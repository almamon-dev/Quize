<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'CV Screening / Sorting',
                'subject' => 'Application Update: {job_title}',
                'body' => '<p>Hello {candidate_name},</p><p>Thank you for applying for the <strong>{job_title}</strong> position. We wanted to let you know that our team has received your application and is currently reviewing your profile.</p><p>We will get back to you shortly regarding the next steps.</p><p>Best regards,<br>Recruitment Team</p>',
            ],
            [
                'name' => 'Quiz Invitation (Online)',
                'subject' => 'Next Step: Online Quiz for {job_title}',
                'body' => '<p>Hello {candidate_name},</p><p>Congratulations! We have shortlisted your application for the <strong>{job_title}</strong> role. As the next step, we would like you to participate in an online technical quiz.</p><p>You can start the quiz here: <a href="{quiz_link}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Online Quiz</a></p><p>Please complete it within the next 48 hours. Good luck!</p>',
            ],
            [
                'name' => 'Technical Assignment (Stage 3)',
                'subject' => 'Technical Assignment: {job_title}',
                'body' => '<p>Hello {candidate_name},</p><p>We were impressed with your quiz results! We would now like to move forward with a technical assignment for the <strong>{job_title}</strong> position.</p><div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #0a66c2; margin: 15px 0;">Please review the assignment instructions and submission link below.</div><p><a href="{submission_link}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View & Submit Project</a></p>',
            ],
            [
                'name' => 'Rejection (Polite)',
                'subject' => 'Update regarding your application for {job_title}',
                'body' => '<p>Hello {candidate_name},</p><p>Thank you for the time and effort you put into your application for the <strong>{job_title}</strong> position. After careful review, we have decided to move forward with other candidates at this time.</p><p>We wish you the best of luck in your career search.</p>',
            ],
        ];

        foreach ($templates as $template) {
            EmailTemplate::updateOrCreate(
                ['name' => $template['name']],
                $template
            );
        }
    }
}
