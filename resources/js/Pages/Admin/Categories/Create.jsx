import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Home, LayoutGrid, Upload, Trash2, CheckCircle2 } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        icon: null,
        status: true,
    });

    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("icon", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData("icon", null);
        setPreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.categories.store"));
    };

    return (
        <AdminLayout>
            <Head title="Add Category" />

            <div className="space-y-6 max-w-[900px] mx-auto pb-20">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Add New Category
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <Link
                                href={route("admin.categories.index")}
                                className="hover:text-[#673ab7] transition-colors"
                            >
                                Categories
                            </Link>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Create</span>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-full bg-[#f4f0ff] flex items-center justify-center text-[#673ab7]">
                                <LayoutGrid size={24} />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-bold text-[#2f3344]">
                                    Category Details
                                </h2>
                                <p className="text-[13px] text-[#727586]">
                                    Organize your Recipes by defining
                                    descriptive categories
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category Name */}
                                <div className="space-y-2">
                                    <label className="block text-[14px] font-bold text-[#2f3344]">
                                        Category Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="e.g., Breakfast, Dinner, Dessert"
                                        className={`w-full h-[48px] px-4 bg-white border ${
                                            errors.name
                                                ? "border-red-500"
                                                : "border-[#e3e4e8]"
                                        } rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-[12px] mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Icon/Image Upload */}
                                <div className="space-y-2">
                                    <label className="block text-[14px] font-bold text-[#2f3344]">
                                        Category Icon/Image
                                    </label>

                                    {!preview ? (
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div
                                                className={`flex flex-col items-center justify-center w-full h-[120px] bg-[#f8f9fc] border-2 border-dashed ${errors.icon ? "border-red-300" : "border-[#e3e4e8]"} rounded-xl group-hover:border-[#673ab7] transition-all`}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#727586] group-hover:text-[#673ab7] shadow-sm mb-2">
                                                    <Upload size={20} />
                                                </div>
                                                <p className="text-[12px] font-medium text-[#727586] group-hover:text-[#673ab7]">
                                                    Click or drag image to
                                                    upload
                                                </p>
                                                <p className="text-[11px] text-[#a0a3af] mt-1">
                                                    PNG, JPG or SVG (Max. 2MB)
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-[120px] rounded-xl overflow-hidden border border-[#e3e4e8]">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <label className="w-9 h-9 bg-white text-[#2f3344] rounded-full flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer">
                                                    <Upload size={16} />
                                                    <input
                                                        type="file"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                        accept="image/*"
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {errors.icon && (
                                        <p className="text-red-500 text-[12px] mt-1">
                                            {errors.icon}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="status"
                                    checked={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.checked)
                                    }
                                    className="w-5 h-5 text-[#673ab7] border-[#e3e4e8] rounded focus:ring-[#673ab7]"
                                />
                                <label
                                    htmlFor="status"
                                    className="text-[14px] font-medium text-[#2f3344] cursor-pointer"
                                >
                                    Active (Show on app)
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-4 border-t border-[#e3e4e8]">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#673ab7] text-white px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-[#5e35b1] transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#673ab7]/10"
                                >
                                    <CheckCircle2 size={20} strokeWidth={2.5} />
                                    {processing ? "Saving..." : "Save Category"}
                                </button>
                                <Link
                                    href={route("admin.categories.index")}
                                    className="bg-slate-100 text-slate-600 px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
