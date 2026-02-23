<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobBoardController extends Controller
{
    public function index()
    {
        $jobs = JobPost::where('status', 'active')->latest()->get();

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
        ]);
    }

    public function show($slug)
    {
        $job = JobPost::where('slug', $slug)->where('status', 'active')->firstOrFail();

        return Inertia::render('Jobs/Show', [
            'job' => $job,
        ]);
    }

    public function apply(Request $request, JobPost $job)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'portfolio_url' => 'nullable|url',
            'expected_salary' => 'nullable|string',
            'experience_years' => 'nullable|string',
            'cover_letter' => 'nullable|string',
        ]);

        if ($request->hasFile('resume')) {
            $path = $request->file('resume')->store('resumes', 'public');
            $validated['resume_path'] = $path;
        }

        $validated['job_post_id'] = $job->id;
        $validated['status'] = 'applied';

        $application = JobApplication::create($validated);

        // Stage 1: Automated CV Sorting & Ranking
        app(\App\Services\RecruitmentService::class)->rankCandidate($application);

        return redirect()->back()->with('success', 'Application submitted successfully!');
    }

    public function submitTaskForm($id)
    {
        $application = JobApplication::with('jobPost')->findOrFail($id);
        
        // Ensure application is in the correct stage
        if ($application->status !== 'technical_test' && $application->status !== 'task_submitted') {
            return redirect()->route('jobs.index')->with('error', 'This application is not ready for task submission.');
        }

        return Inertia::render('Jobs/SubmitTask', [
            'application' => $application,
            'job' => $application->jobPost,
        ]);
    }

    public function submitTask(Request $request, $id)
    {
        $application = JobApplication::findOrFail($id);

        $request->validate([
            'submission_type' => 'required|in:url,file',
            'task_url' => 'required_if:submission_type,url|nullable|url',
            'task_file' => 'required_if:submission_type,file|nullable|file|mimes:zip,rar,pdf,doc,docx|max:10240', // Max 10MB
        ]);

        if ($request->submission_type === 'file' && $request->hasFile('task_file')) {
            $path = $request->file('task_file')->store('task_submissions', 'public');
            $application->update([
                'task_file_path' => $path,
                'task_url' => null,
                'status' => 'task_submitted',
            ]);
            $comment = 'Candidate uploaded technical assignment file.';
        } else {
            $application->update([
                'task_url' => $request->task_url,
                'task_file_path' => null,
                'status' => 'task_submitted',
            ]);
            $comment = 'Candidate submitted technical assignment URL: ' . $request->task_url;
        }

        // Add to application logs
        \App\Models\ApplicationLog::create([
            'job_application_id' => $application->id,
            'from_status' => 'technical_test',
            'to_status' => 'task_submitted',
            'comment' => $comment,
        ]);

        return redirect()->back()->with('success', 'Task submitted successfully!');
    }
}
