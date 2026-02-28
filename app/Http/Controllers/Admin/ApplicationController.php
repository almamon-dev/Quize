<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ApplicationLog;
use App\Models\EmailTemplate;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $applications = JobApplication::with(['jobPost'])
            ->select('job_applications.*')
            ->selectSub(function ($query) {
                $query->from('quiz_attempts')
                    ->select('score')
                    ->whereColumn('quiz_attempts.email', 'job_applications.email')
                    ->latest()
                    ->limit(1);
            }, 'quiz_score')
            ->when($request->job_id, fn ($q) => $q->where('job_post_id', $request->job_id))
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->when($request->department, fn ($q) => $q->whereHas('jobPost', fn ($jq) => $jq->where('department', $request->department)))
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
            'filters' => $request->only(['job_id', 'status', 'department']),
            'jobs' => \App\Models\JobPost::all(['id', 'title']),
            'departments' => \App\Models\JobPost::distinct()->whereNotNull('department')->pluck('department'),
        ]);
    }

    public function pipeline()
    {
        return Inertia::render('Admin/Applications/Pipeline', [
            'applications' => JobApplication::with('jobPost')->latest()->get(),
            'jobs' => \App\Models\JobPost::all(),
        ]);
    }

    public function show(JobApplication $application)
    {
        $application->load(['jobPost', 'logs.admin']);
        $templates = EmailTemplate::all();

        $quizAttempt = \App\Models\QuizAttempt::where('email', $application->email)
            ->with(['quiz', 'answers.question', 'answers.option'])
            ->latest()
            ->first();

        $jobQuiz = $application->jobPost->quizzes()->where('is_published', true)->first();

        return Inertia::render('Admin/Applications/Show', [
            'application' => $application,
            'templates' => $templates,
            'quizAttempt' => $quizAttempt,
            'jobQuiz' => $jobQuiz,
        ]);
    }

    public function updateStatus(Request $request, JobApplication $application)
    {
        $request->validate([
            'status' => 'required|string',
            'comment' => 'nullable|string',
        ]);

        $oldStatus = $application->status;
        $application->update(['status' => $request->status]);

        // Auto-send Quiz Invitation if status is 'shortlisted'
        if ($request->status === 'shortlisted') {
            $quiz = $application->jobPost->quizzes()->where('is_published', true)->first();
            if ($quiz) {
                $quizLink = route('quiz.public.show', $quiz->id).($quiz->token ? "?token={$quiz->token}" : '');
                $subject = 'Quiz Invitation: '.$quiz->title;

                $body = "<h2>Hello {$application->name},</h2>".
                        "<p>Congratulations! You have been shortlisted for the <strong>{$application->jobPost->title}</strong> position.</p>".
                        '<p>The next step in our process is a brief technical assessment. Please complete the quiz using the link below:</p>'.
                        "<p><a href='{$quizLink}' style='background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Start Quiz</a></p>".
                        "<p>If the button doesn't work, copy and paste this URL: {$quizLink}</p>".
                        '<p>Good luck!</p>';

                try {
                    Mail::to($application->email)->send(new \App\Mail\CandidateEmail($subject, $body));
                    $request->merge(['comment' => ($request->comment ? $request->comment."\n\n" : '').'Automated quiz invitation email sent to candidate.']);
                } catch (\Exception $e) {
                    Log::error('Failed to send quiz invitation email: '.$e->getMessage());
                }
            }
        }

        // Auto-send Technical Assignment if status is 'technical_test'
        if ($request->status === 'technical_test' && ($application->jobPost->technical_assignment || $application->jobPost->technical_assignment_file)) {
            $submissionLink = route('jobs.application.task-form', $application->id);
            $subject = 'Technical Assignment: '.$application->jobPost->title;

            $body = "<h2>Hello {$application->name},</h2>".
                    "<p>We are pleased to invite you to the technical assessment stage for the <strong>{$application->jobPost->title}</strong> position.</p>";

            if ($application->jobPost->technical_assignment) {
                $body .= "<div style='background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eee; margin: 20px 0;'>".
                         $application->jobPost->technical_assignment.
                         '</div>';
            }

            if ($application->jobPost->technical_assignment_file) {
                $fileLink = url('/storage/'.$application->jobPost->technical_assignment_file);
                $body .= "<p><strong>Download Assignment Instructions:</strong> <a href='{$fileLink}'>Download File</a></p>";
            }

            $body .= '<p>Once you have completed the task, please submit your work using the link below:</p>'.
                     "<p><a href='{$submissionLink}' style='background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Submit Your Task</a></p>".
                     "<p>If the button doesn't work, copy and paste this URL: {$submissionLink}</p>".
                     '<p>Good luck!</p>';

            try {
                Mail::to($application->email)->send(new \App\Mail\CandidateEmail($subject, $body));
                $request->merge(['comment' => ($request->comment ? $request->comment."\n\n" : '').'Automated assignment email sent to candidate.']);
            } catch (\Exception $e) {
                Log::error('Failed to send assignment email: '.$e->getMessage());
            }
        }

        ApplicationLog::create([
            'job_application_id' => $application->id,
            'from_status' => $oldStatus,
            'to_status' => $request->status,
            'comment' => $request->comment,
            'user_id' => \Illuminate\Support\Facades\Auth::id(),
        ]);

        return redirect()->back()->with('success', "Status updated to {$request->status}");
    }

    public function updateAssessment(Request $request, JobApplication $application)
    {
        $validated = $request->validate([
            'ranking_score' => 'nullable|numeric|min:0|max:100',
            'cv_analysis' => 'nullable|string',
            'task_url' => 'nullable|string',
            'task_file_path' => 'nullable|string',
            'task_score' => 'nullable|numeric|min:0|max:100',
            'interview_note' => 'nullable|string',
            'admin_note' => 'nullable|string',
        ]);

        $application->update($validated);

        return redirect()->back()->with('success', 'Assessment updated successfully.');
    }

    public function sendEmail(Request $request, JobApplication $application)
    {
        $request->validate([
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        try {
            Mail::to($application->email)->send(new \App\Mail\CandidateEmail($request->subject, $request->body));

            return redirect()->back()->with('success', 'Email sent to '.$application->email);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to send email: '.$e->getMessage());
        }
    }
}
