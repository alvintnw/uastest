<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class DeveloperController extends Controller
{
    public function index(): JsonResponse
    {
        // Temporary dummy data
        $developers = [
            [
                'id' => 1,
                'name' => 'Ahmad Wijaya',
                'role' => 'Full Stack Developer',
                'email' => 'ahmad.wijaya@umkmdelicious.com',
                'whatsapp' => '+62 812-3456-7891',
                'skills' => ['Laravel', 'Next.js', 'MongoDB', 'TypeScript']
            ],
            [
                'id' => 2,
                'name' => 'Sari Dewi', 
                'role' => 'Frontend Developer',
                'email' => 'sari.dewi@umkmdelicious.com',
                'whatsapp' => '+62 812-3456-7892',
                'skills' => ['Next.js', 'React', 'Bootstrap', 'CSS']
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $developers,
            'message' => 'Developers retrieved successfully'
        ]);
    }
}