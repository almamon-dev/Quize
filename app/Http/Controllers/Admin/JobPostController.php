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
            'jobs' => $jobs,
            'departments' => \App\Models\Department::all()
        ]);
    }

    public function show(Request $request, JobPost $job)
    {
        $job->loadCount('applications');
        
        $query = $job->applications()
            ->select('job_applications.*')
            ->selectSub(function ($query) {
                $query->from('quiz_attempts')
                    ->select('score')
                    ->whereColumn('quiz_attempts.email', 'job_applications.email')
                    ->latest()
                    ->limit(1);
            }, 'quiz_score')
            ->latest();

        $applications = clone $query;
        $applications = $applications->get();
        
        $filterQuery = clone $query;

        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $filterQuery->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('email', 'like', $searchTerm);
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $filterQuery->where('status', $request->status);
        }

        $perPage = $request->input('per_page', 10);
        $paginatedApplications = $filterQuery->paginate($perPage)->withQueryString();

        $quiz = $job->quizzes()->withCount('attempts')->first();

        return Inertia::render('Admin/Jobs/Show', [
            'job' => $job,
            'applications' => $applications,
            'paginatedApplications' => $paginatedApplications,
            'quiz' => $quiz,
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Jobs/Create', [
            'departments' => \App\Models\Department::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'job_category' => 'nullable|string|max:255',
            'vacancy' => 'required|integer|min:1',
            'experience_level' => 'required|string|max:255',
            'posted_date' => 'required|date',
            'deadline_date' => 'required|date',
            'close_date' => 'required|date',
            'gender' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'salary_from' => 'required|numeric|min:0',
            'salary_to' => 'required|numeric|min:0',
            'stack' => 'nullable|array',
            'type' => 'required|in:full_time,part_time,contract,internship',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'education_level' => 'required|string|max:255',
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
            'job' => $job,
            'departments' => \App\Models\Department::all()
        ]);
    }

    public function update(Request $request, JobPost $job)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'job_category' => 'nullable|string|max:255',
            'vacancy' => 'required|integer|min:1',
            'experience_level' => 'required|string|max:255',
            'posted_date' => 'required|date',
            'deadline_date' => 'required|date',
            'close_date' => 'required|date',
            'gender' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'salary_from' => 'required|numeric|min:0',
            'salary_to' => 'required|numeric|min:0',
            'stack' => 'nullable|array',
            'type' => 'required|in:full_time,part_time,contract,internship',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'education_level' => 'required|string|max:255',
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
