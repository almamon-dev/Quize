import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { 
    Plus, 
    Building2, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight, 
    ChevronDown, 
    Search,
    Filter,
    Activity,
    Briefcase,
    GraduationCap,
    Hash,
    Layers,
    Table2,
    LayoutGrid,
    MoreHorizontal
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Index({ departments, filters = {} }) {
    const [searchInput, setSearchInput] = useState(filters.search || "");

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this department?")) {
            router.delete(route("admin.departments.destroy", id));
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== (filters.search || "")) {
                handleFilterChange("search", searchInput);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleFilterChange = (key, value) => {
        router.get(
            route("admin.departments.index"),
            { ...filters, [key]: value },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    // Stats for Departments
    const totalDepartments = departments.total || 0;
    
    return (
        <AdminLayout>
            <Head title="Manage Departments" />

            <div className="space-y-6 max-w-8xl mx-auto px-4 sm:px-6 py-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Departments</h1>
                        <p className="text-sm text-gray-500 font-medium">Manage job departments and organizational categories</p>
                    </div>
                    <Link
                        href={route("admin.departments.create")}
                        className="inline-flex items-center px-6 py-2.5 bg-[#4F46E5] text-white font-bold rounded-sm hover:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-100"
                    >
                        <Plus className="w-4 h-4 mr-2 stroke-[3]" />
                        Add Department
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        icon={<Building2 className="w-5 h-5" />} 
                        label="Total Departments" 
                        value={totalDepartments} 
                        color="bg-blue-50 text-blue-600" 
                    />
                    <StatCard 
                        icon={<Briefcase className="w-5 h-5" />} 
                        label="Active Roles" 
                        value={departments.data.reduce((acc, dept) => acc + (dept.jobs_count || 0), 0)} 
                        color="bg-emerald-50 text-emerald-600" 
                    />
                    <StatCard 
                        icon={<GraduationCap className="w-5 h-5" />} 
                        label="Quiz Bank" 
                        value={departments.data.reduce((acc, dept) => acc + (dept.quizzes_count || 0), 0)} 
                        color="bg-purple-50 text-purple-600" 
                    />
                    <StatCard 
                        icon={<Activity className="w-5 h-5" />} 
                        label="Recently Updated" 
                        value={departments.data.length > 0 ? "Today" : "None"} 
                        color="bg-amber-50 text-amber-600" 
                    />
                </div>

                {/* Departments Card */}
                <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
                    {/* Search bar Area */}
                    <div className="p-3 sm:p-4 border-b border-gray-50 flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search departments..." 
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-slate-100 rounded-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-gray-50/30"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Department</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Identifier</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 text-center">Stats</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50/50">
                                {departments.data.map((dept) => (
                                    <tr key={dept.id} className="group hover:bg-indigo-50/30 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 shadow-sm">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{dept.name}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 mt-0.5">ESTD. 2024</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-500 rounded-sm text-[10px] font-black uppercase tracking-wider border border-gray-100 w-fit">
                                                <Hash className="w-3 h-3" />
                                                {dept.slug}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-6">
                                                <div className="text-center">
                                                    <div className="text-sm font-black text-gray-900 leading-none">{dept.jobs_count || 0}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-tighter">Jobs</div>
                                                </div>
                                                <div className="w-px h-6 bg-gray-100"></div>
                                                <div className="text-center">
                                                    <div className="text-sm font-black text-gray-900 leading-none">{dept.quizzes_count || 0}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-tighter">Quizzes</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 transition-all">
                                                <Link
                                                    href={route("admin.departments.edit", dept.id)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-sm transition-all shadow-sm border border-transparent hover:border-indigo-100"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(dept.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-sm transition-all shadow-sm border border-transparent hover:border-red-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-gray-900 transition-all ml-1">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {departments.data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center bg-white">
                                            <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" strokeWidth={1} />
                                            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight font-black">No departments found</h3>
                                            <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">We couldn't find any departments matching your current search.</p>
                                            <button
                                                onClick={() => setSearchInput("")}
                                                className="mt-6 inline-flex items-center px-6 py-2 bg-indigo-50 text-indigo-600 font-bold text-[11px] uppercase tracking-widest rounded-sm hover:bg-indigo-100 shadow-sm transition-all"
                                            >
                                                Clear search
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

            {/* Pagination Footer - Tactical Style */}
            <div className="px-6 py-2 bg-white border-t border-slate-100 flex items-center justify-end gap-10">
                {/* Page Size Selector */}
                <div className="flex items-center gap-3">
                    <Select 
                        value={filters.per_page?.toString() || "10"}
                        onValueChange={(val) => handleFilterChange("per_page", val)}
                    >
                        <SelectTrigger className="w-[95px] h-8 border-slate-100 bg-white text-xs font-black ring-0 rounded-sm focus:ring-0">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent upward className="min-w-0 w-[95px]">
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Result Range */}
                <p className="text-xs font-black text-slate-900 min-w-[80px] text-center tracking-widest font-bold">
                    {departments.total > 0 ? (
                        <>{departments.from} - {departments.to} of {departments.total}</>
                    ) : (
                        "0 - 0 of 0"
                    )}
                </p>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-2">
                    <button 
                        disabled={!departments.prev_page_url}
                        onClick={() => departments.prev_page_url && router.get(departments.prev_page_url, filters, { preserveScroll: true })}
                        className="p-2 rounded-md hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                    </button>
                    
                    <button 
                        disabled={!departments.next_page_url}
                        onClick={() => departments.next_page_url && router.get(departments.next_page_url, filters, { preserveScroll: true })}
                        className="p-2 rounded-md hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronRight className="w-5 h-5" strokeWidth={2} />
                    </button>
                </div>
            </div>
        </div>
            </div>
        </AdminLayout>
    );
}

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md group">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">{value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        </div>
    </div>
);

const DepartmentCard = ({ dept, handleDelete }) => {
    return (
        <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden flex flex-col group transition-all duration-300">
            <div className="p-6 sm:p-7 flex-1">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                            ID: #{dept.id}
                        </span>
                        <span className="px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100">
                            Active
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <Link
                            href={route("admin.departments.edit", dept.id)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm transition-all shadow-sm"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => handleDelete(dept.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all shadow-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                        <Building2 className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                            {dept.name}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 flex items-center gap-1.5 mt-1">
                            <Hash className="w-3 h-3" />
                            {dept.slug}
                        </p>
                    </div>
                </div>

                {/* High Density Stats Box */}
                <div className="bg-gray-50/50 rounded-xl p-4 flex items-center justify-between border border-gray-50 mt-4">
                    <div className="text-center flex-1">
                        <p className="text-lg font-black text-gray-900 leading-none">{dept.jobs_count || 0}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Jobs</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200/50 mx-2"></div>
                    <div className="text-center flex-1">
                        <p className="text-lg font-black text-gray-900 leading-none">{dept.quizzes_count || 0}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Quizzes</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200/50 mx-2"></div>
                    <div className="text-center flex-1">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                            <Layers className="w-4 h-4 text-indigo-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 sm:px-7 py-4 border-t border-gray-50 bg-white flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Functional</span>
                </div>
                <Link
                    href={route("admin.departments.edit", dept.id)}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-700 underline"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};
