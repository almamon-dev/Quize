import React, { useState } from "react";
import Sidebar from "@/Components/Navigation/Admin/Sidebar";
import Header from "@/Components/Navigation/Admin/Header";

export default function AdminLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`transition-all duration-300 ease-in-out border-r border-gray-200 bg-white shadow-sm flex-shrink-0
                ${isCollapsed ? "w-20" : "w-64"}`}
            >
                <Sidebar
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header isCollapsed={isCollapsed} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
