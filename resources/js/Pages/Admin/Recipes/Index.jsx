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
    Utensils,
    Clock,
} from "lucide-react";

export default function Index({ recipes, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (value) => {
        setSearch(value);
        updateFilters({ search: value, page: 1 });
    };

    const updateFilters = (newFilters) => {
        router.get(
            route("admin.recipes.index"),
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
        if (confirm("Are you sure you want to delete this recipe?")) {
            router.delete(route("admin.recipes.destroy", id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Recipe Management" />

            <div className="space-y-6 max-w-[1240px] mx-auto pb-20">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Recipe Management
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Recipes</span>
                        </div>
                    </div>
                    <Link
                        href={route("admin.recipes.create")}
                        className="bg-[#673ab7] text-white px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-[#5e35b1] transition-all flex items-center gap-2 shadow-lg shadow-[#673ab7]/10"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Add Recipe
                    </Link>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    {/* Search Bar */}
                    <div className="p-7">
                        <div className="relative w-full">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a0a3af]">
                                <Search size={22} />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search recipes by title or slug..."
                                className="w-full h-[52px] pl-14 pr-6 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition-all"
                            />
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#e3e4e8]">
                                    <th className="text-left px-7 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Recipe
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Prep Time
                                    </th>
                                    <th className="text-left px-5 py-4 text-[13px] font-bold text-[#2f3344] uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-7 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f2f4]">
                                {recipes.data.length > 0 ? (
                                    recipes.data.map((recipe) => (
                                        <tr
                                            key={recipe.id}
                                            className="hover:bg-[#fafbfc] transition-colors group"
                                        >
                                            <td className="px-7 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-[#f4f0ff] flex items-center justify-center text-[#673ab7] border border-[#e9e3ff] overflow-hidden">
                                                        {recipe.image ? (
                                                            <img
                                                                src={`/${recipe.image}`}
                                                                alt={
                                                                    recipe.title
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Utensils
                                                                size={24}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-bold text-[#2f3344] group-hover:text-[#673ab7] transition-colors">
                                                            {recipe.title}
                                                        </p>
                                                        <p className="text-[12px] text-[#727586]">
                                                            /{recipe.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <span className="px-2.5 py-1 rounded-full bg-[#f4f0ff] text-[#673ab7] text-[11px] font-bold border border-[#e9e3ff]">
                                                    {recipe.category?.name}
                                                </span>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex items-center gap-1.5 text-[13px] text-[#727586]">
                                                    <Clock size={14} />
                                                    {recipe.prep_time || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                        recipe.status
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {recipe.status
                                                        ? "Active"
                                                        : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-7 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            "admin.recipes.edit",
                                                            recipe.id,
                                                        )}
                                                        className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] text-[#673ab7] bg-[#f4f0ff]/50 hover:bg-[#673ab7] hover:text-white transition-all shadow-sm border border-transparent hover:border-[#673ab7]"
                                                        title="Edit Recipe"
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                recipe.id,
                                                            )
                                                        }
                                                        className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] text-[#ef4444] bg-[#fee2e2]/50 hover:bg-[#ef4444] hover:text-white transition-all shadow-sm border border-transparent hover:border-[#ef4444]"
                                                        title="Delete Recipe"
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
                                            className="px-7 py-20 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3 text-[#727586]">
                                                <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-2">
                                                    <Utensils
                                                        size={30}
                                                        className="text-[#c3c4ca]"
                                                    />
                                                </div>
                                                <p className="text-[16px] font-bold text-[#2f3344]">
                                                    No recipes found
                                                </p>
                                                <p className="text-[14px]">
                                                    Add your first recipe to get
                                                    started.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-end gap-8 px-8 py-5 border-t border-[#e3e4e8]">
                        <div className="flex items-center gap-3">
                            <span className="text-[13px] text-[#727586]">
                                Items per page:
                            </span>
                            <div className="relative">
                                <select
                                    value={filters.per_page || 15}
                                    onChange={handlePerPageChange}
                                    className="h-[38px] pl-4 pr-10 bg-white border border-[#e3e4e8] rounded-[6px] text-[13px] text-[#2f3344] font-medium appearance-none cursor-pointer focus:border-[#673ab7] outline-none"
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#727586]">
                                    <ChevronDown size={14} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <span className="text-[13px] text-[#2f3344] font-medium">
                                {recipes.from || 0} - {recipes.to || 0} of{" "}
                                {recipes.total || 0}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        handlePageChange(recipes.prev_page_url)
                                    }
                                    disabled={!recipes.prev_page_url}
                                    className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#673ab7] hover:bg-[#673ab7]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() =>
                                        handlePageChange(recipes.next_page_url)
                                    }
                                    disabled={!recipes.next_page_url}
                                    className="w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#673ab7] hover:bg-[#673ab7]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
