<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }

            if (! Schema::hasColumn('users', 'class_name')) {
                $table->string('class_name')->nullable()->after('role');
            }

            if (! Schema::hasColumn('users', 'major')) {
                $table->string('major')->nullable()->after('class_name');
            }

            if (! Schema::hasColumn('users', 'school_name')) {
                $table->string('school_name')->nullable()->after('major');
            }

            if (! Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('active')->after('school_name');
            }
        });

        Schema::table('chapters', function (Blueprint $table) {
            if (! Schema::hasColumn('chapters', 'description')) {
                $table->text('description')->nullable()->after('title');
            }

            if (! Schema::hasColumn('chapters', 'code_example')) {
                $table->text('code_example')->nullable()->after('content');
            }

            if (! Schema::hasColumn('chapters', 'order_number')) {
                $table->unsignedInteger('order_number')->default(1)->after('code_example');
            }

            if (! Schema::hasColumn('chapters', 'duration_minutes')) {
                $table->unsignedInteger('duration_minutes')->nullable()->after('order_number');
            }

            if (! Schema::hasColumn('chapters', 'status')) {
                $table->enum('status', ['draft', 'published'])->default('draft')->after('duration_minutes');
            }

            if (! Schema::hasColumn('chapters', 'created_by')) {
                $table->foreignId('created_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
            }
        });

        Schema::table('exercises', function (Blueprint $table) {
            if (Schema::hasColumn('exercises', 'chapter_id')) {
                $table->foreignId('chapter_id')->nullable()->change();
            }

            foreach (['question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer'] as $column) {
                if (Schema::hasColumn('exercises', $column)) {
                    $table->string($column)->nullable()->change();
                }
            }

            if (! Schema::hasColumn('exercises', 'title')) {
                $table->string('title')->nullable()->after('chapter_id');
            }

            if (! Schema::hasColumn('exercises', 'description')) {
                $table->text('description')->nullable()->after('title');
            }

            if (! Schema::hasColumn('exercises', 'type')) {
                $table->enum('type', ['chapter', 'final_exam'])->default('chapter')->after('description');
            }

            if (! Schema::hasColumn('exercises', 'total_questions')) {
                $table->unsignedInteger('total_questions')->default(0)->after('type');
            }

            if (! Schema::hasColumn('exercises', 'duration_minutes')) {
                $table->unsignedInteger('duration_minutes')->nullable()->after('total_questions');
            }

            if (! Schema::hasColumn('exercises', 'status')) {
                $table->enum('status', ['draft', 'active', 'inactive'])->default('draft')->after('duration_minutes');
            }

            if (! Schema::hasColumn('exercises', 'created_by')) {
                $table->foreignId('created_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
            }
        });

        if (! Schema::hasTable('chapter_progress')) {
            Schema::create('chapter_progress', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('chapter_id')->constrained('chapters')->cascadeOnDelete();
                $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');
                $table->unsignedTinyInteger('progress_percentage')->default(0);
                $table->timestamp('completed_at')->nullable();
                $table->timestamps();

                $table->unique(['user_id', 'chapter_id']);
            });
        }

        if (! Schema::hasTable('questions')) {
            Schema::create('questions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('exercise_id')->constrained('exercises')->cascadeOnDelete();
                $table->text('question_text');
                $table->enum('question_type', ['multiple_choice', 'essay'])->default('multiple_choice');
                $table->string('option_a')->nullable();
                $table->string('option_b')->nullable();
                $table->string('option_c')->nullable();
                $table->string('option_d')->nullable();
                $table->string('correct_answer')->nullable();
                $table->unsignedInteger('score')->default(10);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('submissions')) {
            Schema::create('submissions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('exercise_id')->constrained('exercises')->cascadeOnDelete();
                $table->enum('status', ['submitted', 'pending_review', 'graded'])->default('pending_review');
                $table->unsignedInteger('score')->nullable();
                $table->text('feedback')->nullable();
                $table->timestamp('submitted_at')->nullable();
                $table->foreignId('graded_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('graded_at')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('submission_answers')) {
            Schema::create('submission_answers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('submission_id')->constrained('submissions')->cascadeOnDelete();
                $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();
                $table->text('answer_text')->nullable();
                $table->string('selected_option')->nullable();
                $table->boolean('is_correct')->nullable();
                $table->unsignedInteger('score_awarded')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('final_exam_results')) {
            Schema::create('final_exam_results', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('exercise_id')->constrained('exercises')->cascadeOnDelete();
                $table->unsignedInteger('score');
                $table->unsignedInteger('total_correct');
                $table->unsignedInteger('total_questions');
                $table->unsignedInteger('duration_used_minutes')->default(0);
                $table->enum('status', ['passed', 'failed']);
                $table->timestamp('submitted_at');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('final_exam_results');
        Schema::dropIfExists('submission_answers');
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('chapter_progress');
    }
};
