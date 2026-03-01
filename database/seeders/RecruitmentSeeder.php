<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use App\Models\JobPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RecruitmentSeeder extends Seeder
{
    public function run(): void
    {
        // Sample Jobs
        $jobs = [
            [
                'title' => 'Senior Full Stack Developer',
                'company_name' => 'Nexus Innovations',
                'department' => 'Laravel',
                'type' => 'full_time',
                'city' => 'Worldwide',
                'state' => 'N/A',
                'country' => 'Global',
                'status' => 'active',
                'salary_from' => 100,
                'salary_to' => 150,
                'vacancy' => 2,
                'experience_level' => '3_plus_yrs',
                'posted_date' => now()->format('Y-m-d'),
                'deadline_date' => now()->addDays(15)->format('Y-m-d'),
                'close_date' => now()->addDays(20)->format('Y-m-d'),
                'gender' => 'any',
                'education_level' => 'Bachelor in CS',
                'description' => '<h1>Join our core product team</h1><p>We are looking for a Senior Full Stack Developer to lead our team. You will be responsible for building scalable web applications using <strong>Laravel</strong>, <strong>React</strong>, and <strong>AWS</strong>.</p>',
                'requirements' => '<ul><li>5+ years of experience with PHP/Laravel</li><li>Strong knowledge of React/Inertia</li><li>Experience with AWS and CI/CD pipelines</li><li>Excellent problem-solving skills</li></ul>',
                'stack' => ['Laravel', 'React', 'PostgreSQL', 'AWS'],
            ],
            [
                'title' => 'Junior UI/UX Designer',
                'company_name' => 'Creative Flow Studio',
                'department' => 'UI',
                'type' => 'full_time',
                'city' => 'Sylhet',
                'state' => 'Sylhet',
                'country' => 'Bangladesh',
                'status' => 'active',
                'salary_from' => 40,
                'salary_to' => 60,
                'vacancy' => 1,
                'experience_level' => 'fresher',
                'posted_date' => now()->format('Y-m-d'),
                'deadline_date' => now()->addDays(30)->format('Y-m-d'),
                'close_date' => now()->addDays(35)->format('Y-m-d'),
                'gender' => 'any',
                'education_level' => 'Bachelor in Design',
                'description' => '<h1>Creative Design Opportunity</h1><p>Join our design team to create stunning and intuitive user experiences for our global users.</p>',
                'requirements' => '<ul><li>Proficiency in Figma</li><li>Understanding of typography and color theory</li><li>Portfolio of previous design work</li><li>Basic knowledge of HTML/CSS is a plus</li></ul>',
                'stack' => ['Figma', 'Adobe XD', 'Sketch'],
            ],
            [
                'title' => 'Content Writer',
                'company_name' => 'Global Media Group',
                'department' => 'Frontend',
                'type' => 'contract',
                'city' => 'San Francisco',
                'state' => 'CA',
                'country' => 'United States',
                'status' => 'active',
                'salary_from' => 30,
                'salary_to' => 50,
                'vacancy' => 3,
                'experience_level' => '1_yr',
                'posted_date' => now()->format('Y-m-d'),
                'deadline_date' => now()->addDays(10)->format('Y-m-d'),
                'close_date' => now()->addDays(12)->format('Y-m-d'),
                'gender' => 'any',
                'education_level' => 'BA in English',
                'description' => '<h1>Tell our story</h1><p>We need a creative writer to help us communicate our vision to the world.</p>',
                'requirements' => '<ul><li>Excellent English writing skills</li><li>Understanding of SEO principles</li><li>Experience in tech writing</li></ul>',
                'stack' => ['WordPress', 'SEO'],
            ],
        ];

        foreach ($jobs as $job) {
            $job['slug'] = Str::slug($job['title']).'-'.rand(1000, 9999);
            JobPost::create($job);
        }

        // Sample Email Templates
        EmailTemplate::create([
            'name' => 'Interview Invitation',
            'subject' => 'Interview Invitation: {job_title} at Our Company',
            'body' => "Hi {candidate_name},\n\nThank you for applying for the {job_title} position. We were impressed by your profile and would like to invite you for a technical interview.\n\nPlease let us know your availability for the coming week.\n\nBest regards,\nHiring Team",
        ]);

        EmailTemplate::create([
            'name' => 'Rejection Letter',
            'subject' => 'Update regarding your application for {job_title}',
            'body' => "Hi {candidate_name},\n\nThank you for your interest in the {job_title} position. After careful review, we have decided to move forward with other candidates at this time.\n\nWe wish you the best in your job search.\n\nRegards,\nHiring Team",
        ]);

        // Sample Job Applications
        $app1 = \App\Models\JobApplication::create([
            'job_post_id' => 1,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '01712345678',
            'resume_path' => 'resumes/sample.pdf',
            'experience_years' => '5',
            'status' => 'interview',
            'ranking_score' => 92,
        ]);

        \App\Models\JobApplication::create([
            'job_post_id' => 1,
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone' => '01812345678',
            'resume_path' => 'resumes/sample.pdf',
            'experience_years' => '3',
            'status' => 'applied',
            'ranking_score' => 78,
        ]);

        // Sample Interviews
        \App\Models\JobInterview::create([
            'job_application_id' => $app1->id,
            'interview_type' => 'Technical Interview',
            'scheduled_at' => now()->addDays(2)->setHour(10)->setMinute(0),
            'duration_minutes' => 60,
            'status' => 'scheduled',
            'video_link' => 'https://meet.google.com/abc-defg-hij',
        ]);
    }
}
