<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_post_id',
        'name',
        'email',
        'phone',
        'resume_path',
        'portfolio_url',
        'expected_salary',
        'experience_years',
        'cover_letter',
        'ranking_score',
        'cv_analysis',
        'status',
        'task_url',
        'task_file_path',
        'task_score',
        'interview_note',
        'admin_note',
    ];

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class);
    }

    public function logs()
    {
        return $this->hasMany(ApplicationLog::class);
    }
}
