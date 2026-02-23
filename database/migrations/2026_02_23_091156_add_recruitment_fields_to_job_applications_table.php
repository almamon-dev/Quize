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
        Schema::table('job_applications', function (Blueprint $table) {
            $table->decimal('ranking_score', 5, 2)->nullable()->after('cover_letter');
            $table->text('cv_analysis')->nullable()->after('ranking_score');
            $table->string('task_url')->nullable()->after('status');
            $table->decimal('task_score', 5, 2)->nullable()->after('task_url');
            $table->text('interview_note')->nullable()->after('task_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            //
        });
    }
};
