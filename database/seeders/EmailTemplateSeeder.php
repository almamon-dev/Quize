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
                'name' => 'CV Screening / Shortlisting',
                'subject' => 'Application Received – {job_title}',
                'body' => '
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.7; color: #333;">
                    
                    <p>Dear {candidate_name},</p>

                    <p>
                        Thank you for applying for the <strong>{job_title}</strong> position at our company.
                        We would like to confirm that we have successfully received your application.
                    </p>

                    <p>
                        Our recruitment team is currently reviewing your profile in detail.
                        If your qualifications match our requirements, we will contact you with the next steps in the selection process.
                    </p>

                    <p>
                        We appreciate your interest in joining our organization.
                    </p>

                    <br>

                    <p>
                        Kind regards,<br>
                        <strong>Talent Acquisition Team</strong><br>
                        {company_name}
                    </p>

                </div>
                ',
            ],

            [
                'name' => 'Online Quiz Invitation',
                'subject' => 'Next Stage: Online Assessment for {job_title}',
                'body' => '
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.7; color: #333;">
                    
                    <p>Dear {candidate_name},</p>

                    <p>
                        We are pleased to inform you that you have been shortlisted for the
                        <strong>{job_title}</strong> position.
                    </p>

                    <p>
                        As part of our selection process, you are invited to complete an online technical assessment.
                        This assessment will help us better evaluate your technical and analytical skills.
                    </p>

                    <div style="margin: 25px 0;">
                        <a href="{quiz_link}" 
                           style="background-color: #111; 
                                  color: #ffffff; 
                                  padding: 12px 25px; 
                                  text-decoration: none; 
                                  border-radius: 6px; 
                                  font-weight: 600; 
                                  display: inline-block;">
                            Start Online Assessment
                        </a>
                    </div>

                    <p>
                        Kindly complete the assessment within <strong>48 hours</strong>.
                        Should you face any technical difficulties, please contact our support team.
                    </p>

                    <br>

                    <p>
                        Best regards,<br>
                        <strong>Talent Acquisition Team</strong><br>
                        {company_name}
                    </p>

                </div>
                ',
            ],

            [
                'name' => 'Technical Assignment (Stage 3)',
                'subject' => 'Technical Assignment – {job_title}',
                'body' => '
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.7; color: #333;">
                    
                    <p>Dear {candidate_name},</p>

                    <p>
                        Thank you for successfully completing the previous stage.
                        We were impressed with your performance and would like to proceed with the next step.
                    </p>

                    <p>
                        You are invited to complete a technical assignment for the
                        <strong>{job_title}</strong> position.
                        This assignment is designed to evaluate your practical problem-solving skills.
                    </p>

                    <div style="background-color: #f5f7fa; padding: 18px; border-left: 4px solid #0a66c2; margin: 20px 0;">
                        Please review the detailed instructions and submit your project using the link below.
                    </div>

                    <div style="margin: 20px 0;">
                        <a href="{submission_link}" 
                           style="background-color: #111; 
                                  color: #ffffff; 
                                  padding: 12px 25px; 
                                  text-decoration: none; 
                                  border-radius: 6px; 
                                  font-weight: 600; 
                                  display: inline-block;">
                            View Assignment & Submit
                        </a>
                    </div>

                    <p>
                        We look forward to reviewing your submission.
                    </p>

                    <br>

                    <p>
                        Sincerely,<br>
                        <strong>Talent Acquisition Team</strong><br>
                        {company_name}
                    </p>

                </div>
                ',
            ],

            [
                'name' => 'Application Rejection (Professional)',
                'subject' => 'Application Update – {job_title}',
                'body' => '
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.7; color: #333;">
                    
                    <p>Dear {candidate_name},</p>

                    <p>
                        Thank you for your interest in the <strong>{job_title}</strong> position
                        and for the time you invested in your application.
                    </p>

                    <p>
                        After careful consideration, we regret to inform you that
                        we will not be moving forward with your application at this time.
                    </p>

                    <p>
                        This decision was difficult due to the high quality of applications we received.
                        We encourage you to apply for future opportunities that match your profile.
                    </p>

                    <br>

                    <p>
                        We sincerely appreciate your interest in our organization and
                        wish you every success in your career.
                    </p>

                    <br>

                    <p>
                        Kind regards,<br>
                        <strong>Talent Acquisition Team</strong><br>
                        {company_name}
                    </p>

                </div>
                ',
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
