<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/settings', function () {
        return Inertia::render('Admin/Settings/Edit');
    })->name('settings.edit');
    Route::get('/quizzes/results', [App\Http\Controllers\Admin\QuizController::class, 'results'])->name('quizzes.results');
    Route::get('/quizzes/attempts/{attempt}', [App\Http\Controllers\Admin\QuizController::class, 'showAttempt'])->name('quizzes.attempts.show');
    Route::post('/quizzes/answers/{answer}/grade', [App\Http\Controllers\Admin\QuizController::class, 'grade'])->name('quizzes.answers.grade');
    Route::post('/quizzes/generate-questions', [App\Http\Controllers\Admin\AiQuizController::class, 'generate'])->name('quizzes.generate-questions');
    Route::resource('quizzes', App\Http\Controllers\Admin\QuizController::class);
});

// Public Quiz Routes
Route::get('/q/{id}', [App\Http\Controllers\PublicQuizController::class, 'show'])->name('quiz.public.show');
Route::post('/quiz/start/{quiz}', [App\Http\Controllers\PublicQuizController::class, 'startAttempt'])->name('quiz.attempt.start');
Route::post('/quiz/submit-answer', [App\Http\Controllers\PublicQuizController::class, 'submitAnswer'])->name('quiz.answer.submit');
Route::post('/quiz/complete/{attempt}', [App\Http\Controllers\PublicQuizController::class, 'completeAttempt'])->name('quiz.attempt.complete');
Route::get('/quiz/completed', [App\Http\Controllers\PublicQuizController::class, 'completed'])->name('quiz.completed');

require __DIR__.'/auth.php';
