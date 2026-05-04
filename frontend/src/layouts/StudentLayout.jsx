import React, { useMemo, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
    FiMenu,
    FiHome,
    FiCalendar,
    FiFileText,
    FiBell,
    FiClipboard,
    FiLogOut,
    FiX,
    FiUser,
    FiBook,
    FiAward,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";

const StudentLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userType");
        navigate("/login");
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
            { label: "Profile", icon: <FiUser />, to: "/student/profile" },
        ],
        [],
    );

    const isActive = (path) => location.pathname === path;

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
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
                <Sidebar width="260px" className="h-screen bg-white shadow-xl">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h1 className="text-xl font-bold text-green-600">
                            Student Portal
                        </h1>
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
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
                    <div className="flex items-center justify-between p-4 border-b h-16">
                        {!collapsed && (
                            <h1 className="text-xl font-bold text-green-600 truncate">
                                Student Portal
                            </h1>
                        )}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiMenu className="w-5 h-5 text-gray-600" />
                        </button>
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
                <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between flex-shrink-0 z-30">
                    <h1 className="text-lg font-bold text-green-600">
                        Student Portal
                    </h1>
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <FiMenu className="w-6 h-6" />
                    </button>
                </div>

                {/* Page Content - Scrollable */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
