<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\ApplicationLog;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $applications = JobApplication::with('jobPost')
            ->when($request->job_id, fn($q) => $q->where('job_post_id', $request->job_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->department, fn($q) => $q->whereHas('jobPost', fn($jq) => $jq->where('department', $request->department)))
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
            'filters' => $request->only(['job_id', 'status', 'department']),
            'jobs' => \App\Models\JobPost::all(['id', 'title']),
            'departments' => \App\Models\JobPost::distinct()->whereNotNull('department')->pluck('department')
        ]);
    }

    public function show(JobApplication $application)
    {
        $application->load(['jobPost', 'logs.admin']);
        $templates = EmailTemplate::all();

        return Inertia::render('Admin/Applications/Show', [
            'application' => $application,
            'templates' => $templates
        ]);
    }

    public function updateStatus(Request $request, JobApplication $application)
    {
        $request->validate([
            'status' => 'required|string',
            'comment' => 'nullable|string'
        ]);

        $oldStatus = $application->status;
        $application->update(['status' => $request->status]);

        ApplicationLog::create([
            'job_application_id' => $application->id,
            'from_status' => $oldStatus,
            'to_status' => $request->status,
            'comment' => $request->comment,
            'user_id' => \Illuminate\Support\Facades\Auth::id(),
        ]);

        return redirect()->back()->with('success', "Status updated to {$request->status}");
    }

    public function sendEmail(Request $request, JobApplication $application)
    {
        $request->validate([
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        try {
            Mail::to($application->email)->send(new \App\Mail\CandidateEmail($request->subject, $request->body));
            return redirect()->back()->with('success', 'Email sent to ' . $application->email);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to send email: ' . $e->getMessage());
        }
    }
}
