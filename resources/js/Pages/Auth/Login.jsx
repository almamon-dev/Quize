import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Mail,
    Lock,
    ChevronRight,
    Eye,
    EyeOff,
    Shield,
    Sparkles,
} from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 via-white to-slate-50 font-sans">
            <Head title="Login | Admin Portal" />

            {/* Left Side: Premium Brand Panel with Abstract Pattern */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                            backgroundSize: "40px 40px",
                        }}
                    ></div>
                </div>

                {/* Gradient Orbs */}
                <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-40 left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                {/* Content */}
                <div className="relative z-10 p-16 flex flex-col justify-between w-full h-full">
                    {/* Premium Logo Badge */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-lg rounded-full"></div>
                            <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                                <img
                                    src="/images/logo.png"
                                    alt="Company Logo"
                                    className="h-8 w-auto brightness-0 invert"
                                />
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-light tracking-[6px] text-white/60 uppercase">
                                Powered by
                            </span>
                            <span className="block text-xl font-bold text-white tracking-tight">
                                Quiz OS
                            </span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-lg">
                        <div className="space-y-8">
                            {/* Premium Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                                <span className="text-xs font-medium text-white/90">
                                    Enterprise Assessment Platform
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-7xl font-bold text-white leading-[1.1] tracking-tight">
                                Welcome
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400">
                                    Administrator
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-white/60 leading-relaxed max-w-md">
                                Access your centralized dashboard to manage
                                assessments, analyze performance metrics, and
                                orchestrate digital examinations at scale.
                            </p>

                            {/* Feature Pills */}
                            <div className="flex flex-wrap gap-3 pt-4">
                                {[
                                    "Real-time Analytics",
                                    "Secure Access",
                                    "Batch Management",
                                ].map((feature) => (
                                    <div
                                        key={feature}
                                        className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                                    >
                                        <span className="text-xs font-medium text-white/80">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="absolute bottom-16 left-16 flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white/20 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white/20 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <span className="text-xs text-white/40 font-medium tracking-wide">
                                SOC2 Type II Certified
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40 font-medium tracking-wide">
                            © 2026 Softvence. All rights reserved.
                        </span>
                        <div className="flex gap-8">
                            <Link
                                href="#"
                                className="text-white/40 hover:text-white/60 transition-colors"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="#"
                                className="text-white/40 hover:text-white/60 transition-colors"
                            >
                                Terms
                            </Link>
                            <Link
                                href="#"
                                className="text-white/40 hover:text-white/60 transition-colors"
                            >
                                Security
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Sophisticated Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
                <div className="w-full max-w-md space-y-10">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-between">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="h-10 w-auto"
                        />
                        <span className="text-sm font-light text-gray-400">
                            Quiz OS
                        </span>
                    </div>

                    {/* Header */}
                    <div className="space-y-3">
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                            Sign in to your account
                        </h2>
                        <p className="text-gray-500 text-base">
                            Welcome back! Please enter your credentials to
                            access the admin panel.
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <p className="text-sm text-emerald-600 font-medium">
                                {status}
                            </p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="admin@company.com"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.email}
                                className="mt-1"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <InputError
                                message={errors.password}
                                className="mt-1"
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                    Remember me for 30 days
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 active:scale-[0.98]"
                        >
                            <span>
                                {processing
                                    ? "Authenticating..."
                                    : "Sign in to Dashboard"}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Back to Home */}
                    <div className="pt-6 border-t border-gray-100">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Back to homepage</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Animation Styles */}
            <style jsx>{`
                @keyframes blob {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
