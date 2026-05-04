import React, { useMemo, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { FiMenu, FiHome, FiCalendar, FiFileText, FiBell, FiSearch, FiEdit3, FiClipboard, FiLogOut, FiX, FiUser } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";

const FacultyLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const menuItems = useMemo(
    () => [
      { label: "Dashboard", icon: <FiHome />, to: "/faculty?page=home" },
      { label: "Timetable", icon: <FiCalendar />, to: "/faculty?page=timetable" },
      { label: "Material", icon: <FiFileText />, to: "/faculty?page=material" },
      { label: "Notice", icon: <FiBell />, to: "/faculty?page=notice" },
      { label: "Student Info", icon: <FiSearch />, to: "/faculty?page=student%20info" },
      { label: "Marks", icon: <FiEdit3 />, to: "/faculty?page=marks" },
      { label: "Exam", icon: <FiClipboard />, to: "/faculty?page=exam" },
    ],
    []
  );

  const isActive = (path) => {
    const [menuPath, query] = path.split("?");
    if (menuPath !== location.pathname) return false;
    if (!query) return true;
    return location.search.replace("?", "") === query;
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-100">
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-slate-800">Faculty Panel</span>
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 rounded-lg border border-slate-300 text-slate-700"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
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
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <Sidebar
            collapsed={collapsed}
            backgroundColor="#f0fdf4"
            width="280px"
            collapsedWidth="88px"
            rootStyles={{
              borderRight: "1px solid #bbf7d0",
              height: "100vh",
              position: "sticky",
              top: 0,
            }}
          >
            <div className="px-4 py-5 border-b border-green-200 flex items-center justify-between">
              {!collapsed && (
                <div>
                  <h2 className="text-green-900 font-semibold text-lg">Faculty Workspace</h2>
                </div>
              )}
              <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="text-green-700 hover:text-green-900 p-2 rounded-md hover:bg-green-100"
              >
                <FiMenu />
              </button>
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
                    component={<Link to={item.to} onClick={() => setMobileOpen(false)} />}
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
                  button: ({ active }) => ({
                    borderRadius: "12px",
                    color: active ? "#ffffff" : "#166534",
                    background: active
                      ? "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)"
                      : "transparent",
                    padding: "12px 14px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }),
                  icon: ({ active }) => ({
                    color: active ? "#ffffff" : "#16a34a",
                  }),
                }}
              >
                <MenuItem
                  icon={<FiUser />}
                  component={<Link to="/faculty/profile" onClick={() => setMobileOpen(false)} />}
                  active={isActive("/faculty/profile")}
                >
                  My Profile
                </MenuItem>
              </Menu>

              <Menu
                menuItemStyles={{
                  button: {
                    borderRadius: "12px",
                    color: "#b91c1c",
                    backgroundColor: "#fef2f2",
                    padding: "12px 14px",
                    fontWeight: 600,
                  },
                }}
              >
                <MenuItem icon={<FiLogOut />} onClick={logout}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </Sidebar>
        </div>

        <main className="flex-1 h-full overflow-y-auto overflow-x-auto p-4 md:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;
