import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Completed() {
    return (
        <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-6 font-sans">
            <Head title="Quiz Completed" />

            {/* Illustration */}
            <div className="mb-8 w-full max-w-[400px]">
                <img
                    src="/images/completed.png"
                    alt="Quiz Completed Illustration"
                    className="w-full h-auto object-contain"
                />
            </div>

            {/* Content Container */}
            <div className="text-center w-full max-w-2xl px-4">
                <p className="text-[#6B7280] text-lg font-medium mb-6">
                    Your submission has been successfully received.
                </p>

                <h1 className="text-[44px] font-black text-[#00D287] mb-6 tracking-tight leading-tight">
                    Quiz Completed!
                </h1>

                <p className="text-[22px] font-bold text-gray-900 leading-snug mb-10">
                    Thank you for taking the assessment. Our team will review
                    your responses and get back to you soon.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-10 py-4 bg-[#059669] text-white text-lg font-bold rounded-full hover:bg-[#047857] transition-all shadow-xl shadow-emerald-200"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
