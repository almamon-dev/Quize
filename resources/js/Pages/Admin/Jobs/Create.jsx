import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Loader2, Plus } from "lucide-react";
import RichTextEditor from "@/Components/Form/RichTextEditor";

export default function Create({ departments = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        company_name: "",
        department: "",
        job_category: "",
        vacancy: 1,
        experience_level: "",
        posted_date: "",
        deadline_date: "",
        close_date: "",
        gender: "",
        description: "",
        requirements: "",
        salary_from: "",
        salary_to: "",
        type: "full_time",
        city: "",
        state: "",
        country: "",
        education_level: "",
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

            <div className="p-6 max-w-8xl mx-auto">
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
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-gray-700">
                                        Department *
                                    </label>
                                    <Link
                                        href={route("admin.departments.create")}
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors uppercase tracking-wider"
                                    >
                                        <Plus size={10} strokeWidth={3} />
                                        Add New
                                    </Link>
                                </div>
                                <select
                                    value={data.department}
                                    onChange={(e) =>
                                        setData("department", e.target.value)
                                    }
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.name}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.department && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {errors.department}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Job Category
                                </label>
                                <select
                                    value={data.job_category}
                                    onChange={(e) =>
                                        setData("job_category", e.target.value)
                                    }
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="">Choose...</option>
                                    <option value="development">Development</option>
                                    <option value="design">Design</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="sales">Sales</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Job Type *
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="">Choose...</option>
                                    <option value="full_time">Full Time</option>
                                    <option value="part_time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    No. of Vacancy *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.vacancy}
                                    onChange={(e) => setData("vacancy", e.target.value)}
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Enter number of vacancies"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Select Experience *
                                </label>
                                <select
                                    value={data.experience_level}
                                    onChange={(e) => setData("experience_level", e.target.value)}
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="">Choose...</option>
                                    <option value="fresher">Fresher</option>
                                    <option value="1_yr">1 Yr</option>
                                    <option value="2_yrs">2 Yrs</option>
                                    <option value="3_plus_yrs">3+ Yrs</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Posted Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.posted_date}
                                    onChange={(e) => setData("posted_date", e.target.value)}
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Last Date To Apply *
                                </label>
                                <input
                                    type="date"
                                    value={data.deadline_date}
                                    onChange={(e) => setData("deadline_date", e.target.value)}
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Close Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.close_date}
                                    onChange={(e) => setData("close_date", e.target.value)}
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Select Gender: *
                                </label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData("gender", e.target.value)}
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="">Choose...</option>
                                    <option value="any">Any</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Salary From *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={data.salary_from}
                                        onChange={(e) => setData("salary_from", e.target.value)}
                                        className="w-full rounded border-gray-300 pl-7 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Min salary"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Salary To *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={data.salary_to}
                                        onChange={(e) => setData("salary_to", e.target.value)}
                                        className="w-full rounded border-gray-300 pl-7 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Max salary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Enter City: *
                                </label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData("city", e.target.value)}
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="City"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Enter State: *
                                </label>
                                <input
                                    type="text"
                                    value={data.state}
                                    onChange={(e) => setData("state", e.target.value)}
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="State"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Enter Country: *
                                </label>
                                <input
                                    type="text"
                                    value={data.country}
                                    onChange={(e) => setData("country", e.target.value)}
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Country"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Enter Education Level: *
                                </label>
                                <input
                                    type="text"
                                    value={data.education_level}
                                    onChange={(e) => setData("education_level", e.target.value)}
                                    className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Education Level"
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-6">
                            <label className="block text-sm font-bold text-gray-700 whitespace-nowrap">
                                Status:
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="active"
                                    checked={data.status === "active"}
                                    onChange={(e) => setData("status", e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="closed"
                                    checked={data.status === "closed"}
                                    onChange={(e) => setData("status", e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">In Active</span>
                            </label>
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
