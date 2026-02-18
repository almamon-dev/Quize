import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Home,
    Briefcase,
    Upload,
    Trash2,
    CheckCircle2,
    Plus,
    HelpCircle,
    MinusCircle,
} from "lucide-react";

export default function Edit({ service }) {
    const { data, setData, post, processing, errors } = useForm({
        title: service.title || "",
        subtitle: service.subtitle || "",
        description: service.description || "",
        icon: null,
        thumbnail: null,
        features: service.features || [""],
        pricing_plans: service.pricing_plans || [
            { name: "", price: "", features: [""] },
        ],
        faqs: service.faqs || [{ question: "", answer: "" }],
        status: service.status ? true : false,
        _method: "PUT",
    });

    const [iconPreview, setIconPreview] = useState(
        service.icon ? `/${service.icon}` : null,
    );
    const [thumbPreview, setThumbPreview] = useState(
        service.thumbnail ? `/${service.thumbnail}` : null,
    );

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            if (field === "icon") setIconPreview(URL.createObjectURL(file));
            if (field === "thumbnail")
                setThumbPreview(URL.createObjectURL(file));
        }
    };

    const addFeature = () => {
        setData("features", [...data.features, ""]);
    };

    const removeFeature = (index) => {
        const newFeatures = data.features.filter((_, i) => i !== index);
        setData("features", newFeatures);
    };

    const updateFeature = (index, value) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData("features", newFeatures);
    };

    const addPlan = () => {
        setData("pricing_plans", [
            ...data.pricing_plans,
            { name: "", price: "", features: [""] },
        ]);
    };

    const removePlan = (index) => {
        const newPlans = data.pricing_plans.filter((_, i) => i !== index);
        setData("pricing_plans", newPlans);
    };

    const updatePlan = (index, field, value) => {
        const newPlans = [...data.pricing_plans];
        newPlans[index][field] = value;
        setData("pricing_plans", newPlans);
    };

    const addPlanFeature = (planIndex) => {
        const newPlans = [...data.pricing_plans];
        newPlans[planIndex].features.push("");
        setData("pricing_plans", newPlans);
    };

    const updatePlanFeature = (planIndex, featureIndex, value) => {
        const newPlans = [...data.pricing_plans];
        newPlans[planIndex].features[featureIndex] = value;
        setData("pricing_plans", newPlans);
    };

    const removePlanFeature = (planIndex, featureIndex) => {
        const newPlans = [...data.pricing_plans];
        newPlans[planIndex].features = newPlans[planIndex].features.filter(
            (_, i) => i !== featureIndex,
        );
        setData("pricing_plans", newPlans);
    };

    const addFaq = () => {
        setData("faqs", [...data.faqs, { question: "", answer: "" }]);
    };

    const removeFaq = (index) => {
        const newFaqs = data.faqs.filter((_, i) => i !== index);
        setData("faqs", newFaqs);
    };

    const updateFaq = (index, field, value) => {
        const newFaqs = [...data.faqs];
        newFaqs[index][field] = value;
        setData("faqs", newFaqs);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.services.update", service.id));
    };

    return (
        <AdminLayout>
            <Head title="Edit Service" />

            <div className="space-y-6 max-w-[1000px] mx-auto pb-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            Edit Service
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={16} className="text-[#727586]" />
                            <span className="text-[#c3c4ca]">-</span>
                            <Link
                                href={route("admin.services.index")}
                                className="hover:text-[#673ab7] transition-colors"
                            >
                                Services
                            </Link>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Edit</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Briefcase size={22} className="text-[#673ab7]" />
                            <h2 className="text-[18px] font-bold text-[#2f3344]">
                                Basic Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[14px] font-bold text-[#2f3344]">
                                    Service Title{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="e.g., Monthly SEO"
                                    className={`w-full h-[48px] px-4 border ${errors.title ? "border-red-500" : "border-[#e3e4e8]"} rounded-[8px] focus:ring-1 focus:ring-[#673ab7] outline-none transition-all`}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-[12px]">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[14px] font-bold text-[#2f3344]">
                                    Subtitle
                                </label>
                                <input
                                    type="text"
                                    value={data.subtitle}
                                    onChange={(e) =>
                                        setData("subtitle", e.target.value)
                                    }
                                    placeholder="e.g., Drive Organic Traffic"
                                    className="w-full h-[48px] px-4 border border-[#e3e4e8] rounded-[8px] focus:ring-1 focus:ring-[#673ab7] outline-none"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-[14px] font-bold text-[#2f3344]">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="Brief summary of the service..."
                                    className="w-full min-h-[100px] p-4 border border-[#e3e4e8] rounded-[8px] focus:ring-1 focus:ring-[#673ab7] outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Icon Upload */}
                            <div className="space-y-2">
                                <label className="block text-[14px] font-bold text-[#2f3344]">
                                    Service Icon
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            handleFileChange(e, "icon")
                                        }
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center justify-center w-full h-[120px] bg-[#f8f9fc] border-2 border-dashed border-[#e3e4e8] rounded-xl group-hover:border-[#673ab7] transition-all overflow-hidden">
                                        {iconPreview ? (
                                            <img
                                                src={iconPreview}
                                                alt="Icon Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <>
                                                <Upload
                                                    size={20}
                                                    className="text-[#a0a3af]"
                                                />
                                                <p className="text-[12px] text-[#727586] mt-2">
                                                    Upload Icon
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnail Upload */}
                            <div className="space-y-2">
                                <label className="block text-[14px] font-bold text-[#2f3344]">
                                    Thumbnail Image
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            handleFileChange(e, "thumbnail")
                                        }
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center justify-center w-full h-[120px] bg-[#f8f9fc] border-2 border-dashed border-[#e3e4e8] rounded-xl group-hover:border-[#673ab7] transition-all overflow-hidden">
                                        {thumbPreview ? (
                                            <img
                                                src={thumbPreview}
                                                alt="Thumb Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <>
                                                <Upload
                                                    size={20}
                                                    className="text-[#a0a3af]"
                                                />
                                                <p className="text-[12px] text-[#727586] mt-2">
                                                    Upload Thumbnail
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle2
                                    size={22}
                                    className="text-[#673ab7]"
                                />
                                <h2 className="text-[18px] font-bold text-[#2f3344]">
                                    Key Features
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={addFeature}
                                className="text-[#673ab7] text-[13px] font-bold hover:underline flex items-center gap-1"
                            >
                                <Plus size={16} /> Add Feature
                            </button>
                        </div>

                        <div className="space-y-3">
                            {data.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) =>
                                            updateFeature(index, e.target.value)
                                        }
                                        placeholder={`Feature #${index + 1}`}
                                        className="flex-1 h-[44px] px-4 border border-[#e3e4e8] rounded-[8px] focus:ring-1 focus:ring-[#673ab7] outline-none"
                                    />
                                    {data.features.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-red-400 hover:text-red-600 px-2 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <HelpCircle
                                    size={22}
                                    className="text-[#673ab7]"
                                />
                                <h2 className="text-[18px] font-bold text-[#2f3344]">
                                    Pricing Plans
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={addPlan}
                                className="text-[#673ab7] text-[13px] font-bold hover:underline flex items-center gap-1"
                            >
                                <Plus size={16} /> Add Plan
                            </button>
                        </div>

                        <div className="space-y-6">
                            {data.pricing_plans.map((plan, pIndex) => (
                                <div
                                    key={pIndex}
                                    className="p-6 bg-[#f8f9fc] rounded-xl border border-[#e3e4e8] space-y-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-[14px] font-bold text-[#673ab7]">
                                            Plan {pIndex + 1}
                                        </h3>
                                        {data.pricing_plans.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removePlan(pIndex)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[12px] font-bold text-[#727586]">
                                                Plan Name
                                            </label>
                                            <input
                                                type="text"
                                                value={plan.name}
                                                onChange={(e) =>
                                                    updatePlan(
                                                        pIndex,
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full h-[40px] px-3 border border-[#e3e4e8] rounded-lg outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[12px] font-bold text-[#727586]">
                                                Price
                                            </label>
                                            <input
                                                type="text"
                                                value={plan.price}
                                                onChange={(e) =>
                                                    updatePlan(
                                                        pIndex,
                                                        "price",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="$"
                                                className="w-full h-[40px] px-3 border border-[#e3e4e8] rounded-lg outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[12px] font-bold text-[#727586]">
                                                Plan Features
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addPlanFeature(pIndex)
                                                }
                                                className="text-[#673ab7] text-[11px] font-bold"
                                            >
                                                + Feature
                                            </button>
                                        </div>
                                        {plan.features.map((pf, pfIndex) => (
                                            <div
                                                key={pfIndex}
                                                className="flex gap-2"
                                            >
                                                <input
                                                    type="text"
                                                    value={pf}
                                                    onChange={(e) =>
                                                        updatePlanFeature(
                                                            pIndex,
                                                            pfIndex,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1 h-[36px] px-3 bg-white border border-[#e3e4e8] rounded-lg text-[13px] outline-none"
                                                />
                                                {plan.features.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removePlanFeature(
                                                                pIndex,
                                                                pfIndex,
                                                            )
                                                        }
                                                        className="text-red-400"
                                                    >
                                                        <MinusCircle
                                                            size={16}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-[12px] border border-[#e3e4e8] shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <HelpCircle
                                    size={22}
                                    className="text-[#673ab7]"
                                />
                                <h2 className="text-[18px] font-bold text-[#2f3344]">
                                    FAQs
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={addFaq}
                                className="text-[#673ab7] text-[13px] font-bold hover:underline flex items-center gap-1"
                            >
                                <Plus size={16} /> Add FAQ
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="space-y-2 p-4 bg-[#f8f9fc] rounded-lg border border-[#e3e4e8]"
                                >
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={faq.question}
                                            onChange={(e) =>
                                                updateFaq(
                                                    index,
                                                    "question",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Question"
                                            className="flex-1 h-[40px] px-3 border border-[#e3e4e8] rounded-lg outline-none"
                                        />
                                        {data.faqs.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeFaq(index)}
                                                className="text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <textarea
                                        value={faq.answer}
                                        onChange={(e) =>
                                            updateFaq(
                                                index,
                                                "answer",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Answer"
                                        className="w-full min-h-[80px] p-3 border border-[#e3e4e8] rounded-lg outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-6 border-t border-[#e3e4e8]">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#673ab7] text-white px-10 py-3 rounded-lg text-[14px] font-bold hover:bg-[#5e35b1] transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg"
                        >
                            <CheckCircle2 size={20} />
                            {processing ? "Saving..." : "Save Changes"}
                        </button>
                        <Link
                            href={route("admin.services.index")}
                            className="bg-slate-100 text-slate-600 px-10 py-3 rounded-lg text-[14px] font-bold hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
