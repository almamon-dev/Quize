import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
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

const QuestionTypeSelect = ({ value, onChange }) => {
    const types = [
        {
            id: "mcq",
            label: "Multiple Choice",
            icon: List,
            color: "text-blue-500",
        },
        {
            id: "text",
            label: "Short Answer",
            icon: AlignLeft,
            color: "text-emerald-500",
        },
        {
            id: "fill_gap",
            label: "Fill in the Gap",
            icon: SquareSlash,
            color: "text-amber-500",
        },
    ];

    const activeType = types.find((t) => t.id === value) || types[0];

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Dropdown>
                <Dropdown.Trigger>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all shadow-sm group"
                    >
                        <activeType.icon
                            className={`w-3.5 h-3.5 ${activeType.color}`}
                        />
                        <span className="text-sm font-medium text-gray-700">
                            {activeType.label}
                        </span>
                        <ChevronDown className="w-3 h-3 text-gray-400 ml-1 group-hover:text-gray-600 transition-colors" />
                    </button>
                </Dropdown.Trigger>
                <Dropdown.Content
                    align="left"
                    width="48"
                    contentClasses="bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden p-1"
                >
                    {types.map((type) => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onChange(type.id);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                value === type.id
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <type.icon
                                className={`w-3.5 h-3.5 ${type.color}`}
                            />
                            <span>{type.label}</span>
                        </button>
                    ))}
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
};

