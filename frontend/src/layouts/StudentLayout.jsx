import React, { useMemo, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
    FiMenu,
    FiHome,
    FiBookOpen,
    FiBell,
    FiDollarSign,
    FiLogOut,
    FiX,
    FiUser,
    FiFileText,
    FiCalendar,
    FiClipboard,
    FiAward,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const StudentLayout = ({ children }) => {
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
            { label: "Dashboard", icon: <FiHome />, to: "/student" },
            {
                label: "Timetable",
                icon: <FiCalendar />,
                to: "/student/timetable",
            },
            {
                label: "Material",
                icon: <FiFileText />,
                to: "/student/material",
            },
            { label: "Notice", icon: <FiBell />, to: "/student/notice" },
            { label: "Exam", icon: <FiClipboard />, to: "/student/exam" },
            { label: "Marks", icon: <FiAward />, to: "/student/marks" },
            { label: "Fees", icon: <FiDollarSign />, to: "/student/fees" },
            { label: "Profile", icon: <FiUser />, to: "/student/profile" },
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
                            Student Portal
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
                    <Menu className="mt-4">
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.to}
                                icon={item.icon}
                                component={<Link to={item.to} />}
                                onClick={() => setMobileOpen(false)}
                                className={
                                    isActive(item.to)
                                        ? "bg-green-50 text-green-600"
                                        : "text-gray-600 hover:bg-gray-50"
                                }
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                        <MenuItem
                            icon={<FiLogOut />}
                            onClick={logout}
                            className="text-red-600 hover:bg-red-50 mt-4"
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Sidebar>
            </div>

            {/* Desktop Sidebar - Fixed Full Height */}
            <div className="hidden lg:block h-screen flex-shrink-0">
                <Sidebar
                    collapsed={collapsed}
                    width="260px"
                    collapsedWidth="80px"
                    className="h-screen bg-white shadow-lg"
                >
                    <div
                        className={`flex items-center justify-between p-4 border-b h-16 ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                        {!collapsed && (
                            <h1
                                className={`text-xl font-bold truncate ${isDark ? "text-green-400" : "text-green-600"}`}
                            >
                                Student Portal
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
                    <Menu className="mt-4">
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.to}
                                icon={item.icon}
                                component={<Link to={item.to} />}
                                className={
                                    isActive(item.to)
                                        ? "bg-green-50 text-green-600"
                                        : "text-gray-600 hover:bg-gray-50"
                                }
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                        <MenuItem
                            icon={<FiLogOut />}
                            onClick={logout}
                            className="text-red-600 hover:bg-red-50 mt-4"
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Sidebar>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile Header */}
                <div
                    className={`lg:hidden shadow-sm p-4 flex items-center justify-between flex-shrink-0 z-30 ${isDark ? "bg-gray-800" : "bg-white"}`}
                >
                    <h1
                        className={`text-lg font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
                    >
                        Student Portal
                    </h1>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileOpen(true)}
                            className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                        >
                            <FiMenu
                                className={`w-6 h-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                            />
                        </button>
                    </div>
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

export default StudentLayout;
