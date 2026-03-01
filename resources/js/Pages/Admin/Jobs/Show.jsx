import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
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
    Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Show({ job, applications, paginatedApplications, quiz, filters = {} }) {
    const [searchInput, setSearchInput] = useState(filters.search || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== (filters.search || "")) {
                handleFilterChange("search", searchInput);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        if (key !== "page") {
            delete newFilters.page;
        }
        Object.keys(newFilters).forEach((k) => !newFilters[k] && delete newFilters[k]);
        router.get(route("admin.jobs.show", job.id), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

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

            <div className="min-h-screen bg-[#F8FAFC]">
                {/* Top Action Bar */}
                <div className="px-8 py-4 flex items-center justify-between z-30 bg-white border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                            <Briefcase size={20} />
                        </div>
                        <nav className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <Link href={route("admin.jobs.index")} className="hover:text-slate-900 transition-colors">Jobs</Link>
                            <span>/</span>
                            <span className="text-slate-900">{job.title}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto p-8 space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight ">
                                    {job.title}
                                </h1>
                                <span
                                    className={cn(
                                        "px-3 py-1 text-[10px] font-black  tracking-widest rounded-sm border",
                                        job.status === "active"
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            : "bg-slate-100 text-slate-500 border-slate-200"
                                    )}
                                >
                                    {job.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 mt-1  tracking-wider">
                                <div className="flex items-center gap-1.5">
                                    <Briefcase size={14} className="text-slate-300" />
                                    {job.department || "General"}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-slate-300" />
                                    {job.location || "Remote"}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-slate-300" />
                                    {job.type.replace("_", " ")}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href={route("admin.jobs.edit", job.id)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-[11px]  tracking-widest rounded-sm hover:bg-slate-50 transition-colors">
                                Edit Job
                            </Link>
                            <Link href={route("admin.applications.index", { job_id: job.id })} className="px-5 py-2.5 bg-indigo-600 border border-indigo-600 text-white font-bold text-[11px]  tracking-widest rounded-sm hover:bg-indigo-700 transition-colors">
                                View Pipeline
                            </Link>
                        </div>
                    </div>

                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-sm">
                                    <Users size={18} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400  tracking-widest">
                                    Applications
                                </span>
                            </div>
                            <div className="text-3xl font-black text-slate-900">
                                {job.applications_count}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1 font-bold">
                                TOTAL SUBMISSIONS
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-sm">
                                    <GraduationCap size={18} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400  tracking-widest">
                                    Quiz Passed
                                </span>
                            </div>
                            <div className="text-3xl font-black text-slate-900">
                                {passedCount}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1 font-bold">
                                {applications.length > 0
                                    ? Math.round(
                                          (passedCount / applications.length) * 100,
                                      )
                                    : 0}
                                % PASS RATE
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-50 text-purple-600 flex items-center justify-center rounded-sm">
                                    <CheckCircle2 size={18} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400  tracking-widest">
                                    Avg Score
                                </span>
                            </div>
                            <div className="text-3xl font-black text-slate-900">
                                {Math.round(avgScore)}%
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1 font-bold">
                                BASED ON{" "}
                                {
                                    applications.filter(
                                        (a) => a.quiz_score !== null,
                                    ).length
                                }{" "}
                                ATTEMPTS
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-50 text-amber-600 flex items-center justify-center rounded-sm">
                                    <Clock size={18} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400  tracking-widest">
                                    Min Score
                                </span>
                            </div>
                            <div className="text-3xl font-black text-slate-900">
                                {job.min_quiz_score || 50}%
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1 font-bold">
                                REQUIRED TO PASS
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Applicant List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h2 className="text-sm font-black text-slate-900  tracking-wider">
                                    Recent Applicants
                                </h2>
                                <div className="flex flex-row flex-wrap md:flex-nowrap items-center gap-3 w-full sm:w-auto overflow-visible">
                                    <div className="relative flex-1 min-w-[150px]">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Search candidates..." 
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            className="w-full pl-10 pr-4 h-[38px] py-0 border border-slate-200 rounded-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-white"
                                        />
                                    </div>
                                    <div className="w-[120px]">
                                        <Select 
                                            value={filters.status || "all"}
                                            onValueChange={(value) => handleFilterChange("status", value)}
                                        >
                                            <SelectTrigger className="w-full h-[38px] bg-white border-slate-200 rounded-sm text-[11px] font-black  tracking-widest text-slate-600">
                                                <SelectValue placeholder="All Status" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-sm border-slate-200" position="popper" sideOffset={4}>
                                                <SelectItem value="all" className="text-[11px] font-black  tracking-widest">All Status</SelectItem>
                                                <SelectItem value="applied" className="text-[11px] font-black  tracking-widest text-slate-600">Applied</SelectItem>
                                                <SelectItem value="shortlisted" className="text-[11px] font-black  tracking-widest text-indigo-600">Shortlisted</SelectItem>
                                                <SelectItem value="technical_test" className="text-[11px] font-black tracking-widest text-fuchsia-600">Assessment</SelectItem>
                                                <SelectItem value="interview" className="text-[11px] font-black tracking-widest text-amber-600">Interview</SelectItem>
                                                <SelectItem value="hired" className="text-[11px] font-black tracking-widest text-emerald-600">Hired</SelectItem>
                                                <SelectItem value="rejected" className="text-[11px] font-black  tracking-widest text-rose-600">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-[100px]">
                                        <Select 
                                            value={filters.per_page?.toString() || "10"}
                                            onValueChange={(value) => handleFilterChange("per_page", value)}
                                        >
                                            <SelectTrigger className="w-full h-[38px] bg-white border-slate-200 rounded-sm text-[11px] font-black  tracking-widest text-slate-600">
                                                <SelectValue placeholder="10" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-sm border-slate-200" position="popper" sideOffset={4}>
                                                <SelectItem value="10" className="text-[11px] font-black  tracking-widest">10</SelectItem>
                                                <SelectItem value="25" className="text-[11px] font-black  tracking-widest text-slate-600">25</SelectItem>
                                                <SelectItem value="50" className="text-[11px] font-black  tracking-widest text-slate-600">50</SelectItem>
                                                <SelectItem value="100" className="text-[11px] font-black  tracking-widest text-slate-600">100</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Link
                                        href={route("admin.applications.index", {
                                            job_id: job.id,
                                        })}
                                        className="text-[11px] ml-1 font-bold text-indigo-600 hover:text-indigo-700 underline flex items-center gap-1.5 transition-colors whitespace-nowrap hidden lg:flex"
                                    >
                                        View Pipeline <ExternalLink size={12} strokeWidth={2} />
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[750px]">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400  tracking-widest">
                                                    Candidate
                                                </th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400  tracking-widest">
                                                    Details
                                                </th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400  tracking-widest">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400  tracking-widest">
                                                    Quiz Status
                                                </th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400  tracking-widest text-right">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {paginatedApplications.data.map((app) => (
                                                <tr
                                                    key={app.id}
                                                    className="hover:bg-slate-50/50 transition-colors group"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-sm bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                                                                {app.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                                                                    {app.name}
                                                                </div>
                                                                <div className="text-xs text-slate-400 font-medium">
                                                                    {app.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                       
                                                        <div className="text-[10px] text-slate-400 font-black  tracking-widest mt-1">
                                                            Applied: {new Date(app.created_at).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn(
                                                            "px-2.5 py-1 text-[10px] font-black  tracking-widest rounded-sm border uppercase",
                                                            app.status === 'shortlisted' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                                            app.status === 'technical_test' ? "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" :
                                                            app.status === 'interview' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                            app.status === 'hired' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                            app.status === 'rejected' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                            "bg-slate-100 text-slate-500 border-slate-200"
                                                        )}>
                                                            {app.status === 'technical_test' ? 'Assessment' : app.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {app.quiz_score !== null ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full ${app.quiz_score >= (job.min_quiz_score || 50) ? "bg-emerald-500" : "bg-rose-500"}`}
                                                                        style={{
                                                                            width: `${app.quiz_score}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span
                                                                    className={`text-[11px] font-black tracking-widest ${app.quiz_score >= (job.min_quiz_score || 50) ? "text-emerald-600" : "text-rose-500"}`}
                                                                >
                                                                    {Math.round(
                                                                        app.quiz_score,
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-slate-400 italic">
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
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-sm text-[10px] font-black  tracking-wider hover:bg-black transition-all whitespace-nowrap"
                                                        >
                                                            Profile
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                            {paginatedApplications.data.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="px-6 py-12 text-center text-slate-400 text-sm italic font-medium"
                                                    >
                                                        No candidates have applied for
                                                        this position yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {paginatedApplications.total > 0 && (
                                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-[11px] font-black text-slate-400  tracking-widest">
                                            Showing {paginatedApplications.from || 0} to {paginatedApplications.to || 0} of {paginatedApplications.total}
                                        </div>
                                        {paginatedApplications.links && paginatedApplications.links.length > 3 && (
                                            <div className="flex items-center gap-1">
                                                {paginatedApplications.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={cn(
                                                            "px-3 py-1.5 text-[11px] font-black  tracking-widest rounded-sm transition-colors",
                                                            !link.url ? "text-slate-300 cursor-not-allowed" :
                                                            link.active ? "bg-indigo-600 text-white shadow-sm" :
                                                            "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100"
                                                        )}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                        preserveScroll
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar / Quiz Info */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-black text-slate-900  tracking-wider">
                                Quiz Context
                            </h2>

                            {quiz ? (
                                <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-50">
                                        <div className="w-12 h-12 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-sm">
                                            <GraduationCap size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 leading-tight">
                                                {quiz.title}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 font-black  tracking-widest mt-0.5">
                                                Active Assessment
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 mb-6">
                                        <div>
                                            <p className="text-[10px] font-black  tracking-widest text-slate-400 mb-1">Total Attempts</p>
                                            <p className="text-sm font-bold text-slate-900">{quiz.attempts_count}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black  tracking-widest text-slate-400 mb-1">Passing Score</p>
                                            <p className="text-sm font-bold text-slate-900">{job.min_quiz_score || 50}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black  tracking-widest text-slate-400 mb-1">Time Limit</p>
                                            <p className="text-sm font-bold text-slate-900">{quiz.time_per_question} mins</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-slate-50">
                                        <button
                                            onClick={() => {
                                                const url = `${window.location.origin}/q/${quiz.id}${quiz.token ? `?token=${quiz.token}` : ""}`;
                                                navigator.clipboard.writeText(url);
                                                alert(
                                                    "Public link copied to clipboard!",
                                                );
                                            }}
                                            className="block w-full py-3 border border-emerald-200 text-emerald-600 rounded-sm text-[11px]  tracking-widest font-black hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Link2 size={14} />
                                            Manual Link
                                        </button>
                                        <Link
                                            href={route(
                                                "admin.quizzes.edit",
                                                quiz.id,
                                            )}
                                            className="block w-full text-center py-3 bg-slate-900 rounded-sm text-[11px]  tracking-widest font-black text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            Modify Quiz
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 p-8 rounded-sm text-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <GraduationCap
                                            size={20}
                                            className="text-slate-300"
                                        />
                                    </div>
                                    <h3 className="font-bold text-slate-700 text-sm mb-1">
                                        No Assessment
                                    </h3>
                                    <p className="text-xs text-slate-500 mb-6">
                                        Candidates apply without taking a quiz.
                                    </p>
                                    <Link
                                        href={route("admin.quizzes.create", {
                                            job_id: job.id,
                                        })}
                                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-sm text-[11px]  tracking-widest font-black hover:bg-indigo-700 transition-all"
                                    >
                                        Add Assessment
                                    </Link>
                                </div>
                            )}

                            <div className="bg-slate-900 text-white p-8 rounded-sm shadow-sm relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="font-black text-[10px] text-indigo-400  tracking-widest mb-3">
                                        Active Tracking
                                    </h3>
                                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                        System traces passing candidates. High performers are flagged to shortlist.
                                    </p>
                                </div>
                                <div className="absolute -bottom-4 -right-4 opacity-[0.03]">
                                    <CheckCircle2 size={100} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
