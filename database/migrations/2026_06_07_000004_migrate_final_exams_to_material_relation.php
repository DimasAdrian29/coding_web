<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            if (! Schema::hasColumn('exercises', 'material_id')) {
                $table->foreignId('material_id')->nullable()->after('chapter_id')->constrained('materials')->nullOnDelete();
            }

            if (Schema::hasColumn('exercises', 'chapter_id')) {
                $table->unsignedBigInteger('chapter_id')->nullable()->change();
            }
        });

        DB::table('exercises')
            ->join('chapters', 'exercises.chapter_id', '=', 'chapters.id')
            ->where('exercises.type', 'final_exam')
            ->whereNull('exercises.material_id')
            ->update([
                'exercises.material_id' => DB::raw('COALESCE(chapters.material_id, chapters.materi_id)'),
            ]);

        DB::table('exercises')
            ->where('type', 'final_exam')
            ->whereNotNull('material_id')
            ->update([
                'chapter_id' => null,
            ]);
    }

    public function down(): void
    {
        // Attempt history depends on exercises.id, so this migration intentionally
        // does not reverse data mapping or remove material_id.
    }
};
