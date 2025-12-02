<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DeveloperController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\InvoiceStatusController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\FoodController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// API Status (Biarkan seperti ini)
Route::get('/', function () {
    return response()->json([
        'message' => 'UMKM Delicious API',
        'version' => '1.0.0',
        'status' => 'running',
        'timestamp' => now()
    ]);
});

// ------------------------------------------------------------------------
// ## Rute Publik (Unauthenticated)
// ------------------------------------------------------------------------

// ✅ FOOD (READ: Index dan Show) - Ini harus tetap public agar frontend bisa tampil
Route::get('/foods', [FoodController::class, 'index']);
Route::get('/foods/{id}', [FoodController::class, 'show']);

// Developers
Route::resource('developers', DeveloperController::class)->only(['index', 'show']);

// Authentication
Route::post('/register', [AuthController::class, 'register']);

// Customer Order (Public)
Route::post('/orders', [InvoiceController::class, 'customerOrder']);

// ------------------------------------------------------------------------
// ✅ FIX: Test MongoDB connection (DIPERBAIKI)
// ------------------------------------------------------------------------
Route::get('/test-db', function() {
    try {
        // 1. Cek Extension PHP
        if (!extension_loaded('mongodb')) {
            return response()->json([
                'status' => 'Error',
                'message' => 'MongoDB PHP extension not installed',
                'extensions' => get_loaded_extensions()
            ], 500);
        }

        // 2. Cek Koneksi (Ping Database)
        $connection = DB::connection('mongodb');
        $connection->command(['ping' => 1]);

        // 3. Ambil nama database (Aman untuk Atlas)
        $dbName = $connection->getDatabaseName();

        return response()->json([
            'status' => 'Connected to MongoDB successfully',
            'database_name' => $dbName,
            'message' => 'Connection established using MongoDB Atlas DSN.'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'Failed to connect to MongoDB',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

Route::post('/login', [AuthController::class, 'login']);

// ------------------------------------------------------------------------
// ## Rute Terproteksi (Authenticated)
// ------------------------------------------------------------------------

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

});

// ------------------------------------------------------------------------
// Rute Admin/Manajer (CRUD)
// ------------------------------------------------------------------------
Route::middleware([\App\Http\Middleware\EnsureAdminOrDemo::class])->prefix('admin')->group(function () {

    // CRUD FOOD
    Route::get('foods', [FoodController::class, 'adminIndex']);
    Route::post('foods', [FoodController::class, 'store']);
    Route::put('foods/{id}', [FoodController::class, 'update']);
    Route::delete('foods/{id}', [FoodController::class, 'destroy']);

    // CRUD Products
    Route::resource('products', ProductController::class)->except(['create', 'edit']);

    // Invoices
    Route::resource('invoices', InvoiceController::class)->except(['create', 'edit']);

    // Update invoice status
    Route::put('invoices/{invoice}/status', [InvoiceStatusController::class, 'updateStatus']);

    // Dashboard Stats
    Route::get('/dashboard/stats', function () {
        try {
            // Get total sales from Sale model
            $saleRecord = \App\Models\Sale::first();
            $totalSales = $saleRecord ? $saleRecord->total_sales : 0;

            // Get total orders
            $totalOrders = \App\Models\Invoice::count();

            // Get total products
            $totalProducts = \App\Models\Food::where('is_active', true)->count();

            // Get status counts
            $pendingOrders = \App\Models\Invoice::where('status', 'Menunggu')->count();
            $processingOrders = \App\Models\Invoice::where('status', 'Diproses')->count();
            $completedOrders = \App\Models\Invoice::where('status', 'Selesai')->count();

            // Get recent orders
            $recentOrders = \App\Models\Invoice::orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($invoice) {
                    return [
                        'id' => $invoice->_id,
                        'invoice_number' => $invoice->invoice_number,
                        'customer_name' => $invoice->customer_name,
                        'total' => $invoice->total_amount,
                        'status' => $invoice->status,
                        'created_at' => $invoice->created_at,
                        'items_count' => 1
                    ];
                });

            // Get popular products
            $popularProducts = \App\Models\InvoiceItem::select('food_name', 'quantity', 'subtotal')
                ->get()
                ->groupBy('food_name')
                ->map(function ($items, $foodName) {
                    $totalSold = $items->sum('quantity');
                    $totalRevenue = $items->sum('subtotal');
                    return [
                        'name' => $foodName,
                        'sold' => (int) $totalSold,
                        'revenue' => (float) $totalRevenue
                    ];
                })
                ->sortByDesc('sold')
                ->take(3)
                ->values();

            return response()->json([
                'total_sales' => (float) $totalSales,
                'total_orders' => (int) $totalOrders,
                'total_products' => (int) $totalProducts,
                'pending_orders' => (int) $pendingOrders,
                'processing_orders' => (int) $processingOrders,
                'completed_orders' => (int) $completedOrders,
                'recent_orders' => $recentOrders,
                'popular_products' => $popularProducts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch dashboard stats',
                'message' => $e->getMessage()
            ], 500);
        }
    });
});