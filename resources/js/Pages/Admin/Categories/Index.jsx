import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Home,
    Search,
    Trash2,
    Edit,
    Plus,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Index({ categories, filters = {}, auth }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (value) => {
        setSearch(value);
        updateFilters({ search: value, page: 1 });
    };

    const updateFilters = (newFilters) => {
        router.get(
            route("admin.categories.index"),
            { ...filters, ...newFilters },
            { preserveState: true, replace: true },
        );
    };

    const handlePerPageChange = (e) => {
        updateFilters({ per_page: e.target.value, page: 1 });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            router.delete(route("admin.categories.destroy", id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Category Management" />

            <div className="space-y-6 max-w-[1240px] mx-auto pb-20">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Category Management
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Categories</span>
                        </div>
                    </div>
                    <Link
                        href={route("admin.categories.create")}
                        className="bg-[#673ab7] text-white px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-[#5e35b1] transition-all flex items-center gap-2 shadow-lg shadow-[#673ab7]/10"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Add Category
                    </Link>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-sm border border-slate-100 shadow-sm overflow-hidden">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-slate-50 flex flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search categories by name or slug..."
                                className="w-full h-10 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-sm text-sm font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 placeholder:font-medium"
                            />
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        Category Name
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        Slug
                                    </th>

                                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {categories.data.length > 0 ? (
                                    categories.data.map((category) => (
                                        <tr
                                            key={category.id}
                                            className="hover:bg-slate-50/30 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-sm bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50 overflow-hidden shadow-sm">
                                                        {category.icon ? (
                                                            <img
                                                                src={`/${category.icon}`}
                                                                alt={category.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <LayoutGrid size={18} strokeWidth={2.5} />
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {category.name}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-sm border border-slate-100">
                                                    /{category.slug}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                                        category.status
                                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                            : "bg-slate-50 text-slate-400 border-slate-100"
                                                    )}
                                                >
                                                    {category.status ? "Active" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route("admin.categories.edit", category.id)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-sm transition-all shadow-sm border border-transparent hover:border-indigo-100"
                                                        title="Edit Category"
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all border border-transparent hover:border-rose-100"
                                                        title="Delete Category"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-7 py-20 text-center bg-white"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                                                    <LayoutGrid
                                                        size={30}
                                                        className="text-slate-200"
                                                    />
                                                </div>
                                                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                                    No categories found
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                        {/* Pagination Footer - Tactical Style */}
                        <div className="flex items-center justify-end gap-10 px-8 py-2 border-t border-[#e3e4e8]">
                            {/* Items per page Selector */}
                            <div className="flex items-center gap-3">
                                <span className="text-[12px] font-bold text-slate-500 whitespace-nowrap uppercase tracking-widest">Items / Page:</span>
                                <Select 
                                    value={(filters.per_page || 15).toString()}
                                    onValueChange={(val) => updateFilters({ per_page: val, page: 1 })}
                                >
                                    <SelectTrigger className="w-[95px] h-8 border-slate-100 bg-white text-xs font-black ring-0 rounded-sm focus:ring-0">
                                        <SelectValue placeholder="15" />
                                    </SelectTrigger>
                                    <SelectContent upward className="min-w-0 w-[95px]">
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="15">15</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Result Range */}
                            <p className="text-xs font-black text-slate-900 min-w-[80px] text-center tracking-widest font-bold">
                                {categories.total > 0 ? (
                                    <>{categories.from} - {categories.to} of {categories.total}</>
                                ) : (
                                    "0 - 0 of 0"
                                )}
                            </p>

                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => handlePageChange(categories.prev_page_url)}
                                disabled={!categories.prev_page_url}
                                className="p-2 rounded-md hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-slate-400 hover:text-indigo-600"
                            >
                                <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                            </button>
                            
                            <button 
                                onClick={() => handlePageChange(categories.next_page_url)}
                                disabled={!categories.next_page_url}
                                className="p-2 rounded-md hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-slate-400 hover:text-indigo-600"
                            >
                                <ChevronRight className="w-5 h-5" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
