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

        if ($quiz->status !== 'published') {
            abort(404, 'Quiz not found or not published.');
        }

        if ($quiz->token && request('token') !== $quiz->token) {
            abort(403, 'Invalid or missing access token.');
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
        } elseif ($question->type === 'text' && $request->user_answer) {
            $apiKey = config('services.openai.key');
            if ($apiKey) {
                $prompt = "Evaluate the relevance and correctness of the User Answer to the Question, based on the Expected Idea. Return ONLY a single integer from 0 to 100 representing the percentage match/relevance. Do not explain.\n\nQuestion: {$question->text}\nExpected Idea: {$question->correct_answer}\nUser Answer: {$request->user_answer}";
                
                try {
                    $response = \Illuminate\Support\Facades\Http::withHeaders([
                        'Authorization' => 'Bearer ' . $apiKey,
                        'Content-Type' => 'application/json',
                    ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                        'model' => 'gpt-4o-mini',
                        'messages' => [
                            ['role' => 'system', 'content' => 'You are an automated strict grader. You return only a number from 0 to 100.'],
                            ['role' => 'user', 'content' => $prompt]
                        ],
                        'temperature' => 0.1,
                    ]);

                    if ($response->successful()) {
                        $content = trim($response->json('choices.0.message.content'));
                        $percentage = (int) $content;

                        if ($percentage >= 80) {
                            $isCorrect = true;
                            $marksAwarded = $question->points;
                        } elseif ($percentage >= 50) {
                            $isCorrect = true;
                            $marksAwarded = $question->points * 0.5;
                        } elseif ($percentage >= 30) {
                            $isCorrect = false;
                            $marksAwarded = $question->points * 0.25;
                        } else {
                            $isCorrect = false;
                            $marksAwarded = 0;
                        }
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('AI Grading Exception: ' . $e->getMessage());
                    $isCorrect = false;
                    $marksAwarded = 0;
                }
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

        // Recruitment Flow: Link to Job Application if applicable
        $jobPostId = $attempt->quiz->job_post_id;
        if ($jobPostId) {
            $application = \App\Models\JobApplication::where('email', $attempt->email)
                ->where('job_post_id', $jobPostId)
                ->first();

            if ($application) {
                $quiz = $attempt->quiz;
                $totalPossiblePoints = $quiz->questions()->sum('points');
                
                // Avoid division by zero
                $percentage = $totalPossiblePoints > 0 ? ($totalScore / $totalPossiblePoints) : 0;
                
                $oldStatus = $application->status;
                
                // Logic for ranges:
                // < 40% -> rejected
                // 40% - 70% -> shortlisted
                // >= 70% -> technical_test
                if ($percentage < 0.4) {
                    $newStatus = 'rejected';
                    $message = "Rejected due to low score (" . round($percentage * 100) . "%).";
                } elseif ($percentage < 0.7) {
                    $newStatus = 'shortlisted';
                    $message = "Shortlisted for further review (" . round($percentage * 100) . "%).";
                } else {
                    $newStatus = 'technical_test';
                    $message = "Moved to technical test stage (" . round($percentage * 100) . "%).";
                }

                $application->update([
                    'status' => $newStatus,
                    'admin_note' => $application->admin_note . "\nQuiz completed. Score: {$totalScore}/{$totalPossiblePoints} (" . round($percentage * 100) . "%). {$message}",
                ]);

                // Log the transition
                \App\Models\ApplicationLog::create([
                    'job_application_id' => $application->id,
                    'from_status' => $oldStatus,
                    'to_status' => $newStatus,
                    'comment' => "Automated scoring: {$totalScore}/{$totalPossiblePoints} (" . round($percentage * 100) . "%)",
                    'user_id' => null, // Automated action
                ]);
            }
        }

        return response()->json(['success' => true]);
    }

    public function completed()
    {
        return Inertia::render('Quiz/Completed');
    }
}
