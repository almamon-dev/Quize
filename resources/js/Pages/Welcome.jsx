import { Head, Link } from "@inertiajs/react";
import {
    Briefcase,
    ArrowRight,
    CheckCircle2,
    TrendingUp,
    Users,
    Globe,
    MapPin,
    Clock,
    DollarSign,
    Rocket,
} from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";

export default function Welcome({ auth, jobs }) {
    return (
        <MainLayout auth={auth}>
            <Head title="Premium Recruitment & Quiz Platform" />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-white">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <img
                        src="/images/bg_1.png"
                        className="w-full h-full object-cover"
                        alt=""
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 animate-fade-in">
                                <Rocket size={14} />
                                The Future of Tech Hiring
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tighter">
                                Build Your{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Dream Team
                                </span>{" "}
                                with AI-Powered Insights
                            </h1>
                            <p className="text-xl text-gray-500 mb-10 max-w-2xl font-medium leading-relaxed">
                                Our platform combines smart recruitment with
                                advanced skill testing to help you find the
                                perfectly matched candidates faster than ever.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    href={route("jobs.index")}
                                    className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 flex items-center gap-2 group uppercase tracking-widest text-sm"
                                >
                                    Browse Open Roles
                                    <ArrowRight
                                        size={20}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href={route("register")}
                                        className="px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 font-black rounded-2xl hover:border-blue-200 transition-all flex items-center gap-2 uppercase tracking-widest text-sm"
                                    >
                                        Join as a Candidate
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                                    className="w-full h-full object-cover"
                                    alt="Team collaboration"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                            <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Stats */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                label: "Active Jobs",
                                count: "150+",
                                icon: Briefcase,
                                color: "text-blue-600",
                            },
                            {
                                label: "Total Candidates",
                                count: "12k+",
                                icon: Users,
                                color: "text-purple-600",
                            },
                            {
                                label: "Skills Verified",
                                count: "45k+",
                                icon: CheckCircle2,
                                color: "text-green-600",
                            },
                            {
                                label: "Companies",
                                count: "500+",
                                icon: Globe,
                                color: "text-indigo-600",
                            },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:border-blue-200 transition-all"
                            >
                                <div
                                    className={`p-4 bg-gray-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform ${stat.color}`}
                                >
                                    <stat.icon size={28} />
                                </div>
                                <div className="text-3xl font-black text-gray-900 mb-1">
                                    {stat.count}
                                </div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Jobs Section */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase">
                                Explore{" "}
                                <span className="text-blue-600">Latest</span>{" "}
                                Vacancies
                            </h2>
                            <p className="text-lg text-gray-500 font-medium">
                                We are actively hiring for multiple roles across
                                all departments. Find your next career move and
                                apply today.
                            </p>
                        </div>
                        <Link
                            href={route("jobs.index")}
                            className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest group border-b-2 border-blue-600 pb-1"
                        >
                            View All Positions
                            <ArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {jobs.map((job) => (
                            <Link
                                key={job.id}
                                href={route("jobs.show", job.slug)}
                                className="group relative block bg-white border border-gray-100 p-8 rounded-[2rem] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500"
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none border border-blue-100">
                                                {job.type.replace("_", " ")}
                                            </span>
                                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-widest">
                                                <Clock size={12} />
                                                {new Date(
                                                    job.created_at,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-all mb-2 leading-tight">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-500">
                                            <div className="flex items-center gap-1.5 min-w-[120px]">
                                                <TrendingUp
                                                    size={16}
                                                    className="text-blue-500"
                                                />
                                                {job.company_name ||
                                                    "Nexus Tech"}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                                <span className="capitalize">
                                                    {job.location_type?.replace(
                                                        "_",
                                                        "-",
                                                    ) || "On-site"}
                                                </span>
                                                {job.location && (
                                                    <span className="opacity-60 text-xs">
                                                        ({job.location})
                                                    </span>
                                                )}
                                            </div>
                                            {job.salary_range && (
                                                <div className="flex items-center gap-1.5 text-green-600">
                                                    <DollarSign size={16} />
                                                    {job.salary_range}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="hidden md:flex flex-wrap gap-2 justify-end max-w-[200px]">
                                            {(
                                                job.stack || [
                                                    "Laravel",
                                                    "React",
                                                    "AWS",
                                                ]
                                            )
                                                .slice(0, 3)
                                                .map((s, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-bold border border-gray-100"
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                        </div>
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                                            <ArrowRight
                                                size={20}
                                                className="-rotate-45"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {jobs.length === 0 && (
                            <div className="bg-gray-50 rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
                                <div className="text-5xl mb-6 opacity-30">
                                    🔍
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">
                                    No Active Positions
                                </h3>
                                <p className="text-gray-500 font-medium">
                                    We're not hiring at the moment, but check
                                    back soon!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto relative rounded-[3rem] bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900 p-12 md:p-24 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter leading-tight">
                            Ready to take the{" "}
                            <span className="text-blue-300 underline underline-offset-8">
                                Next Step
                            </span>{" "}
                            in your career?
                        </h2>
                        <p className="text-xl text-blue-100/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                            Join thousands of candidates who have found their
                            dream jobs through our Skill-Verification
                            technology.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                href={route("jobs.index")}
                                className="px-12 py-5 bg-white text-blue-900 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl uppercase tracking-widest text-sm"
                            >
                                Start Applying
                            </Link>
                            <Link
                                href={route("login")}
                                className="px-12 py-5 bg-blue-800/50 text-white border-2 border-blue-400/30 font-black rounded-2xl hover:bg-blue-800 transition-all uppercase tracking-widest text-sm"
                            >
                                Candidate Login
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
