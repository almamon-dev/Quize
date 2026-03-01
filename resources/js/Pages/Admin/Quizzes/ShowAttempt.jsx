import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    User,
    GraduationCap,
    Award,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronLeft,
    Activity,
    MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShowAttempt({ attempt }) {
    const totalPossiblePoints = attempt.quiz.questions.reduce(
        (sum, q) => sum + q.points,
        0,
    );
    const scorePercentage = (attempt.score / totalPossiblePoints) * 100;

    return (
        <AdminLayout>
            <Head
                title={`Attempt Review: ${attempt.user?.name ?? attempt.name}`}
            />

            <div className="min-h-screen bg-[#F8FAFC]">
                {/* Top Action Bar */}
                <div className="px-8 py-4 flex items-center justify-between z-30">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                            <Activity size={20} />
                        </div>
                        <nav className="text-sm font-medium text-slate-400 flex gap-2">
                            <span>Assessments</span>
                            <span>/</span>
                            <span className="text-slate-900">{attempt.quiz.title} Review</span>
                        </nav>
                    </div>
                    
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                </div>

                <div className="max-w-8xl mx-auto p-6 space-y-6">
                    {/* Compact Header Summary Area */}
                    <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
                        <div className="grid grid-cols-12 divide-x divide-slate-100">
                            <div className="col-span-12 lg:col-span-6 p-6 flex items-center gap-5">
                                <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-white text-lg font-bold">
                                    {(attempt.user?.name ?? attempt.name).charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-xl font-bold text-slate-900 truncate tracking-tight">
                                        {attempt.user?.name ?? attempt.name}
                                    </h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 uppercase tracking-wider">
                                            <GraduationCap size={14} /> {attempt.quiz.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-span-6 lg:col-span-2 p-5 flex flex-col justify-center text-center sm:text-left">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                <span className={cn(
                                    "inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold",
                                    scorePercentage >= 70 ? "text-emerald-700" : "text-amber-700"
                                )}>
                                    <div className={cn("w-1.5 h-1.5 rounded-full", scorePercentage >= 70 ? "bg-emerald-600" : "bg-amber-600")} />
                                    {scorePercentage >= 70 ? "Verified" : "Low Score"}
                                </span>
                            </div>

                            <div className="col-span-3 lg:col-span-2 p-5 flex flex-col justify-center border-l lg:border-l-0">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Score</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-bold text-slate-900">{attempt.score}</span>
                                    <span className="text-xs font-medium text-slate-500">/ {totalPossiblePoints}</span>
                                </div>
                            </div>

                            <div className="col-span-3 lg:col-span-2 p-5 flex flex-col justify-center">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Accuracy</p>
                                <span className="text-lg font-bold text-indigo-700">{Math.round(scorePercentage)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Streamlined Response Analysis */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Activity className="text-slate-500" size={14} />
                            <h2 className="font-bold text-slate-600 uppercase text-[10px] tracking-widest">Submission Breakdown</h2>
                        </div>

                        <div className="max-w-8xl grid grid-cols-1 lg:grid-cols-2 gap-4 pb-20">
                            {[0, 1].map((colIndex) => (
                                <div key={colIndex} className="space-y-4">
                                    {attempt.quiz.questions
                                        .filter((_, i) => i % 2 === colIndex)
                                        .map((question) => {
                                            const originalIndex = attempt.quiz.questions.findIndex(q => q.id === question.id);
                                            const answer = attempt.answers.find(
                                                (a) => a.question_id === question.id,
                                            );
                                            return (
                                                <AnswerCard
                                                    key={question.id}
                                                    answer={answer}
                                                    question={question}
                                                    index={originalIndex}
                                                    attempt={attempt}
                                                />
                                            );
                                        })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function AnswerCard({ answer, question, index }) {
    const { data, setData, post, processing } = useForm({
        is_correct: answer?.is_correct ?? false,
        marks_awarded: answer?.marks_awarded ?? 0,
        admin_feedback: answer?.admin_feedback || "",
    });

    const handleGrade = (e) => {
        e.preventDefault();
        if (!answer) return;
        post(route("admin.quizzes.answers.grade", answer.id), {
            preserveScroll: true,
        });
    };

    const qType = question.type;
    const isMCQ = qType === "mcq";
    const isFillGap = qType === "fill_gap";
    const isText = qType === "text";
    const isAnswered = !!answer;

    return (
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden group">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="w-6 h-6 bg-slate-800 text-white flex items-center justify-center rounded-sm text-[10px] font-bold">
                        {index + 1}
                    </span>
                    <h3 
                        className="text-sm font-semibold text-slate-800 tracking-tight truncate max-w-md"
                        dangerouslySetInnerHTML={{ __html: question.text.length > 80 ? question.text.substring(0, 80) + "..." : question.text }}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{qType.replace("_", " ")}</span>
                    <div className="h-3 w-[1px] bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{question.points} PTS</span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Compact Question Text Area (if long) */}
                {question.text.length > 80 && (
                    <div 
                        className="text-sm font-medium text-slate-700 leading-relaxed border-l-2 border-slate-200 pl-4 py-1 prose prose-slate prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: question.text }}
                    />
                )}

                {isFillGap && answer && (
                    <p className="text-sm font-semibold text-slate-900 italic">
                        {question.text.split("___").map((part, i, arr) => (
                            <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                    <span className="font-bold text-indigo-600 border-b border-indigo-200 px-1 mx-1">
                                        {answer.user_answer || "___"}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </p>
                )}

                {!isAnswered ? (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-sm text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        No Submission Provided
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Candidate Answer Box */}
                            <div className="flex-1 min-w-0">
                                <div className={cn(
                                    "p-3 rounded-sm border flex items-center gap-3 justify-between transition-all duration-300",
                                    answer.is_correct ? "bg-emerald-50/20 border-emerald-100/50" : "bg-rose-50/20 border-rose-100/50"
                                )}>
                                    <div className="flex items-center gap-4 truncate">
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                                            answer.is_correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                                        )}>
                                            {answer.is_correct ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                        </div>
                                        <div className="truncate">
                                            <p className="text-[9px] font-bold uppercase text-slate-500 mb-0.5 tracking-wider">Candidate Choice</p>
                                            {isText ? (
                                                <div 
                                                    className={cn(
                                                        "text-sm font-medium prose prose-sm max-w-none prose-p:m-0",
                                                        answer.is_correct ? "text-emerald-900 prose-p:text-emerald-900" : "text-rose-900 prose-p:text-rose-900"
                                                    )}
                                                    dangerouslySetInnerHTML={{ __html: answer.user_answer }}
                                                />
                                            ) : (
                                                <p className={cn(
                                                    "text-sm font-bold truncate",
                                                    answer.is_correct ? "text-emerald-900" : "text-rose-900"
                                                )}>
                                                    {isMCQ ? (answer.option?.text || "Missing Data") : `"${answer.user_answer}"`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider",
                                        answer.is_correct ? "text-emerald-700" : "text-rose-700"
                                    )}>
                                        {answer.is_correct ? "PASS" : "FAIL"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Integrated Benchmark Area */}
                        <div className="flex flex-col gap-3">
                            {(isText || isFillGap) && question.correct_answer && (
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-sm border border-slate-100">
                                    <Award size={14} className="text-indigo-500 mt-0.5" />
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Standard Benchmark</p>
                                        <div 
                                            className="text-xs font-medium text-slate-700 leading-snug prose prose-slate prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: question.correct_answer }}
                                        />
                                    </div>
                                </div>
                            )}

                            {isMCQ && (
                                <div className="space-y-2">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Options Matrix</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                        {question.options.map((opt) => (
                                            <div
                                                key={opt.id}
                                                className={cn(
                                                    "px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider border border-dashed transition-all",
                                                    opt.is_correct
                                                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                                        : answer?.option_id === opt.id
                                                            ? "bg-rose-50 border-rose-200 text-rose-800"
                                                            : "bg-white border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {opt.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Compact Evaluation Tool */}
                        {(isText || isFillGap) && (
                            <form onSubmit={handleGrade} className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex-1">
                                        <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-1">Manual Evaluation</h4>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Review text validity and assign final weight</p>
                                    </div>
                                    <div className="flex bg-slate-100 p-1 rounded-sm border border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => setData({ ...data, is_correct: true, marks_awarded: question.points })}
                                            className={cn(
                                                "px-6 py-2 rounded-sm text-[9px] font-bold uppercase tracking-wider transition-all",
                                                data.is_correct ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                                            )}
                                        >
                                            Validate
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData({ ...data, is_correct: false, marks_awarded: 0 })}
                                            className={cn(
                                                "px-6 py-2 rounded-sm text-[9px] font-bold uppercase tracking-wider transition-all",
                                                !data.is_correct ? "bg-rose-600 text-white shadow-sm" : "text-slate-500 hover:text-rose-600"
                                            )}
                                        >
                                            Invalidate
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <textarea
                                        value={data.admin_feedback}
                                        onChange={(e) => setData("admin_feedback", e.target.value)}
                                        placeholder="Add professional assessment commentary..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-sm py-3 px-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-100 focus:border-slate-400 outline-none transition-all placeholder:text-slate-400 min-h-[80px]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-black transition-all disabled:opacity-50"
                                >
                                    {processing ? "Saving Evaluation..." : "Commit Evaluation"}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
