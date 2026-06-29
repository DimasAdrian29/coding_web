<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chapters', function (Blueprint $table) {
            if (! Schema::hasColumn('chapters', 'materi_id')) {
                $table->unsignedBigInteger('materi_id')->nullable()->after('material_id');
                $table->foreign('materi_id')->references('id')->on('materials')->cascadeOnDelete();
            }
        });

        if (Schema::hasColumn('chapters', 'material_id') && Schema::hasColumn('chapters', 'materi_id')) {
            DB::table('chapters')
                ->whereNull('materi_id')
                ->update(['materi_id' => DB::raw('material_id')]);
        }
    }

    public function down(): void
    {
        Schema::table('chapters', function (Blueprint $table) {
            if (Schema::hasColumn('chapters', 'materi_id')) {
                $table->dropForeign(['materi_id']);
                $table->dropColumn('materi_id');
            }
        });
    }
};
