<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('material_id')->nullable()->constrained('materials')->nullOnDelete();
            $table->foreignId('chapter_id')->nullable()->constrained('chapters')->nullOnDelete();
            $table->foreignId('quiz_id')->nullable()->constrained('quizzes')->nullOnDelete();
            $table->enum('type', ['exercise', 'quiz']);
            $table->string('title');
            $table->unsignedInteger('score')->nullable();
            $table->unsignedInteger('teacher_score')->nullable();
            $table->text('teacher_feedback')->nullable();
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['pending', 'graded'])->default('pending');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();
        });

        Schema::create('student_submission_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_submission_id')->constrained('student_submissions')->cascadeOnDelete();
            $table->string('question_source')->nullable();
            $table->unsignedBigInteger('question_id')->nullable();
            $table->text('question_text');
            $table->json('options')->nullable();
            $table->string('selected_answer')->nullable();
            $table->string('correct_answer')->nullable();
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_submission_answers');
        Schema::dropIfExists('student_submissions');
    }
};
