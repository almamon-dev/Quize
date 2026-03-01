import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Info } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        subject: "",
        body: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.email-templates.store"));
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
            <Head title="Create Email Template" />

            <div className="p-6">
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("admin.email-templates.index")}
                            className="p-2.5 bg-white border border-gray-200 rounded-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                                Create Template
                            </h1>
                            <p className="text-sm font-medium text-gray-500 mt-1">
                                Define a new recruitment email template.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-8 space-y-6">
                            <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-8 space-y-6">
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
                                        className="w-full bg-gray-50/50 border-gray-100 rounded-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all py-3 px-4"
                                    />
                                    {errors.name && (
                                        <p className="text-xs font-bold text-red-500 mt-1.5">
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
                                        className="w-full bg-gray-50/50 border-gray-100 rounded-sm text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all py-3 px-4"
                                    />
                                    {errors.subject && (
                                        <p className="text-xs font-bold text-red-500 mt-1.5">
                                            {errors.subject}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                                        Email Body
                                    </label>
                                    <div className="quill-container border border-gray-100 rounded-sm overflow-hidden bg-white">
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
                                        <p className="text-xs font-bold text-red-500 mt-1.5">
                                            {errors.body}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-4 space-y-6">
                            <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-8">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                                    Guidelines
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="mt-0.5 text-indigo-500 bg-indigo-50 p-2 rounded-sm flex-shrink-0">
                                            <Info size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4">
                                                You can personalize your emails by using dynamic placeholders that will be replaced automatically.
                                            </p>
                                            
                                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 block">
                                                Available Variables
                                            </p>
                                            
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-2.5 rounded-sm border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-indigo-100 transition-all group">
                                                    <code className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-sm border border-indigo-100/50">
                                                        {"{candidate_name}"}
                                                    </code>
                                                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-500 transition-colors uppercase">Uses Applicant's Name</span>
                                                </div>
                                                
                                                <div className="flex items-center justify-between p-2.5 rounded-sm border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-indigo-100 transition-all group">
                                                    <code className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-sm border border-indigo-100/50">
                                                        {"{job_title}"}
                                                    </code>
                                                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-500 transition-colors uppercase">Uses Job Position</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-gray-50">
                                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                            These placeholders will be automatically
                                            replaced when you send an email.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full mt-8 bg-gray-900 hover:bg-black text-white py-3.5 rounded-sm font-bold uppercase tracking-widest text-xs transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Save size={16} />
                                    Save Template
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
                    padding: 12px 16px;
                }
                .ql-container.ql-snow {
                    border: none;
                }
                .ql-editor {
                    min-height: 250px;
                    padding: 16px;
                }
            `,
                }}
            />
        </AdminLayout>
    );
}
