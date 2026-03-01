<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiQuizController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'topic' => 'required|string|max:255',
            'count' => 'required|integer|min:1|max:30',
            'type' => 'required|string|in:mcq,text,fill_gap,combined',
        ]);

        $apiKey = config('services.openai.key');

        if (! $apiKey) {
            return response()->json([
                'error' => 'OpenAI API Key is not configured. Please add OPENAI_API_KEY to your .env file.',
            ], 422);
        }

        $topic = $request->topic;
        $count = $request->count;
        $type = $request->type;

        if ($type === 'combined') {
            $typeInstruction = "a random mix of 'mcq', 'text', and 'fill_gap' types";
        } else {
            $typeInstruction = "type '{$type}'";
        }

        $prompt = "Generate exactly {$count} quiz questions about '{$topic}' using {$typeInstruction}.
        For 'mcq', provide 4 options and set 'is_correct' to true for ONLY the correct option.
        For 'text', provide the question and the correct answer.
        For 'fill_gap', provide the question with '___' where the gap is and the correct answer.
        Return ONLY a JSON array of objects with the following structure:
        For mcq: { \"text\": \"...\", \"type\": \"mcq\", \"difficulty\": \"medium\", \"points\": 1, \"options\": [ { \"text\": \"...\", \"is_correct\": true/false }, ... ] }
        For text/fill_gap: { \"text\": \"...\", \"type\": \"text\" or \"fill_gap\", \"difficulty\": \"medium\", \"points\": 1, \"correct_answer\": \"...\", \"options\": [] }
        Do not include any other text, markdown formatting, or explanations.";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a quiz generation assistant that returns only raw JSON.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.7,
            ]);

            if ($response->failed()) {
                $errorData = $response->json();
                $errorMessage = $errorData['error']['message'] ?? 'Unknown OpenAI Error';
                Log::error('OpenAI API Error: '.$errorMessage);

                return response()->json(['error' => 'AI Error: '.$errorMessage], 500);
            }

            $content = $response->json('choices.0.message.content');

            // Clean content if AI includes backticks or markdown
            $content = trim($content);
            if (preg_match('/```json\s*(.*?)\s*```/s', $content, $matches)) {
                $content = $matches[1];
            } elseif (str_starts_with($content, '```')) {
                $content = preg_replace('/^```\w*\s*|```$/', '', $content);
            }
            $content = trim($content);

            $questions = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('AI Response Format Error (JSON Parse Failed): '.$content);

                return response()->json(['error' => 'AI returned invalid format. Please try again.'], 500);
            }

            return response()->json(['questions' => $questions]);
        } catch (\Exception $e) {
            Log::error('AI Generation Exception: '.$e->getMessage());

            return response()->json(['error' => 'Error: '.$e->getMessage()], 500);
        }
    }
}
