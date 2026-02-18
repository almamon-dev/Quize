import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    Mail,
    Shield,
    Key,
    Save,
    Loader2,
    Cpu,
    X,
    Server,
    Globe,
    ChevronRight,
    Home,
    Settings as SettingsIcon,
    Code,
    MessageSquare,
    CheckCircle2,
    Eye,
    EyeOff,
    Copy,
    Check,
} from "lucide-react";
import RichTextEditor from "@/Components/RichTextEditor";

export default function SystemSettings({ settings }) {
    const [activeTab, setActiveTab] = useState("email");
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (data.openai_api_key) {
            navigator.clipboard.writeText(data.openai_api_key);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const { data, setData, post, processing, errors } = useForm({
        mail_driver: settings.mail_driver || "smtp",
        mail_host: settings.mail_host || "",
        mail_port: settings.mail_port || "587",
        mail_username: settings.mail_username || "",
        mail_password: settings.mail_password || "",
        mail_encryption: settings.mail_encryption || "tls",
        mail_from_address: settings.mail_from_address || "",
        mail_from_name: settings.mail_from_name || "",
        openai_api_key: settings.openai_api_key || "",
        email_footer: settings.email_footer || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.settings.system.update"));
    };

    const tabs = [
        { id: "email", label: "Email Server", icon: Mail },
        { id: "api", label: "AI & API Tools", icon: Cpu },
    ];

    return (
        <AdminLayout>
            <Head title="System Settings" />

            <div className="max-w-9xl mx-auto pb-20 pt-4 px-4 sm:px-0 space-y-6">
                {/* Minimal Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[12px] font-medium text-slate-400/80">
                    <Link
                        href="/dashboard"
                        className="hover:text-[#673ab7] transition-colors flex items-center gap-1.5"
                    >
                        <Home size={13} />
                        Dashboard
                    </Link>
                    <ChevronRight size={12} className="opacity-50" />
                    <span>Settings</span>
                    <ChevronRight size={12} className="opacity-50" />
                    <span className="text-slate-600">System</span>
                </nav>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <h1 className="text-[24px] font-bold text-[#2f3344] tracking-tight">
                            System Configuration
                        </h1>
                        <p className="text-[13px] text-slate-400 mt-0.5">
                            Manage mail servers and platform integrations
                        </p>
                    </div>

                    {/* Minimal Tabs */}
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[13px] font-bold transition-all ${
                                    activeTab === tab.id
                                        ? "bg-white text-[#673ab7] shadow-sm border border-slate-100"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {activeTab === "email" && (
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
                            <div className="space-y-4">
                                <h3 className="text-[14px] font-bold text-[#2f3344] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#673ab7]"></div>
                                    SMTP Server Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-slate-600">
                                            Mail Driver
                                        </label>
                                        <input
                                            type="text"
                                            value={data.mail_driver}
                                            onChange={(e) =>
                                                setData(
                                                    "mail_driver",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full bg-slate-50/50 border-slate-200 rounded-lg px-4 py-2 text-[14px] focus:bg-white focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-slate-600">
                                            SMTP Host
                                        </label>
                                        <input
                                            type="text"
                                            value={data.mail_host}
                                            onChange={(e) =>
                                                setData(
                                                    "mail_host",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full bg-slate-50/50 border-slate-200 rounded-lg px-4 py-2 text-[14px] focus:bg-white focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-slate-600">
                                            Port
                                        </label>
                                        <input
                                            type="text"
                                            value={data.mail_port}
                                            onChange={(e) =>
                                                setData(
                                                    "mail_port",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full bg-slate-50/50 border-slate-200 rounded-lg px-4 py-2 text-[14px] focus:bg-white focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-slate-600">
                                            Encryption
                                        </label>
                                        <select
                                            value={data.mail_encryption}
                                            onChange={(e) =>
                                                setData(
                                                    "mail_encryption",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full bg-slate-50/50 border-slate-200 rounded-lg px-4 py-2 text-[14px] focus:bg-white focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="tls">TLS</option>
                                            <option value="ssl">SSL</option>
                                            <option value="none">None</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <h3 className="text-[14px] font-bold text-[#2f3344] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#673ab7]"></div>
                                    Authentication & Identity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-slate-600">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={data.mail_username}
                                            onChange={(e) =>
                                                setData(
                                                    "mail_username",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full bg-slate-50/50 border-slate-200 rounded-lg px-4 py-2 text-[14px] focus:bg-white focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-slate-600">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.mail_password}
                                            onChange={(e) =>
                                                setData(
                                                    "mail_password",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full bg-slate-50/50 border-slate-200 rounded-lg px-4 py-2 text-[14px] focus:bg-white focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-slate-600">
                                            From Address
                                        </label>
                                        <input
                                            type="email"
                                            value={data.mail_from_address}
                                            onChange={(e) =>
                                                setData(
                                                    "mail_from_address",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full bg-slate-50/50 border-slate-200 rounded-lg px-4 py-2 text-[14px] focus:bg-white focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-semibold text-slate-600">
                                            From Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.mail_from_name}
                                            onChange={(e) =>
                                                setData(
                                                    "mail_from_name",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full bg-slate-50/50 border-slate-200 rounded-lg px-4 py-2 text-[14px] focus:bg-white focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "api" && (
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-[14px] font-bold text-[#2f3344] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00b090]"></div>
                                External Integrations
                            </h3>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-semibold text-slate-600">
                                    OpenAI API Key
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                                        <Key size={16} />
                                    </div>
                                    <input
                                        type={showKey ? "text" : "password"}
                                        value={data.openai_api_key}
                                        onChange={(e) =>
                                            setData(
                                                "openai_api_key",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full bg-slate-50/50 border-slate-200 rounded-lg pl-10 pr-20 py-2 text-[14px] focus:bg-white focus:ring-2 focus:ring-[#673ab7]/10 focus:border-[#673ab7] transition-all"
                                        placeholder="sk-..."
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowKey(!showKey)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all"
                                            title={
                                                showKey
                                                    ? "Hide API Key"
                                                    : "Show API Key"
                                            }
                                        >
                                            {showKey ? (
                                                <EyeOff size={14} />
                                            ) : (
                                                <Eye size={14} />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all"
                                            title="Copy API Key"
                                        >
                                            {copied ? (
                                                <Check
                                                    size={14}
                                                    className="text-emerald-500"
                                                />
                                            ) : (
                                                <Copy size={14} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Right-Aligned Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6">
                        <button
                            type="button"
                            className="bg-slate-100 text-slate-600 px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#673ab7] text-white px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-[#5e35b1] transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#673ab7]/10"
                        >
                            {processing ? (
                                <Loader2 className="animate-spin" size={14} />
                            ) : (
                                <CheckCircle2 size={14} />
                            )}
                            {processing ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
