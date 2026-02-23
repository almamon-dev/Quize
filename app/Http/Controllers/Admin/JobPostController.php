<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class JobPostController extends Controller
{
    public function index()
    {
        $jobs = JobPost::withCount('applications')->latest()->get();
        return Inertia::render('Admin/Jobs/Index', [
            'jobs' => $jobs
        ]);
    }

    public function show(JobPost $job)
    {
        $job->loadCount('applications');
        
        $applications = $job->applications()
            ->select('job_applications.*')
            ->selectSub(function ($query) {
                $query->from('quiz_attempts')
                    ->select('score')
                    ->whereColumn('quiz_attempts.email', 'job_applications.email')
                    ->latest()
                    ->limit(1);
            }, 'quiz_score')
            ->latest()
            ->get();

        $quiz = $job->quizzes()->withCount('attempts')->first();

        return Inertia::render('Admin/Jobs/Show', [
            'job' => $job,
            'applications' => $applications,
            'quiz' => $quiz,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Jobs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'salary_range' => 'nullable|string',
            'stack' => 'nullable|array',
            'type' => 'required|in:full_time,part_time,contract,internship',
            'status' => 'required|in:active,closed,draft',
            'technical_assignment' => 'nullable|string',
            'technical_assignment_file' => 'nullable|file|mimes:pdf,zip,doc,docx|max:10240',
        ]);

        if ($request->hasFile('technical_assignment_file')) {
            $validated['technical_assignment_file'] = $request->file('technical_assignment_file')->store('assignments', 'public');
        }

        $validated['slug'] = Str::slug($validated['title']) . '-' . rand(1000, 9999);

        JobPost::create($validated);

        return redirect()->route('admin.jobs.index')->with('success', 'Job created successfully.');
    }

    public function edit(JobPost $job)
    {
        return Inertia::render('Admin/Jobs/Edit', [
            'job' => $job
        ]);
    }

    public function update(Request $request, JobPost $job)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'salary_range' => 'nullable|string',
            'stack' => 'nullable|array',
            'type' => 'required|in:full_time,part_time,contract,internship',
            'status' => 'required|in:active,closed,draft',
            'technical_assignment' => 'nullable|string',
            'technical_assignment_file' => 'nullable|file|mimes:pdf,zip,doc,docx|max:10240',
        ]);

        if ($request->hasFile('technical_assignment_file')) {
            $validated['technical_assignment_file'] = $request->file('technical_assignment_file')->store('assignments', 'public');
        }

        $job->update($validated);

        return redirect()->route('admin.jobs.index')->with('success', 'Job updated successfully.');
    }

    public function destroy(JobPost $job)
    {
        $job->delete();
        return redirect()->back()->with('success', 'Job deleted successfully.');
    }
}
