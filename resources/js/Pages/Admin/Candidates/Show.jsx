import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import {
    Mail, Phone, Calendar, Download, MessageSquare, Send, CheckCircle,
    Clock, DollarSign, X, Award, GraduationCap, ExternalLink, Link2, 
    Copy, ChevronRight, CheckCircle2, Activity, User, FileText, Globe, XCircle
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Show({
    application,
    templates,
    quizAttempt = null,
    jobQuiz = null,
}) {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const statusForm = useForm({ status: application.status });
    const emailForm = useForm({ subject: "", body: "" });

    const statusMap = { 'applied': 0, 'shortlisted': 1, 'quiz': 2, 'interview': 3, 'technical_test': 4, 'hired': 5 };
    const isRejected = (statusForm.data.status || application.status) === 'rejected';
    
    let currentStageIndex = statusMap[statusForm.data.status || application.status];
    
    // Auto-advance if quiz attempt exists or handle fallback for rejected
    if (currentStageIndex === undefined) {
        currentStageIndex = quizAttempt ? 2 : (isRejected ? 1 : 0);
    } else if (quizAttempt && currentStageIndex < 2) {
        currentStageIndex = 2;
    }

    const totalPossiblePoints = quizAttempt?.answers?.reduce((sum, a) => sum + (parseFloat(a.question?.points) || 0), 0) || 0;
    const accuracy = totalPossiblePoints > 0 ? (quizAttempt.score / totalPossiblePoints) * 100 : 0;

    return (
        <AdminLayout>
            <Head title={`${application.name} | Candidate Profile`} />

            <div className="min-h-screen bg-[#F8FAFC]">
                {/* Top Action Bar */}
                <div className=" px-8 py-4 flex items-center justify-between z-30">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                            <User size={20} />
                        </div>
                        <nav className="text-sm font-medium text-slate-400 flex gap-2">
                            <span>Applications</span>
                            <span>/</span>
                            <span className="text-slate-900">{application.name}</span>
                        </nav>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsEmailModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 transition-all"
                        >
                            <Send size={16} /> Email
                        </button>
                        <Select
                            value={statusForm.data.status}
                            onValueChange={(val) => {
                                statusForm.setData("status", val);
                                router.post(route("admin.applications.status", application.id), { status: val });
                            }}
                        >
                            <SelectTrigger className="w-[160px] bg-indigo-600 text-white border-none h-10 font-bold text-xs uppercase tracking-wider focus:ring-0 hover:bg-indigo-600 hover:text-white transition-none">
                                <SelectValue placeholder="Set Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="applied">Applied</SelectItem>
                                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                <SelectItem value="quiz">Quiz</SelectItem>
                                <SelectItem value="interview">Interview</SelectItem>
                                <SelectItem value="technical_test">Assessment</SelectItem>
                                <SelectItem value="hired">Hired</SelectItem>
                                <SelectItem value="rejected" className="text-rose-600 font-bold">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto p-6 grid grid-cols-12 gap-6">
                    
                    {/* Left Column: Profile Card & Progress */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        
                        {/* Status Stepper Card */}
                        <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm relative">
                            <div className="relative flex justify-between items-center max-w-4xl mx-auto">
                                {/* Connecting Lines Base */}
                                <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-100 z-0">
                                    <div 
                                        className="h-full bg-green-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,197,94,0.3)]" 
                                        style={{ 
                                            width: `${(currentStageIndex / 5) * 100}%`,
                                            backgroundColor: isRejected ? '#F43F5E' : '#22C55E' 
                                        }} 
                                    />
                                </div>

                                {[
                                    { id: '1', label: 'Applied' },
                                    { id: '2', label: 'Shortlist' },
                                    { id: '3', label: 'Quiz' },
                                    { id: '4', label: 'Interview' },
                                    { id: '5', label: 'Technical' },
                                    { id: '6', label: 'Hired' }
                                ].map((step, idx) => {
                                    const isDone = idx < currentStageIndex;
                                    const isCurrent = idx === currentStageIndex;
                                    const isStepFailed = isRejected && isCurrent;

                                    return (
                                        <div key={idx} className="relative z-10 flex flex-col items-center group">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                                                isDone ? "bg-green-500 border-green-500 shadow-lg shadow-green-100" :
                                                isCurrent ? "bg-white border-green-500 text-green-600 ring-4 ring-green-50" :
                                                "bg-white border-slate-200 text-slate-400",
                                                isStepFailed && "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100 ring-rose-50"
                                            )}>
                                                {isStepFailed ? <XCircle size={20} className="text-white" /> : (isDone ? <CheckCircle2 size={20} className="text-white" /> : <span className="text-sm font-bold">{idx + 1}</span>)}
                                            </div>
                                            <span className={cn(
                                                "mt-3 text-[10px] font-bold uppercase tracking-widest text-center min-w-[60px]",
                                                isCurrent ? (isStepFailed ? "text-rose-600" : "text-green-600") : "text-slate-400"
                                            )}>{step.label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        { /* quize result */}
                        <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText size={18} className="text-slate-400" />
                                    <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Assessment Result</h3>
                                </div>
                                {quizAttempt && (
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Marks Obtained</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-black text-indigo-600">{quizAttempt.score}</span>
                                                <span className="text-xs font-bold text-slate-400">/ {totalPossiblePoints}</span>
                                            </div>
                                        </div>
                                        <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />
                                        <div className="text-right hidden md:block">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Accuracy</p>
                                            <p className="text-lg font-black text-slate-700">{Math.round(accuracy)}%</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                {quizAttempt ? (
                                    <div className="space-y-6">
                                        {/* Quiz Meta Brief */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-slate-100">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assessment Name</p>
                                                <p className="text-sm font-bold text-slate-700 leading-tight">{quizAttempt.quiz.title}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Spent</p>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {quizAttempt.started_at && quizAttempt.completed_at 
                                                        ? `${Math.round((new Date(quizAttempt.completed_at) - new Date(quizAttempt.started_at)) / 60000)} Mins`
                                                        : "Unknown"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {quizAttempt.completed_at ? new Date(quizAttempt.completed_at).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Results</p>
                                                <p className="text-sm font-bold text-indigo-600">
                                                    {quizAttempt.score} / {totalPossiblePoints} Marks
                                                </p>
                                                <p className="text-[9px] font-bold text-emerald-600 mt-0.5">
                                                    {quizAttempt.answers.filter(a => a.is_correct).length} / {quizAttempt.answers.length} Correct
                                                </p>
                                            </div>
                                        </div>

                                        {/* Detailed Q&A Breakdown */}
                                        <div className="space-y-3">
                                            {quizAttempt.answers.map((answer, i) => (
                                                <div key={answer.id} className="p-4 rounded-sm bg-white border border-slate-100 flex flex-col gap-3">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-start gap-4">
                                                            <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-sm bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                                                            <h4 
                                                                className="text-sm font-bold text-slate-800 leading-snug"
                                                                dangerouslySetInnerHTML={{ __html: answer.question.text }}
                                                            />
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            {answer.is_correct ? (
                                                                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-100">
                                                                    <CheckCircle2 size={14} />
                                                                    <span className="text-[9px] font-black uppercase tracking-widest">Correct</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2 py-1 rounded-sm border border-rose-100">
                                                                    <XCircle size={14} />
                                                                    <span className="text-[9px] font-black uppercase tracking-widest">Incorrect</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
                                                        <div className={cn(
                                                            "p-3 rounded-sm border",
                                                            answer.is_correct ? "bg-emerald-50/30 border-emerald-100/50" : "bg-rose-50/30 border-rose-100/50"
                                                        )}>
                                                            <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">User Answer</p>
                                                            <p className={cn("text-xs font-bold", answer.is_correct ? "text-emerald-700" : "text-rose-700")}>
                                                                {answer.option?.text || answer.user_answer || "No Answer / Skipped"}
                                                            </p>
                                                        </div>

                                                        {!answer.is_correct && (
                                                            <div className="p-3 rounded-sm border bg-indigo-50/30 border-indigo-100/50">
                                                                <p className="text-[9px] font-black uppercase text-indigo-400 mb-1 tracking-widest">Correct Answer</p>
                                                                <p 
                                                                    className="text-xs font-bold text-indigo-700"
                                                                    dangerouslySetInnerHTML={{ __html: answer.question.type === 'mcq' ? (answer.question.options?.find(o => o.is_correct)?.text || "N/A") : (answer.question.correct_answer || "N/A") }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <GraduationCap size={24} className="text-slate-200" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400">No Assessment Record Found</p>
                                        <p className="text-xs text-slate-300 mt-1">Candidate has not yet completed the screening quiz.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information Sidebar */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        
                        {/* Quick Info Card */}
                        <div className="bg-white rounded-sm border border-slate-200 p-8 shadow-sm space-y-8">
                            <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                                <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-black">
                                    {application.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="font-black text-slate-900 text-xl leading-none">{application.name}</h2>
                                        {isRejected && (
                                            <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest border border-rose-100">
                                                Rejected
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-400 text-sm mt-1 font-medium">{application.job_post.title}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <SidebarItem icon={<Mail size={16}/>} label="Email Address" value={application.email} isLink href={`mailto:${application.email}`} />
                                <SidebarItem icon={<Phone size={16}/>} label="Phone Number" value={application.phone || "N/A"} />
                                <SidebarItem icon={<Calendar size={16}/>} label="Applied On" value={new Date(application.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} />
                             
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex flex-col gap-3">
                                {application.resume_path && (
                                    <a href={`/storage/${application.resume_path}`} target="_blank" className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
                                        <Download size={16} /> View Resume
                                    </a>
                                )}
                            </div>
                        </div>

                      

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Minimal Components for Professional Look
const SidebarItem = ({ icon, label, value, isLink, href }) => (
    <div className="flex gap-4">
        <div className="text-slate-300 mt-1">{icon}</div>
        <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            {isLink ? (
                <a href={href} className="text-sm font-bold text-indigo-600 hover:underline transition-all truncate block">{value}</a>
            ) : (
                <p className="text-sm font-bold text-slate-700">{value}</p>
            )}
        </div>
    </div>
);

const SmallLinkCard = ({ label, url, icon }) => (
    <a href={url} target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group">
        <div className="flex items-center gap-3">
            <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">{icon}</div>
            <span className="text-xs font-bold text-slate-600">{label}</span>
        </div>
        <ChevronRight size={14} className="text-slate-300" />
    </a>
);
