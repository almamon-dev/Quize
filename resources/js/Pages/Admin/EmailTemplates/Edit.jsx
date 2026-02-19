import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Info } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Edit({ template }) {
    const { data, setData, put, processing, errors } = useForm({
        name: template.name,
        subject: template.subject,
        body: template.body,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.email-templates.update", template.id));
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
    ];

    return (
        <AdminLayout>
            <Head title={`Edit Template: ${template.name}`} />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("admin.email-templates.index")}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Edit Template
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Modify your recruitment email template.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-8 space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                                        Template Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Interview Confirmation"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full bg-gray-50/50 border-gray-100 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] transition-all"
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                                        Email Subject
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Subject line for the email"
                                        value={data.subject}
                                        onChange={(e) =>
                                            setData("subject", e.target.value)
                                        }
                                        className="w-full bg-gray-50/50 border-gray-100 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] transition-all"
                                    />
                                    {errors.subject && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.subject}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                                        Email Body
                                    </label>
                                    <div className="quill-container border border-gray-100 rounded-lg overflow-hidden bg-white">
                                        <ReactQuill
                                            theme="snow"
                                            value={data.body}
                                            onChange={(val) =>
                                                setData("body", val)
                                            }
                                            modules={modules}
                                            formats={formats}
                                            placeholder="Compose your email template here..."
                                        />
                                    </div>
                                    {errors.body && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.body}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-4 space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4">
                                    Guidelines
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="mt-0.5 text-[#0a66c2]">
                                            <Info size={16} />
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                            Use curly braces for placeholders.
                                            For example:
                                            <br />
                                            <span className="text-[#0a66c2] font-black italic">
                                                {"{candidate_name}"}
                                            </span>
                                            ,
                                            <br />
                                            <span className="text-[#0a66c2] font-black italic">
                                                {"{job_title}"}
                                            </span>
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-400 italic font-medium pt-2 border-t border-gray-50">
                                        These placeholders will be automatically
                                        replaced when you send an email.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full mt-8 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                                >
                                    <Save size={16} />
                                    Update Template
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .ql-container {
                    min-height: 250px;
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
                    min-height: 250px;
                }
            `,
                }}
            />
        </AdminLayout>
    );
}
