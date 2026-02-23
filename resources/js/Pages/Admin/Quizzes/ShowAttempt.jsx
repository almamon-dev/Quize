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

            <div className="min-h-screen bg-gray-50 -m-8 p-6 md:p-10">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Standard Admin Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold text-gray-900">
                                Assessment Review
                            </h1>
                            <p className="text-sm text-gray-500 font-medium">
                                Quiz:{" "}
                                <span className="text-gray-900">
                                    {attempt.quiz.title}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => window.history.back()}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back to List
                            </button>
                        </div>
                    </div>

                    {/* Summary Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                                    Candidate
                                </p>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {attempt.user?.name ?? attempt.name}
                                </h2>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center border border-purple-100">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                                    Score Index
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-900">
                                        {attempt.score}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        / {totalPossiblePoints}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
                                <span className="font-bold text-sm">
                                    {Math.round(scorePercentage)}%
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                                    Percentage
                                </p>
                                <p
                                    className={`text-sm font-bold ${scorePercentage >= 70 ? "text-emerald-600" : "text-amber-600"}`}
                                >
                                    {scorePercentage >= 70
                                        ? "Satisfactory"
                                        : "Requires Review"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Responses Analysis */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2">
                            <GraduationCap
                                className="text-gray-400"
                                size={20}
                            />
                            <h2 className="text-md font-bold text-gray-700 uppercase tracking-wider">
                                Analysis of Responses
                            </h2>
                        </div>

                        <div className="space-y-6 pb-20">
                            {attempt.quiz.questions.map((question, index) => {
                                const answer = attempt.answers.find(
                                    (a) => a.question_id === question.id,
                                );

                                return (
                                    <AnswerCard
                                        key={question.id}
                                        answer={answer}
                                        question={question}
                                        index={index}
                                    />
                                );
                            })}
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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-900 text-white flex items-center justify-center rounded text-[10px] font-bold italic">
                        Q{index + 1}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[2px]">
                        {qType.replace("_", " ")}
                    </span>
                </div>
                <div className="text-[10px] font-bold text-gray-500 bg-white px-2 py-1 rounded border border-gray-100 shadow-sm uppercase">
                    Weight: {question.points} PTS
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 leading-normal">
                    {isFillGap && answer ? (
                        <span>
                            {question.text.split("___").map((part, i, arr) => (
                                <React.Fragment key={i}>
                                    {part}
                                    {i < arr.length - 1 && (
                                        <span className="font-bold text-blue-600 border-b-2 border-blue-200 px-1 italic">
                                            {answer.user_answer || "___"}
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </span>
                    ) : (
                        question.text
                    )}
                </h3>

                {!isAnswered ? (
                    <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded text-center text-sm font-medium text-gray-400 italic">
                        Candidate did not provide a response.
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div
                            className={`p-4 rounded-lg border ${answer.is_correct ? "bg-emerald-50/50 border-emerald-100" : "bg-rose-50/50 border-rose-100"}`}
                        >
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 leading-none">
                                Submitted Response
                            </p>
                            {isMCQ ? (
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`p-1 rounded-full ${answer.option?.is_correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}
                                    >
                                        {answer.option?.is_correct ? (
                                            <CheckCircle2 size={12} />
                                        ) : (
                                            <XCircle size={12} />
                                        )}
                                    </div>
                                    <span
                                        className={`text-base font-bold ${answer.option?.is_correct ? "text-emerald-900" : "text-rose-900"}`}
                                    >
                                        {answer.option?.text ||
                                            "Selection Missing"}
                                    </span>
                                </div>
                            ) : (
                                <p
                                    className={`text-base font-bold italic ${answer.is_correct ? "text-emerald-900" : "text-rose-900"}`}
                                >
                                    "{answer.user_answer}"
                                </p>
                            )}
                        </div>

                        {/* Reference / Solutions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(isText || isFillGap) &&
                                question.correct_answer && (
                                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-2">
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <Award size={14} />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">
                                                Official Reference
                                            </p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-600 leading-relaxed border-l-2 border-gray-100 pl-3">
                                            {question.correct_answer}
                                        </p>
                                    </div>
                                )}

                            {isMCQ && (
                                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm md:col-span-2 space-y-3">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        Assessment Benchmarks
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {question.options.map((opt) => (
                                            <div
                                                key={opt.id}
                                                className={`px-4 py-2 rounded text-[11px] font-bold border transition-shadow ${
                                                    opt.is_correct
                                                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                                                        : answer?.option_id ===
                                                            opt.id
                                                          ? "bg-rose-50/80 border-rose-200 text-rose-900"
                                                          : "bg-gray-50 border-gray-100 text-gray-400"
                                                }`}
                                            >
                                                {opt.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Manual Grading Section */}
                        {isText && (
                            <form
                                onSubmit={handleGrade}
                                className="mt-8 pt-8 border-t border-gray-100 space-y-6"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest leading-none">
                                            Evaluation Matrix
                                        </h4>
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            Verify validity and provide
                                            candidate feedback
                                        </p>
                                    </div>
                                    <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData({
                                                    ...data,
                                                    is_correct: true,
                                                    marks_awarded:
                                                        question.points,
                                                })
                                            }
                                            className={`px-6 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${data.is_correct ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-blue-600"}`}
                                        >
                                            Validate
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData({
                                                    ...data,
                                                    is_correct: false,
                                                    marks_awarded: 0,
                                                })
                                            }
                                            className={`px-6 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${!data.is_correct ? "bg-rose-600 text-white shadow-sm" : "text-gray-500 hover:text-rose-600"}`}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute top-4 left-4 text-gray-300 pointer-events-none">
                                        <MessageSquare size={16} />
                                    </div>
                                    <textarea
                                        value={data.admin_feedback}
                                        onChange={(e) =>
                                            setData(
                                                "admin_feedback",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Add professional assessment commentary..."
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-4 pl-12 pr-4 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300 min-h-[120px] shadow-sm focus:bg-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-[2px] rounded-lg hover:bg-black transition-all disabled:opacity-50 shadow-md active:scale-[0.99]"
                                >
                                    {processing
                                        ? "Processing Finalization..."
                                        : "Authorize Evaluation"}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
