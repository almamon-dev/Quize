<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $activeJobs = \App\Models\JobPost::where('status', 'active')->count();
        $totalApps = \App\Models\JobApplication::count();
        $shortlisted = \App\Models\JobApplication::whereIn('status', ['cv_sorted', 'quiz', 'interview', 'assessment', 'negotiation', 'hired'])->count();
        $hired = \App\Models\JobApplication::where('status', 'hired')->count();

        // Pipeline data
        $pipelineStatuses = ['applied', 'cv_sorted', 'quiz', 'interview', 'assessment', 'negotiation', 'hired'];
        $pipelineCounts = \App\Models\JobApplication::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $pipeline = [];
        $maxPipelineCount = 0;
        foreach ($pipelineStatuses as $status) {
            $count = $pipelineCounts[$status] ?? 0;
            $pipeline[] = [
                'status' => $status,
                'count' => $count,
                'label' => ucwords(str_replace('_', ' ', $status)),
            ];
            $maxPipelineCount = max($maxPipelineCount, $count);
        }

        $recentCandidates = \App\Models\JobApplication::with('jobPost:id,title')
            ->orderBy('id', 'desc')
            ->take(5)
            ->get();

        $upcomingInterviews = \App\Models\JobInterview::with('jobApplication:id,name,email')
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'active_jobs' => $activeJobs,
                'total_applicants' => $totalApps,
                'shortlisted' => $shortlisted,
                'total_hired' => $hired,
            ],
            'pipeline' => $pipeline,
            'maxPipelineCount' => $maxPipelineCount,
            'recentCandidates' => $recentCandidates,
            'upcomingInterviews' => $upcomingInterviews,
            'openai_api_key' => config('services.openai.key') ?? '',
        ]);
    }
}
