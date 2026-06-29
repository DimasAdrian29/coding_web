<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('materi') && ! Schema::hasTable('materi_lama')) {
            Schema::rename('materi', 'materi_lama');
        }

        if (Schema::hasTable('BabLama') && ! Schema::hasTable('bab_lama')) {
            Schema::rename('BabLama', 'bab_lama');
        }

        if (Schema::hasTable('progress') && ! Schema::hasTable('progress_lama')) {
            Schema::rename('progress', 'progress_lama');
        }

        if (Schema::hasTable('users') && ! Schema::hasTable('pengguna')) {
            Schema::rename('users', 'pengguna');
        }

        if (Schema::hasTable('materials') && ! Schema::hasTable('materi')) {
            Schema::rename('materials', 'materi');
        }

        if (Schema::hasTable('chapters') && ! Schema::hasTable('BabLama')) {
            Schema::rename('chapters', 'BabLama');
        }

        if (Schema::hasTable('exercises') && ! Schema::hasTable('latihan')) {
            Schema::rename('exercises', 'latihan');
        }

        if (Schema::hasTable('questions') && ! Schema::hasTable('soal_latihan')) {
            Schema::rename('questions', 'soal_latihan');
        }

        if (Schema::hasTable('exercise_attempts') && ! Schema::hasTable('riwayat_latihan')) {
            Schema::rename('exercise_attempts', 'riwayat_latihan');
        }

        if (Schema::hasTable('exercise_attempt_answers') && ! Schema::hasTable('jawaban_riwayat_latihan')) {
            Schema::rename('exercise_attempt_answers', 'jawaban_riwayat_latihan');
        }

        if (Schema::hasTable('chapter_progress') && ! Schema::hasTable('progress_bab')) {
            Schema::rename('chapter_progress', 'progress_bab');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('pengguna') && ! Schema::hasTable('users')) {
            Schema::rename('pengguna', 'users');
        }

        if (Schema::hasTable('materi') && ! Schema::hasTable('materials')) {
            Schema::rename('materi', 'materials');
        }

        if (Schema::hasTable('BabLama') && ! Schema::hasTable('chapters')) {
            Schema::rename('BabLama', 'chapters');
        }

        if (Schema::hasTable('latihan') && ! Schema::hasTable('exercises')) {
            Schema::rename('latihan', 'exercises');
        }

        if (Schema::hasTable('soal_latihan') && ! Schema::hasTable('questions')) {
            Schema::rename('soal_latihan', 'questions');
        }

        if (Schema::hasTable('riwayat_latihan') && ! Schema::hasTable('exercise_attempts')) {
            Schema::rename('riwayat_latihan', 'exercise_attempts');
        }

        if (Schema::hasTable('jawaban_riwayat_latihan') && ! Schema::hasTable('exercise_attempt_answers')) {
            Schema::rename('jawaban_riwayat_latihan', 'exercise_attempt_answers');
        }

        if (Schema::hasTable('progress_bab') && ! Schema::hasTable('chapter_progress')) {
            Schema::rename('progress_bab', 'chapter_progress');
        }

        if (Schema::hasTable('materi_lama') && ! Schema::hasTable('materi')) {
            Schema::rename('materi_lama', 'materi');
        }

        if (Schema::hasTable('bab_lama') && ! Schema::hasTable('BabLama')) {
            Schema::rename('bab_lama', 'BabLama');
        }

        if (Schema::hasTable('progress_lama') && ! Schema::hasTable('progress')) {
            Schema::rename('progress_lama', 'progress');
        }
    }
};
