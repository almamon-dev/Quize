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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_post_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('resume_path');
            $table->string('portfolio_url')->nullable();
            $table->string('expected_salary')->nullable();
            $table->string('experience_years')->nullable();
            $table->text('cover_letter')->nullable();
            $table->enum('status', [
                'applied',
                'shortlisted',
                'technical_test',
                'interview',
                'offer',
                'hired',
                'rejected',
            ])->default('applied');
            $table->text('admin_note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
