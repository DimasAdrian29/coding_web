<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bab', function (Blueprint $table) {
            if (! Schema::hasColumn('bab', 'judul_contoh_kode')) {
                $table->string('judul_contoh_kode')->nullable()->after('code_example');
            }

            if (! Schema::hasColumn('bab', 'bahasa_pemrograman')) {
                $table->string('bahasa_pemrograman', 50)->nullable()->after('judul_contoh_kode');
            }

            if (! Schema::hasColumn('bab', 'contoh_kode')) {
                $table->longText('contoh_kode')->nullable()->after('bahasa_pemrograman');
            }

            if (! Schema::hasColumn('bab', 'penjelasan_kode')) {
                $table->text('penjelasan_kode')->nullable()->after('contoh_kode');
            }
        });
    }

    public function down(): void
    {
        Schema::table('bab', function (Blueprint $table) {
            foreach (['penjelasan_kode', 'contoh_kode', 'bahasa_pemrograman', 'judul_contoh_kode'] as $column) {
                if (Schema::hasColumn('bab', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
