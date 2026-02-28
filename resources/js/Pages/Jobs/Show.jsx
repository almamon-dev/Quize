import { Head, useForm, Link } from "@inertiajs/react";
import {
    Briefcase,
    Calendar,
    MapPin,
    DollarSign,
    ChevronLeft,
    Upload,
    Send,
    CheckCircle2,
    Check,
    ArrowLeft,
    Loader2,
    Star,
} from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";
import { useState } from "react";

export default function Show({ auth, job }) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        name: "",
        email: "",
        phone: "",
        resume: null,
        portfolio_url: "",
        expected_salary: "",
        experience_years: "",
        cover_letter: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("jobs.apply", job.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <MainLayout auth={auth}>
            <Head title={`${job.title} | Join Us`} />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto py-12 px-6">
                    <Link
                        href={route("jobs.index")}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-all mb-8 group"
                    >
                        <ChevronLeft
                            size={20}
                            className="group-hover:-translate-x-1 transition-transform"
                        />
                        Back to Job Postings
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Job Details */}
                        <div className="lg:col-span-2">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 leading-tight">
                                {job.title}
                            </h1>
                            <p className="text-blue-600 font-black text-lg uppercase mb-6 flex items-center gap-2">
                                <Star size={20} />
                                {job.company_name || "Nexus Tech"}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-10">
                                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                                    <Briefcase size={16} />
                                    {job.type.replace("_", " ")}
                                </div>
                                <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-black uppercase tracking-widest border border-gray-200 flex items-center gap-2">
                                    <MapPin size={16} />
                                    <span className="capitalize">
                                        {job.location_type?.replace("_", "-") ||
                                            "On-site"}
                                    </span>
                                    {job.location && (
                                        <span className="text-xs opacity-60">
                                            ({job.location})
                                        </span>
                                    )}
                                </div>
                                {job.salary_range && (
                                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                                        <DollarSign size={16} />
                                        {job.salary_range}
                                    </div>
                                )}
                            </div>

                            <div className="prose prose-blue prose-lg max-w-none text-gray-700">
                                <h3 className="text-2xl font-black text-gray-900 mb-4 border-b-4 border-blue-200 inline-block">
                                    Job Description
                                </h3>
                                <div
                                    className="leading-relaxed mb-12"
                                    dangerouslySetInnerHTML={{
                                        __html: job.description,
                                    }}
                                />

                                {job.requirements && (
                                    <>
                                        <h3 className="text-2xl font-black text-gray-900 mb-4 border-b-4 border-blue-200 inline-block">
                                            Requirements
                                        </h3>
                                        <div
                                            className="leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: job.requirements,
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Application Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-100 p-8 border border-gray-100 sticky top-12">
                                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                    Apply for{" "}
                                    <span className="text-blue-600">
                                        Position
                                    </span>
                                </h3>

                                {recentlySuccessful ? (
                                    <div className="bg-green-50 border-2 border-green-100 p-8 rounded-3xl text-center">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 animate-bounce">
                                            <Check size={32} />
                                        </div>
                                        <h4 className="text-xl font-black text-green-900 mb-2">
                                            Application Received!
                                        </h4>
                                        <p className="text-green-700 font-medium">
                                            Thank you for applying. Our hiring
                                            team will review your profile and
                                            get back to you soon.
                                        </p>
                                        <button
                                            onClick={() => reset()}
                                            className="mt-6 text-sm font-black text-green-900 uppercase underline decoration-2 underline-offset-4"
                                        >
                                            Send another application?
                                        </button>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold p-3 ${errors.name ? "ring-2 ring-red-500" : ""}`}
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold p-3 ${errors.email ? "ring-2 ring-red-500" : ""}`}
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                                    Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            "phone",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold p-3"
                                                    placeholder="+880..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                                    Experience (Years)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        data.experience_years
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "experience_years",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold p-3"
                                                    placeholder="e.g. 5"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                                Upload Resume (PDF) *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    onChange={(e) =>
                                                        setData(
                                                            "resume",
                                                            e.target.files[0],
                                                        )
                                                    }
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="w-full bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center text-blue-600 gap-2">
                                                    <Upload size={24} />
                                                    <span className="text-xs font-black uppercase tracking-tighter">
                                                        {data.resume
                                                            ? data.resume.name
                                                            : "Choose File"}
                                                    </span>
                                                </div>
                                            </div>
                                            {errors.resume && (
                                                <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter">
                                                    {errors.resume}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                                Expected Salary
                                            </label>
                                            <input
                                                type="text"
                                                value={data.expected_salary}
                                                onChange={(e) =>
                                                    setData(
                                                        "expected_salary",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold p-3"
                                                placeholder="e.g. $100k/year"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                                Cover Letter / Note
                                            </label>
                                            <textarea
                                                value={data.cover_letter}
                                                onChange={(e) =>
                                                    setData(
                                                        "cover_letter",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium p-3 text-sm h-32"
                                                placeholder="Tell us why you're a great fit..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white p-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
                                        >
                                            {processing ? (
                                                <Loader2
                                                    size={24}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <>
                                                    Submit Application
                                                    <Send
                                                        size={20}
                                                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                                                    />
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest mt-4">
                                            By submitting, you agree to our
                                            privacy policy.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
