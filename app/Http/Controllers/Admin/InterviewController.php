<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobInterview;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InterviewController extends Controller
{
    public function index(Request $request)
    {
        $query = JobInterview::with(['jobApplication.jobPost.department']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('interview_type')) {
            $query->where('interview_type', $request->interview_type);
        }

        if ($request->filled('department_id')) {
            $query->whereHas('jobApplication.jobPost', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        if ($request->filled('job_post_id')) {
            $query->whereHas('jobApplication', function ($q) use ($request) {
                $q->where('job_post_id', $request->job_post_id);
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('jobApplication', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 10);
        $interviews = $query->latest('scheduled_at')->paginate($perPage)->withQueryString();

        $stats = [
            'total' => JobInterview::count(),
            'upcoming' => JobInterview::where('scheduled_at', '>', now())->count(),
            'completed' => JobInterview::where('status', 'completed')->count(),
            'with_video' => JobInterview::whereNotNull('video_link')->count(),
        ];

        return Inertia::render('Admin/Interviews/Index', [
            'interviews' => $interviews,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search', 'department_id', 'job_post_id', 'interview_type']),
            'candidates' => \App\Models\JobApplication::whereIn('status', ['shortlisted', 'quiz', 'interview', 'technical_test'])->get(['id', 'name', 'email', 'job_post_id']),
            'jobs' => \App\Models\JobPost::get(['id', 'title', 'department_id']),
            'departments' => \App\Models\Department::get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_application_id' => 'required|exists:job_applications,id',
            'interview_type' => 'required|string',
            'interview_mode' => 'required|string|in:online,offline',
            'scheduled_at' => 'required|date',
            'duration_minutes' => 'required|integer|min:15',
            'video_link' => 'nullable|url',
            'location' => 'nullable|string',
            'interviewers' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        JobInterview::create($validated);

        return redirect()->back()->with('success', 'Interview scheduled successfully.');
    }

    public function update(Request $request, JobInterview $interview)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'scheduled_at' => 'nullable|date',
            'duration_minutes' => 'nullable|integer|min:15',
            'video_link' => 'nullable|url',
            'location' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $interview->update($validated);

        return redirect()->back()->with('success', 'Interview updated successfully.');
    }

    public function destroy(JobInterview $interview)
    {
        $interview->delete();

        return redirect()->back()->with('success', 'Interview deleted successfully.');
    }
}
