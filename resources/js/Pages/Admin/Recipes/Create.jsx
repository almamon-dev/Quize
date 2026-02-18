import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Home,
    Upload,
    Trash2,
    CheckCircle2,
    Utensils,
    Plus,
    GripVertical,
    X,
} from "lucide-react";

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: "",
        title: "",
        description: "",
        prep_time: "",
        meal_types: [],
        image: null,
        ingredients: [""],
        instructions: [""],
        status: true,
    });

    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData("image", null);
        setPreview(null);
    };

    const handleAddItem = (type) => {
        const newList = [...data[type], ""];
        setData(type, newList);
    };

    const handleRemoveItem = (type, index) => {
        const newList = data[type].filter((_, i) => i !== index);
        setData(type, newList.length > 0 ? newList : [""]);
    };

    const handleItemChange = (type, index, value) => {
        const newList = [...data[type]];
        newList[index] = value;
        setData(type, newList);
    };

    const handleMealTypeChange = (type) => {
        const currentTypes = [...data.meal_types];
        const index = currentTypes.indexOf(type);
        if (index > -1) {
            currentTypes.splice(index, 1);
        } else {
            currentTypes.push(type);
        }
        setData("meal_types", currentTypes);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.recipes.store"));
    };

    return (
        <AdminLayout>
            <Head title="Add Recipe" />

            <div className="space-y-6 max-w-[1000px] mx-auto pb-20">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Add New Recipe
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <Link
                                href={route("admin.recipes.index")}
                                className="hover:text-[#673ab7] transition-colors"
                            >
                                Recipes
                            </Link>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Create</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-full bg-[#f4f0ff] flex items-center justify-center text-[#673ab7]">
                                    <Utensils size={24} />
                                </div>
                                <div>
                                    <h2 className="text-[18px] font-bold text-[#2f3344]">
                                        Recipe Details
                                    </h2>
                                    <p className="text-[13px] text-[#727586]">
                                        Fill in the basic information about the
                                        recipe
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-[14px] font-bold text-[#2f3344]">
                                        Recipe Title{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        placeholder="e.g., CASTORS Potato Delight"
                                        className={`w-full h-[48px] px-4 bg-white border ${errors.title ? "border-red-500" : "border-[#e3e4e8]"} rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] transition-all`}
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-[12px]">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="block text-[14px] font-bold text-[#2f3344]">
                                        Category{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) =>
                                            setData(
                                                "category_id",
                                                e.target.value,
                                            )
                                        }
                                        className={`w-full h-[48px] px-4 bg-white border ${errors.category_id ? "border-red-500" : "border-[#e3e4e8]"} rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] transition-all`}
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="text-red-500 text-[12px]">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                {/* Prep Time */}
                                <div className="space-y-2">
                                    <label className="block text-[14px] font-bold text-[#2f3344]">
                                        Prep Time
                                    </label>
                                    <input
                                        type="text"
                                        value={data.prep_time}
                                        onChange={(e) =>
                                            setData("prep_time", e.target.value)
                                        }
                                        placeholder="e.g., 30 mins"
                                        className="w-full h-[48px] px-4 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                </div>

                                {/* Meal Types */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-[14px] font-bold text-[#2f3344] mb-3">
                                        Meal Types (Select all that apply)
                                    </label>
                                    <div className="flex flex-wrap gap-4">
                                        {["Breakfast", "Lunch", "Dinner"].map(
                                            (type) => (
                                                <div
                                                    key={type}
                                                    onClick={() =>
                                                        handleMealTypeChange(
                                                            type.toLowerCase(),
                                                        )
                                                    }
                                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                                                        data.meal_types.includes(
                                                            type.toLowerCase(),
                                                        )
                                                            ? "border-[#673ab7] bg-[#f4f0ff]"
                                                            : "border-[#e3e4e8] bg-white hover:border-[#673ab7]/30"
                                                    }`}
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                                            data.meal_types.includes(
                                                                type.toLowerCase(),
                                                            )
                                                                ? "bg-[#673ab7] border-[#673ab7]"
                                                                : "border-[#e3e4e8] bg-white"
                                                        }`}
                                                    >
                                                        {data.meal_types.includes(
                                                            type.toLowerCase(),
                                                        ) && (
                                                            <CheckCircle2
                                                                size={12}
                                                                className="text-white"
                                                                strokeWidth={3}
                                                            />
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`text-[14px] font-bold ${
                                                            data.meal_types.includes(
                                                                type.toLowerCase(),
                                                            )
                                                                ? "text-[#673ab7]"
                                                                : "text-[#727586]"
                                                        }`}
                                                    >
                                                        {type}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    {errors.meal_types && (
                                        <p className="text-red-500 text-[12px]">
                                            {errors.meal_types}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-[14px] font-bold text-[#2f3344]">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="A delicious CASTORS recipe..."
                                        rows="4"
                                        className="w-full px-4 py-3 bg-white border border-[#e3e4e8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#673ab7] transition-all"
                                    ></textarea>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-[14px] font-bold text-[#2f3344]">
                                        Featured Image
                                    </label>
                                    {!preview ? (
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="flex flex-col items-center justify-center w-full h-[160px] bg-[#f8f9fc] border-2 border-dashed border-[#e3e4e8] rounded-xl group-hover:border-[#673ab7] transition-all">
                                                <Upload
                                                    size={24}
                                                    className="text-[#727586] mb-2"
                                                />
                                                <p className="text-[13px] font-medium text-[#727586]">
                                                    Click to upload recipe image
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-[200px] rounded-xl overflow-hidden border border-[#e3e4e8]">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                    {errors.image && (
                                        <p className="text-red-500 text-[12px]">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients & Instructions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Ingredients Card */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[#f1f2f4] flex items-center justify-between">
                                <h3 className="text-[16px] font-bold text-[#2f3344]">
                                    Ingredients
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => handleAddItem("ingredients")}
                                    className="text-[#673ab7] hover:text-[#5e35b1] flex items-center gap-1 text-[13px] font-bold"
                                >
                                    <Plus size={16} /> Add Ingredient
                                </button>
                            </div>
                            <div className="p-6 space-y-3">
                                {data.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={ingredient}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        "ingredients",
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={`Ingredient ${index + 1}`}
                                                className="w-full h-[42px] px-3 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] transition-all"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(
                                                    "ingredients",
                                                    index,
                                                )
                                            }
                                            className="w-[42px] h-[42px] flex items-center justify-center text-red-500 hover:bg-red-50 transition-all rounded-[6px]"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructions Card */}
                        <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[#f1f2f4] flex items-center justify-between">
                                <h3 className="text-[16px] font-bold text-[#2f3344]">
                                    Instructions
                                </h3>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddItem("instructions")
                                    }
                                    className="text-[#673ab7] hover:text-[#5e35b1] flex items-center gap-1 text-[13px] font-bold"
                                >
                                    <Plus size={16} /> Add Step
                                </button>
                            </div>
                            <div className="p-6 space-y-3">
                                {data.instructions.map((step, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="w-8 h-[42px] flex items-center justify-center bg-[#f4f0ff] text-[#673ab7] font-bold rounded-[6px] text-[13px]">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <textarea
                                                value={step}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        "instructions",
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={`Step ${index + 1}`}
                                                className="w-full px-3 py-2 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] focus:outline-none focus:border-[#673ab7] transition-all min-h-[42px]"
                                            ></textarea>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(
                                                    "instructions",
                                                    index,
                                                )
                                            }
                                            className="w-[42px] h-[42px] flex items-center justify-center text-red-500 hover:bg-red-50 transition-all rounded-[6px]"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-white p-6 rounded-[12px] border border-[#e3e4e8] shadow-sm flex items-center justify-between">
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
                        <div className="flex items-center gap-3">
                            <Link
                                href={route("admin.recipes.index")}
                                className="bg-slate-100 text-slate-600 px-8 py-3 rounded-lg text-[14px] font-bold hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#673ab7] text-white px-8 py-3 rounded-lg text-[14px] font-bold hover:bg-[#5e35b1] transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#673ab7]/10"
                            >
                                <CheckCircle2 size={20} strokeWidth={2.5} />
                                {processing ? "Saving..." : "Save Recipe"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
