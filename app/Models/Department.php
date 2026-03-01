<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['name', 'slug'];

    public function jobs()
    {
        return $this->hasMany(JobPost::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}
