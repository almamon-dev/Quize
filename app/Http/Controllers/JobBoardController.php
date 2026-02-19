<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JobBoardController extends Controller
{
    public function index()
    {
        $jobs = JobPost::where('status', 'active')->latest()->get();
        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs
        ]);
    }

    public function show($slug)
    {
        $job = JobPost::where('slug', $slug)->where('status', 'active')->firstOrFail();
        return Inertia::render('Jobs/Show', [
            'job' => $job
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

        JobApplication::create($validated);

        return redirect()->back()->with('success', 'Application submitted successfully!');
    }
}
