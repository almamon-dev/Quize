import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function Edit() {
    return (
        <AdminLayout>
            <Head title="Settings" />
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Settings
                </h1>
                <p className="text-gray-500">
                    Settings page is under construction.
                </p>
            </div>
        </AdminLayout>
    );
}
