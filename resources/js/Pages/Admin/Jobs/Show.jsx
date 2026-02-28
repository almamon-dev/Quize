import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Briefcase,
    Users,
    GraduationCap,
    Calendar,
    MapPin,
    Clock,
    ArrowLeft,
    ChevronRight,
    ExternalLink,
    CheckCircle2,
    XCircle,
    User,
    Mail,
    Link2,
} from "lucide-react";

export default function Show({ job, applications, quiz }) {
    const passedCount = applications.filter(
        (app) => app.quiz_score >= (job.min_quiz_score || 50),
    ).length;
    const avgScore =
        applications.length > 0
            ? applications.reduce(
                  (acc, app) => acc + (app.quiz_score || 0),
                  0,
              ) / applications.length
            : 0;

    return (
        <AdminLayout>
            <Head title={`Job: ${job.title}`} />

            <div className="p-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link
                        href={route("admin.jobs.index")}
                        className="hover:text-gray-900 transition-colors"
                    >
                        Jobs
                    </Link>
                    <ChevronRight size={14} />
                    <span className="font-bold text-gray-900">{job.title}</span>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                {job.title}
                            </h1>
                            <span
                                className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${
                                    job.status === "active"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                            >
                                {job.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-1.5">
                                <Briefcase
                                    size={16}
                                    className="text-gray-400"
                                />
                                {job.department || "General"}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={16} className="text-gray-400" />
                                {job.location || "Remote"}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={16} className="text-gray-400" />
                                {job.type.replace("_", " ").toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Users size={20} />
                            </div>
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                Applications
                            </span>
                        </div>
                        <div className="text-3xl font-black text-gray-900">
                            {job.applications_count}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 font-bold">
                            TOTAL SUBMISSIONS
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <GraduationCap size={20} />
                            </div>
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                Quiz Passed
                            </span>
                        </div>
                        <div className="text-3xl font-black text-gray-900">
                            {passedCount}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 font-bold">
                            {applications.length > 0
                                ? Math.round(
                                      (passedCount / applications.length) * 100,
                                  )
                                : 0}
                            % PASS RATE
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                Avg Score
                            </span>
                        </div>
                        <div className="text-3xl font-black text-gray-900">
                            {Math.round(avgScore)}%
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 font-bold">
                            BASED ON{" "}
                            {
                                applications.filter(
                                    (a) => a.quiz_score !== null,
                                ).length
                            }{" "}
                            ATTEMPTS
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <Clock size={20} />
                            </div>
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                Min Score
                            </span>
                        </div>
                        <div className="text-3xl font-black text-gray-900">
                            {job.min_quiz_score || 50}%
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 font-bold">
                            REQUIRED TO PASS
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Applicant List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                Recent Applicants
                            </h2>
                            <Link
                                href={route("admin.applications.index", {
                                    job_id: job.id,
                                })}
                                className="text-xs font-bold text-[#0a66c2] hover:underline flex items-center gap-1"
                            >
                                View Pipeline <ExternalLink size={12} />
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Candidate
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Quiz Status
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {applications.map((app) => (
                                        <tr
                                            key={app.id}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-sm">
                                                            {app.name}
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                                                            <Mail size={10} />{" "}
                                                            {app.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {app.quiz_score !== null ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${app.quiz_score >= (job.min_quiz_score || 50) ? "bg-emerald-500" : "bg-red-500"}`}
                                                                style={{
                                                                    width: `${app.quiz_score}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span
                                                            className={`text-xs font-bold ${app.quiz_score >= (job.min_quiz_score || 50) ? "text-emerald-600" : "text-red-500"}`}
                                                        >
                                                            {Math.round(
                                                                app.quiz_score,
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-gray-400 italic">
                                                        No attempt yet
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <Link
                                                    href={route(
                                                        "admin.applications.show",
                                                        app.id,
                                                    )}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded text-[10px] font-black uppercase tracking-wider hover:bg-black transition-all whitespace-nowrap"
                                                >
                                                    Profile
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {applications.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-6 py-12 text-center text-gray-500 text-sm italic font-medium"
                                            >
                                                No candidates have applied for
                                                this position yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar / Quiz Info */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Quiz Context
                        </h2>

                        {quiz ? (
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                        <GraduationCap size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">
                                            {quiz.title}
                                        </h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider italic">
                                            Active Assessment
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-medium">
                                            Total Attempts
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {quiz.attempts_count}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-medium">
                                            Passing Score
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {job.min_quiz_score || 50}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-medium">
                                            Time Limit
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {quiz.time_per_question} mins
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/q/${quiz.id}${quiz.token ? `?token=${quiz.token}` : ""}`;
                                            navigator.clipboard.writeText(url);
                                            alert(
                                                "Public link copied to clipboard!",
                                            );
                                        }}
                                        className="block w-full py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Link2 size={14} />
                                        Manual Quiz Link
                                    </button>
                                    <Link
                                        href={route(
                                            "admin.quizzes.edit",
                                            quiz.id,
                                        )}
                                        className="block w-full text-center py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Modify Quiz Details
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-xl text-center">
                                <GraduationCap
                                    size={32}
                                    className="text-gray-300 mx-auto mb-3"
                                />
                                <h3 className="font-bold text-gray-900 text-sm mb-1">
                                    No Quiz Attached
                                </h3>
                                <p className="text-xs text-gray-500 mb-4">
                                    Candidates can apply without taking a quiz.
                                </p>
                                <Link
                                    href={route("admin.quizzes.create", {
                                        job_id: job.id,
                                    })}
                                    className="inline-flex items-center gap-2 bg-[#0a66c2] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#084d91] transition-all"
                                >
                                    Add Assessment
                                </Link>
                            </div>
                        )}

                        <div className="bg-black text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-black text-sm uppercase tracking-widest mb-2">
                                    Internal Note
                                </h3>
                                <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">
                                    "System automatically tracks candidates who
                                    pass the threshold. High performers are
                                    flagged for immediate shortlist."
                                </p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 opacity-10">
                                <CheckCircle2 size={100} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
