<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UserSeeder::class,
            FoodSeeder::class,
            ProductSeeder::class,  // Aktifkan ProductSeeder
            // DeveloperSeeder::class, // Comment dulu
            // SaleSeeder::class,     // Comment dulu
        ]);
    }
}
