<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_application_id',
        'from_status',
        'to_status',
        'comment',
        'user_id',
    ];

    public function application()
    {
        return $this->belongsTo(JobApplication::class, 'job_application_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
