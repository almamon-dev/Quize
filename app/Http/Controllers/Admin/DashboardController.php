<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => ['count' => User::count()],
                'quizzes' => ['count' => Quiz::count()],
                'attempts' => ['count' => QuizAttempt::count()],
                'services' => ['count' => 0], // Placeholder or actual service count
            ],
            'openai_api_key' => config('services.openai.key') ?? '',
        ]);
    }
}
