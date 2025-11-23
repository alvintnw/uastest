<?php

namespace Database\Seeders;

use App\Models\Developer;
use Illuminate\Database\Seeder;

class DeveloperSeeder extends Seeder
{
    public function run()
    {
        // Clear existing developers
        Developer::truncate();

        $developers = [
            [
                'name' => 'Ahmad Wijaya',
                'role' => 'Full Stack Developer',
                'email' => 'ahmad.wijaya@umkmdelicious.com',
                'whatsapp' => '+62 812-3456-7891',
                'photo_url' => '/images/developer-1.jpg',
                'skills' => ['Laravel', 'Next.js', 'MongoDB', 'TypeScript', 'REST API'],
                'description' => 'Berpengalaman dalam pengembangan web aplikasi selama 3 tahun. Spesialis dalam backend development dan database architecture.',
                'github_url' => 'https://github.com/ahmadwijaya',
                'linkedin_url' => 'https://linkedin.com/in/ahmadwijaya',
                'is_active' => true,
                'display_order' => 1
            ],
            [
                'name' => 'Sari Dewi',
                'role' => 'Frontend Developer',
                'email' => 'sari.dewi@umkmdelicious.com',
                'whatsapp' => '+62 812-3456-7892',
                'photo_url' => '/images/developer-2.jpg',
                'skills' => ['Next.js', 'React', 'Bootstrap', 'CSS', 'JavaScript', 'TypeScript'],
                'description' => 'Spesialis dalam membuat UI/UX yang menarik dan user-friendly. Fokus pada responsive design dan user experience.',
                'github_url' => 'https://github.com/saridewi',
                'linkedin_url' => 'https://linkedin.com/in/saridewi',
                'is_active' => true,
                'display_order' => 2
            ],
            [
                'name' => 'Budi Santoso',
                'role' => 'Backend Developer',
                'email' => 'budi.santoso@umkmdelicious.com',
                'whatsapp' => '+62 812-3456-7893',
                'photo_url' => '/images/developer-3.jpg',
                'skills' => ['Laravel', 'MongoDB', 'REST API', 'PHP', 'MySQL', 'System Architecture'],
                'description' => 'Ahli dalam membangun sistem backend yang scalable dan aman. Pengalaman dalam optimasi database dan API development.',
                'github_url' => 'https://github.com/budisantoso',
                'linkedin_url' => 'https://linkedin.com/in/budisantoso',
                'is_active' => true,
                'display_order' => 3
            ],
            [
                'name' => 'Maya Sari',
                'role' => 'UI/UX Designer',
                'email' => 'maya.sari@umkmdelicious.com',
                'whatsapp' => '+62 812-3456-7894',
                'photo_url' => '/images/developer-4.jpg',
                'skills' => ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing', 'Design System'],
                'description' => 'Menciptakan pengalaman pengguna yang optimal dan desain yang estetik. Fokus pada usability dan visual appeal.',
                'github_url' => 'https://github.com/mayasari',
                'linkedin_url' => 'https://linkedin.com/in/mayasari',
                'is_active' => true,
                'display_order' => 4
            ],
            [
                'name' => 'Rizki Pratama',
                'role' => 'DevOps Engineer',
                'email' => 'rizki.pratama@umkmdelicious.com',
                'whatsapp' => '+62 812-3456-7895',
                'photo_url' => '/images/developer-5.jpg',
                'skills' => ['Docker', 'CI/CD', 'AWS', 'Server Management', 'Linux', 'Nginx'],
                'description' => 'Memastikan aplikasi berjalan lancar dan terdeploy dengan baik. Spesialis dalam infrastructure dan deployment automation.',
                'github_url' => 'https://github.com/rizkipratama',
                'linkedin_url' => 'https://linkedin.com/in/rizkipratama',
                'is_active' => true,
                'display_order' => 5
            ]
        ];

        foreach ($developers as $developer) {
            Developer::create($developer);
        }

        $this->command->info('Developers seeded successfully!');
    }
}