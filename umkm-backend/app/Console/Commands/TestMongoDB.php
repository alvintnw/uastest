<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;

class TestMongoDB extends Command
{
    protected $signature = 'test:mongodb';
    protected $description = 'Test MongoDB connection';

    public function handle()
    {
        try {
            $count = Product::count();
            $this->info("MongoDB connection successful! Products count: {$count}");
            return 0;
        } catch (\Exception $e) {
            $this->error("MongoDB connection failed: " . $e->getMessage());
            return 1;
        }
    }
}