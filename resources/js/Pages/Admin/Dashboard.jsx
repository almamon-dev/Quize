import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Users,
    Briefcase,
    CheckCircle2,
    CheckSquare,
    TrendingUp,
    Video,
    Star,
    ArrowRight,
    Award
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard({ auth, metrics, pipeline, maxPipelineCount, recentCandidates, upcomingInterviews }) {
    const user = auth.user;

    const pipelineColors = [
        "bg-blue-500", // Applied
        "bg-indigo-500", // CV Sorted
        "bg-purple-500", // Quiz
        "bg-fuchsia-500", // Interview
        "bg-pink-500", // Assessment
        "bg-rose-500", // Negotiation
        "bg-emerald-500", // Hired
    ];

    const getStatusStyle = (status) => {
        const styles = {
            applied: "bg-blue-50 text-blue-700",
            cv_sorted: "bg-indigo-50 text-indigo-700",
            quiz: "bg-purple-50 text-purple-700",
            interview: "bg-fuchsia-50 text-fuchsia-700",
            assessment: "bg-pink-50 text-pink-700",
            negotiation: "bg-amber-50 text-amber-700",
            hired: "bg-emerald-50 text-emerald-700",
        };
        return styles[status] || "bg-slate-50 text-slate-700";
    };

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="space-y-6 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Welcome back! Here's your recruitment overview.
                        </p>
                    </div>
                    <div>
                        <Link 
                            href={route("admin.jobs.create")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest"
                        >
                            <Briefcase size={16} /> Post New Job
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title="Active Jobs" 
                        value={metrics?.active_jobs || 0} 
                        icon={<Briefcase className="w-5 h-5 text-indigo-600" />} 
                        bg="bg-indigo-50"
                        trend="12%"
                    />
                    <StatCard 
                        title="Total Applicants" 
                        value={metrics?.total_applicants || 0} 
                        icon={<Users className="w-5 h-5 text-purple-600" />} 
                        bg="bg-purple-50"
                        trend="8%"
                    />
                    <StatCard 
                        title="Shortlisted" 
                        value={metrics?.shortlisted || 0} 
                        icon={<CheckSquare className="w-5 h-5 text-emerald-600" />} 
                        bg="bg-emerald-50"
                        trend="5%"
                    />
                    <StatCard 
                        title="Total Hired" 
                        value={metrics?.total_hired || 0} 
                        icon={<CheckCircle2 className="w-5 h-5 text-amber-600" />} 
                        bg="bg-amber-50"
                        trend="3"
                    />
                </div>

                {/* Hiring Pipeline */}
                <div className="bg-white rounded-sm border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Hiring Pipeline</h2>
                            <p className="text-xs font-medium text-slate-500">Candidate flow across stages</p>
                        </div>
                        <Link href={route("admin.applications.index")} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                            View All <ArrowRight size={14}/>
                        </Link>
                    </div>
                    
                    <div className="relative pt-8 pb-4">
                        {/* Horizontal Connection Line */}
                        <div className="absolute top-12 left-[5%] right-[5%] h-px bg-slate-100 -z-10"></div>
                        
                        <div className="flex justify-between h-48">
                            {pipeline?.map((stage, index) => {
                                const fillPercentage = maxPipelineCount > 0 ? (stage.count / maxPipelineCount) * 100 : 0;
                                const colorClass = pipelineColors[index % pipelineColors.length];
                                
                                return (
                                    <div key={index} className="flex flex-col items-center justify-end flex-1 group h-full">
                                        {/* Count Bubble */}
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 mb-2 shadow-sm transition-transform group-hover:scale-110 shrink-0",
                                            colorClass
                                        )}>
                                            {stage.count}
                                        </div>
                                        
                                        {/* Dynamic Bar */}
                                        <div className="w-full px-2 h-24 sm:h-32 flex items-end justify-center shrink-0">
                                            <div 
                                                className={cn("w-full max-w-[80px] rounded-t-sm opacity-90 transition-all duration-700 ease-out flex-shrink-0 group-hover:opacity-100", colorClass)}
                                                style={{ height: `${Math.max(fillPercentage, 2)}%` }} // minimum 2% height so it shows if zero
                                            ></div>
                                        </div>
                                        
                                        {/* Label */}
                                        <div className="mt-3 text-[10px] sm:text-xs font-bold text-slate-500 text-center tracking-wide uppercase shrink-0">
                                            {stage.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Candidates */}
                    <div className="bg-white border border-slate-100 rounded-sm shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Recent Candidates</h3>
                                <p className="text-xs font-medium text-slate-500">Latest applications</p>
                            </div>
                            <Link href={route("admin.applications.index")} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                                View All <ArrowRight size={14}/>
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentCandidates?.length > 0 ? recentCandidates.map((candidate) => (
                                <div key={candidate.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-black shrink-0">
                                            {candidate.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">
                                                {candidate.name}
                                            </p>
                                            <p className="text-xs font-medium text-slate-500 truncate">
                                                {candidate.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        {candidate.ranking_score > 0 && (
                                            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                                                <Star className="w-3.5 h-3.5 fill-current" /> {candidate.ranking_score}%
                                            </div>
                                        )}
                                        <span className={cn(
                                            "inline-flex px-2 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider whitespace-nowrap",
                                            getStatusStyle(candidate.status)
                                        )}>
                                            {candidate.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500 text-center py-4">No candidates found.</p>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Interviews */}
                    <div className="bg-white border border-slate-100 rounded-sm shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Upcoming Interviews</h3>
                                <p className="text-xs font-medium text-slate-500">Scheduled sessions</p>
                            </div>
                            <Link href={route("admin.interviews.index")} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                                View All <ArrowRight size={14}/>
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {upcomingInterviews?.length > 0 ? upcomingInterviews.map((interview) => (
                                <div key={interview.id} className="flex items-start justify-between p-4 border border-slate-100 rounded-sm bg-slate-50/50">
                                    <div className="flex flex-col gap-2">
                                        <h4 className="text-sm font-bold text-slate-900">
                                            {interview.job_application?.name || "Unknown Candidate"}
                                        </h4>
                                        <span className="inline-flex max-w-max px-2 py-0.5 rounded-sm bg-purple-100 text-purple-700 text-[9px] font-bold uppercase tracking-widest">
                                            {interview.interview_type}
                                        </span>
                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                                            <span>📅 {new Date(interview.scheduled_at).toLocaleDateString()}</span>
                                            <span>⏰ {new Date(interview.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm shrink-0">
                                        {interview.interview_mode === 'video' ? (
                                            <Video className="w-3.5 h-3.5 text-indigo-600" />
                                        ) : (
                                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500 text-center py-4">No upcoming interviews scheduled.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon, bg, trend }) {
    return (
        <div className="bg-white p-5 rounded-sm border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-100 transition-colors">
            <div className="flex items-start justify-between mb-2 z-10 relative">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500 mb-1">{title}</span>
                    <span className="text-2xl font-black text-slate-900">{value}</span>
                </div>
                <div className={cn("w-10 h-10 rounded-sm flex items-center justify-center", bg)}>
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-600 z-10 relative cursor-default">
                    <TrendingUp size={14} className="stroke-[3]" />
                    <span>+{trend} vs last month</span>
                </div>
            )}
        </div>
    );
}
