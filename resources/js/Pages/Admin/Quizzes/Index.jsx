import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import {
    Plus,
    Edit,
    Trash2,
    GraduationCap,
    Clock,
    CheckCircle2,
    XCircle,
    Link2,
    Search,
    Filter,
    HelpCircle,
    Activity,
    FileText,
    BarChart3,
    MoreHorizontal,
    ChevronDown,
    Building2,
    Users,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import Dropdown from "@/Components/Dropdown";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Index({ quizzes, filters = {} }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");

    const quizzesList = quizzes.data || [];

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        if (key !== 'page') newFilters.page = 1;
        
        Object.keys(newFilters).forEach((k) => (newFilters[k] === 'all' || !newFilters[k]) && delete newFilters[k]);
        
        router.get(route("admin.quizzes.index"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this quiz?")) {
            router.delete(route("admin.quizzes.destroy", id));
        }
    };

    // Stats Calculation (Based on current page or all if passed)
    const stats = useMemo(() => {
        const total = quizzes.total || quizzesList.length;
        const active = quizzesList.filter(q => q.status === 'published').length;
        const totalQuestions = quizzesList.reduce((acc, q) => acc + (q.questions_count || 0), 0);
        const avgDuration = quizzesList.length > 0 
            ? Math.round(quizzesList.reduce((acc, q) => acc + (parseInt(q.time_limit) || 0), 0) / quizzesList.length) 
            : 0;

        return { total, active, totalQuestions, avgDuration };
    }, [quizzes, quizzesList]);

    return (
        <AdminLayout>
            <Head title="Manage Quizzes" />

            <div className="space-y-6 max-w-8xl mx-auto px-4 sm:px-6 py-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Quizzes</h1>
                        <p className="text-sm text-gray-500 font-medium">Create and manage assessment quizzes</p>
                    </div>
                    <Link
                        href={route("admin.quizzes.create")}
                        className="inline-flex items-center px-6 py-2.5 bg-[#4F46E5] text-white font-bold rounded-sm hover:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-100"
                    >
                        <Plus className="w-4 h-4 mr-2 stroke-[3]" />
                        Create Quiz
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        icon={<HelpCircle className="w-5 h-5" />} 
                        label="Total Quizzes" 
                        value={stats.total} 
                        color="bg-blue-50 text-blue-600" 
                    />
                    <StatCard 
                        icon={<Activity className="w-5 h-5" />} 
                        label="Active" 
                        value={stats.active} 
                        color="bg-emerald-50 text-emerald-600" 
                    />
                    <StatCard 
                        icon={<FileText className="w-5 h-5" />} 
                        label="Total Questions" 
                        value={stats.totalQuestions} 
                        color="bg-purple-50 text-purple-600" 
                    />
                    <StatCard 
                        icon={<BarChart3 className="w-5 h-5" />} 
                        label="Avg Duration" 
                        value={`${stats.avgDuration} min`} 
                        color="bg-amber-50 text-amber-600" 
                    />
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-3 sm:p-4 rounded-sm border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search quizzes..." 
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                handleFilterChange("search", e.target.value);
                            }}
                            className="w-full pl-10 pr-4 py-2 border-slate-100 rounded-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-gray-50/30"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={statusFilter} onValueChange={(val) => {
                            setStatusFilter(val);
                            handleFilterChange("status", val);
                        }}>
                            <SelectTrigger className="w-full sm:w-[180px] h-10 border-slate-100 bg-gray-50/30 rounded-sm focus:ring-indigo-500 text-sm font-bold">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Status</SelectItem>
                                <SelectItem value="published">Active</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Quiz Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {quizzesList.map((quiz) => (
                        <QuizCard 
                            key={quiz.id} 
                            quiz={quiz} 
                            handleDelete={handleDelete} 
                        />
                    ))}

                    {quizzesList.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-sm border-2 border-dashed border-gray-100">
                            <GraduationCap className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">No quizzes found</h3>
                            <p className="text-gray-500 mt-2 font-medium max-w-sm mx-auto">
                                We couldn't find any quizzes matching your current search or filter.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(""); setStatusFilter("all"); router.get(route('admin.quizzes.index')); }}
                                className="mt-6 text-indigo-600 font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-xm border border-gray-100 shadow-sm flex items-center gap-4 ">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">{value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        </div>
    </div>
);

const QuizCard = ({ quiz, handleDelete }) => {
    const isPublished = quiz.status === "published";
    
    return (
        <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden flex flex-col group ">
            <div className="p-6 sm:p-7 flex-1">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100/50">
                            <GraduationCap className="w-6 h-6 text-indigo-600" />
                        </div>
                        {isPublished ? (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                Published
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-50 text-gray-500 border border-gray-100">
                                {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-1">
                         <button
                            onClick={() => {
                                if (!isPublished) {
                                    alert("Publish the quiz first to copy the link.");
                                    return;
                                }
                                const url = `${window.location.origin}/q/${quiz.id}${quiz.token ? `?token=${quiz.token}` : ""}`;
                                navigator.clipboard.writeText(url);
                                alert("Link copied!");
                            }}
                            className={`p-2 rounded-lg transition-all ${isPublished ? "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50" : "text-gray-200 cursor-not-allowed"}`}
                            title={!isPublished ? "Publish to enable link" : "Copy Link"}
                        >
                            <Link2 className="w-4 h-4" />
                        </button>
                        <Link
                            href={route("admin.quizzes.edit", quiz.id)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => handleDelete(quiz.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                    {quiz.title}
                </h3>

                <div className="space-y-3 mb-6">
                    {quiz.department && (
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            {quiz.department.name}
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {quiz.time_limit} minutes duration
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {quiz.questions_count} questions total
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                        {quiz.pass_percentage}% passing score
                    </div>
                </div>

                <div className="pt-5 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Users className="w-4 h-4 text-gray-400" />
                        {quiz.unique_attempts_count || 0} candidates attempted
                    </div>
                    <Link
                        href={route("admin.quizzes.edit", quiz.id)}
                        className="text-xs font-black text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                    >
                        Review Quiz
                    </Link>
                </div>
            </div>
        </div>
    );
};
