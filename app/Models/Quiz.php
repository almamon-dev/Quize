<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
        'category_id', 
        'job_post_id', 
        'department_id',
        'title', 
        'slug', 
        'token', 
        'description', 
        'type',
        'time_limit',
        'pass_percentage',
        'status',
        'negative_marking',
        'randomize_questions'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }
}
