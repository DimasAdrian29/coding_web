<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chapters', function (Blueprint $table) {
            if (! Schema::hasColumn('chapters', 'video_type')) {
                $table->enum('video_type', ['youtube', 'upload'])->nullable()->after('content');
            }

            if (! Schema::hasColumn('chapters', 'video_file')) {
                $table->string('video_file')->nullable()->after('video_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('chapters', function (Blueprint $table) {
            if (Schema::hasColumn('chapters', 'video_file')) {
                $table->dropColumn('video_file');
            }

            if (Schema::hasColumn('chapters', 'video_type')) {
                $table->dropColumn('video_type');
            }
        });
    }
};
