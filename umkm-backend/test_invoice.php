<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    echo "Testing Invoice model creation...\n";
    $invoice = new App\Models\Invoice();
    echo "✅ Invoice model created successfully\n";

    echo "Testing InvoiceItem model creation...\n";
    $item = new App\Models\InvoiceItem();
    echo "✅ InvoiceItem model created successfully\n";

    echo "Testing database connection...\n";
    $connection = DB::connection('mongodb_local');
    $connection->command(['ping' => 1]);
    echo "✅ Database connection successful\n";

    // Check if we're using the right connection
    $config = config('database.connections.mongodb_local');
    echo "Using connection: mongodb_local\n";
    echo "Host: {$config['host']}\n";
    echo "Port: {$config['port']}\n";
    echo "Database: {$config['database']}\n";

    echo "Testing invoice creation...\n";
    $testInvoice = App\Models\Invoice::create([
        'invoice_number' => 'TEST-' . time(),
        'customer_name' => 'Test Customer',
        'customer_phone' => '081234567890',
        'total_amount' => 50000,
        'status' => 'Menunggu'
    ]);
    echo "✅ Invoice created successfully with ID: " . $testInvoice->_id . "\n";

    echo "Testing invoice item creation...\n";
    $testItem = App\Models\InvoiceItem::create([
        'invoice_id' => $testInvoice->_id,
        'food_id' => '507f1f77bcf86cd799439011', // dummy ObjectId
        'food_name' => 'Test Food',
        'quantity' => 2,
        'price' => 25000,
        'subtotal' => 50000
    ]);
    echo "✅ Invoice item created successfully with ID: " . $testItem->_id . "\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
