<?php

namespace App\Http\Controllers;

use App\Models\Option;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PublicQuizController extends Controller
{
    public function show($id)
    {
        $quiz = Quiz::with(['questions' => function ($query) {
            $query->with('options');
        }])->findOrFail($id);

        if (! $quiz->is_published) {
            abort(404, 'Quiz not found or not published.');
        }

        return Inertia::render('Quiz/Take', [
            'quiz' => $quiz,
        ]);
    }

    public function startAttempt(Request $request, Quiz $quiz)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
        ]);

        // Check if this email has already attempted this quiz
        $existingAttempt = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('email', $request->email)
            ->first();

        if ($existingAttempt) {
            return response()->json([
                'error' => 'This email has already been used for this assessment.',
            ], 422);
        }

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => Auth::id(),
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        return response()->json([
            'attempt_id' => $attempt->id,
        ]);
    }

    public function submitAnswer(Request $request)
    {
        $request->validate([
            'quiz_attempt_id' => 'required|exists:quiz_attempts,id',
            'question_id' => 'required|exists:questions,id',
            'option_id' => 'nullable|exists:options,id',
            'user_answer' => 'nullable|string',
        ]);

        $question = Question::findOrFail($request->question_id);
        $isCorrect = false;
        $marksAwarded = 0;

        if ($question->type === 'mcq' && $request->option_id) {
            $option = Option::find($request->option_id);
            if ($option && $option->is_correct) {
                $isCorrect = true;
                $marksAwarded = $question->points;
            }
        } elseif ($question->type === 'fill_gap' && $request->user_answer) {
            if (trim(strtolower($request->user_answer)) === trim(strtolower($question->correct_answer))) {
                $isCorrect = true;
                $marksAwarded = $question->points;
            }
        }

        $answer = QuizAnswer::updateOrCreate(
            [
                'quiz_attempt_id' => $request->quiz_attempt_id,
                'question_id' => $request->question_id,
            ],
            [
                'option_id' => $request->option_id,
                'user_answer' => $request->user_answer,
                'is_correct' => $isCorrect,
                'marks_awarded' => $marksAwarded,
            ]
        );

        return response()->json(['success' => true]);
    }

    public function completeAttempt(Request $request, QuizAttempt $attempt)
    {
        // Calculate total score based on auto-graded questions (MCQs)
        $totalScore = $attempt->answers()->sum('marks_awarded');

        $attempt->update([
            'score' => $totalScore,
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    public function completed()
    {
        return Inertia::render('Quiz/Completed');
    }
}
