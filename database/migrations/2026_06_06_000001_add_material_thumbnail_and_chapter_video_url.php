<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('materials', function (Blueprint $table) {
            if (! Schema::hasColumn('materials', 'thumbnail')) {
                $table->string('thumbnail')->nullable()->after('description');
            }
        });

        Schema::table('chapters', function (Blueprint $table) {
            if (! Schema::hasColumn('chapters', 'video_url')) {
                $table->string('video_url')->nullable()->after('content');
            }
        });
    }

    public function down(): void
    {
        Schema::table('chapters', function (Blueprint $table) {
            if (Schema::hasColumn('chapters', 'video_url')) {
                $table->dropColumn('video_url');
            }
        });

        Schema::table('materials', function (Blueprint $table) {
            if (Schema::hasColumn('materials', 'thumbnail')) {
                $table->dropColumn('thumbnail');
            }
        });
    }
};
