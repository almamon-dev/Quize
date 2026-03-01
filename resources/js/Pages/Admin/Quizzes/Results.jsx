import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    Award,
    Clock,
    CheckCircle2,
    Search,
    Eye,
    Activity,
    Users,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Trophy,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Results({ attempts, quizzes, filters, metrics }) {
    const [searchInput, setSearchInput] = useState(filters.search || "");

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
        const newFilters = { ...filters, [key]: value };
        if (key !== 'page') newFilters.page = 1; // Reset to page 1 on filter change
        
        Object.keys(newFilters).forEach((k) => !newFilters[k] && delete newFilters[k]);
        
        router.get(route("admin.quizzes.results"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Note: Since data is paginated on server, we use attempts.data for the list
    const attemptsList = attempts.data || [];

    return (
        <AdminLayout>
            <Head title="Quiz Results" />

            <div className="space-y-6 max-w-8xl mx-auto px-4 sm:px-6 py-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <Link href={route('admin.quizzes.index')} className="hover:text-indigo-600 transition-colors">Quizzes</Link>
                            <ChevronRight size={10} strokeWidth={3} />
                            <span className="text-slate-600">Results Analysis</span>
                        </nav>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Quiz Results</h1>
                        <p className="text-sm text-slate-500 font-medium">Monitor candidate performance and review submissions</p>
                    </div>
                </div>

                {/* Stats Summary (Approximate based on current page or pass meta if needed) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        icon={<Users className="w-5 h-5" />} 
                        label="Total Attempts" 
                        value={metrics?.total_attempts || 0} 
                        color="bg-blue-50 text-blue-600" 
                    />
                    <StatCard 
                        icon={<Target className="w-5 h-5" />} 
                        label="Success Rate" 
                        value={`${metrics?.success_rate || 0}%`} 
                        color="bg-emerald-50 text-emerald-600" 
                    />
                    <StatCard 
                        icon={<Trophy className="w-5 h-5" />} 
                        label="High Scores" 
                        value={metrics?.high_scores || 0} 
                        color="bg-purple-50 text-purple-600" 
                    />
                    <StatCard 
                        icon={<Activity className="w-5 h-5" />} 
                        label="Current Page" 
                        value={attempts.current_page} 
                        color="bg-amber-50 text-amber-600" 
                    />
                </div>

                {/* Results Card */}
                <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                    {/* Search & Filters Bar */}
                    <div className="p-3 border-b border-slate-100 flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search candidate name or email..." 
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border-slate-100 rounded-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <Select 
                                value={filters.quiz_id || "all"}
                                onValueChange={(val) => handleFilterChange("quiz_id", val === "all" ? "" : val)}
                            >
                                <SelectTrigger className="w-full lg:w-[240px] h-10 border-slate-100 bg-slate-50/50 text-xs font-bold ring-0">
                                    <SelectValue placeholder="Assessments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Assessments</SelectItem>
                                    {quizzes?.map(quiz => (
                                        <SelectItem key={quiz.id} value={quiz.id.toString()}>{quiz.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Candidate</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Assessment</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Obtained Marks</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Total Marks</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Performance</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {attemptsList.map((attempt) => (
                                    <tr key={attempt.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-sm bg-slate-900 flex items-center justify-center text-white text-xs font-black">
                                                    {(attempt.user?.name || attempt.name || "G")[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                                                        {attempt.user?.name ?? attempt.name ?? "Guest User"}
                                                    </p>
                                                    <p className="text-[11px] font-medium text-slate-400 font-bold tracking-tight">
                                                        {attempt.user?.email ?? attempt.email ?? "No email provided"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-indigo-50 rounded-sm flex items-center justify-center border border-indigo-100/50">
                                                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 leading-tight truncate max-w-[150px]">{attempt.quiz?.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 text-center text-xs font-black text-slate-900">
                                            {attempt.answers_sum_marks_awarded || 0}
                                        </td>
                                        <td className="px-6 py-2 text-center text-xs font-bold text-slate-500">
                                            {attempt.quiz?.questions_sum_points || 0}
                                        </td>
                                        <td className="px-6 py-2">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Trophy className={cn(
                                                    "w-4 h-4",
                                                    attempt.quiz?.questions_sum_points && (attempt.score / attempt.quiz.questions_sum_points) * 100 >= 70 ? "text-amber-500" : "text-slate-300"
                                                )} />
                                                <span className="text-sm font-black text-slate-900">
                                                    {attempt.quiz?.questions_sum_points 
                                                        ? Math.round((attempt.score / attempt.quiz.questions_sum_points) * 100)
                                                        : 0}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2">
                                            {attempt.status === "completed" ? (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                                                    In Progress
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-2 text-right">
                                            <Link
                                                href={route("admin.quizzes.attempts.show", attempt.id)}
                                                className="inline-flex items-center px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-black transition-all shadow-sm active:scale-95"
                                            >
                                                <Eye className="w-3 h-3 mr-2" strokeWidth={3} />
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                
                                {attemptsList.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="max-w-xs mx-auto">
                                                <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                                <p className="text-sm font-bold text-slate-400">No matching records found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Footer - Tactical Style */}
                    <div className="px-6 py-2 bg-white border-t border-slate-100 flex items-center justify-end gap-10">
                        {/* Items per page Selector */}
                        <div className="flex items-center gap-3">
                            <Select 
                                value={(filters.per_page || 10).toString()}
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
                        <p className="text-xs font-black text-slate-900 min-w-[40px] text-center tracking-widest font-bold">
                            {attempts.total > 0 ? (
                                <>{attempts.from} - {attempts.to} of {attempts.total}</>
                            ) : (
                                "0 - 0 of 0"
                            )}
                        </p>

                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-2">
                            <button 
                                disabled={!attempts.prev_page_url}
                                onClick={() => attempts.prev_page_url && router.get(attempts.prev_page_url, filters, { preserveScroll: true })}
                                className="p-2 rounded-md hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-slate-400 hover:text-indigo-600"
                            >
                                <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                            </button>
                            
                            <button 
                                disabled={!attempts.next_page_url}
                                onClick={() => attempts.next_page_url && router.get(attempts.next_page_url, filters, { preserveScroll: true })}
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
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02]">
        <div className={cn("w-12 h-12 flex items-center justify-center rounded-xl", color)}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        </div>
    </div>
);

