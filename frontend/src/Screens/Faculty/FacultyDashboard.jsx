import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import DataTable from "../../components/DataTable";
import {
  FiUsers,
  FiBookOpen,
  FiClipboard,
  FiBell,
  FiArrowRight,
  FiEdit3,
  FiUpload,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = ["#16a34a", "#0891b2", "#d97706", "#7c3aed"];

const FacultyDashboard = ({ profileData }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, subjects: 0, exams: 0, notices: 0 });
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [statsRes, examsRes, noticesRes] = await Promise.allSettled([
          axiosWrapper.get("/faculty/summary", { headers: { Authorization: `Bearer ${token}` } }),
          axiosWrapper.get("/exam/upcoming?limit=5", { headers: { Authorization: `Bearer ${token}` } }),
          axiosWrapper.get("/notice?limit=5", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (statsRes.status === "fulfilled" && statsRes.value.data.success)
          setStats(statsRes.value.data.data);
        if (examsRes.status === "fulfilled" && examsRes.value.data.success)
          setUpcomingExams(examsRes.value.data.data);
        if (noticesRes.status === "fulfilled" && noticesRes.value.data.success)
          setRecentNotices(noticesRes.value.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      }
    };
    fetchSummary();
  }, []);

  const statCards = useMemo(
    () => [
      {
        title: "Students",
        value: stats.students,
        icon: <FiUsers />,
        to: "/faculty?page=student%20info",
        color: "from-emerald-400 to-emerald-600",
      },
      {
        title: "Subjects",
        value: stats.subjects,
        icon: <FiBookOpen />,
        to: "/faculty?page=marks",
        color: "from-cyan-400 to-cyan-600",
      },
      {
        title: "Exams",
        value: stats.exams,
        icon: <FiClipboard />,
        to: "/faculty?page=exam",
        color: "from-amber-400 to-amber-600",
      },
      {
        title: "Notices",
        value: stats.notices,
        icon: <FiBell />,
        to: "/faculty?page=notice",
        color: "from-violet-400 to-violet-600",
      },
    ],
    [stats]
  );

  const maxCount = Math.max(...statCards.map((c) => c.value), 1);

  const chartData = statCards.map((c) => ({ name: c.title, value: c.value }));

  const examColumns = useMemo(
    () => [
      { header: "Name", accessorKey: "name" },
      {
        header: "Date",
        cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
      },
      { header: "Total Marks", accessorKey: "totalMarks" },
    ],
    []
  );

  const noticeColumns = useMemo(
    () => [
      { header: "Title", accessorKey: "title" },
      { header: "Type", accessorKey: "type" },
      {
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
    ],
    []
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* ── Hero Banner ── */}
      <div className="rounded-2xl md:p-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
        <p className="text-sm uppercase tracking-wider text-green-100">Welcome back</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-1">
          {profileData
            ? `${profileData.firstName} ${profileData.lastName}`
            : "Faculty Member"}
        </h1>
        <p className="mt-2 text-green-100">
          {profileData?.designation || "Faculty"} — dashboard overview
        </p>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          { label: "Add Marks", icon: <FiEdit3 />, to: "/faculty/upload-marks", color: "from-emerald-400 to-emerald-600" },
          { label: "Manage Notices", icon: <FiBell />, to: "/faculty?page=notice", color: "from-cyan-400 to-cyan-600" },
          { label: "Upload Material", icon: <FiUpload />, to: "/faculty?page=material", color: "from-violet-400 to-violet-600" },
        ].map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all group"
          >
            <div
              className={`h-10 w-10 rounded-xl bg-gradient-to-br ${action.color} text-white flex items-center justify-center text-lg flex-shrink-0`}
            >
              {action.icon}
            </div>
            <span className="font-semibold text-slate-700">{action.label}</span>
            <FiArrowRight className="ml-auto text-slate-400 group-hover:text-slate-700 transition-colors" />
          </Link>
        ))}
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{card.value}</h3>
              </div>
              <div
                className={`h-11 w-11 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center text-xl`}
              >
                {card.icon}
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${card.color}`}
                style={{ width: `${(card.value / maxCount) * 100}%` }}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Category Comparison</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis tick={{ fill: "#475569", fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Distribution View</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-pie-${entry.name}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Upcoming Exams ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Exams</h2>
          <Link
            to="/faculty?page=exam"
            className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
          >
            View All <FiArrowRight />
          </Link>
        </div>
        {upcomingExams.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">No upcoming exams found.</p>
        ) : (
          <DataTable data={upcomingExams} columns={examColumns} pageSize={5} />
        )}
      </div>

      {/* ── Recent Notices ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Notices</h2>
          <Link
            to="/faculty?page=notice"
            className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
          >
            View All <FiArrowRight />
          </Link>
        </div>
        {recentNotices.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">No recent notices found.</p>
        ) : (
          <DataTable data={recentNotices} columns={noticeColumns} pageSize={5} />
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
