import React, { useState, useEffect, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import {
    ChevronRight,
    ChevronLeft,
    Clock,
    Send,
    AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Take({ quiz }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [answers, setAnswers] = useState({});
    const [attemptId, setAttemptId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [visitor, setVisitor] = useState({ name: "", email: "", phone: "" });
    const [showRegistration, setShowRegistration] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const questions = useMemo(() => {
        let q = quiz.questions || [];
        if (quiz.randomize_questions) {
            const shuffled = [...q];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
        return q;
    }, [quiz]);
    const currentQuestion = questions[currentQuestionIndex];

    // Timer Logic: Fixed total time for the whole quiz
    useEffect(() => {
        let timer;
        if (attemptId && !isCompleted) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleFinish();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [attemptId, isCompleted]);

    // Anti-cheat: Auto-submit if user changes tabs or leaves the window
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && attemptId && !isCompleted && !isSubmitting) {
                // If they leave the tab, instantly submit and mark as completed
                handleFinish();
            }
        };

        const handleWindowBlur = () => {
            if (attemptId && !isCompleted && !isSubmitting) {
                // Also trigger if the window loses focus
                handleFinish();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleWindowBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleWindowBlur);
        };
    }, [attemptId, isCompleted, isSubmitting]);

    const handleStart = async (e) => {
        e.preventDefault();
        setLoginError(null);
        try {
            const response = await axios.post(
                route("quiz.attempt.start", quiz.id),
                visitor,
            );
            setAttemptId(response.data.attempt_id);
            // Treat the stored value as total quiz minutes
            const totalSeconds = (quiz.time_limit || 30) * 60;
            setTimeLeft(totalSeconds);
            setCurrentQuestionIndex(0);
        } catch (error) {
            setLoginError(
                error.response?.data?.error || "Something went wrong.",
            );
        }
    };

    const handleNext = async () => {
        const currentAnswer = answers[currentQuestion.id];
        if (currentAnswer && attemptId) {
            try {
                await axios.post(route("quiz.answer.submit"), {
                    quiz_attempt_id: attemptId,
                    question_id: currentQuestion.id,
                    ...currentAnswer,
                });
            } catch (error) {
                console.error(error);
            }
        }
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleFinish();
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleFinish = async () => {
        if (isSubmitting || isCompleted) return;
        setIsSubmitting(true);
        setIsCompleted(true);
        try {
            await axios.post(route("quiz.attempt.complete", attemptId));
            router.get(route("quiz.completed"));
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    //
    if (currentQuestionIndex === -1) {
        return (
            <div
                className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-no-repeat bg-cover bg-center font-sans overflow-x-hidden relative"
                style={{ backgroundImage: "url('/images/bg_0.png')" }}
            >
                <Head title="Quiz Start" />

                <div className="w-full max-w-[1000px] flex flex-col">
                    {/* Logo Section */}
                    <div className="mb-6 flex items-center justify-start">
                        <img src="/images/logo.png" alt="Logo" />
                    </div>

                    {/* Main White Container (Large Box) */}
                    <div className="w-full bg-white rounded-xl shadow-[0_30px_100px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col items-center relative min-h-[80vh] border border-white">
                        {/* Illustration Banner */}
                        <div className="w-full relative">
                            <img
                                src="/images/bg_1.jpg"
                                className="w-full h-auto object-contain"
                                alt="Banner Illustration"
                            />
                        </div>

                        {/* Floating Form Card Overlay */}
                        <div className="w-full max-w-[680px] bg-white rounded-lg shadow-[0_25px_60px_rgba(0,0,0,0.12)] px-12 py-8 -mt-12 mb-16 relative z-20 border border-gray-50/50 mx-4">
                            <div className="text-center mb-6">
                                <h1 className="text-[20px] font-black text-gray-900 mb-4 tracking-tighter leading-none">
                                    {quiz.title || "Exam"}
                                </h1>
                                <div className="flex items-center justify-center gap-2 text-base font-bold text-gray-900">
                                    <span>Total Time:</span>
                                    <span className="bg-[#DF3D41] text-white px-2.5 py-1 rounded text-xs font-black min-w-[50px] text-center shadow-sm">
                                        {parseFloat(
                                            quiz.time_limit || 30,
                                        ).toFixed(0)}
                                    </span>
                                    <span>minutes</span>
                                </div>
                            </div>

                            <div className="w-full">
                                {!showRegistration ? (
                                    <div className="w-full">
                                        <h2 className="text-2xl font-bold text-[#00D287] mb-6 border-b border-gray-100 pb-4">
                                            Exam Instructions
                                        </h2>
                                        
                                        {quiz.description ? (
                                            <div 
                                                className="prose prose-sm max-w-none prose-p:text-gray-600 prose-headings:text-gray-900 prose-a:text-[#00D287] mb-8"
                                                dangerouslySetInnerHTML={{ __html: quiz.description }}
                                            />
                                        ) : (
                                            <p className="text-gray-500 font-medium mb-8">
                                                No specific instructions provided. Please proceed when you are ready.
                                            </p>
                                        )}

                                        <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                                            <div className="text-sm font-bold text-gray-500">
                                                Passing Score: <span className="text-[#00D287]">{quiz.pass_percentage || 50}%</span>
                                            </div>
                                            <button
                                                onClick={() => setShowRegistration(true)}
                                                className="px-8 py-3 bg-[#00D287] text-black text-xs font-black rounded hover:bg-[#00bf74] transition-all uppercase tracking-widest shadow-lg shadow-[#00D287]/20 flex items-center gap-2"
                                            >
                                                Proceed <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <div className="flex items-center gap-4 mb-6">
                                            <button onClick={() => setShowRegistration(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                                <ChevronLeft size={20} />
                                            </button>
                                            <h2 className="text-2xl font-bold text-[#00D287]">
                                                Before We Get Started
                                            </h2>
                                        </div>

                                        <form
                                            onSubmit={handleStart}
                                            className="space-y-8"
                                        >
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-900 flex items-center gap-0.5">
                                                    Full name
                                                    <span className="text-[#DF3D41] font-bold">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Enter Your Name"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded focus:border-[#00D287] outline-none text-sm font-medium transition-colors placeholder:text-gray-300"
                                                    value={visitor.name}
                                                    onChange={(e) =>
                                                        setVisitor({
                                                            ...visitor,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-900 flex items-center gap-0.5">
                                                        Email
                                                        <span className="text-[#DF3D41] font-bold">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        placeholder="Enter Your Email"
                                                        className="w-full px-5 py-3 border border-gray-300 rounded focus:border-[#00D287] outline-none text-sm font-medium transition-colors placeholder:text-gray-300"
                                                        value={visitor.email}
                                                        onChange={(e) =>
                                                            setVisitor({
                                                                ...visitor,
                                                                email: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-900 flex items-center gap-0.5">
                                                        Phone number
                                                        <span className="text-[#DF3D41] font-bold">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        placeholder="Enter Your Phone"
                                                        className="w-full px-5 py-3 border border-gray-300 rounded focus:border-[#00D287] outline-none text-sm font-medium transition-colors placeholder:text-gray-300"
                                                        value={visitor.phone}
                                                        onChange={(e) =>
                                                            setVisitor({
                                                                ...visitor,
                                                                phone: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {loginError && (
                                                <div className="p-4 bg-red-50 text-red-600 text-sm rounded border border-red-100 flex items-center gap-3 font-bold">
                                                    <AlertCircle size={18} />{" "}
                                                    {loginError}
                                                </div>
                                            )}

                                            <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                                                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                    {questions.length} Questions Total
                                                </span>
                                                <button
                                                    type="submit"
                                                    className="px-10 py-3.5 bg-[#00D287] text-black text-xs font-black rounded hover:bg-[#00bf74] transition-all uppercase tracking-widest shadow-lg shadow-[#00D287]/20 flex items-center gap-2"
                                                >
                                                    START NOW <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- ৩. কুইজের মেইন প্রশ্ন পেজ (নতুন ডিজাইন অনুযায়ী) ---
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return { h, m, s };
    };

    const { h, m, s } = formatTime(timeLeft);

    return (
        <div
            className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-6 bg-no-repeat bg-cover bg-center font-sans overflow-x-hidden relative"
            style={{ backgroundImage: "url('/images/bg_0.png')" }}
        >
            <Head title={`Question ${currentQuestionIndex + 1}`} />

            <div className="w-full max-w-[1100px] flex flex-col">
                {/* Header: Logo and Timer */}
                <div className="mb-6 flex items-center justify-between">
                    <img src="/images/logo.png" alt="Logo" className="h-10" />

                    {/* Styled Timer Bubble */}
                    <div className="bg-[#00D287] rounded-full pl-4 pr-1 py-1 flex items-center gap-3 shadow-lg border-4 border-emerald-100/50">
                        <div className="flex items-center gap-2 text-black font-black text-xs uppercase tracking-tighter">
                            <Clock size={16} />
                            <span>Quiz Time start</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="bg-white rounded-lg px-2 py-1 flex flex-col items-center min-w-[35px]">
                                <span className="text-black font-black text-sm leading-tight">
                                    {h.toString().padStart(2, "0")}
                                </span>
                                <span className="text-[7px] font-bold text-gray-500 uppercase">
                                    hrs
                                </span>
                            </div>
                            <div className="bg-white rounded-lg px-2 py-1 flex flex-col items-center min-w-[35px]">
                                <span className="text-black font-black text-sm leading-tight">
                                    {m.toString().padStart(2, "0")}
                                </span>
                                <span className="text-[7px] font-bold text-gray-500 uppercase">
                                    min
                                </span>
                            </div>
                            <div className="bg-white rounded-lg px-2 py-1 flex flex-col items-center min-w-[35px]">
                                <span className="text-black font-black text-sm leading-tight">
                                    {s.toString().padStart(2, "0")}
                                </span>
                                <span className="text-[7px] font-bold text-gray-500 uppercase">
                                    sec
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Container */}
                <div className="w-full bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col relative border border-gray-100">
                    {/* Illustration Banner (Reduced height) */}
                    <div className="w-full relative h-32 md:h-40">
                        <img
                            src="/images/bg_1.jpg"
                            className="w-full h-full object-cover"
                            alt="Banner Illustration"
                        />
                    </div>

                    {/* Question Content Area (Minimal Space) */}
                    <div className="p-6 md:p-10 flex flex-col">
                        <div className="flex flex-col flex-1">
                            {/* Question Header Box (Minimal Space) */}
                            <div className="text-center mb-8 w-full border-y border-[#10F097]/10 py-6">
                                <span className="text-[#10F097] font-black text-lg mb-1 block">
                                    Question {currentQuestionIndex + 1}
                                </span>
                                <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight px-4">
                                    {currentQuestion.text}
                                </h2>
                            </div>

                            {/* Options / Input Field Area (Compact) */}
                            <div className="max-w-2xl mx-auto w-full mb-6">
                                {currentQuestion.type === "mcq" ? (
                                    <div className="flex flex-col gap-4">
                                        {currentQuestion.options.map(
                                            (option, index) => {
                                                const label =
                                                    String.fromCharCode(
                                                        65 + index,
                                                    ); // A, B, C, D
                                                const isSelected =
                                                    answers[currentQuestion.id]
                                                        ?.option_id ===
                                                    option.id;

                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() =>
                                                            setAnswers({
                                                                ...answers,
                                                                [currentQuestion.id]:
                                                                    {
                                                                        option_id:
                                                                            option.id,
                                                                    },
                                                            })
                                                        }
                                                        className={`w-full flex items-center p-2.5 rounded-lg border-2 transition-all group ${
                                                            isSelected
                                                                ? "border-[#10F097] bg-emerald-50/30"
                                                                : "border-gray-100/80 hover:border-gray-200 bg-white"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-10 h-10 flex items-center justify-center rounded-md font-black text-lg transition-all ${
                                                                isSelected
                                                                    ? "bg-[#10F097] text-white"
                                                                    : "bg-emerald-50 text-[#00D287]"
                                                            }`}
                                                        >
                                                            {label}
                                                        </div>
                                                        <span
                                                            className={`ml-5 font-bold text-lg md:text-xl ${
                                                                isSelected
                                                                    ? "text-gray-900"
                                                                    : "text-gray-600"
                                                            }`}
                                                        >
                                                            {option.text}
                                                        </span>
                                                    </button>
                                                );
                                            },
                                        )}
                                    </div>
                                ) : currentQuestion.type === "text" ? (
                                    <div className="relative quiz-answer-editor">
                                        <style dangerouslySetInnerHTML={{__html: `
                                            .quiz-answer-editor .ql-toolbar {
                                                border: none !important;
                                                border-bottom: 2px solid #f3f4f6 !important;
                                                padding: 12px 16px !important;
                                                background-color: #fafafa;
                                                border-radius: 12px 12px 0 0;
                                            }
                                            .quiz-answer-editor .ql-container {
                                                border: none !important;
                                                font-family: inherit !important;
                                                font-size: 1.125rem !important;
                                                min-height: 200px;
                                                border-radius: 0 0 12px 12px;
                                            }
                                            .quiz-answer-editor .ql-editor {
                                                min-height: 200px;
                                                padding: 20px !important;
                                            }
                                            .quiz-answer-editor .ql-editor.ql-blank::before {
                                                color: #d1d5db;
                                                font-style: normal;
                                                left: 20px;
                                            }
                                            .quiz-answer-editor .bg-white.rounded-xl {
                                                border-width: 2px;
                                                border-color: #f3f4f6;
                                                transition: all 0.2s;
                                            }
                                            .quiz-answer-editor .bg-white.rounded-xl:focus-within {
                                                border-color: #10F097;
                                                box-shadow: 0 0 0 4px rgba(16, 240, 151, 0.1);
                                            }
                                        `}} />
                                        <div className="bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-200">
                                            <ReactQuill 
                                                theme="snow"
                                                value={answers[currentQuestion.id]?.user_answer || ""}
                                                onChange={(content, delta, source, editor) => {
                                                    if (content !== answers[currentQuestion.id]?.user_answer) {
                                                        setAnswers({
                                                            ...answers,
                                                            [currentQuestion.id]: {
                                                                user_answer: content,
                                                            }
                                                        });
                                                    }
                                                }}
                                                placeholder="Type your answer here..."
                                                modules={{
                                                    toolbar: [
                                                        ['bold', 'italic', 'underline'],
                                                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                        ['clean']
                                                    ],
                                                }}
                                                className="text-lg font-medium text-gray-800"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative flex flex-col items-center">
                                        <input
                                            type="text"
                                            className="w-full max-w-lg text-center p-6 border-b-4 border-gray-200 bg-gray-50 focus:bg-white focus:border-[#10F097] outline-none text-2xl transition-all font-black placeholder:text-gray-300 placeholder:font-medium shadow-inner rounded-t-xl mx-auto"
                                            placeholder="Type your answer here..."
                                            value={
                                                answers[currentQuestion.id]
                                                    ?.user_answer || ""
                                            }
                                            onChange={(e) =>
                                                setAnswers({
                                                    ...answers,
                                                    [currentQuestion.id]: {
                                                        user_answer:
                                                            e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        {currentQuestion.type === "fill_gap" && (
                                            <p className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Please fill in the gap above
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Navigation */}
                        <div className="mt-8 flex justify-between items-center w-full">
                            <button
                                onClick={handleBack}
                                disabled={currentQuestionIndex === 0}
                                className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-xs transition-all ${
                                    currentQuestionIndex === 0
                                        ? "text-gray-300 cursor-not-allowed opacity-0"
                                        : "text-gray-500 hover:text-[#10F097]"
                                }`}
                            >
                                <ChevronLeft size={20} />
                                Back
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className="bg-[#10F097] text-white px-12 py-4 rounded font-black uppercase tracking-widest text-sm flex items-center gap-2 transition-all hover:bg-[#0be68d] shadow-lg shadow-emerald-200/50"
                            >
                                {currentQuestionIndex === questions.length - 1
                                    ? "Finish"
                                    : "Next"}
                                <ChevronRight size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
