<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->renameIfNeeded('quizzes', 'kuis');
        $this->renameIfNeeded('quiz_questions', 'soal_kuis');
        $this->renameIfNeeded('final_exam_results', 'hasil_latihan_akhir');
        $this->renameIfNeeded('student_material_progress', 'progress_materi_siswa');
        $this->renameIfNeeded('student_chapter_progress', 'progress_bab_siswa');
        $this->renameIfNeeded('student_exercise_progress', 'progress_latihan_siswa');
        $this->renameIfNeeded('student_quiz_progress', 'progress_kuis_siswa');
        $this->renameIfNeeded('student_submissions', 'pengumpulan_siswa');
        $this->renameIfNeeded('student_submission_answers', 'jawaban_pengumpulan_siswa');
        $this->renameIfNeeded('submissions', 'pengumpulan_latihan');
        $this->renameIfNeeded('submission_answers', 'jawaban_pengumpulan_latihan');
    }

    public function down(): void
    {
        $this->renameIfNeeded('kuis', 'quizzes');
        $this->renameIfNeeded('soal_kuis', 'quiz_questions');
        $this->renameIfNeeded('hasil_latihan_akhir', 'final_exam_results');
        $this->renameIfNeeded('progress_materi_siswa', 'student_material_progress');
        $this->renameIfNeeded('progress_bab_siswa', 'student_chapter_progress');
        $this->renameIfNeeded('progress_latihan_siswa', 'student_exercise_progress');
        $this->renameIfNeeded('progress_kuis_siswa', 'student_quiz_progress');
        $this->renameIfNeeded('pengumpulan_siswa', 'student_submissions');
        $this->renameIfNeeded('jawaban_pengumpulan_siswa', 'student_submission_answers');
        $this->renameIfNeeded('pengumpulan_latihan', 'submissions');
        $this->renameIfNeeded('jawaban_pengumpulan_latihan', 'submission_answers');
    }

    private function renameIfNeeded(string $from, string $to): void
    {
        if (Schema::hasTable($from) && ! Schema::hasTable($to)) {
            Schema::rename($from, $to);
        }
    }
};
