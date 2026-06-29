<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('progress', function (Blueprint $table) {
            $table->unsignedInteger('exercise_attempts')->default(0)->after('is_completed');
            $table->unsignedTinyInteger('exercise_last_score')->nullable()->after('exercise_attempts');
            $table->timestamp('exercise_completed_at')->nullable()->after('exercise_last_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('progress', function (Blueprint $table) {
            $table->dropColumn(['exercise_attempts', 'exercise_last_score', 'exercise_completed_at']);
        });
    }
};
