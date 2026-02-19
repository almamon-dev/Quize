import { Head, Link } from "@inertiajs/react";
import { Briefcase, MapPin, Clock, ArrowRight, Star } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";

export default function Index({ auth, jobs }) {
    return (
        <MainLayout auth={auth}>
            <Head title="Careers | Join Our Team" />

            <div className="bg-gradient-to-br from-gray-900 to-blue-900 py-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">
                        Join Our <span className="text-blue-400">Team</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">
                        We are looking for passionate individuals to build the
                        future of software with us.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto py-16 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {jobs.map((job) => (
                        <Link
                            key={job.id}
                            href={route("jobs.show", job.slug)}
                            className="group block bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-blue-500 hover:shadow-blue-200/40 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Briefcase size={24} />
                                </div>
                                <span className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs font-black uppercase tracking-widest">
                                    {job.type.replace("_", " ")}
                                </span>
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {job.title}
                            </h2>
                            <p className="text-blue-600 font-black text-sm uppercase mb-2">
                                {job.company_name || "Nexus Tech"}
                            </p>
                            <div className="flex flex-wrap gap-4 mb-6">
                                <p className="text-gray-500 font-bold flex items-center gap-2">
                                    <Star size={16} className="text-blue-400" />
                                    {job.department || "General"}
                                </p>
                                <p className="text-gray-500 font-bold flex items-center gap-2">
                                    <MapPin
                                        size={16}
                                        className="text-gray-400"
                                    />
                                    <span className="capitalize">
                                        {job.location_type?.replace("_", "-") ||
                                            "On-site"}
                                    </span>
                                    {job.location && (
                                        <span className="text-xs text-gray-400 font-medium">
                                            ({job.location})
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                <span className="text-sm font-black text-blue-600 uppercase tracking-tighter flex items-center gap-1">
                                    View Details <ArrowRight size={16} />
                                </span>
                                <span className="text-sm font-bold text-gray-400">
                                    Posted{" "}
                                    {new Date(
                                        job.created_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {jobs.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">🏜️</div>
                        <h2 className="text-2xl font-black text-gray-900">
                            No open positions right now
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Check back later or follow us on social media.
                        </p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
