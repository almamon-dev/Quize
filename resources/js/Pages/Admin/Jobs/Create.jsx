import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import RichTextEditor from "@/Components/Form/RichTextEditor";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        company_name: "",
        department: "",
        description: "",
        requirements: "",
        salary_range: "",
        type: "full_time",
        location_type: "on_site",
        location: "",
        status: "active",
        stack: [],
        technical_assignment: "",
        technical_assignment_file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.jobs.store"), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Post New Job" />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Link
                            href={route("admin.jobs.index")}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-2 text-sm"
                        >
                            <ArrowLeft size={16} />
                            Back to Jobs
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Post New Job
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded border border-gray-200 p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className={`w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm ${errors.title ? "border-red-500" : ""}`}
                                    placeholder="e.g. Senior Frontend Engineer"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    value={data.company_name}
                                    onChange={(e) =>
                                        setData("company_name", e.target.value)
                                    }
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value={data.department}
                                    onChange={(e) =>
                                        setData("department", e.target.value)
                                    }
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="e.g. Engineering"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Job Type
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="full_time">Full Time</option>
                                    <option value="part_time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">
                                        Internship
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Salary Range
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.salary_range}
                                        onChange={(e) =>
                                            setData(
                                                "salary_range",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border-gray-300 pl-7 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="e.g. 80 - 120"
                                    />
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {[
                                        "30 - 50",
                                        "60 - 90",
                                        "100 - 130",
                                        "150+",
                                    ].map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() =>
                                                setData("salary_range", val)
                                            }
                                            className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-[10px] font-bold text-gray-500 rounded border border-gray-200 transition-colors"
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Location Type
                                </label>
                                <select
                                    value={data.location_type}
                                    onChange={(e) =>
                                        setData("location_type", e.target.value)
                                    }
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="on_site">On-site</option>
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Specific Location / City
                                </label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="e.g. New York, NY or Worldwide"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <RichTextEditor
                                label="Job Description"
                                value={data.description}
                                onChange={(val) => setData("description", val)}
                                placeholder="Describe the role and your company..."
                                error={errors.description}
                            />
                        </div>

                        <div className="mt-6">
                            <RichTextEditor
                                label="Requirements"
                                value={data.requirements}
                                onChange={(val) => setData("requirements", val)}
                                placeholder="List candidate requirements..."
                                error={errors.requirements}
                            />
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <RichTextEditor
                                label="Stage 3: Technical Assignment"
                                value={data.technical_assignment}
                                onChange={(val) =>
                                    setData("technical_assignment", val)
                                }
                                placeholder="Detailed instructions for the technical task (GitHub submission required)..."
                                error={errors.technical_assignment}
                            />

                            <div className="mt-4">
                                <label className="block text-xs font-bold text-gray-700 mb-2">
                                    Assignment Instruction File (Optional)
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "technical_assignment_file",
                                            e.target.files[0],
                                        )
                                    }
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-black file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                />
                                {errors.technical_assignment_file && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.technical_assignment_file}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link
                            href={route("admin.jobs.index")}
                            className="px-6 py-2 border border-gray-300 rounded font-bold text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-2 rounded font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Publish Job
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
