import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Award,
    User,
    Clock,
    CheckCircle2,
    AlertCircle,
    Eye,
} from "lucide-react";

export default function Results({ attempts }) {
    return (
        <AdminLayout>
            <Head title="Quiz Results" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quiz Results
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Monitor user performance and grade subjective answers.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Quiz
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {attempts.map((attempt) => (
                                    <tr
                                        key={attempt.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0a66c2]">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {attempt.user?.name ??
                                                            attempt.name ??
                                                            "Guest User"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {attempt.user?.email ??
                                                            attempt.email ??
                                                            "No email provided"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-700">
                                                {attempt.quiz.title}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <Award className="w-4 h-4 text-amber-500" />
                                                <span className="text-sm font-bold text-gray-900">
                                                    {attempt.score} pts
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {attempt.status === "completed" ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    In Progress
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(
                                                attempt.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={route(
                                                    "admin.quizzes.attempts.show",
                                                    attempt.id,
                                                )}
                                                className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-[#0a66c2] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                                View & Grade
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {attempts.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-gray-500 italic"
                                        >
                                            No quiz attempts recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
