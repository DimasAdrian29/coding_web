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
        Schema::table('BabLama', function (Blueprint $table) {
            $table->text('exercise_prompt')->nullable()->after('exercise_title');
            $table->text('exercise_answer')->nullable()->after('exercise_prompt');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('BabLama', function (Blueprint $table) {
            $table->dropColumn(['exercise_prompt', 'exercise_answer']);
        });
    }
};
