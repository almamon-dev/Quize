<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index()
    {
        $quizzes = Quiz::withCount('questions')
            ->addSelect(['unique_attempts_count' => QuizAttempt::selectRaw('count(distinct email)')
                ->whereColumn('quiz_id', 'quizzes.id')
            ])
            ->latest()
            ->get();

        return Inertia::render('Admin/Quizzes/Index', [
            'quizzes' => $quizzes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Quizzes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_per_question' => 'required|integer|min:1',
            'is_published' => 'boolean',
            'questions' => 'required|array|min:1',
            'questions.*.text' => 'required|string',
            'questions.*.image' => 'nullable|image|max:2048',
            'questions.*.type' => 'required|in:mcq,text,fill_gap',
            'questions.*.points' => 'required|numeric|min:0',
            'questions.*.correct_answer' => 'nullable|string',
            'questions.*.options' => 'required_if:questions.*.type,mcq|array',
            'questions.*.options.*.text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);

        $quiz = Quiz::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'time_per_question' => $validated['time_per_question'],
            'is_published' => $validated['is_published'] ?? false,
            'token' => Str::random(255),
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
        ]);
    }

    public function update(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_per_question' => 'required|integer|min:1',
            'is_published' => 'boolean',
            'questions' => 'required|array|min:1',
            'questions.*.id' => 'nullable|exists:questions,id',
            'questions.*.text' => 'required|string',
            'questions.*.image' => 'nullable|image|max:2048',
            'questions.*.type' => 'required|in:mcq,text,fill_gap',
            'questions.*.points' => 'required|numeric|min:0',
            'questions.*.correct_answer' => 'nullable|string',
            'questions.*.options' => 'required_if:questions.*.type,mcq|array',
            'questions.*.options.*.id' => 'nullable|exists:options,id',
            'questions.*.options.*.text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);

        $quiz->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'time_per_question' => $validated['time_per_question'],
            'is_published' => $validated['is_published'] ?? false,
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

    public function results()
    {
        $attempts = QuizAttempt::with(['user', 'quiz'])->latest()->get();

        return Inertia::render('Admin/Quizzes/Results', [
            'attempts' => $attempts,
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
