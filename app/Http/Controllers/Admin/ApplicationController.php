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
        $query = JobApplication::query()->with(['jobPost']);

        // Apply filters
        if ($request->filled('job_id')) {
            $query->where('job_post_id', $request->job_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 10);
        $applications = $query->paginate((int)$perPage)->withQueryString();

        $statusCounts = JobApplication::groupBy('status')
            ->select('status', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->pluck('count', 'status')
            ->toArray();

        return Inertia::render('Admin/Candidates/Index', [
            'applications' => $applications,
            'filters' => $request->only(['job_id', 'status', 'department', 'search', 'sort_by', 'sort_order']),
            'jobs' => \App\Models\JobPost::all(['id', 'title']),
            'departments' => \App\Models\Department::all(),
            'statusCounts' => $statusCounts,
        ]);
    }

    public function cvManagement(Request $request)
    {
        $query = JobApplication::query()->with(['jobPost']);

        // Apply filters
        if ($request->filled('job_id')) {
            $query->where('job_post_id', $request->job_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 10);
        $applications = $query->paginate((int)$perPage)->withQueryString();

        $statusCounts = JobApplication::groupBy('status')
            ->select('status', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->pluck('count', 'status')
            ->toArray();

        return Inertia::render('Admin/CVManagement/Index', [
            'applications' => $applications,
            'filters' => $request->only(['job_id', 'status', 'department', 'search', 'sort_by', 'sort_order']),
            'jobs' => \App\Models\JobPost::all(['id', 'title']),
            'departments' => \App\Models\Department::all(),
            'statusCounts' => $statusCounts,
        ]);
    }

    public function pipeline()
    {
        return Inertia::render('Admin/Candidates/Pipeline', [
            'applications' => JobApplication::with('jobPost')->latest()->get(),
            'jobs' => \App\Models\JobPost::all(),
        ]);
    }

    public function show(JobApplication $application)
    {
        $application->load(['jobPost', 'logs.admin']);
        $templates = EmailTemplate::all();

        $quizAttempt = \App\Models\QuizAttempt::where('email', $application->email)
            ->with(['quiz.questions', 'answers.question.options', 'answers.option'])
            ->latest()
            ->first();

        $jobQuiz = $application->jobPost->quizzes()->where('is_published', true)->first();

        return Inertia::render('Admin/Candidates/Show', [
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

        // Auto-send Shortlist Email & Quiz Invitation if status is 'shortlisted'
        if ($request->status === 'shortlisted') {
            $template = \App\Models\EmailTemplate::where('name', 'like', '%Shortlist%')->first();
            
            $subject = 'Update on your application: ' . ($application->jobPost->title ?? 'Shortlisted');
            $body = "<h2>Hello {$application->name},</h2><p>Congratulations! You have been shortlisted for the <strong>" . ($application->jobPost->title ?? 'position') . "</strong> position.</p>";
            
            if ($template) {
                $subject = str_replace(
                    ['{candidate_name}', '{job_title}'], 
                    [$application->name, $application->jobPost->title ?? ''], 
                    $template->subject
                );
                
                $bodyStr = str_replace(
                    ['{candidate_name}', '{job_title}'], 
                    [$application->name, $application->jobPost->title ?? ''], 
                    $template->body
                );
                
                // If template content is plain text (no HTML tags), wrap it in nl2br
                $body = $bodyStr != strip_tags($bodyStr) ? $bodyStr : nl2br($bodyStr);
            }

            // Append Quiz if exists
            $quiz = $application->jobPost->quizzes()->where('is_published', true)->first();
            if ($quiz) {
                $quizLink = route('quiz.public.show', $quiz->id).($quiz->token ? "?token={$quiz->token}" : '');
                $quizHtml = '<br><br><p>The next step in our process is a brief technical assessment. Please complete the quiz using the link below:</p>'.
                        "<p><br><a href='{$quizLink}' style='background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Start Quiz</a><br><br></p>".
                        "<p>If the button doesn't work, copy and paste this URL: <br>{$quizLink}</p>";
                
                if (str_contains($body, '{quiz_link}')) {
                    $body = str_replace('{quiz_link}', "<a href='{$quizLink}'>Start Quiz</a>", $body);
                } else {
                    $body .= $quizHtml;
                }
            }

            try {
                \Illuminate\Support\Facades\Mail::to($application->email)->send(new \App\Mail\CandidateEmail($subject, $body));
                $request->merge(['comment' => ($request->comment ? $request->comment."\n\n" : '').'Automated shortlist/quiz email sent to candidate.']);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send shortlist email: '.$e->getMessage());
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

    public function analyze(JobApplication $application)
    {
        $result = app(\App\Services\RecruitmentService::class)->rankCandidate($application);

        if ($result) {
            return redirect()->back()->with('success', 'AI Analysis completed successfully.');
        }

        return redirect()->back()->with('error', 'AI Analysis failed. Please check your API configuration.');
    }
}
