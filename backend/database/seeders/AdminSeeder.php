<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@gambling.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
                'is_banned' => false,
            ]
        );

        if (!$admin->wallet) {
            $admin->wallet()->create(['balance' => 0]);
        }
    }
}
