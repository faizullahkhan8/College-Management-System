import React, { useMemo, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
    FiMenu,
    FiHome,
    FiCalendar,
    FiFileText,
    FiBell,
    FiSearch,
    FiEdit3,
    FiClipboard,
    FiLogOut,
    FiX,
    FiUser,
    FiCheckSquare,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const FacultyLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const logout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userType");
        navigate("/");
    };

    const menuItems = useMemo(
        () => [
            { label: "Dashboard", icon: <FiHome />, to: "/faculty" },
            {
                label: "Timetable",
                icon: <FiCalendar />,
                to: "/faculty/timetable",
            },
            {
                label: "Material",
                icon: <FiFileText />,
                to: "/faculty/material",
            },
            { label: "Notice", icon: <FiBell />, to: "/faculty/notice" },
            {
                label: "Student Info",
                icon: <FiSearch />,
                to: "/faculty/student-info",
            },
            {
                label: "Attendance",
                icon: <FiCheckSquare />,
                to: "/faculty/attendance",
            },
            { label: "Marks", icon: <FiEdit3 />, to: "/faculty/marks" },
            { label: "Exam", icon: <FiClipboard />, to: "/faculty/exam" },
            { label: "Profile", icon: <FiUser />, to: "/faculty/profile" },
        ],
        [],
    );

    const isActive = (path) => location.pathname === path;

    return (
        <div
            className={`h-screen flex overflow-hidden ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
        >
            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Sidebar
                    width="260px"
                    className={`h-screen shadow-xl ${isDark ? "bg-gray-800" : "bg-white"}`}
                >
                    <div
                        className={`lg:hidden sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"}`}
                    >
                        <h1
                            className={`text-xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
                        >
                            Faculty Portal
                        </h1>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <button
                                onClick={() => setMobileOpen(false)}
                                className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                            >
                                <FiX
                                    className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                                />
                            </button>
                        </div>
                    </div>
                    <Menu 
                        className="mt-4"
                        menuItemStyles={{
                            button: ({ active }) => ({
                                "&:hover": {
                                    backgroundColor: isDark ? "#374151" : "#f3f4f6",
                                    color: isDark ? "#34d399" : "#16a34a",
                                },
                                backgroundColor: active 
                                    ? (isDark ? "#374151" : "#f0fdf4") 
                                    : "transparent",
                                color: active 
                                    ? (isDark ? "#34d399" : "#16a34a") 
                                    : (isDark ? "#d1d5db" : "#4b5563"),
                                borderRight: active ? "4px solid #22c55e" : "none",
                            }),
                            icon: ({ active }) => ({
                                color: active 
                                    ? (isDark ? "#34d399" : "#16a34a") 
                                    : (isDark ? "#9ca3af" : "#6b7280"),
                            }),
                        }}
                    >
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.to}
                                icon={item.icon}
                                component={<Link to={item.to} />}
                                onClick={() => setMobileOpen(false)}
                                active={isActive(item.to)}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </Menu>
                    <div className="mt-auto px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                        <Menu
                            menuItemStyles={{
                                button: {
                                    "&:hover": {
                                        backgroundColor: isDark ? "#374151" : "#fef2f2",
                                        color: isDark ? "#f87171" : "#dc2626",
                                    },
                                    color: isDark ? "#fca5a5" : "#dc2626",
                                    borderRadius: "12px",
                                },
                                icon: { color: isDark ? "#fca5a5" : "#dc2626" },
                            }}
                        >
                            <MenuItem icon={<FiLogOut />} onClick={logout}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                </Sidebar>
            </div>

            {/* Desktop Sidebar - Fixed Full Height */}
            <div className="hidden lg:block h-screen flex-shrink-0">
                <Sidebar
                    collapsed={collapsed}
                    width="260px"
                    collapsedWidth="80px"
                    className={`h-screen shadow-lg ${isDark ? "bg-gray-800 text-white border-r border-gray-700" : "bg-white text-gray-800"}`}
                    backgroundColor={isDark ? "#1f2937" : "#ffffff"}
                >
                    <div
                        className={`flex items-center justify-between p-4 border-b h-16 ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                        {!collapsed && (
                            <h1
                                className={`text-xl font-bold truncate ${isDark ? "text-green-400" : "text-green-600"}`}
                            >
                                Faculty Portal
                            </h1>
                        )}
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                            >
                                <FiMenu
                                    className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                                />
                            </button>
                        </div>
                    </div>
                    <Menu 
                        className="mt-4"
                        menuItemStyles={{
                            button: ({ active }) => ({
                                "&:hover": {
                                    backgroundColor: isDark ? "#374151" : "#f3f4f6",
                                    color: isDark ? "#34d399" : "#16a34a",
                                },
                                backgroundColor: active 
                                    ? (isDark ? "#374151" : "#f0fdf4") 
                                    : "transparent",
                                color: active 
                                    ? (isDark ? "#34d399" : "#16a34a") 
                                    : (isDark ? "#d1d5db" : "#4b5563"),
                                borderRight: active ? "4px solid #22c55e" : "none",
                            }),
                            icon: ({ active }) => ({
                                color: active 
                                    ? (isDark ? "#34d399" : "#16a34a") 
                                    : (isDark ? "#9ca3af" : "#6b7280"),
                            }),
                        }}
                    >
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.to}
                                icon={item.icon}
                                component={<Link to={item.to} />}
                                active={isActive(item.to)}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </Menu>
                    <div className="mt-auto px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                        <Menu
                            menuItemStyles={{
                                button: {
                                    "&:hover": {
                                        backgroundColor: isDark ? "#374151" : "#fef2f2",
                                        color: isDark ? "#f87171" : "#dc2626",
                                    },
                                    color: isDark ? "#fca5a5" : "#dc2626",
                                    borderRadius: "12px",
                                },
                                icon: { color: isDark ? "#fca5a5" : "#dc2626" },
                            }}
                        >
                            <MenuItem icon={<FiLogOut />} onClick={logout}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                </Sidebar>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between flex-shrink-0 z-30">
                    <h1 className="text-lg font-bold text-green-600">
                        Faculty Portal
                    </h1>
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <FiMenu className="w-6 h-6" />
                    </button>
                </div>

                {/* Page Content - Scrollable */}
                <main
                    className={`flex-1 p-4 lg:p-8 overflow-y-auto ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default FacultyLayout;
