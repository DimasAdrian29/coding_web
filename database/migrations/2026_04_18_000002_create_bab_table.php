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
        Schema::create('BabLama', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materi_id')->constrained('materi')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->longText('content');
            $table->longText('code_example')->nullable();
            $table->string('code_language')->default('javascript');
            $table->string('exercise_title')->nullable();
            $table->string('quiz_title')->nullable();
            $table->unsignedInteger('order_number');
            $table->timestamps();

            $table->unique(['materi_id', 'order_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('BabLama');
    }
};
