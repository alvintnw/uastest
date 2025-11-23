<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Sale;
use App\Models\Food;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(): JsonResponse
    {
        $invoices = Invoice::with('items')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }

    public function show($id): JsonResponse
    {
        $invoice = Invoice::with('items')->find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $invoice
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'items' => 'required|array|min:1',
            'items.*.food_id' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0'
        ]);

        DB::beginTransaction();

        try {
            // Check stock availability and lock foods
            $foodIds = collect($validated['items'])->pluck('food_id')->unique();
            $foods = Food::whereIn('_id', $foodIds)->get()->keyBy('_id');

            foreach ($validated['items'] as $item) {
                $food = $foods[$item['food_id']];
                $requestedQuantity = $item['quantity'];

                if ($food->stock_quantity < $requestedQuantity) {
                    throw new \Exception("Insufficient stock for {$food->name}. Available: {$food->stock_quantity}, Requested: {$requestedQuantity}");
                }
            }

            // Calculate total
            $total = 0;
            foreach ($validated['items'] as $item) {
                $total += $item['quantity'] * $item['price'];
            }

            // Create invoice
            $invoice = Invoice::create([
                'invoice_number' => 'ORD-' . date('Ymd') . '-' . rand(1000, 9999),
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'total_amount' => $total,
                'status' => 'Menunggu'
            ]);

            // Add invoice items and reduce stock
            foreach ($validated['items'] as $item) {
                $food = $foods[$item['food_id']];

                InvoiceItem::create([
                    'invoice_id' => $invoice->_id,
                    'food_id' => $item['food_id'],
                    'food_name' => $food->name,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['quantity'] * $item['price']
                ]);

                // Reduce stock
                $food->decrement('stock_quantity', $item['quantity']);
            }

            // Update sales total
            $this->updateSalesTotal($total);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $invoice->load('items')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found'
            ], 404);
        }

        $validated = $request->validate([
            'customer_name' => 'sometimes|string|max:255',
            'customer_phone' => 'sometimes|string|max:20',
            'status' => 'sometimes|in:Menunggu,Diproses,Selesai',
            'items' => 'sometimes|array|min:1'
        ]);

        DB::beginTransaction();

        try {
            // If items are updated, recalculate total
            if (isset($validated['items'])) {
                $total = 0;
                foreach ($validated['items'] as $item) {
                    $total += $item['quantity'] * $item['price'];
                }
                $validated['total_amount'] = $total;

                // Update sales total (difference from old total)
                $difference = $total - $invoice->total_amount;
                $this->updateSalesTotal($difference);

                // Update items
                InvoiceItem::where('invoice_id', $invoice->_id)->delete();
                foreach ($validated['items'] as $item) {
                    InvoiceItem::create(array_merge($item, ['invoice_id' => $invoice->_id]));
                }
            }

            // Update the invoice with validated data
            $invoice->update($validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Invoice updated successfully',
                'data' => $invoice->load('items')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update invoice: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        $invoice = Invoice::find($id);
        
        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found'
            ], 404);
        }

        DB::beginTransaction();

        try {
            // Subtract from sales total before deleting
            $this->updateSalesTotal(-$invoice->total_amount);
            
            $invoice->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Invoice deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete invoice: ' . $e->getMessage()
            ], 500);
        }
    }

    private function updateSalesTotal($amount)
    {
        $sale = Sale::first();
        if (!$sale) {
            $sale = Sale::create(['total_sales' => 0]);
        }
        
        $sale->total_sales += $amount;
        $sale->save();
    }

    public function getByCustomer($phone): JsonResponse
    {
        $invoices = Invoice::where('customer_phone', $phone)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }

    public function customerOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'food_id' => 'required|string',
            'quantity' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();

        try {
            // Get food details
            $food = Food::find($validated['food_id']);
            if (!$food) {
                return response()->json([
                    'success' => false,
                    'message' => 'Food not found'
                ], 404);
            }

            // Check stock
            if ($food->stock_quantity < $validated['quantity']) {
                return response()->json([
                    'success' => false,
                    'message' => "Insufficient stock for {$food->name}. Available: {$food->stock_quantity}"
                ], 400);
            }

            // Calculate total
            $total = $validated['quantity'] * $food->price;

            // Create invoice
            $invoice = Invoice::create([
                'invoice_number' => 'ORD-' . date('Ymd') . '-' . rand(1000, 9999),
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'total_amount' => $total,
                'status' => 'Menunggu'
            ]);

            // Add invoice item and reduce stock
            InvoiceItem::create([
                'invoice_id' => $invoice->_id,
                'food_id' => $validated['food_id'],
                'food_name' => $food->name,
                'quantity' => $validated['quantity'],
                'price' => $food->price,
                'subtotal' => $total
            ]);

            // Reduce stock
            $food->decrement('stock_quantity', $validated['quantity']);

            // Update sales total
            $this->updateSalesTotal($total);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $invoice->load('items')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }
}