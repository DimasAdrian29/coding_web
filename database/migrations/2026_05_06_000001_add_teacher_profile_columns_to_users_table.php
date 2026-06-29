<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'email')) {
                $table->string('email')->nullable()->change();
            }

            if (! Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }

            if (! Schema::hasColumn('users', 'nip')) {
                $table->string('nip')->nullable()->unique()->after('nisn');
            }

            if (! Schema::hasColumn('users', 'subject')) {
                $table->string('subject')->nullable()->after('nip');
            }

            if (! Schema::hasColumn('users', 'school_name')) {
                $table->string('school_name')->nullable()->after('role');
            }

            if (! Schema::hasColumn('users', 'profile_photo')) {
                $table->string('profile_photo')->nullable()->after('school_name');
            }

            if (! Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('active')->after('profile_photo');
            }

            if (! Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            foreach (['profile_photo', 'subject'] as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
