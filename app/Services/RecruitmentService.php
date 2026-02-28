<?php

namespace App\Services;

use App\Models\JobApplication;
use App\Models\JobPost;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class RecruitmentService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.openai.key');
    }

    /**
     * Analyze and rank a candidate's CV based on job post requirements.
     */
    public function rankCandidate(JobApplication $application)
    {
        if (!$this->apiKey) {
            Log::error('OpenAI API Key is not configured for CV ranking.');
            return null;
        }

        $job = $application->jobPost;
        
        $prompt = $this->generateRankingPrompt($application, $job);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are an HR AI assistant specialized in candidate screening.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.3,
            ]);

            if ($response->failed()) {
                Log::error('OpenAI API Error during ranking: ' . $response->body());
                return null;
            }

            $content = $response->json('choices.0.message.content');
            $analysis = json_decode($this->cleanJsonResponse($content), true);

            if ($analysis) {
                $application->update([
                    'ranking_score' => $analysis['score'] ?? 0,
                    'cv_analysis' => $analysis['summary'] ?? '',
                ]);

                // Auto-shortlist if score is high (e.g., > 70)
                if (($analysis['score'] ?? 0) >= 70) {
                    $application->update(['status' => 'shortlisted']);
                }

                return $analysis;
            }
        } catch (\Exception $e) {
            Log::error('CV Ranking Exception: ' . $e->getMessage());
        }

        return null;
    }

    protected function generateRankingPrompt(JobApplication $application, JobPost $job)
    {
        $requirements = $job->requirements;
        $stack = implode(', ', $job->stack ?? []);
        
        return "Analyze the following candidate for the position of '{$job->title}'.
        
        Job Requirements:
        {$requirements}
        
        Desired Tech Stack:
        {$stack}
        
        Candidate Details:
        - Experience: {$application->experience_years} years
        - Expected Salary: {$application->expected_salary}
        - Cover Letter: {$application->cover_letter}
        - Portfolio: {$application->portfolio_url}
        
        Provide a ranking score from 0 to 100 and a brief summary of why the candidate fits or doesn't fit the role.
        Return ONLY a JSON object: { \"score\": 85, \"summary\": \"Candidate has strong experience in...\" }";
    }

    protected function cleanJsonResponse($content)
    {
        $content = trim($content);
        if (preg_match('/```json\s*(.*?)\s*```/s', $content, $matches)) {
            $content = $matches[1];
        }
        return trim($content);
    }
}
