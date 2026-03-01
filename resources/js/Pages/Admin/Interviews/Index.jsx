import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { 
    Calendar, 
    Clock, 
    CheckCircle2, 
    Video, 
    Search, 
    Filter, 
    Plus, 
    MoreVertical, 
    ChevronRight,
    SearchX,
    ChevronLeft,
    Trash2,
    X,
    User,
    Link as LinkIcon,
    MapPin,
    Monitor,
    Users as UsersIcon,
    Sparkles,
    Mail,
    Building2,
    Briefcase,
    LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import Modal from "@/Components/Modal";

export default function Index({ interviews, stats, filters, candidates, jobs, departments }) {
    const [searchInput, setSearchInput] = useState(filters.search || "");
    const [activeTab, setActiveTab] = useState("upcoming");
    const [isScheduling, setIsScheduling] = useState(false);
    const [interviewerEmail, setInterviewerEmail] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        job_application_id: "",
        job_post_id: "",
        interview_type: "HR Interview",
        interview_mode: "online",
        meeting_type: "Google Meet",
        scheduled_at: "",
        duration_minutes: 60,
        video_link: "",
        location: "",
        interviewers: [],
        notes: "",
    });

    // When candidate changes, auto-select job position
    useEffect(() => {
        if (data.job_application_id) {
            const candidate = candidates.find(c => c.id.toString() === data.job_application_id);
            if (candidate) {
                setData("job_post_id", candidate.job_post_id.toString());
            }
        }
    }, [data.job_application_id]);

    // Sync search input with filter props
    useEffect(() => {
        setSearchInput(filters.search || "");
    }, [filters.search]);

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
        if (key === 'department_id') delete newFilters['job_post_id'];
        Object.keys(newFilters).forEach((k) => !newFilters[k] && delete newFilters[k]);
        router.get(route("admin.interviews.index"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const getStatusStyle = (status) => {
        const styles = {
            scheduled: "bg-blue-50 text-blue-700 border-blue-100",
            completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
            cancelled: "bg-rose-50 text-rose-700 border-rose-100",
        };
        return styles[status] || "bg-gray-50 text-gray-500 border-gray-100";
    };

    const handleSchedule = (e) => {
        e.preventDefault();
        post(route("admin.interviews.store"), {
            onSuccess: () => {
                setIsScheduling(false);
                reset();
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to cancel and delete this interview?")) {
            router.delete(route("admin.interviews.destroy", id));
        }
    }

    const handleStatusUpdate = (id, status) => {
        router.patch(route("admin.interviews.update", id), { status });
    }

    const addInterviewer = () => {
        if (interviewerEmail && !data.interviewers.includes(interviewerEmail)) {
            setData("interviewers", [...data.interviewers, interviewerEmail]);
            setInterviewerEmail("");
        }
    }

    const removeInterviewer = (email) => {
        setData("interviewers", data.interviewers.filter(e => e !== email));
    }

    const filteredJobsForFilter = filters.department_id 
        ? jobs.filter(j => String(j.department_id) === String(filters.department_id))
        : jobs;

    return (
        <AdminLayout>
            <Head title="Interviews" />

            <div className="space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 py-4">
                {/* Header Section - More Compact */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Interviews</h1>
                        <p className="text-sm text-slate-400 font-bold tracking-wider">Candidate Meeting Dashboard</p>
                    </div>
                    <button 
                        onClick={() => setIsScheduling(true)}
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-sm font-black tracking-widest rounded-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                    >
                        <Plus className="w-4 h-4 mr-2.5" />
                        Schedule Interview
                    </button>
                </div>

                {/* Stat Cards - Reduced Height/Padding */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard 
                        icon={<LayoutGrid className="w-5 h-5" />} 
                        label="Total" 
                        value={stats.total} 
                        color="bg-indigo-50 text-indigo-600 border-indigo-100" 
                    />
                    <StatCard 
                        icon={<Clock className="w-5 h-5" />} 
                        label="Upcoming" 
                        value={stats.upcoming} 
                        color="bg-blue-50 text-blue-600 border-blue-100" 
                    />
                    <StatCard 
                        icon={<CheckCircle2 className="w-5 h-5" />} 
                        label="Completed" 
                        value={stats.completed} 
                        color="bg-emerald-50 text-emerald-600 border-emerald-100" 
                    />
                    <StatCard 
                        icon={<Video className="w-5 h-5" />} 
                        label="Video Labs" 
                        value={stats.with_video} 
                        color="bg-purple-50 text-purple-600 border-purple-100" 
                    />
                </div>

                {/* Interviews Main Content Card */}
                <div className="bg-white rounded-sm border border-slate-100 shadow-sm overflow-hidden">
                    {/* Minimal Filters Row */}
                    <div className="p-4 border-b border-slate-50 flex flex-row gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Find candidate by name..." 
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-12 pr-5 py-2.5 bg-slate-50 border border-slate-100 rounded-sm focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-base font-medium"
                            />
                        </div>
                        
                        <div className="flex flex-row items-center gap-3">
                            <Select 
                                value={filters.department_id ? filters.department_id.toString() : "all"}
                                onValueChange={(val) => handleFilterChange("department_id", val === "all" ? "" : val)}
                            >
                                <SelectTrigger className="bg-white border border-slate-200 rounded-sm px-4 py-0 h-10 text-xs font-black tracking-wider text-slate-700 outline-none hover:border-indigo-400 min-w-[220px] w-auto">
                                    <div className="flex items-center gap-2.5">
                                        <Building2 size={14} className="text-slate-400" />
                                        <SelectValue>
                                            {filters.department_id 
                                                ? (departments.find(d => String(d.id) === String(filters.department_id))?.name || "Dept Selected") 
                                                : "Departments"}
                                        </SelectValue>
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-sm">
                                    <SelectItem value="all" className="text-sm font-bold">Departments</SelectItem>
                                    {departments.map(dept => (
                                        <SelectItem key={dept.id} value={dept.id.toString()} className="text-sm font-bold">{dept.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select 
                                value={filters.job_post_id ? filters.job_post_id.toString() : "all"}
                                onValueChange={(val) => handleFilterChange("job_post_id", val === "all" ? "" : val)}
                            >
                                <SelectTrigger className="bg-white border border-slate-200 rounded-sm px-4 py-0 h-10 text-xs font-black tracking-wider text-slate-700 outline-none hover:border-indigo-400 min-w-[200px] w-auto">
                                    <div className="flex items-center gap-2.5">
                                        <Briefcase size={14} className="text-slate-400" />
                                        <SelectValue>
                                            {filters.job_post_id 
                                                ? (jobs.find(j => String(j.id) === String(filters.job_post_id))?.title || "Pos Selected") 
                                                : "Positions"}
                                        </SelectValue>
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-sm">
                                    <SelectItem value="all" className="text-sm font-bold">Positions</SelectItem>
                                    {filteredJobsForFilter.map(job => (
                                        <SelectItem key={job.id} value={job.id.toString()} className="text-sm font-bold">{job.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select 
                                value={filters.status ? filters.status.toString() : "all"}
                                onValueChange={(val) => handleFilterChange("status", val === "all" ? "" : val)}
                            >
                                <SelectTrigger className="bg-white border border-slate-200 rounded-sm px-4 py-0 h-10 text-xs font-black tracking-wider text-slate-700 outline-none hover:border-indigo-400 min-w-[190px] w-auto">
                                    <SelectValue>
                                        {filters.status 
                                            ? filters.status.charAt(0).toUpperCase() + filters.status.slice(1) 
                                            : "Status"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-sm">
                                    <SelectItem value="all" className="text-sm font-bold">Status</SelectItem>
                                    <SelectItem value="scheduled" className="text-sm font-bold">Scheduled</SelectItem>
                                    <SelectItem value="completed" className="text-sm font-bold">Completed</SelectItem>
                                    <SelectItem value="cancelled" className="text-sm font-bold">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Reference Pill Tabs */}
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg w-fit">
                            {[
                                { id: "upcoming", label: "Upcoming", count: stats.upcoming },
                                { id: "completed", label: "Completed", count: stats.completed },
                                { id: "all", label: "All Records", count: stats.total },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                                        activeTab === tab.id 
                                            ? "bg-white text-indigo-600 shadow-sm" 
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {tab.label} <span className="opacity-60">({tab.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Interview List Area */}
                    <div className="grid grid-cols-1 divide-y divide-slate-50">
                        {interviews.data.map((interview) => (
                            <InterviewCard 
                                key={interview.id} 
                                interview={interview} 
                                getStatusStyle={getStatusStyle}
                                onDelete={handleDelete}
                                onMarkCompleted={(id) => handleStatusUpdate(id, "completed")}
                            />
                        ))}

                        {interviews.data.length === 0 && (
                            <div className="py-20 text-center bg-white">
                                <SearchX className="w-16 h-16 text-slate-100 mx-auto mb-4" strokeWidth={1.5} />
                                <h3 className="text-base font-black text-slate-900 tracking-widest uppercase">No Records Found</h3>
                                <p className="text-xs text-slate-400 mt-1 font-bold">Try refining your selection criteria</p>
                            </div>
                        )}
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
                        <p className="text-xs font-black text-slate-900 min-w-[40px] text-center tracking-widest font-bold">
                            {interviews.total > 0 ? (
                                <>{interviews.from} - {interviews.to} of {interviews.total}</>
                            ) : (
                                "0 - 0 of 0"
                            )}
                        </p>

                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-2">
                            <button 
                                disabled={!interviews.prev_page_url}
                                onClick={() => interviews.prev_page_url && router.get(interviews.prev_page_url, filters, { preserveScroll: true })}
                                className="p-2 rounded-md hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-slate-400 hover:text-indigo-600"
                            >
                                <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                            </button>
                            
                            <button 
                                disabled={!interviews.next_page_url}
                                onClick={() => interviews.next_page_url && router.get(interviews.next_page_url, filters, { preserveScroll: true })}
                                className="p-2 rounded-md hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-slate-400 hover:text-indigo-600"
                            >
                                <ChevronRight className="w-5 h-5" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scheduling Modal */}
            <Modal show={isScheduling} onClose={() => setIsScheduling(false)} maxWidth="2xl">
                <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight ">Schedule Interview</h2>
                        <button onClick={() => setIsScheduling(false)} className="p-1.5 hover:bg-slate-100 rounded-full transition-all">
                            <X size={18} className="text-slate-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSchedule} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-900  tracking-wide">Candidate *</label>
                                <Select value={data.job_application_id ? data.job_application_id.toString() : ""} onValueChange={(val) => setData("job_application_id", val)}>
                                    <SelectTrigger className="w-full bg-white border-slate-200 h-9 rounded-sm font-medium text-slate-700 px-3">
                                        <SelectValue placeholder="Select candidate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {candidates.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-900  tracking-wide">Job Position *</label>
                                <Select value={data.job_post_id ? data.job_post_id.toString() : ""} onValueChange={(val) => setData("job_post_id", val)}>
                                    <SelectTrigger className="w-full bg-white border-slate-200 h-9 rounded-sm font-medium text-slate-700 px-3">
                                        <SelectValue placeholder="Select job" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jobs.map(j => (
                                            <SelectItem key={j.id} value={j.id.toString()}>{j.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-900  tracking-wide">Interview Stage *</label>
                                <Select value={data.interview_type} onValueChange={(val) => setData("interview_type", val)}>
                                    <SelectTrigger className="w-full bg-white border-slate-200 h-9 rounded-sm font-medium text-slate-700 px-3">
                                        <SelectValue placeholder="HR Interview" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HR Interview">HR Interview</SelectItem>
                                        <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                                        <SelectItem value="Final Round">Final Round</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-900  tracking-wide">Meeting Type</label>
                                <Select value={data.meeting_type} onValueChange={(val) => {
                                    setData("meeting_type", val);
                                    setData("interview_mode", val === "FaceToFace" ? "offline" : "online");
                                }}>
                                    <SelectTrigger className="w-full bg-white border-slate-200 h-9 rounded-sm font-medium text-slate-700 px-3">
                                        <SelectValue placeholder="Google Meet" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Google Meet">Google Meet</SelectItem>
                                        <SelectItem value="Zoom">Zoom</SelectItem>
                                        <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                                        <SelectItem value="FaceToFace">Face to Face</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-900  tracking-wide">Date & Time *</label>
                                <input 
                                    type="datetime-local" 
                                    className="w-full bg-white border-slate-200 h-9 rounded-sm px-3 text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium"
                                    value={data.scheduled_at}
                                    onChange={e => setData("scheduled_at", e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-900  tracking-wide">Duration (min)</label>
                                <input 
                                    type="number" 
                                    placeholder="60"
                                    className="w-full bg-white border-slate-200 h-9 rounded-sm px-3 text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium"
                                    value={data.duration_minutes}
                                    onChange={e => setData("duration_minutes", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-900  tracking-wide">
                                {data.interview_mode === "online" ? "Meeting Link" : "Office Location"}
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input 
                                        type="text" 
                                        placeholder={data.interview_mode === "online" ? "https://meet.google.com/xxx-xxxx-xxx" : "Enter office address"}
                                        className="w-full bg-white border-slate-200 h-9 rounded-sm px-3 text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium"
                                        value={data.interview_mode === "online" ? data.video_link : data.location}
                                        onChange={e => data.interview_mode === "online" ? setData("video_link", e.target.value) : setData("location", e.target.value)}
                                    />
                                </div>
                                <div className="w-9 h-9 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-sm text-slate-400">
                                    {data.interview_mode === "online" ? <Video size={14} /> : <MapPin size={14} />}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-900  tracking-wide">Interviewers</label>
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    placeholder="Enter email"
                                    className="flex-1 bg-white border-slate-200 h-9 rounded-sm px-3 text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium"
                                    value={interviewerEmail}
                                    onChange={e => setInterviewerEmail(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addInterviewer())}
                                />
                                <button 
                                    type="button"
                                    onClick={addInterviewer}
                                    className="px-4 h-9 border border-slate-200 rounded-sm font-black text-xs text-slate-700 hover:bg-slate-50 transition-all "
                                >
                                    Add
                                </button>
                            </div>
                            {data.interviewers.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {data.interviewers.map(email => (
                                        <span key={email} className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-sm text-[10px] font-bold border border-indigo-100">
                                            {email}
                                            <button type="button" onClick={() => removeInterviewer(email)}>
                                                <X size={10} className="hover:text-rose-500" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-900  tracking-wide">Notes</label>
                            <textarea 
                                className="w-full bg-white border-slate-200 rounded-sm p-2 text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px] outline-none text-sm font-medium"
                                placeholder="..."
                                value={data.notes}
                                onChange={e => setData("notes", e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                            <button 
                                type="button"
                                onClick={() => setIsScheduling(false)}
                                className="px-5 py-2 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-all  tracking-widest"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-sm font-black text-[10px]  tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                            >
                                {processing ? "..." : "Schedule"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}

const StatCard = ({ icon, label, value, color }) => (
    <div className={cn(
        "bg-white p-5 rounded-sm border  flex items-center gap-5 transition-all hover:shadow-md group",
        color.includes('border') ? color : `border-slate-100`
    )}>
        <div className={cn(
            "w-12 h-12 flex items-center justify-center rounded-sm transition-transform group-hover:scale-105",
            color
        )}>
            {icon}
        </div>
        <div>
            <p className="text-xs font-black text-slate-400 tracking-widest mb-0.5">{label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
        </div>
    </div>
);

const InterviewCard = ({ interview, getStatusStyle, onDelete, onMarkCompleted }) => {
    const scheduledDate = new Date(interview.scheduled_at);
    
    return (
        <Link 
            href={route('admin.applications.show', interview.job_application_id)}
            className="block bg-white rounded-sm border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between transition-all hover:border-indigo-200 hover:shadow-md group cursor-pointer"
        >
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-sm bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] text-xl font-black">
                    {interview.job_application.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {interview.job_application.name}
                    </h3>
                    <p className="text-slate-400 text-sm font-bold mt-0.5">
                        {interview.job_application.job_post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 border border-slate-100">
                            {interview.interview_type}
                        </span>
                        <span className={cn(
                            "px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border",
                            interview.status === 'scheduled' ? "bg-blue-50 text-blue-600 border-blue-100" : 
                            interview.status === 'completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            "bg-rose-50 text-rose-600 border-rose-100"
                        )}>
                            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8 mt-4 md:mt-0">
                <div className="text-right">
                    <p className="text-sm font-black text-slate-800">
                        {scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                        {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-[10px] font-black text-slate-300 mt-0.5 uppercase tracking-wider">
                        {interview.duration_minutes} minutes
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {interview.interview_mode === "online" && interview.video_link && (
                        <a 
                            href={interview.video_link} 
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="p-3 bg-indigo-50 text-indigo-600 rounded-sm hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                            title="Start Meeting"
                        >
                            <Video size={16} />
                        </a>
                    )}
                    
                    {interview.status === "scheduled" && (
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onMarkCompleted(interview.id);
                            }}
                            className="p-3 bg-emerald-50 text-emerald-600 rounded-sm hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                            title="Mark Completed"
                        >
                            <CheckCircle2 size={16} />
                        </button>
                    )}

                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(interview.id);
                        }}
                        className="p-3 bg-rose-50 text-rose-500 rounded-sm hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                        title="Delete Interview"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </Link>
    );
};
