<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            if (! Schema::hasColumn('exercises', 'duration_minutes')) {
                $table->integer('duration_minutes')->default(30)->after('total_questions');
            }
        });

        Schema::table('exercise_attempts', function (Blueprint $table) {
            if (! Schema::hasColumn('exercise_attempts', 'expires_at')) {
                $table->timestamp('expires_at')->nullable()->after('started_at');
            }

            if (! Schema::hasColumn('exercise_attempts', 'submit_method')) {
                $table->string('submit_method')->nullable()->after('submitted_at');
            }
        });

        Schema::table('final_exam_results', function (Blueprint $table) {
            if (! Schema::hasColumn('final_exam_results', 'submit_method')) {
                $table->string('submit_method')->default('manual')->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('final_exam_results', function (Blueprint $table) {
            if (Schema::hasColumn('final_exam_results', 'submit_method')) {
                $table->dropColumn('submit_method');
            }
        });

        Schema::table('exercise_attempts', function (Blueprint $table) {
            if (Schema::hasColumn('exercise_attempts', 'submit_method')) {
                $table->dropColumn('submit_method');
            }

            if (Schema::hasColumn('exercise_attempts', 'expires_at')) {
                $table->dropColumn('expires_at');
            }
        });
    }
};
