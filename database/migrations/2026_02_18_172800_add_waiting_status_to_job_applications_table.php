<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For MySQL, we use a raw query to update the enum
        DB::statement("ALTER TABLE job_applications MODIFY COLUMN status ENUM('applied', 'shortlisted', 'technical_test', 'interview', 'offer', 'hired', 'rejected', 'waiting') DEFAULT 'applied'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE job_applications MODIFY COLUMN status ENUM('applied', 'shortlisted', 'technical_test', 'interview', 'offer', 'hired', 'rejected') DEFAULT 'applied'");
    }
};
