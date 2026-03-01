<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use App\Models\JobPost;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index()
    {
        $quizzes = Quiz::with(['jobPost', 'department'])
            ->withCount('questions')
            ->addSelect(['unique_attempts_count' => QuizAttempt::selectRaw('count(distinct email)')
                ->whereColumn('quiz_id', 'quizzes.id')
            ])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Quizzes/Index', [
            'quizzes' => $quizzes,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Admin/Quizzes/Create', [
            'jobPosts' => JobPost::where('status', 'active')->get(['id', 'title']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'preselectedJobId' => $request->query('job_id'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_post_id' => 'nullable|exists:job_posts,id',
            'department_id' => 'required|exists:departments,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:mcq,short_answer,mixed',
            'time_limit' => 'required|integer|min:1',
            'pass_percentage' => 'required|integer|min:1|max:100',
            'status' => 'required|in:draft,published,closed',
            'negative_marking' => 'boolean',
            'randomize_questions' => 'boolean',
            'questions' => 'required|array|min:1',
            'questions.*.text' => 'required|string',
            'questions.*.image' => 'nullable|image|max:2048',
            'questions.*.type' => 'required|in:mcq,text,fill_gap',
            'questions.*.difficulty' => 'required|in:easy,medium,hard',
            'questions.*.points' => 'required|numeric|min:0',
            'questions.*.correct_answer' => 'nullable|string',
            'questions.*.options' => 'required_if:questions.*.type,mcq|array',
            'questions.*.options.*.text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);

        $quiz = Quiz::create([
            'title' => $validated['title'],
            'job_post_id' => $validated['job_post_id'] ?? null,
            'department_id' => $validated['department_id'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'time_limit' => $validated['time_limit'],
            'pass_percentage' => $validated['pass_percentage'],
            'status' => $validated['status'],
            'negative_marking' => $validated['negative_marking'] ?? false,
            'randomize_questions' => $validated['randomize_questions'] ?? false,
            'token' => Str::random(25),
        ]);

        foreach ($validated['questions'] as $qData) {
            $imagePath = null;
            if (isset($qData['image'])) {
                $imagePath = $qData['image']->store('questions', 'public');
            }

            $question = $quiz->questions()->create([
                'text' => $qData['text'],
                'image_path' => $imagePath,
                'type' => $qData['type'],
                'difficulty' => $qData['difficulty'] ?? 'medium',
                'points' => $qData['points'],
                'correct_answer' => $qData['correct_answer'] ?? null,
            ]);

            if ($qData['type'] === 'mcq' && isset($qData['options'])) {
                foreach ($qData['options'] as $oData) {
                    $question->options()->create([
                        'text' => $oData['text'],
                        'is_correct' => $oData['is_correct'],
                    ]);
                }
            }
        }

        return redirect()->route('admin.quizzes.index')->with('success', 'Quiz created successfully.');
    }

    public function edit(Quiz $quiz)
    {
        $quiz->load('questions.options');

        return Inertia::render('Admin/Quizzes/Edit', [
            'quiz' => $quiz,
            'jobPosts' => JobPost::where('status', 'active')->get(['id', 'title']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'job_post_id' => 'nullable|exists:job_posts,id',
            'department_id' => 'required|exists:departments,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:mcq,short_answer,mixed',
            'time_limit' => 'required|integer|min:1',
            'pass_percentage' => 'required|integer|min:1|max:100',
            'status' => 'required|in:draft,published,closed',
            'negative_marking' => 'boolean',
            'randomize_questions' => 'boolean',
            'questions' => 'required|array|min:1',
            'questions.*.id' => 'nullable|exists:questions,id',
            'questions.*.text' => 'required|string',
            'questions.*.image' => 'nullable|image|max:2048',
            'questions.*.type' => 'required|in:mcq,text,fill_gap',
            'questions.*.difficulty' => 'required|in:easy,medium,hard',
            'questions.*.points' => 'required|numeric|min:0',
            'questions.*.correct_answer' => 'nullable|string',
            'questions.*.options' => 'required_if:questions.*.type,mcq|array',
            'questions.*.options.*.id' => 'nullable|exists:options,id',
            'questions.*.options.*.text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);

        $quiz->update([
            'title' => $validated['title'],
            'job_post_id' => $validated['job_post_id'] ?? null,
            'department_id' => $validated['department_id'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'time_limit' => $validated['time_limit'],
            'pass_percentage' => $validated['pass_percentage'],
            'status' => $validated['status'],
            'negative_marking' => $validated['negative_marking'] ?? false,
            'randomize_questions' => $validated['randomize_questions'] ?? false,
        ]);

        // Simple approach: delete existing questions and recreate
        // Or more complex sync:
        $quiz->questions()->delete();

        foreach ($validated['questions'] as $qData) {
            $imagePath = $qData['image_path'] ?? null;
            if (isset($qData['image'])) {
                $imagePath = $qData['image']->store('questions', 'public');
            }

            $question = $quiz->questions()->create([
                'text' => $qData['text'],
                'image_path' => $imagePath,
                'type' => $qData['type'],
                'difficulty' => $qData['difficulty'] ?? 'medium',
                'points' => $qData['points'],
                'correct_answer' => $qData['correct_answer'] ?? null,
            ]);

            if ($qData['type'] === 'mcq' && isset($qData['options'])) {
                foreach ($qData['options'] as $oData) {
                    $question->options()->create([
                        'text' => $oData['text'],
                        'is_correct' => $oData['is_correct'],
                    ]);
                }
            }
        }

        return redirect()->route('admin.quizzes.index')->with('success', 'Quiz updated successfully.');
    }

    public function destroy(Quiz $quiz)
    {
        $quiz->delete();

        return redirect()->route('admin.quizzes.index')->with('success', 'Quiz deleted successfully.');
    }

    public function results(Request $request)
    {
        $query = QuizAttempt::with(['quiz' => function($q) {
                $q->withSum('questions', 'points');
            }, 'user'])
            ->withSum('answers', 'marks_awarded');

        // Apply filters
        if ($request->filled('quiz_id')) {
            $query->where('quiz_id', $request->quiz_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('user', function($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Sorting
        $query->latest();

        $statsQuery = clone $query;
        $allStatsData = $statsQuery->get();
        $totalAttemptsCount = $allStatsData->count();
        $successCount = 0;
        $highScoreCount = 0;

        foreach ($allStatsData as $a) {
            $maxScore = $a->quiz->questions_sum_points ?? 1;
            $maxScore = $maxScore > 0 ? $maxScore : 1; 
            $pct = ($a->score / $maxScore) * 100;
            if ($pct >= 70) $successCount++;
            if ($pct >= 90) $highScoreCount++;
        }

        $metrics = [
            'total_attempts' => $totalAttemptsCount,
            'success_rate' => $totalAttemptsCount > 0 ? round(($successCount / $totalAttemptsCount) * 100) : 0,
            'high_scores' => $highScoreCount,
        ];

        $perPage = $request->get('per_page', 10);
        $attempts = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Quizzes/Results', [
            'attempts' => $attempts,
            'metrics' => $metrics,
            'quizzes' => Quiz::all(['id', 'title']),
            'filters' => $request->only(['search', 'quiz_id', 'per_page']),
        ]);
    }

    public function showAttempt(QuizAttempt $attempt)
    {
        $attempt->load(['user', 'quiz.questions.options', 'answers.question.options', 'answers.option']);

        return Inertia::render('Admin/Quizzes/ShowAttempt', [
            'attempt' => $attempt,
        ]);
    }

    public function grade(Request $request, QuizAnswer $answer)
    {
        $validated = $request->validate([
            'is_correct' => 'required|boolean',
            'marks_awarded' => 'required|numeric|min:0',
            'admin_feedback' => 'nullable|string',
        ]);

        $answer->update($validated);

        // Recalculate total score for the attempt
        $attempt = $answer->attempt;
        $totalScore = $attempt->answers()->sum('marks_awarded');
        $attempt->update(['score' => $totalScore]);

        return back()->with('success', 'Answer graded successfully.');
    }
}
