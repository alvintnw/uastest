<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $products = Product::active()->get();

            return response()->json([
                'success' => true,
                'data' => $products,
                'message' => 'Products retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'category' => 'required|string|max:255',
                'image_url' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'stock_quantity' => 'required|integer|min:0',
                'is_active' => 'nullable'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Prepare data robustly (accepts form-data or JSON)
            $imageUrl = $request->input('image_url', null);

            // Handle file upload if present: store as base64 in DB (image_data + image_mime_type)
            $imageData = null;
            $mime = null;
            if ($request->hasFile('image')) {
                try {
                    $image = $request->file('image');
                    $contents = file_get_contents($image->getRealPath());
                    $imageData = base64_encode($contents);
                    $mime = $image->getMimeType() ?? $image->getClientMimeType();
                    // clear image_url because we store binary in DB
                    $imageUrl = null;
                } catch (\Exception $ex) {
                    \Log::warning('Image processing failed: ' . $ex->getMessage());
                }
            }

            // If frontend sends base64 image data directly, accept it too
            if ($request->filled('image_data') && $request->filled('image_mime_type')) {
                $imageData = $request->input('image_data');
                $mime = $request->input('image_mime_type');
                // if an image_url was provided, ignore it in favor of inline image
                $imageUrl = $request->input('image_url', null) ? null : $imageUrl;
            }

            $data = [
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'price' => is_null($request->input('price')) ? 0 : (float)$request->input('price'),
                'category' => $request->input('category'),
                'image_url' => $imageUrl,
                'image_data' => $imageData,
                'image_mime_type' => $mime,
                'stock_quantity' => $request->input('stock_quantity', 0),
                'is_active' => filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN)
            ];

            $product = Product::create($data);

            return response()->json([
                'success' => true,
                'data' => $product,
                'message' => 'Product created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'price' => 'sometimes|required|numeric|min:0',
                'category' => 'sometimes|required|string|max:255',
                'image_url' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'stock_quantity' => 'sometimes|required|integer|min:0',
                'is_active' => 'nullable'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }


            $updateData = $request->only([
                'name', 'description', 'price', 'category',
                'image_url', 'stock_quantity', 'is_active', 'image_data', 'image_mime_type'
            ]);

            // normalize types
            if (array_key_exists('price', $updateData)) {
                $updateData['price'] = (float)$updateData['price'];
            }
            if (array_key_exists('stock_quantity', $updateData)) {
                $updateData['stock_quantity'] = $updateData['stock_quantity'];
            }
            if (array_key_exists('is_active', $updateData)) {
                $updateData['is_active'] = filter_var($updateData['is_active'], FILTER_VALIDATE_BOOLEAN);
            }

            // Handle file upload for update
            if ($request->hasFile('image')) {
                try {
                    $image = $request->file('image');
                    $imageName = time() . '_' . preg_replace('/[^A-Za-z0-9\.\-\_]/', '', $image->getClientOriginalName());
                    $image->move(public_path('images'), $imageName);
                    $updateData['image_url'] = 'images/' . $imageName;
                } catch (\Exception $ex) {
                    \Log::warning('Image upload failed on update: ' . $ex->getMessage());
                }
            }

            $product->fill($updateData);
            $product->save();

            return response()->json([
                'success' => true,
                'data' => $product,
                'message' => 'Product updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
