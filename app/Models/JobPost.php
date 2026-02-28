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
        'description',
        'requirements',
        'salary_range',
        'stack',
        'type',
        'location_type',
        'location',
        'status',
        'min_quiz_score',
        'min_task_score',
        'technical_assignment',
        'technical_assignment_file',
    ];

    protected $casts = [
        'stack' => 'array',
    ];

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}
