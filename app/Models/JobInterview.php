<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobInterview extends Model
{
    protected $fillable = [
        'job_application_id',
        'interview_type',
        'interview_mode',
        'scheduled_at',
        'duration_minutes',
        'status',
        'video_link',
        'location',
        'interviewers',
        'ai_questions',
        'notes',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'interviewers' => 'array',
    ];

    public function jobApplication()
    {
        return $this->belongsTo(JobApplication::class);
    }
}
