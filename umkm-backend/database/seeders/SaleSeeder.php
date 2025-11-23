<?php

namespace Database\Seeders;

use App\Models\Sale;
use Illuminate\Database\Seeder;

class SaleSeeder extends Seeder
{
    public function run()
    {
        // Clear existing sales data
        Sale::truncate();

        Sale::create([
            'total_sales' => 0,
            'daily_sales' => 0,
            'monthly_sales' => 0,
            'yearly_sales' => 0,
            'total_orders' => 0,
            'average_order_value' => 0,
            'last_updated' => now()
        ]);

        $this->command->info('Sales data seeded successfully!');
    }
}