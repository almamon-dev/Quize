import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    GraduationCap,
    Clock,
    CheckCircle2,
    XCircle,
    Link2,
    Users,
} from "lucide-react";

export default function Index({ quizzes }) {
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this quiz?")) {
            router.delete(route("admin.quizzes.destroy", id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Quizzes" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Quizzes
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your interactive quizzes and questions.
                        </p>
                    </div>
                    <Link
                        href={route("admin.quizzes.create")}
                        className="inline-flex items-center px-4 py-2 bg-[#0a66c2] text-white rounded-lg hover:bg-[#084d91] transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Quiz
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <GraduationCap className="w-6 h-6 text-[#0a66c2]" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route(
                                                "admin.quizzes.edit",
                                                quiz.id,
                                            )}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(quiz.id)
                                            }
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {quiz.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                    {quiz.description ||
                                        "No description provided."}
                                </p>

                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                    <div className="flex items-center">
                                        <Clock className="w-3.5 h-3.5 mr-1" />
                                        {quiz.time_per_question}s / question
                                    </div>
                                    <div className="flex items-center">
                                        <GraduationCap className="w-3.5 h-3.5 mr-1" />
                                        {quiz.questions_count} Questions
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="w-3.5 h-3.5 mr-1" />
                                        {quiz.unique_attempts_count}{" "}
                                        Participants
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center">
                                    {quiz.is_published ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            Published
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            <XCircle className="w-3 h-3 mr-1" />
                                            Draft
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/q/${quiz.id}${quiz.token ? `?token=${quiz.token}` : ""}`;
                                            navigator.clipboard.writeText(url);
                                            alert(
                                                "Public link copied to clipboard!",
                                            );
                                        }}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                        title="Copy Public Link"
                                    >
                                        <Link2 className="w-4 h-4" />
                                    </button>
                                    <Link
                                        href={route(
                                            "admin.quizzes.edit",
                                            quiz.id,
                                        )}
                                        className="text-sm font-semibold text-[#0a66c2] hover:underline"
                                    >
                                        Manage
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {quizzes.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">
                                No quizzes yet
                            </h3>
                            <p className="text-gray-500 mt-1">
                                Get started by creating your first quiz.
                            </p>
                            <Link
                                href={route("admin.quizzes.create")}
                                className="mt-4 inline-flex items-center text-[#0a66c2] font-semibold hover:underline"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Create Quiz
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
