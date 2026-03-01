<?php

use App\Http\Controllers\ProfileController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'jobs' => \App\Models\JobPost::where('status', 'active')->latest()->take(3)->get(),
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
    
    // Quiz Admin Routes
    Route::get('/quizzes/results', [App\Http\Controllers\Admin\QuizController::class, 'results'])->name('quizzes.results');
    Route::get('/quizzes/attempts/{attempt}', [App\Http\Controllers\Admin\QuizController::class, 'showAttempt'])->name('quizzes.attempts.show');
    Route::post('/quizzes/answers/{answer}/grade', [App\Http\Controllers\Admin\QuizController::class, 'grade'])->name('quizzes.answers.grade');
    Route::post('/quizzes/generate-questions', [App\Http\Controllers\Admin\AiQuizController::class, 'generate'])->name('quizzes.generate-questions');
    Route::resource('quizzes', App\Http\Controllers\Admin\QuizController::class);

    // Hiring Admin Routes
    Route::resource('jobs', App\Http\Controllers\Admin\JobPostController::class);
    Route::resource('departments', App\Http\Controllers\Admin\DepartmentController::class);
    Route::get('/cv-management', [App\Http\Controllers\Admin\ApplicationController::class, 'cvManagement'])->name('cv_management.index');
    Route::get('/applications/pipeline', [App\Http\Controllers\Admin\ApplicationController::class, 'pipeline'])->name('applications.pipeline');
    Route::get('/applications', [App\Http\Controllers\Admin\ApplicationController::class, 'index'])->name('applications.index');
    Route::get('/applications/{application}', [App\Http\Controllers\Admin\ApplicationController::class, 'show'])->name('applications.show');
    Route::post('/applications/{application}/status', [App\Http\Controllers\Admin\ApplicationController::class, 'updateStatus'])->name('applications.status');
    Route::post('/applications/{application}/assessment', [App\Http\Controllers\Admin\ApplicationController::class, 'updateAssessment'])->name('applications.assessment');
    Route::post('/applications/{application}/email', [App\Http\Controllers\Admin\ApplicationController::class, 'sendEmail'])->name('applications.email');
    Route::post('/applications/{application}/analyze', [App\Http\Controllers\Admin\ApplicationController::class, 'analyze'])->name('applications.analyze');

    // Email Template Routes
    Route::resource('email-templates', App\Http\Controllers\Admin\EmailTemplateController::class);

    // Interview Routes
    Route::resource('interviews', App\Http\Controllers\Admin\InterviewController::class);
});

// Public Quiz Routes
Route::get('/q/{id}', [App\Http\Controllers\PublicQuizController::class, 'show'])->name('quiz.public.show');
Route::post('/quiz/start/{quiz}', [App\Http\Controllers\PublicQuizController::class, 'startAttempt'])->name('quiz.attempt.start');
Route::post('/quiz/submit-answer', [App\Http\Controllers\PublicQuizController::class, 'submitAnswer'])->name('quiz.answer.submit');
Route::post('/quiz/complete/{attempt}', [App\Http\Controllers\PublicQuizController::class, 'completeAttempt'])->name('quiz.attempt.complete');
Route::get('/quiz/completed', [App\Http\Controllers\PublicQuizController::class, 'completed'])->name('quiz.completed');

// Public Job Board Routes
Route::prefix('jobs')->name('jobs.')->group(function () {
    Route::get('/', [App\Http\Controllers\JobBoardController::class, 'index'])->name('index');
    Route::get('/{slug}', [App\Http\Controllers\JobBoardController::class, 'show'])->name('show');
    Route::post('/{job}/apply', [App\Http\Controllers\JobBoardController::class, 'apply'])->name('apply');
    Route::get('/application/{id}/submit-task', [App\Http\Controllers\JobBoardController::class, 'submitTaskForm'])->name('application.task-form');
    Route::post('/application/{id}/submit-task', [App\Http\Controllers\JobBoardController::class, 'submitTask'])->name('application.submit-task');
});

require __DIR__.'/auth.php';
