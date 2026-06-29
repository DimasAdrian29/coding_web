<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_material_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('material_id')->constrained('materials')->cascadeOnDelete();
            $table->foreignId('current_chapter_id')->nullable()->constrained('chapters')->nullOnDelete();
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'material_id']);
        });

        Schema::create('student_chapter_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('chapter_id')->constrained('chapters')->cascadeOnDelete();
            $table->enum('status', ['locked', 'unlocked', 'completed'])->default('locked');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'chapter_id']);
        });

        Schema::create('student_exercise_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('exercise_id')->constrained('exercises')->cascadeOnDelete();
            $table->enum('status', ['locked', 'unlocked', 'completed'])->default('locked');
            $table->unsignedInteger('score')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'exercise_id']);
        });

        Schema::create('student_quiz_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('quiz_id')->constrained('quizzes')->cascadeOnDelete();
            $table->enum('status', ['locked', 'unlocked', 'completed'])->default('locked');
            $table->unsignedInteger('score')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'quiz_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_quiz_progress');
        Schema::dropIfExists('student_exercise_progress');
        Schema::dropIfExists('student_chapter_progress');
        Schema::dropIfExists('student_material_progress');
    }
};
