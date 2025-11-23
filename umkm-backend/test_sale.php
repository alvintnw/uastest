<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing Sale model\n";
try {
    $sale = App\Models\Sale::first();
    echo "Sale record: " . json_encode($sale) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "Testing Invoice count\n";
try {
    $count = App\Models\Invoice::count();
    echo "Invoice count: " . $count . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "Testing Food count\n";
try {
    $count = App\Models\Food::where('is_active', true)->count();
    echo "Food count: " . $count . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
