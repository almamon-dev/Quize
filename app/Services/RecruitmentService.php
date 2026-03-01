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
        $cvText = $this->extractTextFromCv($application->resume_path);
        $prompt = $this->generateRankingPrompt($application, $job, $cvText);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are an HR AI assistant specialized in candidate screening. You analyze CVs and return structured data.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.3,
            ]);

            if ($response->failed()) {
                Log::error('OpenAI API Error during ranking: Status ' . $response->status() . ' - ' . $response->body());
                return null;
            }

            $content = $response->json('choices.0.message.content');
            Log::info('OpenAI Response Content: ' . $content);
            
            $analysis = json_decode($this->cleanJsonResponse($content), true);

            if ($analysis) {
                // Update basic fields if found
                $updateData = [
                    'ranking_score' => $analysis['score'] ?? 0,
                    'cv_analysis' => json_encode($analysis), // Store the whole structured JSON
                ];

                if (isset($analysis['experience_years'])) {
                    $updateData['experience_years'] = $analysis['experience_years'];
                }

                $application->update($updateData);

                // Auto-shortlist if score is high (e.g., > 85)
                if (($analysis['score'] ?? 0) >= 85) {
                    $application->update(['status' => 'shortlisted']);
                }

                return $analysis;
            } else {
                Log::error('Failed to decode AI JSON Response');
            }
        } catch (\Exception $e) {
            Log::error('CV Ranking Exception: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
        }

        return null;
    }

    protected function extractTextFromCv($path)
    {
        if (!$path || !Storage::disk('public')->exists($path)) {
            return "[No CV File Found]";
        }

        $fullPath = Storage::disk('public')->path($path);
        $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

        try {
            if ($extension === 'pdf') {
                $parser = new \Smalot\PdfParser\Parser();
                $pdf = $parser->parseFile($fullPath);
                $text = $pdf->getText();
                
                if (empty(trim($text))) {
                    $pages = $pdf->getPages();
                    foreach ($pages as $page) {
                        $text .= $page->getText();
                    }
                }
                
                return $text;
            } 
            return "[Unsupported file format: {$extension}]";
        } catch (\Exception $e) {
            Log::error("Error extracting text from CV ($path): " . $e->getMessage());
            return "[Error extracting text from CV file]";
        }
    }

    protected function generateRankingPrompt(JobApplication $application, JobPost $job, $cvText = '')
    {
        $requirements = $job->requirements;
        $stack = implode(', ', $job->stack ?? []);
        
        return "Analyze the following candidate for the position of '{$job->title}'.
        
        Job Requirements:
        {$requirements}
        
        Desired Tech Stack:
        {$stack}
        
        Candidate Details:
        - Name: {$application->name}
        - Provided Experience: {$application->experience_years} years
        
        Extracted CV Content:
        ---
        {$cvText}
        ---
        
        TASK:
        Extract and analyze details from the CV. Return ONLY a JSON object with this structure:
        {
          \"score\": 85,
          \"summary\": \"Brief overview of the candidate (2-3 sentences).\",
          \"experience_years\": \"Total years of experience found in CV (just the number/string)\",
          \"experience_details\": [\n            \"Detail 1 about their career\",\n            \"Detail 2 about their career\"\n          ],
          \"education\": \"Their highest or most relevant degree/education found.\",
          \"projects\": [\n            { \"name\": \"Project Name\", \"description\": \"Short info about what they did\" }\n          ],
          \"skills\": [\"React\", \"Node.js\", \"AWS\"],
          \"location\": \"Extracted location (City/Country)\"
        }";
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
