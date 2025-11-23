<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::truncate();

        User::create([
            'name' => 'Admin UMKM',
            'email' => 'admin@umkmdelicious.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true
            ]);
        User::create([
            'name' => 'Manager UMKM',
            'email' => 'manager@umkmdelicious.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
            'is_active' => true
            ]);
        User::create([
            'name' => 'Kasir UMKM',
            'email' => 'kasir@umkmdelicious.com',
            'password' => Hash::make('password123'),
            'role' => 'kasir',
            'is_active' => true
        ]);
    }
}