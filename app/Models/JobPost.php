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
