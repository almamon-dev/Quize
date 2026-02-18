import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    User,
    GraduationCap,
    Award,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronLeft,
} from "lucide-react";

export default function ShowAttempt({ attempt }) {
    return (
        <AdminLayout>
            <Head
                title={`Attempt: ${attempt.user?.name ?? attempt.name ?? "Guest"}`}
            />

            <div className="space-y-8 max-w-7xl mx-auto pb-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.history.back()}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                Assessment Review
                            </h1>
                            <p className="text-xs text-gray-500 font-medium">
                                Reviewing {attempt.user?.name ?? attempt.name}'s
                                performance
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Card - More Compact */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <User className="w-5 h-5 text-[#0a66c2]" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-black text-gray-400  tracking-widest">
                                Candidate
                            </p>
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {attempt.user?.name ?? attempt.name}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-black text-gray-400  tracking-widest">
                                Quiz
                            </p>
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {attempt.quiz.title}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Award className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400  tracking-widest">
                                Score
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                                {attempt.score} pts
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <Clock className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400  tracking-widest">
                                Time
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                                {new Date(
                                    attempt.created_at,
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Answers Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        Responses
                    </h2>

                    {attempt.quiz.questions.map((question, index) => {
                        const answer = attempt.answers.find(
                            (a) => a.question_id === question.id,
                        );

                        if (answer) {
                            return (
                                <AnswerCard
                                    key={answer.id}
                                    answer={answer}
                                    index={index}
                                />
                            );
                        }

                        return (
                            <div
                                key={question.id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition-all opacity-75"
                            >
                                <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 flex items-center justify-center bg-white rounded border border-gray-200 text-[10px] font-black text-gray-500">
                                            {index + 1}
                                        </span>
                                        <span className="text-[10px] font-black text-gray-400 tracking-[2px]">
                                            {question.type.replace("_", " ")}
                                        </span>
                                    </div>
                                    <div className="text-[10px] font-black text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                        Max: {question.points} pts
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-base font-bold text-gray-900 mb-3 leading-snug">
                                        {question.text}
                                    </h3>
                                    <div className="p-4 rounded-xl border-2 bg-gray-50 border-gray-200 text-gray-400 italic text-sm font-medium">
                                        User did not answer this question.
                                    </div>
                                    {question.correct_answer && (
                                        <div className="mt-4 p-3 rounded-xl bg-emerald-100/50 border border-emerald-200">
                                            <p className="text-[9px] font-black text-emerald-700 mb-1.5 tracking-widest">
                                                Official Reference:
                                            </p>
                                            <p className="text-sm font-bold text-emerald-900">
                                                {question.correct_answer}
                                            </p>
                                        </div>
                                    )}
                                    {question.type === "mcq" && (
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {question.options.map((opt) => (
                                                <div
                                                    key={opt.id}
                                                    className={`p-4 rounded-xl border-2 flex items-center justify-between ${opt.is_correct ? "bg-emerald-50 border-emerald-500 text-emerald-900" : "bg-white border-gray-100 text-gray-400"}`}
                                                >
                                                    <span className="font-bold">
                                                        {opt.text}
                                                    </span>
                                                    {opt.is_correct && (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}

function AnswerCard({ answer, index }) {
    const { data, setData, post, processing } = useForm({
        is_correct: answer.is_correct ?? false,
        marks_awarded: answer.marks_awarded,
        admin_feedback: answer.admin_feedback || "",
    });

    const handleGrade = (e) => {
        e.preventDefault();
        post(route("admin.quizzes.answers.grade", answer.id), {
            preserveScroll: true,
        });
    };

    const isMCQ = answer.question.type === "mcq";
    const isFillGap = answer.question.type === "fill_gap";
    const isText = answer.question.type === "text";

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition-all">
            <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-white rounded border border-gray-200 text-[10px] font-black text-gray-500">
                        {index + 1}
                    </span>
                    <span className="text-[10px] font-black text-gray-400  tracking-[2px]">
                        {answer.question.type.replace("_", " ")}
                    </span>
                </div>
                <div className="text-[10px] font-black text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                    Max: {answer.question.points} pts
                </div>
            </div>

            <div className="p-5 space-y-5">
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3 leading-snug">
                        {answer.question.type === "fill_gap" ? (
                            <span>
                                {answer.question.text
                                    .split("___")
                                    .map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && (
                                                <span className="inline-block px-3 py-1 bg-yellow-100 border-b-2 border-yellow-400 text-yellow-900 mx-1 rounded font-bold">
                                                    {answer.user_answer ||
                                                        "..."}
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))}
                            </span>
                        ) : (
                            answer.question.text
                        )}
                    </h3>

                    <div
                        className={`p-4 rounded-xl border-2 transition-all ${
                            answer.is_correct
                                ? "bg-emerald-50 border-emerald-200"
                                : answer.option_id || answer.user_answer
                                  ? "bg-rose-50 border-rose-200"
                                  : "bg-gray-50 border-gray-200"
                        }`}
                    >
                        {isMCQ ? (
                            <div className="flex items-center gap-3">
                                {answer.option ? (
                                    <>
                                        <div
                                            className={`p-1.5 rounded-full ${answer.option.is_correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}
                                        >
                                            {answer.option.is_correct ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : (
                                                <XCircle className="w-3.5 h-3.5" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-base font-bold ${answer.option.is_correct ? "text-emerald-900" : "text-rose-900"}`}
                                        >
                                            {answer.option.text}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-sm italic text-gray-400 font-medium">
                                        No answer selected
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <p
                                    className={`text-lg font-black ${answer.is_correct ? "text-emerald-900" : answer.user_answer ? "text-rose-900" : "text-gray-400"}`}
                                >
                                    {answer.user_answer || "No answer provided"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {isText && answer.question.correct_answer && (
                    <div className="p-3 rounded-xl bg-emerald-100/50 border border-emerald-200">
                        <p className="text-[9px] font-black text-emerald-700  mb-1.5 tracking-widest">
                            Official Reference:
                        </p>
                        <p className="text-sm font-bold text-emerald-900">
                            {answer.question.correct_answer}
                        </p>
                    </div>
                )}

                {isMCQ && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {answer.question.options.map((opt) => (
                            <div
                                key={opt.id}
                                className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                                    opt.is_correct
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/10"
                                        : answer.option_id === opt.id
                                          ? "bg-rose-50 border-rose-300 text-rose-900"
                                          : "bg-white border-gray-100 text-gray-400"
                                }`}
                            >
                                <span className="font-bold">{opt.text}</span>
                                {opt.is_correct ? (
                                    <div className="bg-emerald-500 p-1 rounded-full text-white">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                ) : null}
                                {!opt.is_correct &&
                                    answer.option_id === opt.id && (
                                        <div className="bg-rose-500 p-1 rounded-full text-white">
                                            <XCircle className="w-3 h-3" />
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Grading Form */}
                {isText && (
                    <form
                        onSubmit={handleGrade}
                        className="pt-6 border-t border-gray-100 space-y-4"
                    >
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-bold text-gray-700">
                                    Result:
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                is_correct: true,
                                                marks_awarded:
                                                    answer.question.points,
                                            })
                                        }
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${data.is_correct ? "bg-emerald-500 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                                    >
                                        Correct
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
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!data.is_correct ? "bg-red-500 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                                    >
                                        Incorrect
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="ml-auto px-5 py-2 text-xs font-black text-white bg-gray-900 rounded-lg hover:bg-black transition-all disabled:opacity-50 shadow-md  tracking-widest"
                            >
                                {processing ? "Saving..." : "Update Score"}
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400  tracking-widest ml-1">
                                Assessor Feedback
                            </label>
                            <textarea
                                value={data.admin_feedback}
                                onChange={(e) =>
                                    setData("admin_feedback", e.target.value)
                                }
                                placeholder="Add evaluation comments..."
                                rows={2}
                                className="w-full px-4 py-2 text-sm font-medium rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300 resize-none"
                            />
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
