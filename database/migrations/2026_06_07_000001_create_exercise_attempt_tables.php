<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('exercise_attempts')) {
            Schema::create('exercise_attempts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('exercise_id')->constrained('exercises')->cascadeOnDelete();
                $table->integer('total_questions')->default(0);
                $table->integer('correct_answers')->default(0);
                $table->integer('wrong_answers')->default(0);
                $table->decimal('score', 5, 2)->default(0);
                $table->timestamp('started_at')->nullable();
                $table->timestamp('submitted_at')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('exercise_attempt_answers')) {
            Schema::create('exercise_attempt_answers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('exercise_attempt_id')->constrained('exercise_attempts')->cascadeOnDelete();
                $table->foreignId('exercise_question_id')->constrained('questions')->cascadeOnDelete();
                $table->enum('selected_answer', ['A', 'B', 'C', 'D'])->nullable();
                $table->boolean('is_correct')->default(false);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('exercise_attempt_answers');
        Schema::dropIfExists('exercise_attempts');
    }
};
