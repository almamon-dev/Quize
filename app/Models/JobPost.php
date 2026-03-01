<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'company_name',
        'company_logo',
        'slug',
        'department',
        'job_category',
        'vacancy',
        'experience_level',
        'posted_date',
        'deadline_date',
        'close_date',
        'gender',
        'description',
        'requirements',
        'salary_from',
        'salary_to',
        'stack',
        'type',
        'location_type',
        'city',
        'state',
        'country',
        'education_level',
        'status',
        'department_id',
        'min_quiz_score',
        'min_task_score',
        'technical_assignment',
        'technical_assignment_file',
    ];

    protected $casts = [
        'stack' => 'array',
        'posted_date' => 'date',
        'deadline_date' => 'date',
        'close_date' => 'date',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}
