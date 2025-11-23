<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Food;
use App\Models\Product;

// Update all Food documents
$foods = Food::all();
foreach ($foods as $food) {
    if (is_string($food->stock_quantity)) {
        $food->stock_quantity = (int) $food->stock_quantity;
        $food->save();
    }
}

// Update all Product documents
$products = Product::all();
foreach ($products as $product) {
    if (is_string($product->stock_quantity)) {
        $product->stock_quantity = (int) $product->stock_quantity;
        $product->save();
    }
}

echo "Stock quantities fixed.\n";
