import React, { useState, useRef } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Settings,
    Save,
    Globe,
    User,
    ArrowLeft,
    Youtube,
    MapPin,
    Users,
    Zap,
    Image as ImageIcon,
    Hash,
    Feather,
    CloudUpload,
    Mail,
    Phone,
    Facebook,
    Linkedin,
    Instagram,
    Twitter,
    Briefcase,
    Github,
    X as LucideX,
} from "lucide-react";
import RichTextEditor from "@/Components/RichTextEditor";

export default function General({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings?.site_name || "",
        site_headline: settings?.site_headline || "",
        site_about: settings?.site_about || "",
        site_keywords: settings?.site_keywords || [],
        location: settings?.location || "",
        email: settings?.email || "",
        phone: settings?.phone || "",
        address: settings?.address || "",
        portfolio_url: settings?.portfolio_url || "",
        blog_url: settings?.blog_url || "",
        profile_image: settings?.profile_image || "",
        banner_image: settings?.banner_image || "",
        resume: settings?.resume || "",
    });

    const [keywordInput, setKeywordInput] = useState("");
    const profileInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const resumeInputRef = useRef(null);

    const addKeyword = (e) => {
        if (e.key === "Enter" && keywordInput.trim()) {
            e.preventDefault();
            if (!data.site_keywords.includes(keywordInput.trim())) {
                setData("site_keywords", [
                    ...data.site_keywords,
                    keywordInput.trim(),
                ]);
            }
            setKeywordInput("");
        }
    };

    const removeKeyword = (tag) => {
        setData(
            "site_keywords",
            data.site_keywords.filter((k) => k !== tag),
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.settings.update"), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="General Settings" />

            <div className="space-y-8 max-w-[1000px] mx-auto pb-20 pt-4 px-4 sm:px-0">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Branding Section */}
                    <div className="bg-white rounded-[24px] border border-[#eef0f2] shadow-sm overflow-hidden p-6 sm:p-10">
                        <div className="flex items-start gap-4 mb-10">
                            <div className="bg-[#f4f0ff] w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                                <Globe className="text-[#673ab7]" size={22} />
                            </div>
                            <div>
                                <h3 className="text-[20px] font-bold text-[#2f3344] leading-tight">
                                    Platform Identity
                                </h3>
                                <p className="text-[14px] text-slate-400 mt-1">
                                    Configure your portfolio identity and
                                    branding
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">
                                        Site Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.site_name}
                                        onChange={(e) =>
                                            setData("site_name", e.target.value)
                                        }
                                        className="w-full bg-white border-[#eef0f2] rounded-[10px] px-5 py-3.5 text-[15px] text-slate-600 focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all placeholder:text-slate-300 shadow-sm"
                                        placeholder="e.g., My Portfolio"
                                    />
                                    {errors.site_name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.site_name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">
                                        Site Headline{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.site_headline}
                                        onChange={(e) =>
                                            setData(
                                                "site_headline",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full bg-white border-[#eef0f2] rounded-[10px] px-5 py-3.5 text-[15px] text-slate-600 focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all placeholder:text-slate-300 shadow-sm"
                                        placeholder="e.g., Full Stack Developer"
                                    />
                                    {errors.site_headline && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.site_headline}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <RichTextEditor
                                label="About Info"
                                subtitle="Describe your background, achievements, and goals"
                                value={data.site_about}
                                onChange={(content) =>
                                    setData("site_about", content)
                                }
                                placeholder="Describe yourself..."
                                error={errors.site_about}
                            />

                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">
                                    Skills / Keywords
                                </label>
                                <div className="flex flex-wrap gap-2 p-3 bg-[#fafbfc] border border-[#eef0f2] rounded-[12px] min-h-[50px]">
                                    {data.site_keywords.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-white border border-[#eef0f2] text-[#673ab7] px-3 py-1.5 rounded-[8px] text-xs font-bold flex items-center gap-2 shadow-sm"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeKeyword(tag)
                                                }
                                                className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                            >
                                                <LucideX size={12} />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={keywordInput}
                                        onChange={(e) =>
                                            setKeywordInput(e.target.value)
                                        }
                                        onKeyDown={addKeyword}
                                        className="bg-transparent border-none focus:ring-0 text-[14px] text-slate-600 flex-1 min-w-[120px] placeholder:text-slate-300"
                                        placeholder="Type and press Enter..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Resources Section */}
                    <div className="bg-white rounded-[24px] border border-[#eef0f2] shadow-sm overflow-hidden p-6 sm:p-10">
                        <div className="flex items-start gap-4 mb-10">
                            <div className="bg-[#f0f9ff] w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                                <MapPin className="text-[#0ea5e9]" size={22} />
                            </div>
                            <div>
                                <h3 className="text-[20px] font-bold text-[#2f3344] leading-tight">
                                    Contact & Resources
                                </h3>
                                <p className="text-[14px] text-slate-400 mt-1">
                                    Manage your contact information and public
                                    links
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full bg-white border-[#eef0f2] rounded-[10px] px-5 py-3.5 text-[15px] text-slate-600 focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className="w-full bg-white border-[#eef0f2] rounded-[10px] px-5 py-3.5 text-[15px] text-slate-600 focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData("location", e.target.value)
                                        }
                                        className="w-full bg-white border-[#eef0f2] rounded-[10px] px-5 py-3.5 text-[15px] text-slate-600 focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">
                                        Blog URL
                                    </label>
                                    <input
                                        type="url"
                                        value={data.blog_url}
                                        onChange={(e) =>
                                            setData("blog_url", e.target.value)
                                        }
                                        placeholder="https://blog.mamondev.com"
                                        className="w-full bg-white border-[#eef0f2] rounded-[10px] px-5 py-3.5 text-[15px] text-slate-600 focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2f3344]">
                                        Resume / CV (PDF)
                                    </label>
                                    <div className="p-5 border border-dashed border-[#eef0f2] rounded-[12px] bg-[#fafbfc] flex flex-col items-center gap-3">
                                        <input
                                            type="file"
                                            ref={resumeInputRef}
                                            className="hidden"
                                            onChange={(e) =>
                                                setData(
                                                    "resume",
                                                    e.target.files[0],
                                                )
                                            }
                                            accept=".pdf,.doc,.docx"
                                        />
                                        <CloudUpload
                                            size={24}
                                            className="text-[#673ab7]/40"
                                        />
                                        <p className="text-[12px] text-slate-400 text-center">
                                            {data.resume instanceof File
                                                ? data.resume.name
                                                : data.resume
                                                  ? "Resume uploaded"
                                                  : "Upload your CV in PDF format"}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                resumeInputRef.current?.click()
                                            }
                                            className="px-4 py-2 bg-white border border-[#eef0f2] rounded-[8px] text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                                        >
                                            {data.resume
                                                ? "Change File"
                                                : "Choose File"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Asset Section */}
                    <div className="bg-white rounded-[24px] border border-[#eef0f2] shadow-sm overflow-hidden p-6 sm:p-10">
                        <div className="flex items-start gap-4 mb-10">
                            <div className="bg-[#e6fffb] w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                                <ImageIcon
                                    className="text-[#00b090]"
                                    size={22}
                                />
                            </div>
                            <div>
                                <h3 className="text-[20px] font-bold text-[#2f3344] leading-tight">
                                    Media Assets
                                </h3>
                                <p className="text-[14px] text-slate-400 mt-1">
                                    Update your profile and cover images
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <label className="text-[14px] font-bold text-[#2f3344]">
                                    Profile Image
                                </label>
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-md relative group">
                                        {data.profile_image ? (
                                            <img
                                                src={
                                                    typeof data.profile_image ===
                                                    "string"
                                                        ? data.profile_image
                                                        : URL.createObjectURL(
                                                              data.profile_image,
                                                          )
                                                }
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <User size={40} />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                profileInputRef.current?.click()
                                            }
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                        >
                                            <CloudUpload size={20} />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <input
                                            type="file"
                                            ref={profileInputRef}
                                            className="hidden"
                                            onChange={(e) =>
                                                setData(
                                                    "profile_image",
                                                    e.target.files[0],
                                                )
                                            }
                                            accept="image/*"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                profileInputRef.current?.click()
                                            }
                                            className="px-4 py-2 bg-white border border-[#eef0f2] rounded-[8px] text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                                        >
                                            Choose New Image
                                        </button>
                                        <p className="text-[11px] text-slate-400">
                                            JPG, PNG or GIF. Max 2MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[14px] font-bold text-[#2f3344]">
                                    Banner Image
                                </label>
                                <div
                                    onClick={() =>
                                        bannerInputRef.current?.click()
                                    }
                                    className="w-full h-24 rounded-[12px] bg-slate-50 border-2 border-dashed border-[#eef0f2] hover:border-[#673ab7] hover:bg-[#f4f0ff]/20 transition-all cursor-pointer overflow-hidden group relative"
                                >
                                    {data.banner_image ? (
                                        <img
                                            src={
                                                typeof data.banner_image ===
                                                "string"
                                                    ? data.banner_image
                                                    : URL.createObjectURL(
                                                          data.banner_image,
                                                      )
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                            <CloudUpload size={24} />
                                            <span className="text-[11px] font-bold mt-1">
                                                Upload Banner
                                            </span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={bannerInputRef}
                                        className="hidden"
                                        onChange={(e) =>
                                            setData(
                                                "banner_image",
                                                e.target.files[0],
                                            )
                                        }
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#673ab7] text-white px-8 py-3 rounded-[10px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all flex items-center gap-2 shadow-lg shadow-[#673ab7]/10 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {processing
                                ? "Saving..."
                                : "Save Platform Settings"}
                        </button>
                        <button
                            type="button"
                            className="bg-[#f8f9fa] text-[#727586] px-8 py-3 rounded-[10px] font-bold text-[14px] hover:bg-slate-100 transition-all flex items-center gap-2 border border-[#eef0f2]"
                        >
                            <LucideX size={18} />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

function XIcon({ size, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
