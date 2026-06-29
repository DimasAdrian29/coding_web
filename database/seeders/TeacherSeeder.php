<?php

namespace Database\Seeders;

use App\Models\Pengguna;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pengguna::updateOrCreate(
            ['email' => 'guru@gmail.com'],
            [
                'name' => 'Adri Daswin, S. Pd',
                'nip' => '1987654321',
                'password' =>  Hash::make('password123'),
                'role' => Pengguna::ROLE_GURU,
                'nisn' => null,
            ]
        );
    }
}
