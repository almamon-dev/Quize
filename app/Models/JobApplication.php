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
        'status',
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
