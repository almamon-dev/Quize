import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Plus,
    Briefcase,
    Users,
    Edit,
    Trash2,
    ExternalLink,
    GraduationCap,
} from "lucide-react";

export default function Index({ jobs }) {
    return (
        <AdminLayout>
            <Head title="Manage Jobs" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Job Postings
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Manage your company vacancies and hiring pipeline.
                        </p>
                    </div>
                    <Link
                        href={route("admin.jobs.create")}
                        className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded text-sm font-bold transition-all"
                    >
                        <Plus size={18} />
                        Post New Job
                    </Link>
                </div>

                <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Job Details
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Applications
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {jobs.map((job) => (
                                <tr
                                    key={job.id}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 rounded border border-gray-100 text-blue-600">
                                                <Briefcase size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">
                                                    {job.title}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {job.type
                                                        .replace("_", " ")
                                                        .toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {job.department || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                                                job.status === "active"
                                                    ? "bg-green-50 text-green-700 border-green-100"
                                                    : job.status === "draft"
                                                      ? "bg-gray-50 text-gray-700 border-gray-200"
                                                      : "bg-red-50 text-red-700 border-red-100"
                                            }`}
                                        >
                                            {job.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                            <Users
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            {job.applications_count}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "admin.quizzes.create",
                                                    { job_id: job.id },
                                                )}
                                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                                title="Create Quiz for this Job"
                                            >
                                                <GraduationCap size={16} />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "admin.applications.index",
                                                    { job_id: job.id },
                                                )}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="View Applications"
                                            >
                                                <Users size={16} />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "admin.jobs.edit",
                                                    job.id,
                                                )}
                                                className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {jobs.length === 0 && (
                        <div className="p-12 text-center">
                            <Briefcase
                                size={48}
                                className="mx-auto text-gray-300 mb-4"
                            />
                            <h3 className="text-lg font-medium text-gray-900">
                                No jobs posted yet
                            </h3>
                            <p className="text-gray-500">
                                Create your first job posting to start receiving
                                applications.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
