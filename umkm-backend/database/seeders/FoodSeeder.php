<?php

namespace Database\Seeders;

use App\Models\Food;
use Illuminate\Database\Seeder;

class FoodSeeder extends Seeder
{
    public function run()
    {
        // KOSONGKAN collection 'foods'
        Food::query()->delete();

        $foods = [
            // ==========================================================
            // 14 DATA DARI FOOD SEEDER (Disesuaikan dengan field Food)
            // ==========================================================
            [
                'name' => 'ayam dada',
                'description' => 'Ayam goreng renyah dengan bumbu rahasia.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/ayam-dada.png',
                'stock_quantity' => 100, // Nilai default
                'ingredients' => ['Dada Ayam', 'Tepung', 'Bumbu'], // Nilai default
                'nutrition_facts' => ['calories' => 300], // Nilai default
                'is_active' => true
            ],
            [
                'name' => 'ayam geprek',
                'description' => 'Ayam goreng renyah dengan bumbu rahasia.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/ayam-geprek.png',
                'stock_quantity' => 100,
                'ingredients' => ['Ayam Goreng', 'Sambal Bawang'],
                'nutrition_facts' => ['calories' => 350],
                'is_active' => true
            ],
            [
                'name' => 'ayam goreng sayap',
                'description' => 'Ayam goreng renyah dengan bumbu rahasia.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/ayam-goreng-sayap.png',
                'stock_quantity' => 100,
                'ingredients' => ['Sayap Ayam', 'Tepung'],
                'nutrition_facts' => ['calories' => 280],
                'is_active' => true
            ],
            [
                'name' => 'Ayam paha atas',
                'description' => 'Ayam goreng renyah dengan bumbu rahasia.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/Ayam-paha-atas.png',
                'stock_quantity' => 100,
                'ingredients' => ['Paha Atas', 'Tepung'],
                'nutrition_facts' => ['calories' => 320],
                'is_active' => true
            ],
            [
                'name' => 'Ayam paha bawah',
                'description' => 'Ayam goreng renyah dengan bumbu rahasia.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/Ayam-paha-bawah.png',
                'stock_quantity' => 100,
                'ingredients' => ['Paha Bawah', 'Tepung'],
                'nutrition_facts' => ['calories' => 310],
                'is_active' => true
            ],
            [
                'name' => 'Bakso goreng',
                'description' => 'Ayam goreng renyah dengan bumbu rahasia.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/Bakso-goreng.png',
                'stock_quantity' => 150,
                'ingredients' => ['Daging', 'Tepung Tapioka'],
                'nutrition_facts' => ['calories' => 200],
                'is_active' => true
            ],
            [
                'name' => 'Burger ayam',
                'description' => 'Ayam goreng renyah dengan bumbu rahasia.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/Burger-ayam.png',
                'stock_quantity' => 75,
                'ingredients' => ['Roti Burger', 'Patty Ayam', 'Sayuran'],
                'nutrition_facts' => ['calories' => 400],
                'is_active' => true
            ],
            [
                'name' => 'Chicken roll',
                'description' => 'Ayam goreng renyah dengan bumbu rahasia.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/Chicken-roll.png',
                'stock_quantity' => 100,
                'ingredients' => ['Ayam Gulung', 'Tepung'],
                'nutrition_facts' => ['calories' => 250],
                'is_active' => true
            ],
            [
                'name' => 'Chicken strips',
                'description' => 'Ayam goreng renyah dengan bumbu rahasia.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/Chicken-strips.png',
                'stock_quantity' => 100,
                'ingredients' => ['Fillet Ayam', 'Tepung'],
                'nutrition_facts' => ['calories' => 280],
                'is_active' => true
            ],
            [
                'name' => 'Kentang Goreng',
                'description' => 'Kentang goreng renyah.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/Kentang-Goreng.png',
                'stock_quantity' => 120,
                'ingredients' => ['Kentang'],
                'nutrition_facts' => ['calories' => 180],
                'is_active' => true
            ],
            [
                'name' => 'Mentai',
                'description' => 'Nasi dengan saus mentai.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/Mentai.png',
                'stock_quantity' => 60,
                'ingredients' => ['Nasi', 'Saus Mentai', 'Daging'],
                'nutrition_facts' => ['calories' => 420],
                'is_active' => true
            ],
            [
                'name' => 'Nasi',
                'description' => 'Nasi putih hangat.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/Nasi.png',
                'stock_quantity' => 200,
                'ingredients' => ['Beras'],
                'nutrition_facts' => ['calories' => 250],
                'is_active' => true
            ],
            [
                'name' => 'Rice box chicken roll',
                'description' => 'Nasi dengan chicken roll dan saus spesial.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/Rice-box-chicken-roll.png',
                'stock_quantity' => 90,
                'ingredients' => ['Nasi', 'Chicken Roll', 'Saus'],
                'nutrition_facts' => ['calories' => 450],
                'is_active' => true
            ],
            [
                'name' => 'Saus barbeque',
                'description' => 'Saus cocolan rasa barbeque.',
                'price' => 15000,
                'category' => 'Makanan Utama',
                'image_url' => 'images/Saus-barbeque.png',
                'stock_quantity' => 150,
                'ingredients' => ['Bumbu Barbeque'],
                'nutrition_facts' => ['calories' => 50],
                'is_active' => true
            ],
        ];

        foreach ($foods as $food) {
            // Ensure stock_quantity is integer
            $food['stock_quantity'] = (int) $food['stock_quantity'];
            Food::create($food);
        }

        $this->command->info('Foods seeded successfully in MongoDB!');
    }
}