export default function Edit({ quiz, jobPosts }) {
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
        title: quiz.title,
        description: quiz.description || "",
        time_per_question: quiz.time_per_question,
        is_published: !!quiz.is_published,
        questions: quiz.questions.map((q) => ({
            id: q.id,
            text: q.text,
            image: null,
            image_path: q.image_path,
            type: q.type,
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

    const addQuestion = () => {
        const newQuestions = [
            ...data.questions,
            {
                text: "",
                image: null,
                image_path: null,
                type: "mcq",
                points: 1,
                correct_answer: "",
                options: [
                    { text: "", is_correct: true },
                    { text: "", is_correct: false },
                    { text: "", is_correct: false },
                    { text: "", is_correct: false },
                ],
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
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Edit Quiz
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Update and refine your quiz content
                            </p>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-[#2D7EE9] rounded-lg hover:bg-[#1B66C9] disabled:opacity-50 transition-all shadow-sm"
                    >
                        {processing ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT SIDE: Questions */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Questions ({data.questions.length})
                            </h2>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAiModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all border border-purple-100"
                                >
                                    <Sparkles className="w-4 h-4 mr-1.5" />
                                    Generate with AI
                                </button>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#2D7EE9] bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                                >
                                    <Plus className="w-4 h-4 mr-1.5" />
                                    Add Question
                                </button>
                            </div>
                        </div>

                        {data.questions.map((question, qIndex) => (
                            <div
                                key={qIndex}
                                className={`bg-white rounded-xl border transition-all ${
                                    expandedQuestions.includes(qIndex)
                                        ? "border-[#2D7EE9] shadow-sm"
                                        : "border-gray-200"
                                } overflow-hidden`}
                            >
                                {/* Accordion Header */}
                                <div
                                    className="px-6 py-4 bg-gray-50 flex items-center justify-between cursor-pointer group"
                                    onClick={() =>
                                        setExpandedQuestions((prev) =>
                                            prev.includes(qIndex)
                                                ? prev.filter(
                                                      (i) => i !== qIndex,
                                                  )
                                                : [...prev, qIndex],
                                        )
                                    }
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <span className="text-sm font-medium text-gray-500">
                                            #{qIndex + 1}
                                        </span>
                                        {!expandedQuestions.includes(qIndex) ? (
                                            <p className="text-sm text-gray-700 truncate pr-4">
                                                {question.text || (
                                                    <span className="text-gray-400 italic">
                                                        No question text...
                                                    </span>
                                                )}
                                            </p>
                                        ) : (
                                            <QuestionTypeSelect
                                                value={question.type}
                                                onChange={(val) =>
                                                    updateQuestion(
                                                        qIndex,
                                                        "type",
                                                        val,
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            {expandedQuestions.includes(
                                                qIndex,
                                            ) && (
                                                <div className="flex items-center gap-2 mr-2">
                                                    <span className="text-sm text-gray-500">
                                                        Points
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={question.points}
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        onChange={(e) =>
                                                            updateQuestion(
                                                                qIndex,
                                                                "points",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-16 px-2 py-1 text-sm text-center bg-white border border-gray-200 rounded-md outline-none"
                                                    />
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeQuestion(qIndex);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-400 transition-transform ${expandedQuestions.includes(qIndex) ? "rotate-180" : ""}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Accordion Content */}
                                {expandedQuestions.includes(qIndex) && (
                                    <div className="p-6 space-y-6 border-t border-gray-200">
                                        {/* Question Text */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Question Text
                                            </label>
                                            <textarea
                                                value={question.text}
                                                onChange={(e) =>
                                                    updateQuestion(
                                                        qIndex,
                                                        "text",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    question.type === "fill_gap"
                                                        ? "Use ___ for gaps..."
                                                        : "Enter your question here..."
                                                }
                                                rows={3}
                                                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                            />
                                            {errors[
                                                `questions.${qIndex}.text`
                                            ] && (
                                                <p className="text-sm text-red-600">
                                                    {
                                                        errors[
                                                            `questions.${qIndex}.text`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Image Upload Row */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 block">
                                                Question Media (Optional)
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                `file-${qIndex}`,
                                                            )
                                                            .click()
                                                    }
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#2D7EE9] bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                                                >
                                                    <ImageIcon className="w-4 h-4 mr-1.5" />
                                                    {question.image ||
                                                    question.image_path
                                                        ? "Change File"
                                                        : "Upload File"}
                                                </button>
                                                <input
                                                    id={`file-${qIndex}`}
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        updateQuestion(
                                                            qIndex,
                                                            "image",
                                                            e.target.files[0],
                                                        )
                                                    }
                                                />
                                                {(question.image ||
                                                    question.image_path) && (
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={
                                                                question.image
                                                                    ? URL.createObjectURL(
                                                                          question.image,
                                                                      )
                                                                    : `/storage/${question.image_path}`
                                                            }
                                                            alt="Preview"
                                                            className="h-20 rounded-lg border border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                updateQuestion(
                                                                    qIndex,
                                                                    "image",
                                                                    null,
                                                                );
                                                                updateQuestion(
                                                                    qIndex,
                                                                    "image_path",
                                                                    null,
                                                                );
                                                            }}
                                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-sm"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Answer Section */}
                                        {(question.type === "text" ||
                                            question.type === "fill_gap") && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Correct Answer
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        question.correct_answer ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        updateQuestion(
                                                            qIndex,
                                                            "correct_answer",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Enter the correct answer"
                                                    className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                        )}

                                        {/* MCQ Options */}
                                        {question.type === "mcq" && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Answer Options
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            addOption(qIndex)
                                                        }
                                                        className="text-sm text-[#2D7EE9] hover:text-[#1B66C9] font-medium"
                                                    >
                                                        + Add Option
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {question.options.map(
                                                        (option, oIndex) => (
                                                            <div
                                                                key={oIndex}
                                                                className="flex items-center gap-3"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateOption(
                                                                            qIndex,
                                                                            oIndex,
                                                                            "is_correct",
                                                                            !option.is_correct,
                                                                        )
                                                                    }
                                                                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all ${
                                                                        option.is_correct
                                                                            ? "border-[#10B981] bg-[#10B981]"
                                                                            : "border-gray-300 hover:border-gray-400"
                                                                    }`}
                                                                >
                                                                    {option.is_correct && (
                                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                                    )}
                                                                </button>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        option.text
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateOption(
                                                                            qIndex,
                                                                            oIndex,
                                                                            "text",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder={`Option ${oIndex + 1}`}
                                                                    className="flex-1 px-4 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                                                />
                                                                {question
                                                                    .options
                                                                    .length >
                                                                    2 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeOption(
                                                                                qIndex,
                                                                                oIndex,
                                                                            )
                                                                        }
                                                                        className="p-1.5 text-gray-400 hover:text-red-500"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Question Button */}
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#2D7EE9] hover:text-[#2D7EE9] hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-3"
                        >
                            <div className="p-2.5 bg-white rounded-lg shadow-sm">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">
                                Add New Question
                            </span>
                        </button>
                    </div>

                    {/* RIGHT SIDE: Settings */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Quiz Settings
                                </h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Quiz Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g., Digital Marketing Fundamentals"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Associate with Job Post
                                    </label>
                                    <select
                                        value={data.job_post_id}
                                        onChange={(e) =>
                                            setData(
                                                "job_post_id",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value="">
                                            Select a Job (Optional)
                                        </option>
                                        {jobPosts?.map((job) => (
                                            <option key={job.id} value={job.id}>
                                                {job.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.job_post_id && (
                                        <p className="text-sm text-red-600">
                                            {errors.job_post_id}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        rows={3}
                                        className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                        placeholder="Describe what this quiz is about..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Total Duration (min)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.time_per_question}
                                            onChange={(e) =>
                                                setData(
                                                    "time_per_question",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Visibility
                                        </label>
                                        <div className="flex items-center h-[42px] px-4 border border-gray-200 rounded-lg bg-white">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={data.is_published}
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_published",
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#2D7EE9] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                                                <span className="ml-3 text-sm text-gray-600">
                                                    {data.is_published
                                                        ? "Public"
                                                        : "Draft"}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-4">
                                Quiz Summary
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Total Questions:
                                    </span>
                                    <span className="text-lg font-semibold text-gray-900">
                                        {data.questions.length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Total Points:
                                    </span>
                                    <span className="text-lg font-semibold text-[#2D7EE9]">
                                        {data.questions.reduce(
                                            (acc, q) =>
                                                acc + (Number(q.points) || 0),
                                            0,
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Quiz Duration:
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg font-semibold text-gray-900">
                                            {data.time_per_question || 0}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            min
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* AI Generation Modal */}
            {isAiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-purple-50/30">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Generate Questions
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsAiModalOpen(false)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Topic / Subject
                                </label>
                                <input
                                    type="text"
                                    value={aiConfig.topic}
                                    onChange={(e) =>
                                        setAiConfig({
                                            ...aiConfig,
                                            topic: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., World War II, React Basics, General Knowledge"
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Question Count
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={aiConfig.count}
                                        onChange={(e) =>
                                            setAiConfig({
                                                ...aiConfig,
                                                count: parseInt(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Question Type
                                    </label>
                                    <select
                                        value={aiConfig.type}
                                        onChange={(e) =>
                                            setAiConfig({
                                                ...aiConfig,
                                                type: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none bg-white"
                                    >
                                        <option value="mcq">
                                            Multiple Choice
                                        </option>
                                        <option value="text">
                                            Short Answer
                                        </option>
                                        <option value="fill_gap">
                                            Fill in the Gap
                                        </option>
                                        <option value="combined">
                                            Combined (Random Mix)
                                        </option>
                                    </select>
                                </div>
                            </div>
                            {aiError && (
                                <p className="text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 italic">
                                    {aiError}
                                </p>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setIsAiModalOpen(false)}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isGenerating || !aiConfig.topic}
                                onClick={handleAiGenerate}
                                className="flex-2 px-6 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Magic Generate
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
