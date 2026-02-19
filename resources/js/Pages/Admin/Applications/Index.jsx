import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { User, Mail, Calendar, ExternalLink, Filter } from "lucide-react";

export default function Index({ applications, filters, jobs, departments }) {
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        // Remove empty filters
        Object.keys(newFilters).forEach(
            (k) => !newFilters[k] && delete newFilters[k],
        );

        router.get(route("admin.applications.index"), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const statuses = [
        { id: "applied", label: "Applied", color: "blue" },
        { id: "shortlisted", label: "Shortlisted", color: "purple" },
        { id: "waiting", label: "Waiting", color: "yellow" },
        { id: "hired", label: "Hired", color: "green" },
        { id: "rejected", label: "Rejected", color: "red" },
    ];

    const getStatusColor = (status) => {
        const colors = {
            applied: "bg-blue-50 text-blue-700 border-blue-100",
            shortlisted: "bg-purple-50 text-purple-700 border-purple-100",
            waiting: "bg-amber-50 text-amber-700 border-amber-100",
            hired: "bg-green-50 text-green-700 border-green-100",
            rejected: "bg-red-50 text-red-700 border-red-100",
        };
        return colors[status] || "bg-gray-50 text-gray-700 border-gray-100";
    };

    return (
        <AdminLayout>
            <Head title="Job Applications" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Job Applications
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Track candidates and move them through the hiring
                            pipeline.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/30 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
                                <Filter size={14} /> Pipeline Stage:
                            </div>
                            <button
                                onClick={() => handleFilterChange("status", "")}
                                className={`px-3 py-1 text-[10px] font-bold rounded border transition-all ${
                                    !filters.status
                                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                        : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                ALL
                            </button>
                            {statuses.map((status) => (
                                <button
                                    key={status.id}
                                    onClick={() =>
                                        handleFilterChange("status", status.id)
                                    }
                                    className={`px-3 py-1 text-[10px] font-bold rounded border transition-all ${
                                        filters.status === status.id
                                            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                            : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {status.label.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-wider">
                                Filter by Dept:
                            </div>
                            <select
                                value={filters.department || ""}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "department",
                                        e.target.value,
                                    )
                                }
                                className="text-xs font-bold border-none bg-gray-100 rounded-lg focus:ring-0 py-1.5 pl-3 pr-8"
                            >
                                <option value="">ALL DEPTS</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept.toUpperCase()}
                                    </option>
                                ))}
                            </select>

                            <div className="h-4 w-px bg-gray-200 mx-2"></div>

                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-wider">
                                Filter by Job:
                            </div>
                            <select
                                value={filters.job_id || ""}
                                onChange={(e) =>
                                    handleFilterChange("job_id", e.target.value)
                                }
                                className="text-xs font-bold border-none bg-gray-100 rounded-lg focus:ring-0 py-1.5 pl-3 pr-8"
                            >
                                <option value="">ALL JOBS</option>
                                {jobs.map((job) => (
                                    <option key={job.id} value={job.id}>
                                        {job.title.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Candidate
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Job Role
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Expected Salary
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Applied on
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {applications.data.map((app) => (
                                <tr
                                    key={app.id}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-gray-50 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">
                                                    {app.name}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Mail size={12} />{" "}
                                                    {app.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-700">
                                            {app.job_post.title}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {app.job_post.department}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getStatusColor(app.status)}`}
                                        >
                                            {app.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-600">
                                            {app.expected_salary || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(
                                                app.created_at,
                                            ).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={route(
                                                "admin.applications.show",
                                                app.id,
                                            )}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded text-xs font-bold transition-all"
                                        >
                                            View Details
                                            <ExternalLink size={12} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {applications.data.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No applications found.
                        </div>
                    )}

                    {applications.links?.length > 3 && (
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center gap-2">
                            {applications.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`px-3 py-1 text-xs font-bold rounded border transition-all ${
                                        link.active
                                            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                            : !link.url
                                              ? "bg-transparent text-gray-300 border-transparent cursor-not-allowed"
                                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
