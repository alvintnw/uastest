<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run()
    {
        // Clear existing products dari MongoDB
        Product::truncate();

        $products = [
            [
                'name' => 'Ayam Dada',
                'description' => 'Ayam goreng renyah dengan bumbu rahasia.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/ayam-dada.png',
                'stock_quantity' => 100,
                'ingredients' => ['Ayam Dada', 'Bumbu Rahasia', 'Tepung'],
                'nutrition_facts' => [
                    'calories' => 350,
                    'protein' => '25g',
                    'carbs' => '20g',
                    'fat' => '15g'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Nasi Goreng Special',
                'description' => 'Nasi goreng dengan telur, ayam, udang, dan sayuran segar',
                'price' => 25000,
                'category' => 'Makanan Utama',
                'image_url' => '/images/nasi-goreng.jpg',
                'stock_quantity' => 50,
                'ingredients' => ['Nasi', 'Telur', 'Ayam', 'Udang', 'Sayuran', 'Bumbu Rahasia'],
                'nutrition_facts' => [
                    'calories' => 450,
                    'protein' => '20g',
                    'carbs' => '60g',
                    'fat' => '15g'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Mie Ayam Bakso',
                'description' => 'Mie ayam dengan bakso urat dan pangsit goreng',
                'price' => 20000,
                'category' => 'Makanan Utama',
                'image_url' => '/images/mie-ayam.jpg',
                'stock_quantity' => 30,
                'ingredients' => ['Mie', 'Ayam', 'Bakso', 'Pangsit', 'Sayuran'],
                'nutrition_facts' => [
                    'calories' => 400,
                    'protein' => '18g',
                    'carbs' => '55g',
                    'fat' => '12g'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Es Teh Manis',
                'description' => 'Es teh manis segar dengan perasan lemon',
                'price' => 5000,
                'category' => 'Minuman',
                'image_url' => '/images/es-teh.jpg',
                'stock_quantity' => 200,
                'ingredients' => ['Teh', 'Gula', 'Lemon', 'Es'],
                'nutrition_facts' => [
                    'calories' => 120,
                    'protein' => '0g',
                    'carbs' => '30g',
                    'fat' => '0g'
                ],
                'is_active' => true
            ]
        ];

        foreach ($products as $product) {
            // Ensure stock_quantity is integer
            $product['stock_quantity'] = (int) $product['stock_quantity'];

            // If an image file exists in storage, convert to base64 and store inline
            if (!empty($product['image_url'])) {
                // normalize path: remove leading slash
                $imagePath = ltrim($product['image_url'], '/');
                $fullPath = storage_path('app/public/' . $imagePath);
                if (file_exists($fullPath)) {
                    $contents = file_get_contents($fullPath);
                    $product['image_data'] = base64_encode($contents);
                    $product['image_mime_type'] = mime_content_type($fullPath) ?: 'image/png';
                    // store inline image, clear URL
                    $product['image_url'] = null;
                }
            }

            Product::create($product);
        }

        $this->command->info('Products seeded successfully in MongoDB!');
    }
}
