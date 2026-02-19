import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Mail } from "lucide-react";

export default function Index({ templates }) {
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this template?")) {
            router.delete(route("admin.email-templates.destroy", id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Email Templates" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                            Email Templates
                        </h1>
                        <p className="text-gray-400 text-xs font-medium mt-1">
                            {templates.length} templates configured
                        </p>
                    </div>
                    <Link
                        href={route("admin.email-templates.create")}
                        className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                    >
                        <Plus size={14} />
                        New Template
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Template Name
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Subject Line
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {templates.map((template) => (
                                <tr
                                    key={template.id}
                                    className="hover:bg-gray-50/30 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                <Mail size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">
                                                {template.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-gray-500 font-medium line-clamp-1">
                                            {template.subject}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={route(
                                                    "admin.email-templates.edit",
                                                    template.id,
                                                )}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(template.id)
                                                }
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {templates.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-6 py-20 text-center"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
                                                <Mail size={24} />
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-900">
                                                No Templates
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Start by creating your first
                                                email template.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
