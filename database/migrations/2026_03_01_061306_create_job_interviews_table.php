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
        Schema::create('job_interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_application_id')->constrained()->onDelete('cascade');
            $table->string('interview_type'); // e.g., Technical Interview, Culture Fit
            $table->string('interview_mode')->default('online'); // online, offline
            $table->datetime('scheduled_at');
            $table->integer('duration_minutes')->default(60);
            $table->string('status')->default('scheduled'); // scheduled, completed, cancelled
            $table->string('video_link')->nullable();
            $table->text('interviewers')->nullable(); // JSON or comma separated string
            $table->string('location')->nullable();
            $table->text('notes')->nullable();
            $table->text('ai_questions')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_interviews');
    }
};
