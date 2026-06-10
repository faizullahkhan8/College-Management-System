import React, { useMemo, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
    FiMenu,
    FiHome,
    FiUsers,
    FiBookOpen,
    FiGitBranch,
    FiUser,
    FiLogOut,
    FiX,
    FiDollarSign,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const AdminLayout = ({ children }) => {
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
            { label: "Dashboard", icon: <FiHome />, to: "/admin" },
            { label: "Students", icon: <FiUsers />, to: "/admin/student" },
            { label: "Faculty", icon: <FiUsers />, to: "/admin/faculty" },
            { label: "Subjects", icon: <FiBookOpen />, to: "/admin/subject" },
            { label: "Branches", icon: <FiGitBranch />, to: "/admin/branch" },
            { label: "Fees", icon: <FiDollarSign />, to: "/admin/fees" },
            { label: "Profile", icon: <FiUser />, to: "/profile" },
        ],
        [],
    );

    const isActive = (path) => location.pathname === path;

    return (
        <div
            className={`h-screen overflow-hidden ${isDark ? "bg-gray-900" : "bg-slate-100"}`}
        >
            <div
                className={`lg:hidden sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"}`}
            >
                <span
                    className={`font-semibold ${isDark ? "text-gray-100" : "text-slate-800"}`}
                >
                    Admin Panel
                </span>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setMobileOpen((prev) => !prev)}
                        className={`p-2 rounded-lg border ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-slate-300 text-slate-700 hover:bg-gray-100"}`}
                    >
                        {mobileOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <div className="flex h-[calc(100vh-57px)] lg:h-screen">
                <div
                    className={`fixed lg:static z-50 h-full transition-transform duration-300 ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }`}
                >
                    <Sidebar
                        collapsed={collapsed}
                        backgroundColor={isDark ? "#1f2937" : "#f0fdf4"}
                        width="280px"
                        collapsedWidth="88px"
                        rootStyles={{
                            borderRight: `1px solid ${isDark ? "#374151" : "#bbf7d0"}`,
                            height: "100vh",
                            position: "sticky",
                            top: 0,
                        }}
                    >
                        <div
                            className={`px-4 py-5 flex items-center justify-between border-b ${isDark ? "border-gray-700" : "border-green-200"}`}
                        >
                            {!collapsed && (
                                <div>
                                    <h2
                                        className={`font-semibold text-lg ${isDark ? "text-green-400" : "text-green-900"}`}
                                    >
                                        Admin Portal
                                    </h2>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                                <button
                                    onClick={() =>
                                        setCollapsed((prev) => !prev)
                                    }
                                    className={`p-2 rounded-md transition-colors ${isDark ? "text-green-400 hover:bg-gray-700" : "text-green-700 hover:bg-green-100"}`}
                                >
                                    <FiMenu />
                                </button>
                            </div>
                        </div>

                        <div className="px-3 py-4">
                            <Menu
                                menuItemStyles={{
                                    button: ({ active }) => ({
                                        marginBottom: "8px",
                                        borderRadius: "12px",
                                        color: active ? "#ffffff" : "#166534",
                                        background: active
                                            ? "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)"
                                            : "transparent",
                                        fontWeight: active ? 600 : 500,
                                        padding: "12px 14px",
                                    }),
                                    icon: ({ active }) => ({
                                        color: active ? "#ffffff" : "#16a34a",
                                    }),
                                }}
                            >
                                {menuItems.map((item) => (
                                    <MenuItem
                                        key={item.to}
                                        icon={item.icon}
                                        component={
                                            <Link
                                                to={item.to}
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                            />
                                        }
                                        active={isActive(item.to)}
                                    >
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </div>

                        <div className="mt-auto px-3 py-4 border-t border-green-200">
                            <Menu
                                menuItemStyles={{
                                    button: {
                                        ":hover": {
                                            backgroundColor: "#ff0000aa",
                                        },
                                        borderRadius: "12px",
                                        color: "#b91c1c",
                                        backgroundColor: "#ff000090",
                                        padding: "12px 14px",
                                        fontWeight: 600,
                                    },
                                }}
                            >
                                <MenuItem
                                    style={{ color: "white" }}
                                    icon={<FiLogOut />}
                                    onClick={logout}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    </Sidebar>
                </div>

                <main
                    className={`flex-1 h-full overflow-y-auto overflow-x-auto p-4 md:p-6 lg:p-8 w-full ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
