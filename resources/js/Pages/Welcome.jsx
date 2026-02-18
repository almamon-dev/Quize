import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-white font-sans flex items-center justify-center">
            <Head title="Welcome | Coming Soon" />

            {/* Coming Soon / Error Section */}
            <section className="w-full py-24 px-6 relative overflow-hidden">
                {/* Background Pattern - using bg_1.png for the stripes/rays effect seen in screenshot */}
                <div className="absolute inset-0 z-0 opacity-5">
                    <img
                        src="/images/bg_1.png"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="mb-12">
                        <img
                            src="/images/404-error.jpg"
                            alt="Error Illustration"
                            className="max-w-md mx-auto rounded-3xl shadow-2xl mb-10"
                            onError={(e) => (e.target.style.display = "none")}
                        />
                        <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-8 px-4">
                            Sorry, the page you are looking for does not exist.
                            Comming Soon
                        </h2>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="px-12 py-3 bg-[#1A8754] text-white font-medium rounded-lg hover:bg-[#157347] transition-colors min-w-[240px] text-center shadow-md active:scale-95"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/"
                                    className="px-12 py-3 bg-[#1A8754] text-white font-medium rounded-lg hover:bg-[#157347] transition-colors min-w-[240px] text-center shadow-md active:scale-95"
                                >
                                    Back to Home
                                </Link>
                                <Link
                                    href={route("login")}
                                    className="px-12 py-3 bg-[#0D6EFD] text-white font-medium rounded-lg hover:bg-[#0B5ED7] transition-colors min-w-[240px] text-center shadow-md active:scale-95"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
