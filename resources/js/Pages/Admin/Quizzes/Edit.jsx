import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";
import {
    Plus,
    Trash2,
    CheckCircle2,
    Circle,
    ArrowLeft,
    ChevronDown,
    List,
    AlignLeft,
    SquareSlash,
    Image as ImageIcon,
    X,
    Sparkles,
    Loader2,
} from "lucide-react";
import Dropdown from "@/Components/Dropdown";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Badge = ({ children, variant = "blue" }) => {
    const variants = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        yellow: "bg-amber-50 text-amber-600 border-amber-100",
        gray: "bg-gray-50 text-gray-600 border-gray-100",
    };

    return (
        <span
            className={`px-2.5 py-1 rounded-sm text-xs font-semibold border ${variants[variant]}`}
        >
            {children}
        </span>
    );
};

const QuestionTypeSelect = ({ value, onChange }) => {
    const types = [
        { id: "mcq", label: "MCQ", icon: List, color: "text-blue-600", bg: "bg-blue-50/50", border: "border-blue-100", active: "bg-blue-100/50 text-blue-700" },
        { id: "text", label: "Short Answer", icon: AlignLeft, color: "text-amber-600", bg: "bg-amber-50/50", border: "border-amber-100", active: "bg-amber-100/50 text-amber-700" },
        { id: "fill_gap", label: "Fill in the Gap", icon: SquareSlash, color: "text-purple-600", bg: "bg-purple-50/50", border: "border-purple-100", active: "bg-purple-100/50 text-purple-700" }
    ];
    const activeType = types.find(t => t.id === value) || types[0];
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Dropdown>
                <Dropdown.Trigger>
                    <button type="button" className={`flex items-center gap-1.5 px-2 py-1 border rounded transition-all shadow-sm group ${activeType.bg} ${activeType.border}`}>
                        <activeType.icon className={`w-3 h-3 ${activeType.color}`} />
                        <span className={`text-[11px] font-bold ${activeType.color}`}>{activeType.label}</span>
                        <ChevronDown className={`w-3 h-3 ${activeType.color} opacity-50 group-hover:opacity-100`} />
                    </button>
                </Dropdown.Trigger>
                <Dropdown.Content align="left" width="48" contentClasses="bg-white border border-gray-100 shadow-xl rounded-sm p-1">
                    {types.map(type => (
                        <button key={type.id} type="button" onClick={() => onChange(type.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-[11px] transition-all ${value === type.id ? type.active + " font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
                            <type.icon className={`w-3.5 h-3.5 ${type.color} shrink-0`} />
                            <span className="whitespace-nowrap">{type.label}</span>
                        </button>
                    ))}
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
};

const DifficultySelect = ({ value, onChange }) => {
    const levels = [
        { id: "easy", label: "Easy", color: "text-emerald-500", badge: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        { id: "medium", label: "Medium", color: "text-amber-500", badge: "bg-amber-50 text-amber-600 border-amber-100" },
        { id: "hard", label: "Hard", color: "text-rose-500", badge: "bg-rose-50 text-rose-600 border-rose-100" }
    ];
    const active = levels.find(l => l.id === value) || levels[1];
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Dropdown>
                <Dropdown.Trigger>
                    <button type="button" className={`flex items-center gap-1.5 px-2 py-1 border rounded transition-all shadow-sm group ${active.badge}`}>
                        <span className="text-[11px] font-bold">{active.label}</span>
                        <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                    </button>
                </Dropdown.Trigger>
                <Dropdown.Content align="left" width="40" contentClasses="bg-white border border-gray-100 shadow-xl rounded-sm p-1">
                    {levels.map(level => (
                        <button key={level.id} type="button" onClick={() => onChange(level.id)}
                            className={`w-full flex items-center px-3 py-2 rounded text-[11px] transition-all ${value === level.id ? "bg-gray-100 font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
                            <span className={`${level.color} text-[8px] mr-2`}>●</span>
                            <span className="whitespace-nowrap">{level.label}</span>
                        </button>
                    ))}
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
};

export default function Edit({ quiz, jobPosts, departments }) {
    const [expandedQuestions, setExpandedQuestions] = useState([0]);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiConfig, setAiConfig] = useState({
        topic: "",
        count: 5,
        type: "mcq",
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        job_post_id: quiz.job_post_id || "",
        department_id: quiz.department_id || "",
        title: quiz.title,
        description: quiz.description || "",
        time_limit: quiz.time_limit,
        type: quiz.type || "mcq",
        pass_percentage: quiz.pass_percentage,
        status: quiz.status || "draft",
        negative_marking: !!quiz.negative_marking,
        randomize_questions: !!quiz.randomize_questions,
        questions: quiz.questions.map((q) => ({
            id: q.id,
            text: q.text,
            image: null,
            image_path: q.image_path,
            type: q.type,
            difficulty: q.difficulty || "medium",
            points: q.points,
            correct_answer: q.correct_answer || "",
            options: q.options.map((o) => ({
                id: o.id,
                text: o.text,
                is_correct: !!o.is_correct,
            })),
        })),
    });

    const handleAiGenerate = async () => {
        setIsGenerating(true);
        setAiError(null);
        try {
            const response = await axios.post(
                "/admin/quizzes/generate-questions",
                aiConfig,
            );
            const newQuestions = response.data.questions.map((q) => ({
                ...q,
                id: null,
                difficulty: q.difficulty || "medium",
                points: q.points || 1,
                options: q.options || [],
                image: null,
                image_path: null,
            }));
            const updatedQuestions = [...data.questions, ...newQuestions];

            setData("questions", updatedQuestions);
            setIsAiModalOpen(false);
            // Expand all new questions
            const newIndices = Array.from(
                { length: updatedQuestions.length },
                (_, i) => i,
            );
            setExpandedQuestions(newIndices);
        } catch (error) {
            setAiError(
                error.response?.data?.error || "Failed to generate questions.",
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const addQuestion = (type = "mcq") => {
        const newQuestions = [
            ...data.questions,
            {
                text: "",
                image: null,
                image_path: null,
                type: type,
                difficulty: "medium",
                points: 1,
                correct_answer: "",
                options:
                    type === "mcq"
                        ? [
                              { text: "", is_correct: true },
                              { text: "", is_correct: false },
                              { text: "", is_correct: false },
                              { text: "", is_correct: false },
                          ]
                        : [],
            },
        ];
        setData("questions", newQuestions);
        setExpandedQuestions((prev) => [...prev, newQuestions.length - 1]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...data.questions];
        newQuestions.splice(index, 1);
        setData("questions", newQuestions);
        setExpandedQuestions((prev) =>
            prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
        );
    };

    const updateQuestion = (index, field, value) => {
        setData(
            "questions",
            data.questions.map((q, i) => {
                if (i !== index) return q;

                const updated = { ...q, [field]: value };

                if (
                    field === "type" &&
                    value === "mcq" &&
                    (!updated.options || updated.options.length === 0)
                ) {
                    updated.options = [
                        { text: "", is_correct: true },
                        { text: "", is_correct: false },
                        { text: "", is_correct: false },
                        { text: "", is_correct: false },
                    ];
                }
                return updated;
            }),
        );
    };

    const addOption = (qIndex) => {
        setData(
            "questions",
            data.questions.map((q, i) => {
                if (i !== qIndex) return q;
                return {
                    ...q,
                    options: [...q.options, { text: "", is_correct: false }],
                };
            }),
        );
    };

    const removeOption = (qIndex, oIndex) => {
        setData(
            "questions",
            data.questions.map((q, i) => {
                if (i !== qIndex) return q;
                const newOptions = [...q.options];
                newOptions.splice(oIndex, 1);
                return { ...q, options: newOptions };
            }),
        );
    };

    const updateOption = (qIndex, oIndex, field, value) => {
        setData(
            "questions",
            data.questions.map((q, i) => {
                if (i !== qIndex) return q;

                const newOptions = q.options.map((opt, idx) => {
                    if (field === "is_correct" && value === true) {
                        return { ...opt, is_correct: idx === oIndex };
                    }
                    if (idx === oIndex) {
                        return { ...opt, [field]: value };
                    }
                    return opt;
                });

                return { ...q, options: newOptions };
            }),
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.quizzes.update", quiz.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit Quiz: ${quiz.title}`} />

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
            >
                <div className="space-y-2 sm:space-y-3">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Quiz: {quiz.title}</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Update assessment details and questions</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 transition-all shadow-sm"
                            >
                                Back
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="px-4 py-1.5 sm:py-2 border-b border-gray-100 bg-gray-50/30 rounded-t-xl">
                            <h3 className="text-sm font-semibold text-gray-900">Quiz Configuration</h3>
                        </div>
                        
                        <div className="p-3 sm:p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                                <div className="space-y-1.5 lg:col-span-2">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Quiz Title *</label>
                                    <Input
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        className="h-9 sm:h-10 text-sm"
                                        placeholder="e.g. Digital Marketing Fundamentals"
                                    />
                                    {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
                                </div>

                                <div className="space-y-1.5 lg:col-span-1">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Department *</label>
                                    <Select value={data.department_id?.toString()} onValueChange={(val) => setData("department_id", val)}>
                                        <SelectTrigger className="h-9 sm:h-10">
                                            <SelectValue placeholder="Select Department">
                                                {departments?.find(d => d.id.toString() === data.department_id?.toString())?.name}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments?.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.department_id && <p className="text-xs text-red-600 font-medium mt-1">{errors.department_id}</p>}
                                </div>

                                <div className="space-y-1.5 lg:col-span-1">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Associate with Job Post</label>
                                    <Select value={data.job_post_id?.toString()} onValueChange={(val) => setData("job_post_id", val)}>
                                        <SelectTrigger className="h-9 sm:h-10">
                                            <SelectValue placeholder="Select a Job (Optional)">
                                                {jobPosts?.find(j => j.id.toString() === data.job_post_id?.toString())?.title}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jobPosts?.map((job) => (
                                                <SelectItem key={job.id} value={job.id.toString()}>{job.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.job_post_id && <p className="text-xs text-red-600 font-medium mt-1">{errors.job_post_id}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Time Limit (Min)</label>
                                    <Input
                                        type="number"
                                        value={data.time_limit}
                                        onChange={(e) => setData("time_limit", e.target.value)}
                                        className="h-9 sm:h-10 text-sm"
                                    />
                                    {errors.time_limit && <p className="text-xs text-red-600 font-medium mt-1">{errors.time_limit}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Pass Percentage (%)</label>
                                    <Input
                                        type="number"
                                        value={data.pass_percentage}
                                        onChange={(e) => setData("pass_percentage", e.target.value)}
                                        className="h-9 sm:h-10 text-sm"
                                        min="0"
                                        max="100"
                                    />
                                    {errors.pass_percentage && <p className="text-xs text-red-600 font-medium mt-1">{errors.pass_percentage}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Registration Status</label>
                                    <Select value={data.status} onValueChange={(val) => setData("status", val)}>
                                        <SelectTrigger className="h-9 sm:h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Quiz Type</label>
                                    <Select value={data.type} onValueChange={(val) => setData("type", val)}>
                                        <SelectTrigger className="h-9 sm:h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mcq">MCQ Only</SelectItem>
                                            <SelectItem value="mixed">Mixed Types</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5 lg:col-span-4">
                                    <label className="text-[12px] font-bold text-gray-700 ml-1">Quiz Description</label>
                                    <div className="quill-description-editor rounded-sm border border-gray-200 overflow-hidden bg-white">
                                        <ReactQuill 
                                            theme="snow"
                                            value={data.description || ""}
                                            onChange={(content, delta, source, editor) => {
                                                if (content !== data.description) {
                                                    setData("description", content);
                                                }
                                            }}
                                            placeholder="Write detailed instructions or a brief overview about this quiz..."
                                            modules={{
                                                toolbar: [
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                    ['link', 'clean']
                                                ],
                                            }}
                                            className="min-h-[120px] text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-4">
                        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-blue-600" />
                                Review & Meta
                            </h2>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-3.5 border border-gray-100 bg-gray-50/50 rounded-sm hover:bg-white hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-sm shadow-sm group-hover:bg-red-50 group-hover:border-red-100 transition-colors">
                                            <SquareSlash className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-none">Negative Marking</p>
                                            <p className="text-[10px] text-gray-500 mt-1">Deduct points for wrong answers</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer scale-90">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={data.negative_marking}
                                            onChange={(e) => setData("negative_marking", e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-3.5 border border-gray-100 bg-gray-50/50 rounded-sm hover:bg-white hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-sm shadow-sm group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                            <Sparkles className="w-5 h-5 text-gray-900" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-none">Randomize Questions</p>
                                            <p className="text-[10px] text-gray-500 mt-1">Shuffle order per student</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer scale-90">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={data.randomize_questions}
                                            onChange={(e) => setData("randomize_questions", e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Questions Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Questions ({data.questions.length})</h2>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => addQuestion("mcq")}
                                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-blue-600 bg-blue-50/50 border border-blue-100 rounded-sm hover:bg-blue-100/50 transition-all shadow-sm"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Add MCQ
                            </button>
                            <button
                                type="button"
                                onClick={() => addQuestion("fill_gap")}
                                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-purple-600 bg-purple-50/50 border border-purple-100 rounded-sm hover:bg-purple-100/50 transition-all shadow-sm"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Fill Gap
                            </button>
                            <button
                                type="button"
                                onClick={() => addQuestion("text")}
                                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-amber-600 bg-amber-50/50 border border-amber-100 rounded-sm hover:bg-amber-100/50 transition-all shadow-sm"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Short Answer
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAiModalOpen(true)}
                                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-sm hover:bg-slate-100 transition-all shadow-sm"
                            >
                                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                AI Generate
                            </button>
                        </div>
                    </div>

                    {/* Questions List */}
                    {errors.questions && (
                        <div className="bg-red-50 border border-red-100 p-3 rounded-sm">
                            <p className="text-xs text-red-600 font-bold">{errors.questions}</p>
                        </div>
                    )}
                    <div className="space-y-2">
                        {data.questions.map((question, qIndex) => (
                            <div key={qIndex} className="bg-white rounded-sm border border-gray-200 shadow-sm relative" style={{ zIndex: data.questions.length - qIndex }}>
                                <div className="px-3 py-1.5 sm:py-2 bg-white border-b border-gray-100 rounded-t-lg flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div className="w-6 h-6 flex items-center justify-center bg-gray-50 border border-gray-200 rounded text-[11px] font-bold text-gray-700">
                                            Q{qIndex + 1}
                                        </div>
                                        <QuestionTypeSelect value={question.type} onChange={(val) => updateQuestion(qIndex, "type", val)} />
                                        <DifficultySelect value={question.difficulty} onChange={(val) => updateQuestion(qIndex, "difficulty", val)} />
                                        <div className="flex items-center gap-1 px-1.5 bg-gray-50 border border-gray-200 rounded h-6.5">
                                            <span className="text-[10px] font-medium text-gray-500">Pts:</span>
                                            <input type="number" value={question.points} onChange={(e) => updateQuestion(qIndex, "points", e.target.value)} 
                                                className="w-8 bg-transparent border-none p-0 text-[11px] font-bold text-blue-600 focus:ring-0 text-center" />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all"
                                    >
                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>

                                <div className="p-4 space-y-4">
                                    <div className="space-y-2.5">
                                        <textarea
                                            value={question.text}
                                            onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                                            placeholder={question.type === "fill_gap" ? "e.g. The capital of France is ___." : "Type your question here..."}
                                            className="w-full px-4 py-3 text-sm bg-gray-50/30 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all min-h-[60px] font-medium resize-none"
                                        />
                                        {question.type === "fill_gap" && (
                                            <p className="text-[10px] text-purple-600 font-bold px-1 uppercase tracking-tight">
                                                Use ___ (3 underscores) for blanks
                                            </p>
                                        )}
                                    </div>

                                    {question.type === "mcq" ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center gap-2 group">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateOption(qIndex, oIndex, "is_correct", true)}
                                                        className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-sm border text-xs font-black transition-all shadow-sm ${
                                                            option.is_correct 
                                                                ? "bg-blue-600 border-blue-600 text-white shadow-blue-100" 
                                                                : "bg-white border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500"
                                                        }`}
                                                    >
                                                        {String.fromCharCode(65 + oIndex)}
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={option.text}
                                                        onChange={(e) => updateOption(qIndex, oIndex, "text", e.target.value)}
                                                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                                        className="flex-1 px-4 py-2 text-sm bg-white border border-gray-200 rounded-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">
                                                {question.type === "fill_gap" ? "Expected Answer" : "Sample/Model Answer"}
                                            </label>
                                            <div className="quill-short-answer-editor rounded-sm border border-gray-100 overflow-hidden bg-white">
                                                <ReactQuill 
                                                    theme="snow"
                                                    value={question.correct_answer || ""}
                                                    onChange={(content, delta, source, editor) => {
                                                        if (content !== question.correct_answer) {
                                                            updateQuestion(qIndex, "correct_answer", content);
                                                        }
                                                    }}
                                                    placeholder={question.type === "fill_gap" ? "Enter answer..." : "Write your model answer here..."}
                                                    modules={{
                                                        toolbar: [
                                                            ['bold', 'italic', 'underline'],
                                                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                            ['link', 'clean']
                                                        ],
                                                    }}
                                                    className="min-h-[100px] text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-4 sm:px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-sm transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 sm:px-8 py-2 text-sm font-medium text-white bg-[#2D7EE9] rounded-sm hover:bg-blue-600 transition-all shadow-md flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Quiz Changes"
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* AI Generation Modal */}
            {isAiModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-indigo-600" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">AI Generator</h3>
                            </div>
                            <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-md transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Quiz Topic</label>
                                <input
                                    type="text"
                                    value={aiConfig.topic}
                                    onChange={(e) => setAiConfig({ ...aiConfig, topic: e.target.value })}
                                    placeholder="e.g. JavaScript Closures, WWII History..."
                                    className="w-full px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Question Count</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={aiConfig.count}
                                        onChange={(e) => setAiConfig({ ...aiConfig, count: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</label>
                                    <select
                                        value={aiConfig.type}
                                        onChange={(e) => setAiConfig({ ...aiConfig, type: e.target.value })}
                                        className="w-full px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="mcq">MCQ Only</option>
                                        <option value="text">Short Answer</option>
                                        <option value="fill_gap">Fill in the Gap</option>
                                        <option value="combined">Combined (Mixed)</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 bottom-3.5 pointer-events-none" />
                                </div>
                            </div>
                            {aiError && (
                                <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100 flex items-center gap-2 font-bold">
                                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                                    {aiError}
                                </p>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
                            <button
                                onClick={() => setIsAiModalOpen(false)}
                                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-all"
                            >
                                CANCEL
                            </button>
                            <button
                                disabled={isGenerating || !aiConfig.topic}
                                onClick={handleAiGenerate}
                                className="px-6 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all uppercase tracking-widest"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        GENERATING...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        GENERATE NOW
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
