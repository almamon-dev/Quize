import React, { useState, useRef, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Home,
    Globe,
    LayoutGrid,
    Waves,
    Mail,
    Cloud,
    CreditCard,
    Store,
    ChevronRight,
    ChevronsLeft,
    Settings,
    ShieldCheck,
    DollarSign,
    Cog,
    Users,
    FolderTree,
    Smartphone,
    Monitor,
    CircleDollarSign,
    Hexagon,
    LogOut,
    User,
    Plus,
    GraduationCap,
    Briefcase,
    MessageSquare,
    FolderKanban,
    Award,
    BarChart,
    Utensils,
    Building2,
    Calendar,
} from "lucide-react";

const t = {
    nav: {
        home: "Home",
        blogs: "Blogs",
        all_blogs: "All Blogs",
        add_new: "Add New",
        content: "Content",
        categories: "Categories",
        subcategories: "Subcategories",
        subscribers: "Subscribers",
        account: "Account",
        users: "Users",
        roles: "Roles",
        permissions: "Permissions",
        settings: "Settings",
        general_settings: "General Settings",
        website_settings: "Website Settings",
        system_settings: "System Settings",
        financial_settings: "Financial Settings",
        other_settings: "Other Settings",
        logout: "Logout",
        admin_panel: "Admin Panel",
    },
};

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
    const { url, props } = usePage();
    const { sidebarCategories = [], auth } = props;
    const currentPath = url.split("?")[0];
    const userPermissions = auth.user?.permissions || [];

    const [openMenus, setOpenMenus] = useState(() => {
        // Initialize open menus based on current path
        if (currentPath.startsWith("/admin/blogs")) {
            return { blogs: true };
        }
        if (currentPath.startsWith("/admin/blogs")) {
            return { blogs: true };
        }
        if (
            currentPath.startsWith("/admin/categories") ||
            currentPath.startsWith("/admin/sub-categories") ||
            currentPath.startsWith("/admin/subscribers")
        ) {
            return { content: true };
        }
        if (
            currentPath.startsWith("/admin/roles") ||
            currentPath.startsWith("/admin/permissions") ||
            currentPath.startsWith("/admin/users")
        ) {
            return { account: true };
        }
        if (currentPath.startsWith("/admin/billing")) {
            return { billing: true };
        }
        if (currentPath.startsWith("/admin/settings/website")) {
            return { website: true };
        }
        if (currentPath.startsWith("/admin/settings/financial")) {
            return { financial: true };
        }
        if (currentPath.startsWith("/admin/settings/other")) {
            return { other: true };
        }
        return {};
    });

    const menuGroups = [
        {
            title: "Settings",
            items: [
                {
                    label: "System Settings",
                    icon: <Cog size={18} />,
                    path: "/admin/settings/system",
                    route: "admin.settings.system",
                },
                {
                    label: "Logout",
                    path: "/logout",
                    icon: <LogOut />,
                    method: "post",
                },
            ],
        },
    ];

    const legacyMenuItems = [
        {
            label: t.nav.home,
            path: "/dashboard",
            icon: <Home />,
            route: "dashboard",
        },
        {
            label: "Quizzes",
            path: "/admin/quizzes",
            icon: <GraduationCap size={18} />,
            route: "admin.quizzes.index",
        },
        {
            label: "Quiz Results",
            path: "/admin/quizzes/results",
            icon: <Award size={18} />,
            route: "admin.quizzes.results",
        },
        {
            label: "Departments",
            path: "/admin/departments",
            icon: <Building2 size={18} />,
            route: "admin.departments.*",
        },
        {
            label: "Jobs",
            path: "/admin/jobs",
            icon: <Briefcase size={18} />,
            route: "admin.jobs.index",
        },
        {
            label: "CV Management",
            path: "/admin/cv-management",
            icon: <LayoutGrid size={18} />,
            route: "admin.cv_management.index",
        },
        {
            label: "Interviews",
            path: "/admin/interviews",
            icon: <Calendar size={18} />,
            route: "admin.interviews.index",
        },
        {
            label: "Candidates",
            path: "/admin/applications",
            icon: <Users size={18} />,
            route: "admin.applications.index",
        },
        {
            label: "Email Templates",
            path: "/admin/email-templates",
            icon: <Mail size={18} />,
            route: "admin.email-templates.*",
        },
    ];

    const hasPermission = (permission) => {
        if (!permission) return true;
        return userPermissions.includes(permission);
    };

    const getFilteredItems = (items) => {
        return items
            .map((item) => {
                if (item.children) {
                    const filteredChildren = item.children.filter((child) =>
                        hasPermission(child.permission),
                    );
                    if (filteredChildren.length === 0) return null;
                    return { ...item, children: filteredChildren };
                }
                return hasPermission(item.permission) ? item : null;
            })
            .filter(Boolean);
    };

    const filteredMenuGroups = menuGroups
        .map((group) => ({
            ...group,
            items: getFilteredItems(group.items),
        }))
        .filter((group) => group.items.length > 0);

    const filteredLegacyItems = getFilteredItems(legacyMenuItems);

    const checkActive = (item) => {
        if (typeof route !== "undefined" && item.route) {
            if (route().current(item.route)) return true;
        }
        return currentPath === item.path;
    };

    const renderMenuItem = (item) => {
        const active = checkActive(item);
        const isOpen = openMenus[item.key];
        const isLogout = item.label === "Logout";

        const content = (
            <>
                {/* Active Indicator Bar */}
                {!isCollapsed && active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-[#0a66c2]" />
                )}

                {/* Icon */}
                <div
                    className={`${isCollapsed ? "mb-1" : "mr-3"} transition-transform duration-200 group-hover:scale-110 ${active || isOpen ? "text-[#0a66c2]" : "text-slate-400 group-hover:text-[#0a66c2]"}`}
                >
                    {React.cloneElement(item.icon, {
                        size: isCollapsed ? 24 : 18,
                        strokeWidth: active || isOpen ? 2.5 : 1.5,
                    })}
                </div>

                {/* Label & Badge */}
                {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                        <span
                            className={`leading-tight transition-all duration-300 text-[14px] truncate
                            ${active || isOpen ? "text-[#0a66c2] font-bold" : "text-slate-600 font-medium"}`}
                        >
                            {item.label}
                        </span>
                        {item.badge && (
                            <span className="ml-2 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#f44336] text-white text-[10px] font-black rounded-full shadow-sm animate-pulse">
                                {item.badge}
                            </span>
                        )}
                    </div>
                )}

                {/* Chevron for expandable or just as a visual guide */}
                {!isCollapsed && !isLogout && (
                    <ChevronRight
                        size={14}
                        className={`transition-all duration-200 text-slate-300 group-hover:text-slate-500 ${isOpen ? "rotate-90" : ""} ${item.children ? "" : "opacity-60"}`}
                    />
                )}

                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {item.label}
                    </div>
                )}
            </>
        );

        if (item.children) {
            return (
                <div key={item.label}>
                    <button
                        onClick={() =>
                            setOpenMenus((prev) => ({
                                ...prev,
                                [item.key]: !prev[item.key],
                            }))
                        }
                        className={`w-full flex transition-all duration-200 group relative rounded-lg
                            ${
                                isCollapsed
                                    ? "flex-col items-center justify-center py-4 px-1"
                                    : "flex-row items-center py-2.5 px-4"
                            }
                            ${
                                active || isOpen
                                    ? "bg-gradient-to-r from-[#0a66c2]/10 via-[#0a66c2]/5 to-transparent text-[#0a66c2]"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                    >
                        {content}
                    </button>

                    {/* Sub-menu items */}
                    {!isCollapsed && isOpen && (
                        <div className="ml-4 mt-1">
                            {item.children.map((child) => (
                                <Link
                                    key={child.label}
                                    href={child.path}
                                    className={`flex items-center gap-3 py-2 px-3 rounded-lg text-[13px] transition-all hover:bg-slate-50 relative overflow-hidden
                                        ${
                                            currentPath === child.path ||
                                            (child.route &&
                                                typeof route !== "undefined" &&
                                                route().current(child.route))
                                                ? "text-[#0a66c2] bg-[#0a66c2]/5 font-bold"
                                                : "text-slate-500 hover:text-slate-900"
                                        }`}
                                >
                                    {(currentPath === child.path ||
                                        (child.route &&
                                            typeof route !== "undefined" &&
                                            route().current(child.route))) && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-r bg-[#0a66c2]" />
                                    )}
                                    {child.icon ? (
                                        React.cloneElement(child.icon, {
                                            size: 14,
                                        })
                                    ) : (
                                        <div
                                            className={`w-1.5 h-1.5 rounded-full ${currentPath === child.path || (child.route && typeof route !== "undefined" && route().current(child.route)) ? "bg-[#0a66c2]" : "bg-slate-300"}`}
                                        />
                                    )}
                                    <span>{child.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        if (item.method === "post") {
            return (
                <Link
                    key={item.label}
                    href={item.path}
                    method="post"
                    as="button"
                    className={`w-full flex transition-all duration-200 group relative rounded-lg
                        ${
                            isCollapsed
                                ? "flex-col items-center justify-center py-4 px-1"
                                : "flex-row items-center py-2.5 px-4"
                        }
                        ${
                            active
                                ? "bg-gradient-to-r from-[#0a66c2]/10 via-[#0a66c2]/5 to-transparent text-[#0a66c2]"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                >
                    {content}
                </Link>
            );
        }

        return (
            <Link
                key={item.label}
                href={item.path}
                className={`w-full flex transition-all duration-200 group relative rounded-lg
                    ${
                        isCollapsed
                            ? "flex-col items-center justify-center py-4 px-1"
                            : "flex-row items-center py-2.5 px-4"
                    }
                    ${
                        active
                            ? "bg-gradient-to-r from-[#0a66c2]/10 via-[#0a66c2]/5 to-transparent text-[#0a66c2]"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
            >
                {content}
            </Link>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Collapse Toggle Button */}
            <button
                onClick={toggleCollapse}
                className="absolute -right-3.5 top-5 z-50 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0a66c2] shadow-sm transition-transform duration-300"
                style={{
                    transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                }}
            >
                <ChevronsLeft size={14} strokeWidth={3} />
            </button>

            {/* Logo Section */}
            <div
                className={`h-[70px] flex items-center px-6 transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "justify-start"}`}
            >
                <div className="min-w-[35px] w-[35px] h-[35px] bg-[#0a66c2] rounded-lg flex items-center justify-center text-white shadow-sm">
                    <Cloud size={20} fill="currentColor" />
                </div>
                {!isCollapsed && (
                    <span className="ml-3 font-bold text-slate-800 text-lg tracking-tight animate-in fade-in duration-500">
                        {t.nav.admin_panel}
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col pt-4 overflow-y-auto no-scrollbar px-2">
                {/* Legacy Items */}
                <div className="space-y-1 mb-6">
                    {filteredLegacyItems.map((item) => renderMenuItem(item))}
                </div>

                {/* Sectioned Navigation */}
                {filteredMenuGroups.map((group) => (
                    <div key={group.title} className="mb-6">
                        {!isCollapsed && (
                            <div className="px-4 pt-4 pb-2 border-t border-slate-50 mt-4 mb-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[1.5px] text-[#8da4c1]">
                                    {group.title}
                                </h3>
                            </div>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => renderMenuItem(item))}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
