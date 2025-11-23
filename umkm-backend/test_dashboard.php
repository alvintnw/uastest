<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing dashboard stats API\n";
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
    $recentOrders = \App\Models\Invoice::with('items')
        ->orderBy('created_at', 'desc')
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
                'items_count' => $invoice->items->count()
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

    $result = [
        'total_sales' => (float) $totalSales,
        'total_orders' => (int) $totalOrders,
        'total_products' => (int) $totalProducts,
        'pending_orders' => (int) $pendingOrders,
        'processing_orders' => (int) $processingOrders,
        'completed_orders' => (int) $completedOrders,
        'recent_orders' => $recentOrders,
        'popular_products' => $popularProducts
    ];

    echo "Dashboard stats result: " . json_encode($result, JSON_PRETTY_PRINT) . "\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
