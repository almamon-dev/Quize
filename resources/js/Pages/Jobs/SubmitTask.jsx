import React from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    Send,
    Link as LinkIcon,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Github,
    ExternalLink,
    FileText,
    Clock,
    Award,
} from "lucide-react";

export default function SubmitTask({ application, job }) {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            submission_type: "url", // Default to URL
            task_url: application.task_url || "",
            task_file: null,
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use post with forceFormData for file uploads
        post(route("jobs.application.submit-task", application.id), {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
            <Head title={`Submit Task - ${job.title}`} />

            {/* Header / Branding */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <Send size={18} className="text-white" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-tighter italic">
                            HiringPortal
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Instructions */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 mb-4">
                                Stage 3: Technical Assessment
                            </span>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-950 mb-4">
                                Technical Assignment
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                Congratulations on reaching the technical stage
                                for the <strong>{job.title}</strong> position.
                                Please complete the assignment below and submit
                                your work.
                            </p>
                        </div>

                        {/* Assignment Details "Document" */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transform transition-all hover:shadow-md">
                            <div className="px-8 py-6 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                                <FileText size={20} className="text-blue-600" />
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                                    Assignment Brief
                                </h3>
                            </div>
                            <div className="p-8 prose prose-blue max-w-none">
                                <div
                                    className="text-gray-700 leading-relaxed space-y-4"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            job.technical_assignment ||
                                            "Assignment details will be provided by your recruiter.",
                                    }}
                                />
                            </div>
                            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>
                                    Audit ID: {application.id}-{job.id}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock size={12} /> Deadline: 48 Hours
                                </span>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
                            <div className="p-2 bg-blue-600 text-white rounded-lg">
                                <Award size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-blue-900 mb-1">
                                    Tips for Submission
                                </h4>
                                <ul className="text-xs text-blue-800/80 space-y-2 font-medium">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                        You can submit a{" "}
                                        <strong>Public URL</strong> (GitHub,
                                        Drive) or <strong>Upload a File</strong>{" "}
                                        (ZIP).
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                        Include a clear <code>README.md</code>{" "}
                                        with setup instructions.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                        Quality of code and architectural
                                        decisions are primary focus.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Submission Form */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden">
                                <div className="p-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        Submission Form
                                    </h2>

                                    {recentlySuccessful ? (
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-8 text-center animate-in zoom-in-95 duration-300">
                                            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                                                <CheckCircle size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold text-emerald-950 mb-2 font-sans tracking-tight">
                                                Assignment Submitted
                                            </h3>
                                            <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                                                Your submission has been
                                                recorded. Our team will review
                                                your work and get back to you
                                                shortly.
                                            </p>
                                            <div className="mt-8 pt-6 border-t border-emerald-100">
                                                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                                                    Application Status
                                                </p>
                                                <p className="text-xs font-bold text-emerald-900 mt-1 italic uppercase tracking-wider underline">
                                                    Task Submitted
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            {/* Submission Method Toggle */}
                                            <div>
                                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                                    Submission Method
                                                </label>
                                                <div className="flex p-1 bg-gray-100 rounded-xl">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                "submission_type",
                                                                "url",
                                                            )
                                                        }
                                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                                            data.submission_type ===
                                                            "url"
                                                                ? "bg-white text-black shadow-sm"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        Link / URL
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                "submission_type",
                                                                "file",
                                                            )
                                                        }
                                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                                            data.submission_type ===
                                                            "file"
                                                                ? "bg-white text-black shadow-sm"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        File Upload
                                                    </button>
                                                </div>
                                            </div>

                                            {data.submission_type === "url" ? (
                                                <div className="animate-in fade-in duration-300">
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                                        Repository or Task URL
                                                    </label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                                            <LinkIcon
                                                                size={18}
                                                            />
                                                        </div>
                                                        <input
                                                            type="url"
                                                            value={
                                                                data.task_url
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "task_url",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className={`w-full bg-gray-50 border-gray-200 rounded-xl pl-12 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all ${
                                                                errors.task_url
                                                                    ? "border-red-500 ring-red-500/10"
                                                                    : ""
                                                            }`}
                                                            placeholder="https://github.com/username/repo"
                                                        />
                                                    </div>
                                                    {errors.task_url && (
                                                        <p className="mt-3 text-xs font-bold text-red-500 flex items-center gap-1.5 italic">
                                                            <AlertCircle
                                                                size={14}
                                                            />{" "}
                                                            {errors.task_url}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="animate-in fade-in duration-300">
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                                        Upload Project (ZIP/PDF)
                                                    </label>
                                                    <div className="relative group">
                                                        <input
                                                            type="file"
                                                            onChange={(e) =>
                                                                setData(
                                                                    "task_file",
                                                                    e.target
                                                                        .files[0],
                                                                )
                                                            }
                                                            className={`w-full bg-gray-50 border-gray-200 border-2 border-dashed rounded-xl px-4 py-8 text-xs font-bold text-gray-500 focus:bg-white focus:border-blue-600 transition-all cursor-pointer ${
                                                                errors.task_file
                                                                    ? "border-red-500 bg-red-50"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </div>
                                                    {errors.task_file && (
                                                        <p className="mt-3 text-xs font-bold text-red-500 flex items-center gap-1.5 italic">
                                                            <AlertCircle
                                                                size={14}
                                                            />{" "}
                                                            {errors.task_file}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full bg-black hover:bg-gray-900 text-white rounded-xl py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-black/10 active:scale-[0.98] disabled:opacity-50"
                                            >
                                                {processing ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Submit Assignment
                                                        <ArrowRight size={16} />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        Secure Submission Portal
                                    </span>
                                </div>
                            </div>

                            {/* Candidate Info */}
                            <div className="mt-8 px-2 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center text-sm font-black text-gray-400">
                                    {application.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                        Candidate
                                    </p>
                                    <p className="text-xs font-bold text-gray-900 tracking-tight">
                                        {application.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400">
                    <p className="text-[10px] font-bold uppercase tracking-widest italic">
                        &copy; 2026 HiringPortal - Internal Recruitment System
                    </p>
                    <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest">
                        <a
                            href="#"
                            className="hover:text-gray-900 transition-colors"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="hover:text-gray-900 transition-colors"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
