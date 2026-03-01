import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { 
    User, 
    Search, 
    Filter, 
    X, 
    ChevronDown, 
    ChevronLeft, 
    ChevronRight, 
    Star,
    LayoutPanelTop,
    Table as TableIcon,
    SearchX,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    FileText,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Calendar,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Index({ applications, filters, jobs, departments, statusCounts = {} }) {
    const [searchInput, setSearchInput] = useState(filters.search || "");
    const [viewMode, setViewMode] = useState("cards"); 
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        Object.keys(newFilters).forEach((k) => !newFilters[k] && delete newFilters[k]);
        router.get(route("admin.cv_management.index"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(route("admin.cv_management.index"), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleStatusUpdate = (id, status) => {
        router.post(route("admin.applications.status", id), { status }, {
            onSuccess: () => setIsModalOpen(false),
            preserveScroll: true
        });
    };

    const getStatusStyle = (status) => {
        const styles = {
            applied: "bg-gray-100 text-gray-700",
            shortlisted: "bg-indigo-50 text-indigo-700",
            technical_test: "bg-cyan-50 text-cyan-700",
            interview: "bg-purple-50 text-purple-700",
            hired: "bg-emerald-50 text-emerald-700",
            rejected: "bg-rose-50 text-rose-700",
        };
        return styles[status] || "bg-gray-50 text-gray-500";
    };

    // Stats calculated from statusCounts
    const totalCount = applications.total || 0;
    const shortlistedCount = statusCounts.shortlisted || 0;
    const inProgressCount = (statusCounts.technical_test || 0) + (statusCounts.interview || 0);
    const hiredCount = statusCounts.hired || 0;

    return (
        <AdminLayout>
            <Head title="CV Management" />

            <div className="space-y-6 max-w-8xl mx-auto px-4 sm:px-6 py-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">CV Management</h1>
                        <p className="text-sm text-gray-500 font-medium font-bold">Candidate resumes and pipeline tracking</p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        icon={<User className="w-5 h-5" />} 
                        label="Total Candidates" 
                        value={totalCount} 
                        color="bg-blue-50 text-blue-600" 
                    />
                    <StatCard 
                        icon={<Star className="w-5 h-5" />} 
                        label="Shortlisted" 
                        value={shortlistedCount} 
                        color="bg-emerald-50 text-emerald-600" 
                    />
                    <StatCard 
                        icon={<LayoutPanelTop className="w-5 h-5" />} 
                        label="In Progress" 
                        value={inProgressCount} 
                        color="bg-purple-50 text-purple-600" 
                    />
                    <StatCard 
                        icon={<User className="w-5 h-5" />} 
                        label="Hired" 
                        value={hiredCount} 
                        color="bg-amber-50 text-amber-600" 
                    />
                </div>

                {/* Filters */}
                <div className="bg-white p-3 sm:p-4 rounded-sm border border-gray-100 shadow-sm flex flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search resumes..." 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-10 pr-4 h-[38px] py-0 border border-gray-100 rounded-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-gray-50/30"
                        />
                    </div>
                    <div className="flex flex-row items-center gap-3 w-auto">
                        <Select 
                            value={filters.job_id?.toString() || "all"}
                            onValueChange={(val) => handleFilterChange("job_id", val === "all" ? "" : val)}
                        >
                            <SelectTrigger className="bg-white border border-gray-200 rounded-sm px-4 py-0 h-[38px] text-sm font-bold text-gray-700 outline-none hover:border-indigo-400 transition-colors cursor-pointer min-w-[240px]">
                                <SelectValue placeholder="Jobs" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Jobs</SelectItem>
                                {jobs.map(job => <SelectItem key={job.id} value={job.id.toString()}>{job.title}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select 
                            value={filters.status || "all"}
                            onValueChange={(val) => handleFilterChange("status", val === "all" ? "" : val)}
                        >
                            <SelectTrigger className="bg-white border border-gray-200 rounded-sm px-4 py-0 h-[38px] text-sm font-bold text-gray-700 outline-none hover:border-indigo-400 transition-colors cursor-pointer min-w-[240px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Status</SelectItem>
                                <SelectItem value="applied">Applied</SelectItem>
                                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                <SelectItem value="technical_test">Assessment</SelectItem>
                                <SelectItem value="interview">Interview</SelectItem>
                                <SelectItem value="hired">Hired</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Resumes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {applications.data.map((app) => (
                        <CandidateCard 
                            key={app.id} 
                            app={app} 
                            getStatusStyle={getStatusStyle}
                            onClick={() => {
                                setSelectedCandidate(app);
                                setIsModalOpen(true);
                            }}
                        />
                    ))}

                    {applications.data.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-sm border-2 border-dashed border-gray-100">
                            <SearchX className="w-16 h-16 text-gray-200 mx-auto mb-4" strokeWidth={1} />
                            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">No Matching Candidates</h3>
                            <button onClick={clearFilters} className="mt-6 text-indigo-600 font-bold hover:underline font-black text-xs uppercase tracking-widest ">Reset Filters</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Candidate Details Modal */}
            {isModalOpen && selectedCandidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-50">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-black text-gray-900">Candidate Details</h2>
                                <Link 
                                    href={route('admin.applications.show', selectedCandidate.id)}
                                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm transition-all"
                                    title="View Full Profile"
                                >
                                    <ExternalLink size={16} />
                                </Link>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Profile Header */}
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-black">
                                    {selectedCandidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900">{selectedCandidate.name}</h3>
                                    <span className={cn(
                                        "inline-flex items-center px-4 py-1.5 rounded-sm text-xs font-black uppercase tracking-widest",
                                        getStatusStyle(selectedCandidate.status)
                                    )}>
                                        {selectedCandidate.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="bg-gray-50/50 rounded-xl p-6 space-y-4 border border-gray-100">
                                <div className="flex items-center gap-4 text-gray-600">
                                    <Mail size={18} className="text-gray-400" />
                                    <span className="text-sm font-bold">{selectedCandidate.email}</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <Phone size={18} className="text-gray-400" />
                                    <span className="text-sm font-bold">{selectedCandidate.phone || "+1 555-0123"}</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <Briefcase size={18} className="text-gray-400" />
                                    <span className="text-sm font-bold">{selectedCandidate.job_post?.title || "Position Name"}</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <Calendar size={18} className="text-gray-400" />
                                    <span className="text-sm font-bold">{selectedCandidate.experience_years || 0} Years Experience</span>
                                </div>
                            </div>

                            {/* Resume Section */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Resume / CV</h4>
                                {selectedCandidate.resume_path ? (
                                    <a 
                                        href={`/storage/${selectedCandidate.resume_path}`}
                                        target="_blank"
                                        className="flex items-center gap-3 text-indigo-600 hover:text-indigo-700 font-black text-sm transition-colors"
                                    >
                                        <FileText size={20} />
                                        <span>View Document</span>
                                    </a>
                                ) : (
                                    <p className="text-sm text-gray-400 font-bold italic">No resume uploaded</p>
                                )}
                            </div>

                            {/* Actions Section */}
                            {selectedCandidate.status === 'applied' ? (
                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Update Pipeline Status</h4>
                                        <Link 
                                            href={route('admin.applications.show', selectedCandidate.id)}
                                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 flex items-center gap-1.5"
                                        >
                                            Full Profile <ExternalLink size={12} strokeWidth={2} />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => handleStatusUpdate(selectedCandidate.id, 'shortlisted')}
                                            className="flex items-center justify-center gap-2.5 py-3.5 px-6 border border-emerald-200 text-emerald-600 rounded-sm hover:bg-emerald-50 transition-colors"
                                        >
                                            <CheckCircle2 size={18} strokeWidth={1.5} />
                                            <span className="text-[11px] font-black uppercase tracking-widest">Shortlist</span>
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(selectedCandidate.id, 'rejected')}
                                            className="flex items-center justify-center gap-2.5 py-3.5 px-6 border border-rose-200 text-rose-500 rounded-sm hover:bg-rose-50 transition-colors"
                                        >
                                            <XCircle size={18} strokeWidth={1.5} />
                                            <span className="text-[11px] font-black uppercase tracking-widest">Reject</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Manage Pipeline</h4>
                                    </div>
                                    <Link 
                                        href={route('admin.applications.show', selectedCandidate.id)}
                                        className="flex items-center justify-center gap-2.5 py-3.5 px-6 bg-slate-900 text-white rounded-sm hover:bg-slate-800 transition-colors w-full"
                                    >
                                        <ExternalLink size={18} strokeWidth={1.5} />
                                        <span className="text-[11px] font-black uppercase tracking-widest">Go To Full Profile</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
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

const CandidateCard = ({ app, getStatusStyle, onClick }) => {
    return (
        <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg hover:border-indigo-200 cursor-pointer" onClick={onClick}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                            Score: {Math.round(app.ranking_score || 0)}%
                        </span>
                        <span className={cn(
                            "px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider border",
                            getStatusStyle(app.status)
                        )}>
                            {app.status.replace('_', ' ')}
                        </span>
                    </div>
                    <div className="p-1 px-2 text-gray-300 group-hover:text-indigo-600 transition-all transform translate-x-1">
                        <ChevronRight size={18} />
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                        {app.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                            {app.name}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 mt-1">
                            {app.email}
                        </p>
                    </div>
                </div>

                {/* Job Info Box */}
                <div className="bg-gray-50/50 rounded-xl p-4 flex items-center justify-between border border-gray-50 mt-4">
                    <div className="flex items-center gap-3">
                        <Briefcase size={16} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-600">{app.job_post?.title}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-50 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <Calendar size={14} />
                    {app.experience_years || 0} Years Exp
                </div>
                <span className="text-xs font-black text-indigo-600 hover:text-indigo-700 underline">
                    View Profile
                </span>
            </div>
        </div>
    );
};
