import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Star,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Award,
    Briefcase,
} from "lucide-react";
import { useState } from "react";

const STAGES = [
    {
        id: "applied",
        name: "Applied",
        color: "bg-gray-100 text-gray-700 border-gray-200",
    },
    {
        id: "shortlisted",
        name: "Shortlisted (Quiz)",
        color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
        id: "technical_test",
        name: "Technical Test",
        color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
        id: "interview",
        name: "Interview",
        color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
        id: "hired",
        name: "Hired",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    {
        id: "rejected",
        name: "Rejected",
        color: "bg-red-100 text-red-700 border-red-200",
    },
];

export default function Pipeline({ applications, jobs }) {
    const [selectedJob, setSelectedJob] = useState("all");

    const filteredApplications =
        selectedJob === "all"
            ? applications
            : applications.filter(
                  (app) => app.job_post_id === parseInt(selectedJob),
              );

    const getAppsByStage = (stageId) =>
        filteredApplications.filter((app) => app.status === stageId);

    return (
        <AdminLayout>
            <Head title="Recruitment Pipeline" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            Recruitment Pipeline
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Manage and track candidate progress across all
                            stages.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={selectedJob}
                                onChange={(e) => setSelectedJob(e.target.value)}
                                className="pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">All Job Posts</option>
                                {jobs.map((job) => (
                                    <option key={job.id} value={job.id}>
                                        {job.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex gap-6 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide">
                    {STAGES.map((stage) => (
                        <div
                            key={stage.id}
                            className="flex-shrink-0 w-[320px] bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-4"
                        >
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${stage.color}`}
                                    >
                                        {stage.name}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400">
                                        {getAppsByStage(stage.id).length}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {getAppsByStage(stage.id).map((app) => (
                                    <Link
                                        key={app.id}
                                        href={route(
                                            "admin.applications.show",
                                            app.id,
                                        )}
                                        className="block bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                                <Users className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                                            </div>
                                            {app.ranking_score && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full text-[10px] font-bold">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    {app.ranking_score}
                                                </div>
                                            )}
                                        </div>

                                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                            {app.name}
                                        </h4>
                                        <div className="mt-1 flex items-center gap-1.5">
                                            <Briefcase className="w-3 h-3 text-gray-300" />
                                            <span className="text-[11px] font-medium text-gray-500 truncate">
                                                {app.job_post.title}
                                            </span>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                <Clock className="w-3 h-3" />
                                                {new Date(
                                                    app.created_at,
                                                ).toLocaleDateString()}
                                            </div>
                                            <div className="flex -space-x-2">
                                                {/* Placeholder for tiny assessment icons */}
                                                {app.task_url && (
                                                    <Award className="w-4 h-4 text-purple-400" />
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {getAppsByStage(stage.id).length === 0 && (
                                    <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                        <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                                            No candidates
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
