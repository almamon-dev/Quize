import { Link } from "@inertiajs/react";
import { Briefcase, LogIn, LayoutDashboard } from "lucide-react";

export default function MainLayout({ auth, children }) {
    return (
        <div className="min-h-screen bg-white">
            {/* Header / Navbar */}
            <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
                            <Briefcase size={24} />
                        </div>
                        <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">
                            Nexus<span className="text-blue-600">Hire</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-8">
                        <Link
                            href={route("jobs.index")}
                            className="text-sm font-black text-gray-500 hover:text-blue-600 uppercase tracking-widest transition-colors"
                        >
                            Careers
                        </Link>

                        {auth?.user ? (
                            <Link
                                href={route("dashboard")}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route("login")}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                            >
                                <LogIn size={16} />
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-20">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 py-16 px-6 text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Briefcase size={20} />
                            </div>
                            <span className="text-lg font-black tracking-tighter uppercase">
                                Nexus<span className="text-blue-400">Hire</span>
                            </span>
                        </div>
                        <p className="text-gray-400 font-medium max-w-sm leading-relaxed">
                            Revolutionizing tech recruitment through data-driven
                            insights and AI-powered skill verification.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-blue-400">
                            Platform
                        </h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-400">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-white transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("jobs.index")}
                                    className="hover:text-white transition-colors"
                                >
                                    Job Board
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Skill Tests
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-blue-400">
                            Company
                        </h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-400">
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} NexusHire. All rights
                    reserved.
                </div>
            </footer>
        </div>
    );
}
