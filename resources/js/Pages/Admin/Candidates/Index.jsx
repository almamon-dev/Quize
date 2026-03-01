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
    Download,
    Upload,
    Mail,
    Phone,
    Briefcase,
    Calendar,
    ExternalLink,
    CheckCircle2,
    XCircle,
    FileText,
    Table2,
    LayoutGrid,
    MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import axios from "axios";

export default function Index({ applications, filters, jobs, departments, statusCounts = {} }) {
    const [searchInput, setSearchInput] = useState(filters.search || "");
    const [viewMode, setViewMode] = useState("cards"); 
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load More States
    const [items, setItems] = useState(applications.data);
    const [nextPageUrl, setNextPageUrl] = useState(applications.next_page_url);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        setItems(applications.data);
        setNextPageUrl(applications.next_page_url);
    }, [applications]);

    const handleLoadMore = () => {
        if (!nextPageUrl) return;
        setIsLoadingMore(true);
        axios.get(nextPageUrl, { headers: { "X-Inertia": true } })
            .then(res => {
                const nextApps = res.data.props.applications;
                setItems(prev => [...prev, ...nextApps.data]);
                setNextPageUrl(nextApps.next_page_url);
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoadingMore(false));
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
        const newFilters = { ...filters, [key]: value };
        Object.keys(newFilters).forEach((k) => !newFilters[k] && delete newFilters[k]);
        router.get(route("admin.applications.index"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(route("admin.applications.index"), {}, {
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
            quiz: "bg-indigo-50 text-indigo-700",
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
            <Head title="Candidates" />

            <div className="space-y-6 max-w-8xl mx-auto px-4 sm:px-6 py-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Candidates</h1>
                        <p className="text-sm text-gray-500 font-medium font-bold">Manage applicants across all positions</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="inline-flex items-center px-6 py-2.5 bg-white text-gray-700 font-bold rounded-sm border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Import
                        </button>
                        <button className="inline-flex items-center px-6 py-2.5 bg-white text-gray-700 font-bold rounded-sm border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </button>
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

                {/* Main Content Card */}
                <div className="bg-white rounded-sm border border-slate-100 shadow-sm overflow-hidden">
                    {/* Filters Area */}
                    <div className="p-4 border-b border-slate-50 flex flex-row gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search candidates..." 
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-12 pr-5 h-9 py-0 bg-slate-50 border border-slate-100 rounded-sm focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold placeholder:text-slate-400 placeholder:font-medium"
                            />
                        </div>
                        
                        <div className="flex flex-row items-center gap-3">
                            <Select 
                                value={filters.job_id?.toString() || "all"}
                                onValueChange={(val) => handleFilterChange("job_id", val === "all" ? "" : val)}
                            >
                                <SelectTrigger className="bg-white border border-slate-200 rounded-sm px-4 py-0 h-9 text-xs font-black tracking-wider text-slate-700 outline-none hover:border-indigo-400 min-w-[240px] w-auto">
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
                                <SelectTrigger className="bg-white border border-slate-200 rounded-sm px-4 py-0 h-9 text-xs font-black tracking-wider text-slate-700 outline-none hover:border-indigo-400 min-w-[200px] w-auto">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Status</SelectItem>
                                    <SelectItem value="applied">Applied</SelectItem>
                                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                    <SelectItem value="technical_test">Assessment</SelectItem>
                                    <SelectItem value="interview">Interview</SelectItem>
                                    <SelectItem value="hired">Hired</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex bg-gray-100 p-1 rounded-sm">
                                <button 
                                    onClick={() => setViewMode("table")}
                                    className={cn(
                                        "px-4 py-1.5 rounded-sm text-xs font-black transition-all",
                                        viewMode === "table" ? "bg-black text-white" : "text-gray-500 hover:text-gray-900"
                                    )}
                                >
                                    Table
                                </button>
                                <button 
                                    onClick={() => setViewMode("cards")}
                                    className={cn(
                                        "px-4 py-1.5 rounded-sm text-xs font-black transition-all",
                                        viewMode === "cards" ? "bg-black text-white" : "text-gray-500 hover:text-gray-900"
                                    )}
                                >
                                    Cards
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Candidates List/Grid */}
                    {viewMode === "table" ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Candidate Info</th>
                                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Applied For</th>
                                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Score</th>
                                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {applications.data.map((app) => (
                                            <tr 
                                                key={app.id} 
                                                className="group hover:bg-slate-50/30 transition-all cursor-pointer"
                                                onClick={() => {
                                                    setSelectedCandidate(app);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-sm bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                                                            {app.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{app.name}</div>
                                                            <div className="text-[11px] font-bold text-slate-400 mt-0.5">{app.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-700">{app.job_post?.title}</span>
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mt-0.5">ID: #{app.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-indigo-500 rounded-full" 
                                                                style={{ width: `${Math.round(app.ranking_score || 0)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs font-black text-slate-900">{Math.round(app.ranking_score || 0)}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "inline-flex items-center px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                                        getStatusStyle(app.status)
                                                    )}>
                                                        {app.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route('admin.applications.show', app.id)}
                                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-sm transition-all shadow-sm border border-transparent hover:border-indigo-100"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <ExternalLink size={16} />
                                                        </Link>
                                                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                                                            <MoreHorizontal size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {applications.data.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="py-20 text-center bg-white">
                                                    <SearchX className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">No Matching Candidates</h3>
                                                    <button
                                                        onClick={clearFilters}
                                                        className="mt-6 text-indigo-600 font-bold hover:underline text-xs uppercase tracking-widest"
                                                    >
                                                        Reset filters
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
                                    <span className="text-[12px] font-bold text-slate-500 whitespace-nowrap uppercase tracking-widest">Items / Page:</span>
                                    <Select 
                                        value={filters.per_page?.toString() || "10"}
                                        onValueChange={(val) => handleFilterChange("per_page", val)}
                                    >
                                        <SelectTrigger className="w-[65px] h-8 border-slate-100 bg-white text-xs font-black ring-0 rounded-sm focus:ring-0">
                                            <SelectValue placeholder="10" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Result Range */}
                                <p className="text-xs font-black text-slate-900 min-w-[80px] text-center tracking-widest font-bold">
                                    {applications.total > 0 ? (
                                        <>{applications.from} - {applications.to} of {applications.total}</>
                                    ) : (
                                        "0 - 0 of 0"
                                    )}
                                </p>

                                {/* Navigation Arrows */}
                                <div className="flex items-center gap-2">
                                    <button 
                                        disabled={!applications.prev_page_url}
                                        onClick={() => applications.prev_page_url && router.get(applications.prev_page_url, filters, { preserveScroll: true })}
                                        className="p-2 rounded-md hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-slate-400 hover:text-indigo-600"
                                    >
                                        <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                                    </button>
                                    
                                    <button 
                                        disabled={!applications.next_page_url}
                                        onClick={() => applications.next_page_url && router.get(applications.next_page_url, filters, { preserveScroll: true })}
                                        className="p-2 rounded-md hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-slate-400 hover:text-indigo-600"
                                    >
                                        <ChevronRight className="w-5 h-5" strokeWidth={2} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                            {items.map((app) => (
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
                            {items.length === 0 && (
                                <div className="col-span-full py-20 text-center bg-white rounded-sm border border-slate-100">
                                    <SearchX className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">No Matching Candidates</h3>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-6 text-indigo-600 font-bold hover:underline text-xs uppercase tracking-widest"
                                    >
                                        Reset filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Load More Button for Cards */}
                        {nextPageUrl && (
                            <div className="flex justify-center mt-8 pb-4">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin"></div>
                                            Loading...
                                        </>
                                    ) : (
                                        "Show More Candidates"
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>

        {/* Candidate Details Modal */}
            {isModalOpen && selectedCandidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-[500px] rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Candidate Details</h2>
                                <Link 
                                    href={route('admin.applications.show', selectedCandidate.id)}
                                    className="p-1 text-slate-300 hover:text-indigo-600 transition-colors"
                                    title="View Full Profile"
                                >
                                    <ExternalLink size={16} />
                                </Link>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Profile Header */}
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-[88px] h-[88px] rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-3xl font-bold tracking-tight shadow-sm">
                                    {selectedCandidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-[22px] font-bold text-slate-900 leading-none">{selectedCandidate.name}</h3>
                                    <div>
                                        <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-600 rounded-sm text-[10px] font-black uppercase tracking-[0.15em]">
                                            {selectedCandidate.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="border border-slate-100 rounded-xl p-6 space-y-4 mb-8 bg-white shadow-sm">
                                <div className="flex items-center gap-4 text-slate-600">
                                    <Mail size={18} className="text-slate-400" strokeWidth={1.5} />
                                    <span className="text-[13px] font-semibold text-slate-600">{selectedCandidate.email}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <Phone size={18} className="text-slate-400" strokeWidth={1.5} />
                                    <span className="text-[13px] font-semibold text-slate-600">{selectedCandidate.phone || "+1 555-0123"}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <Briefcase size={18} className="text-slate-400" strokeWidth={1.5} />
                                    <span className="text-[13px] font-semibold text-slate-600">{selectedCandidate.job_post?.title || "Position Name"}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <Calendar size={18} className="text-slate-400" strokeWidth={1.5} />
                                    <span className="text-[13px] font-semibold text-slate-600">{selectedCandidate.experience_years || 0} Years Experience</span>
                                </div>
                            </div>

                            {/* Resume Section */}
                            <div className="mb-10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Resume / CV</h4>
                                {selectedCandidate.resume_path ? (
                                    <a 
                                        href={`/storage/${selectedCandidate.resume_path}`}
                                        target="_blank"
                                        className="inline-flex items-center gap-3 text-indigo-600 hover:text-indigo-700 transition-colors"
                                    >
                                        <FileText size={20} strokeWidth={1.5} />
                                        <span className="text-[13px] font-bold">View Document</span>
                                    </a>
                                ) : (
                                    <p className="text-[13px] font-medium text-slate-400">No resume uploaded</p>
                                )}
                            </div>

                            <div className="w-full h-px bg-slate-100 mb-8"></div>

                            {/* Actions Section */}
                            {selectedCandidate.status === 'applied' ? (
                                <div>
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
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Manage Pipeline</h4>
                                    </div>
                                    <Link 
                                        href={route('admin.applications.show', selectedCandidate.id)}
                                        className="flex items-center justify-center gap-2.5 py-3.5 px-6 bg-slate-900 text-white rounded-sm hover:bg-slate-800 transition-colors w-full"
                                    >
                                        <LayoutGrid size={18} strokeWidth={1.5} />
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
