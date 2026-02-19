import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Download,
    MessageSquare,
    Send,
    CheckCircle,
    Clock,
    ArrowRight,
    Loader2,
    FileText,
    DollarSign,
    Save,
    X,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Show({ application, templates }) {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const statusForm = useForm({
        status: application.status,
        comment: "",
    });

    const emailForm = useForm({
        subject: "",
        body: "",
    });

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        statusForm.post(route("admin.applications.status", application.id));
    };

    const handleEmailSend = (e) => {
        e.preventDefault();
        emailForm.post(route("admin.applications.email", application.id), {
            onSuccess: () => {
                setIsEmailModalOpen(false);
                emailForm.reset();
            },
        });
    };

    const selectTemplate = (template) => {
        let subject = template.subject;
        let body = template.body;

        // Replace placeholders (global replacement)
        const replacements = {
            "{candidate_name}": application.name,
            "{job_title}": application.job_post.title,
            "{company_name}": "Our Company", // Can be dynamic if company field exists
        };

        Object.keys(replacements).forEach((key) => {
            const val = replacements[key] || "";
            subject = subject.split(key).join(val);
            body = body.split(key).join(val);
        });

        emailForm.setData((data) => ({
            ...data,
            subject: subject,
            body: body,
        }));
    };

    return (
        <AdminLayout>
            <Head title={`Candidate: ${application.name}`} />

            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">
                            {application.name}
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">
                            Applying for{" "}
                            <span className="text-blue-600 font-bold">
                                {application.job_post.title}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEmailModalOpen(true)}
                            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-bold transition-all shadow-sm"
                        >
                            <Send size={16} className="text-blue-500" />
                            Send Email
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Candidate Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                                <User size={20} className="text-blue-500" />
                                Candidate Information
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs text-gray-400 font-black uppercase">
                                        Email Address
                                    </label>
                                    <div className="text-gray-900 font-bold flex items-center gap-2 mt-1">
                                        <Mail
                                            size={16}
                                            className="text-gray-400"
                                        />
                                        {application.email}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-black uppercase">
                                        Phone Number
                                    </label>
                                    <div className="text-gray-900 font-bold flex items-center gap-2 mt-1">
                                        <Phone
                                            size={16}
                                            className="text-gray-400"
                                        />
                                        {application.phone || "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-black uppercase">
                                        Expected Salary
                                    </label>
                                    <div className="text-gray-900 font-bold flex items-center gap-2 mt-1">
                                        <DollarSign
                                            size={16}
                                            className="text-gray-400"
                                        />
                                        {application.expected_salary || "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-black uppercase">
                                        Experience
                                    </label>
                                    <div className="text-gray-900 font-bold flex items-center gap-2 mt-1">
                                        <Clock
                                            size={16}
                                            className="text-gray-400"
                                        />
                                        {application.experience_years || "0"}{" "}
                                        Years
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50">
                                <label className="text-xs text-gray-400 font-black uppercase block mb-3">
                                    Cover Letter
                                </label>
                                <div className="p-4 bg-gray-50 rounded border border-gray-100 text-gray-700 whitespace-pre-wrap text-sm leading-relaxed italic">
                                    "
                                    {application.cover_letter ||
                                        "No cover letter provided."}
                                    "
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href={`/storage/${application.resume_path}`}
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 w-full p-4 border border-blue-200 bg-blue-50 text-blue-700 rounded font-bold uppercase tracking-widest text-xs hover:bg-blue-100 transition-all"
                                >
                                    <FileText size={18} />
                                    View Resume
                                    <Download size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Status History / Logs */}
                        <div className="bg-white rounded border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MessageSquare
                                    size={20}
                                    className="text-purple-500"
                                />
                                Activity & Status Logs
                            </h2>
                            <div className="space-y-4">
                                {application.logs.map((log) => (
                                    <div key={log.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                                <Clock size={16} />
                                            </div>
                                            <div className="w-0.5 h-full bg-gray-100 mt-1"></div>
                                        </div>
                                        <div className="pb-6 w-full">
                                            <div className="flex justify-between items-start">
                                                <div className="text-sm">
                                                    <span className="font-black text-gray-900 capitalize">
                                                        {log.from_status.replace(
                                                            "_",
                                                            " ",
                                                        )}
                                                    </span>
                                                    <ArrowRight
                                                        size={14}
                                                        className="inline mx-2 text-gray-400"
                                                    />
                                                    <span className="font-black text-blue-600 uppercase italic">
                                                        {log.to_status.replace(
                                                            "_",
                                                            " ",
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    {new Date(
                                                        log.created_at,
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                            {log.comment && (
                                                <div className="mt-2 text-sm text-gray-600 p-3 bg-gray-50/50 rounded-lg border border-gray-100 italic">
                                                    "{log.comment}"
                                                </div>
                                            )}
                                            <div className="mt-1 text-[10px] text-gray-400 font-medium">
                                                Updated by:{" "}
                                                {log.admin?.name || "System"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {application.logs.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-4 italic">
                                        No activity recorded yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded p-6 shadow-sm sticky top-6">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2 underline underline-offset-4 decoration-blue-500">
                                <CheckCircle
                                    size={18}
                                    className="text-blue-500"
                                />
                                Pipeline Stage
                            </h2>
                            <form
                                onSubmit={handleStatusUpdate}
                                className="space-y-4"
                            >
                                <div>
                                    <select
                                        value={statusForm.status}
                                        onChange={(e) =>
                                            statusForm.setData(
                                                "status",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full bg-white border-gray-200 rounded text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="applied">Applied</option>
                                        <option value="shortlisted">
                                            Shortlisted
                                        </option>
                                        <option value="waiting">Waiting</option>
                                        <option value="hired">Hired</option>
                                        <option value="rejected">
                                            Rejected
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Internal note..."
                                        value={statusForm.comment}
                                        onChange={(e) =>
                                            statusForm.setData(
                                                "comment",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full bg-white border-gray-200 rounded text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={statusForm.processing}
                                    className="w-full bg-gray-900 text-white py-2.5 rounded text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                                >
                                    {statusForm.processing ? (
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    Update Stage
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Modal */}
            {isEmailModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">
                                Send Email
                            </h3>
                            <button
                                onClick={() => setIsEmailModalOpen(false)}
                                className="text-gray-300 hover:text-gray-950 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Templates Bar */}
                            <div className="flex flex-wrap gap-2 pb-5 border-b border-gray-50">
                                {templates.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => selectTemplate(t)}
                                        className="px-3 py-1.5 bg-gray-50 hover:bg-[#0a66c2] text-gray-500 hover:text-white rounded-lg text-[11px] font-bold transition-all border border-transparent hover:shadow-md"
                                    >
                                        {t.name}
                                    </button>
                                ))}
                                {templates.length === 0 && (
                                    <p className="text-[10px] text-gray-400 font-medium italic">
                                        No templates available
                                    </p>
                                )}
                            </div>

                            <form
                                onSubmit={handleEmailSend}
                                className="space-y-4"
                            >
                                <div className="relative">
                                    <Mail
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        value={emailForm.data.subject}
                                        onChange={(e) =>
                                            emailForm.setData(
                                                "subject",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full pl-10 border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#0a66c2]/10 focus:border-[#0a66c2] rounded-xl text-sm font-bold text-gray-800 transition-all"
                                        placeholder="Subject line"
                                    />
                                </div>

                                <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                    <ReactQuill
                                        theme="snow"
                                        value={emailForm.data.body}
                                        onChange={(val) =>
                                            emailForm.setData("body", val)
                                        }
                                        placeholder="Write your message here..."
                                    />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={emailForm.processing}
                                        className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-all shadow-lg shadow-gray-100 flex items-center gap-2"
                                    >
                                        {emailForm.processing ? (
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Send size={16} />
                                        )}
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .ql-container {
                    min-height: 200px;
                    font-family: inherit;
                    font-size: 0.875rem;
                }
                .ql-toolbar.ql-snow {
                    border: none;
                    border-bottom: 1px solid #f3f4f6;
                    background: #fdfdfd;
                }
                .ql-container.ql-snow {
                    border: none;
                }
                .ql-editor {
                    min-height: 200px;
                }
            `,
                }}
            />
        </AdminLayout>
    );
}
