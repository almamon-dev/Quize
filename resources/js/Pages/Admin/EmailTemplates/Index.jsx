import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Mail, ChevronRight, FileText, Calendar, ChevronLeft } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Index({ templates, filters = {} }) {
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this template?")) {
            router.delete(route("admin.email-templates.destroy", id));
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        if (key !== 'page') newFilters.page = 1;
        
        router.get(route("admin.email-templates.index"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const templatesList = templates.data || [];

    return (
        <AdminLayout>
            <Head title="Email Templates" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            Email Templates
                        </h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            {templates.total} templates configured
                        </p>
                    </div>
                    <Link
                        href={route("admin.email-templates.create")}
                        className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                    >
                        <Plus size={16} />
                        New Template
                    </Link>
                </div>

                {templatesList.length === 0 ? (
                    <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-sm flex items-center justify-center text-gray-300 mx-auto mb-4">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                            No Templates Found
                        </h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                            You haven't created any email templates yet. Create your first template to start communicating with candidates.
                        </p>
                        <Link
                            href={route("admin.email-templates.create")}
                            className="inline-flex items-center gap-2 mt-6 bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600 px-6 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            <Plus size={16} /> Create Template
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templatesList.map((template) => {
                                const initials = template.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase();
                                    
                                return (
                                    <div
                                        key={template.id}
                                        className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 flex flex-col gap-6 relative group"
                                    >
                                        {/* Top Row: Badges */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded bg-indigo-50 text-indigo-600">
                                                    ID: {template.id}
                                                </span>
                                                <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded border border-gray-200 text-gray-600">
                                                    TEMPLATE
                                                </span>
                                            </div>
                                            <Link
                                                href={route("admin.email-templates.edit", template.id)}
                                                className="text-gray-300 hover:text-gray-600 transition-colors"
                                            >
                                                <ChevronRight size={16} />
                                            </Link>
                                        </div>

                                        {/* Info section */}
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 rounded-sm bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-900 text-base truncate">
                                                    {template.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate mt-0.5">
                                                    {template.subject}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Middle pill */}
                                        <div className="bg-gray-50/80 rounded-sm p-3 flex items-center gap-3 text-xs font-medium text-gray-600 border border-gray-100">
                                            <FileText size={16} className="text-gray-400 flex-shrink-0" />
                                            <span className="truncate">
                                                Email content configured
                                            </span>
                                        </div>

                                        {/* Bottom Row */}
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {new Date(template.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleDelete(template.id)}
                                                    className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline"
                                                >
                                                    DELETE
                                                </button>
                                                <Link
                                                    href={route("admin.email-templates.edit", template.id)}
                                                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                                                >
                                                    Edit Template
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
