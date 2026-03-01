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
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('set null');
            $table->string('title');
            $table->string('company_name')->nullable();
            $table->string('company_logo')->nullable();
            $table->string('slug')->unique();
            $table->string('department');
            $table->string('job_category')->nullable();
            $table->integer('vacancy')->default(1);
            $table->string('experience_level')->nullable();
            $table->date('posted_date')->nullable();
            $table->date('deadline_date')->nullable();
            $table->date('close_date')->nullable();
            $table->string('gender')->nullable();
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->decimal('salary_from', 15, 2)->nullable();
            $table->decimal('salary_to', 15, 2)->nullable();
            $table->json('stack')->nullable();
            $table->enum('type', ['full_time', 'part_time', 'contract', 'internship'])->default('full_time');
            $table->enum('location_type', ['on_site', 'remote', 'hybrid'])->default('on_site');
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('education_level')->nullable();
            $table->enum('status', ['active', 'closed', 'draft'])->default('draft');
            $table->decimal('min_quiz_score', 5, 2)->default(50.00);
            $table->decimal('min_task_score', 5, 2)->default(50.00);
            $table->text('technical_assignment')->nullable();
            $table->string('technical_assignment_file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_posts');
    }
};
