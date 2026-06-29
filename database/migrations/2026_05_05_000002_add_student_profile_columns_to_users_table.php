<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }

            if (! Schema::hasColumn('users', 'nisn')) {
                $table->string('nisn')->nullable()->unique()->after('phone');
            }

            if (! Schema::hasColumn('users', 'class_name')) {
                $table->string('class_name')->nullable()->after('role');
            }

            if (! Schema::hasColumn('users', 'major')) {
                $table->string('major')->nullable()->after('class_name');
            }

            if (! Schema::hasColumn('users', 'school_name')) {
                $table->string('school_name')->nullable()->after('major');
            }

            if (! Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('active')->after('school_name');
            }

            if (! Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'last_login_at')) {
                $table->dropColumn('last_login_at');
            }
        });
    }
};
