<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['category_id', 'job_post_id', 'title', 'slug', 'token', 'description', 'time_per_question', 'is_published'];

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
