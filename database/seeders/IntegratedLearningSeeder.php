<?php

namespace Database\Seeders;

use App\Models\Bab;
use App\Models\Latihan;
use App\Models\Materi;
use App\Models\SoalLatihan;
use App\Models\Pengguna;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class IntegratedLearningSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = Pengguna::firstOrCreate(
            ['email' => 'guru@coding.test'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'school_name' => 'SMK 5 Pekanbaru',
                'status' => 'active',
            ],
        );

        Pengguna::updateOrCreate(
            ['nisn' => '1234567890'],
            [
                'name' => 'Ahmad Rizki',
                'email' => 'ahmad@student.com',
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'class_name' => 'XI RPL 1',
                'major' => 'Rekayasa Perangkat Lunak',
                'school_name' => 'SMK 5 Pekanbaru',
                'status' => 'active',
            ],
        );

        $Materi = Materi::firstOrCreate(
            ['title' => 'Python'],
            ['description' => 'MateriLama pembelajaran Python dasar', 'status' => 'publish'],
        );

        $chapters = collect([
            ['Variabel dan Tipe Data', 'Mempelajari konsep variabel dan berbagai tipe data dalam Python', 45],
            ['Operator', 'Memahami berbagai jenis operator dalam pemrograman', 40],
            ['Percabangan', 'Mempelajari struktur percabangan IF-ELSE', 50],
            ['Perulangan', 'Memahami konsep loop dan perulangan', 55],
            ['Function', 'Mempelajari cara membuat dan menggunakan function', 60],
        ])->map(function (array $row, int $index) use ($Materi, $teacher) {
            return Bab::updateOrCreate(
                ['title' => $row[0]],
                [
                    'material_id' => $Materi->id,
                    'description' => $row[1],
                    'content' => $row[1] . "\n\nPelajari contoh dan praktikkan langsung di editor.",
                    'code_example' => $index === 0 ? 'nama = "Ahmad"' : null,
                    'order_number' => $index + 1,
                    'chapter_order' => $index + 1,
                    'duration_minutes' => $row[2],
                    'status' => 'published',
                    'created_by' => $teacher->id,
                ],
            );
        });

        foreach ($chapters->take(3) as $Bab) {
            $Latihan = Latihan::updateOrCreate(
                ['title' => 'Latihan BabLama: ' . $Bab->title],
                [
                    'chapter_id' => $Bab->id,
                    'description' => 'Latihan untuk ' . $Bab->title,
                    'type' => 'chapter',
                    'total_questions' => 2,
                    'duration_minutes' => 45,
                    'status' => 'active',
                    'created_by' => $teacher->id,
                ],
            );

            SoalLatihan::updateOrCreate(
                ['exercise_id' => $Latihan->id, 'question_text' => 'Apa inti dari ' . $Bab->title . '?'],
                ['question_type' => 'essay', 'score' => 50],
            );
            SoalLatihan::updateOrCreate(
                ['exercise_id' => $Latihan->id, 'question_text' => 'Pilih jawaban yang paling tepat.'],
                [
                    'question_type' => 'multiple_choice',
                    'option_a' => 'Jawaban A',
                    'option_b' => 'Jawaban B',
                    'option_c' => 'Jawaban C',
                    'option_d' => 'Jawaban D',
                    'correct_answer' => 'A',
                    'score' => 50,
                ],
            );
        }

        $finalExam = Latihan::updateOrCreate(
            ['title' => 'Ujian Akhir Python Basic'],
            [
                'chapter_id' => $chapters->first()?->id,
                'description' => 'Ujian akhir yang dinilai otomatis oleh sistem.',
                'type' => 'final_exam',
                'total_questions' => 1,
                'duration_minutes' => 60,
                'status' => 'active',
                'created_by' => $teacher->id,
            ],
        );

        SoalLatihan::updateOrCreate(
            ['exercise_id' => $finalExam->id, 'question_text' => 'Tipe data untuk angka bulat adalah?'],
            [
                'question_type' => 'multiple_choice',
                'option_a' => 'Integer',
                'option_b' => 'String',
                'option_c' => 'Boolean',
                'option_d' => 'List',
                'correct_answer' => 'A',
                'score' => 100,
            ],
        );
    }
}
