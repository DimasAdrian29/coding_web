<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            if (! Schema::hasColumn('exercises', 'material_id')) {
                $table->foreignId('material_id')->nullable()->after('chapter_id')->constrained('materials')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            if (Schema::hasColumn('exercises', 'material_id')) {
                $table->dropConstrainedForeignId('material_id');
            }
        });
    }
};
