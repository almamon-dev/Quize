import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Building2, Save, X } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.departments.store"));
    };

    return (
        <AdminLayout>
            <Head title="Add Department" />

            <div className="p-6 max-w-8xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add Department</h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Create a new department for categorizing jobs.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
                    <form onSubmit={submit} className="p-6">
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Department Name
                            </label>
                            <div className="relative">
                                <Building2 size={18} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                                    placeholder="Enter department name (e.g. Engineering, Marketing)"
                                    autoFocus
                                />
                            </div>
                            {errors.name && (
                                <p className="text-rose-500 text-[11px] font-bold mt-2 ml-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-8">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing ? "Creating..." : "Save Department"}
                            </button>
                            <Link
                                href={route("admin.departments.index")}
                                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-bold transition-all"
                            >
                                <X size={18} />
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
