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
// Foods API Routes (index/show tersedia publik; create/update/delete tersedia di /api/admin/foods)
Route::get('/foods', [FoodController::class, 'index']);
Route::get('/foods/{id}', [FoodController::class, 'show']);

// Developers
Route::resource('developers', DeveloperController::class)->only(['index', 'show']);

// Authentication
Route::post('/register', [AuthController::class, 'register']);

// Customer Order (Public)
Route::post('/orders', [InvoiceController::class, 'customerOrder']);

// Test MongoDB connection and environment
Route::get('/test-db', function() {
    try {
        // Check MongoDB PHP extension
        if (!extension_loaded('mongodb')) {
            return [
                'status' => 'MongoDB PHP extension not installed',
                'php_version' => PHP_VERSION,
                'extensions' => get_loaded_extensions()
            ];
        }

        // Check connection
        $connection = DB::connection('mongodb');
        $connection->command(['ping' => 1]);

        // Get database name
        $config = config('database.connections.mongodb');

        return [
            'status' => 'Connected to MongoDB successfully',
            'database_name' => $config['database'],
            'host' => $config['host'],
            'port' => $config['port']
        ];
    } catch (\Exception $e) {
        return [
            'status' => 'Failed to connect to MongoDB',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ];
    }
});
Route::post('/login', [AuthController::class, 'login']);

// ------------------------------------------------------------------------
// ## Rute Terproteksi (Authenticated)
// ------------------------------------------------------------------------
// Admin product routes are protected. We allow either a real authenticated
// admin user (Sanctum) or a demo token (Bearer demo-token-*) via the
// EnsureAdminOrDemo middleware implemented in app/Http/Middleware.

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Dashboard Stats moved to admin group below

    // Invoices moved to admin group below
});

// ------------------------------------------------------------------------
// Rute Admin/Manajer (CRUD: CREATE, UPDATE, DELETE)
// Melakukan proteksi dengan EnsureAdminOrDemo middleware (mendukung demo token)
// Ini diletakkan di luar auth:sanctum group agar demo-token tidak ditangani oleh Sanctum
// yang pada setup ini tidak menggunakan relational personal access tokens.
Route::middleware([\App\Http\Middleware\EnsureAdminOrDemo::class])->prefix('admin')->group(function () {

    // CRUD FOOD (POST, PUT, DELETE) - Menggunakan FoodController untuk admin
    Route::get('foods', [FoodController::class, 'adminIndex']);
    Route::post('foods', [FoodController::class, 'store']);
    Route::put('foods/{id}', [FoodController::class, 'update']);
    Route::delete('foods/{id}', [FoodController::class, 'destroy']);

    // CRUD Products (POST, PUT, DELETE) - Tetap ada untuk backward compatibility
    Route::resource('products', ProductController::class)->except(['create', 'edit']);

    // Invoices (Ganti dengan Resource yang lebih bersih)
    // Mencakup GET, POST, PUT, DELETE
    Route::resource('invoices', InvoiceController::class)->except(['create', 'edit']);

    // Update invoice status (endpoint khusus untuk update status)
    Route::put('invoices/{invoice}/status', [InvoiceStatusController::class, 'updateStatus']);

    // Dashboard Stats - Real data from models
    Route::get('/dashboard/stats', function () {
        try {
            // Get total sales from Sale model (more accurate)
            $saleRecord = \App\Models\Sale::first();
            $totalSales = $saleRecord ? $saleRecord->total_sales : 0;

            // Get total orders (count of all invoices)
            $totalOrders = \App\Models\Invoice::count();

            // Get total products (count of active foods)
            $totalProducts = \App\Models\Food::where('is_active', true)->count();

            // Get pending orders count
            $pendingOrders = \App\Models\Invoice::where('status', 'Menunggu')->count();

            // Get processing orders count
            $processingOrders = \App\Models\Invoice::where('status', 'Diproses')->count();

            // Get completed orders count
            $completedOrders = \App\Models\Invoice::where('status', 'Selesai')->count();

            // Get recent orders (last 5 invoices)
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
                        'items_count' => 1 // Simplified for now
                    ];
                });

            // Get popular products (top 3 by sales from invoice items)
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
