import React, { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import { FiUsers, FiUserCheck, FiBookOpen, FiGitBranch } from "react-icons/fi";
import { Link } from "react-router-dom";
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

const Home = () => {
  const [profileData, setProfileData] = useState();
  const [counts, setCounts] = useState({
    students: 0,
    faculty: 0,
    subjects: 0,
    branches: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      setIsLoading(false);
      toast.error("Session expired. Please login again.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Loading user details...");
    try {
      const response = await axiosWrapper.get(`/admin/my-details`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        timeout: 15000,
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching user details");
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch]);

  const fetchDashboardCounts = async () => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) return;
    try {
      const headers = { Authorization: `Bearer ${userToken}` };
      const [studentsRes, facultyRes, subjectsRes, branchesRes] = await Promise.allSettled([
        axiosWrapper.get("/student", { headers }),
        axiosWrapper.get("/faculty", { headers }),
        axiosWrapper.get("/subject", { headers }),
        axiosWrapper.get("/branch", { headers }),
      ]);

      setCounts({
        students:
          studentsRes.status === "fulfilled" && studentsRes.value.data.success
            ? studentsRes.value.data.data?.length || 0
            : 0,
        faculty:
          facultyRes.status === "fulfilled" && facultyRes.value.data.success
            ? facultyRes.value.data.data?.length || 0
            : 0,
        subjects:
          subjectsRes.status === "fulfilled" && subjectsRes.value.data.success
            ? subjectsRes.value.data.data?.length || 0
            : 0,
        branches:
          branchesRes.status === "fulfilled" && branchesRes.value.data.success
            ? branchesRes.value.data.data?.length || 0
            : 0,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  const statCards = useMemo(
    () => [
      { title: "Students", value: counts.students, icon: <FiUsers />, to: "/admin/student", color: "from-emerald-400 to-emerald-600" },
      { title: "Faculty", value: counts.faculty, icon: <FiUserCheck />, to: "/admin/faculty", color: "from-cyan-400 to-cyan-600" },
      { title: "Subjects", value: counts.subjects, icon: <FiBookOpen />, to: "/admin/subject", color: "from-amber-400 to-amber-600" },
      { title: "Branches", value: counts.branches, icon: <FiGitBranch />, to: "/admin/branch", color: "from-violet-400 to-violet-600" },
    ],
    [counts]
  );

  const maxCount = Math.max(...statCards.map((item) => item.value), 1);

  const chartData = statCards.map((item) => ({
    name: item.title,
    value: item.value,
  }));

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
        <p className="text-sm uppercase tracking-wider text-green-100">Welcome back</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-1">
          {profileData ? `${profileData.firstName} ${profileData.lastName}` : "Admin"}
        </h1>
        <p className="mt-2 text-green-100">
          {profileData?.designation || "Administrator"} dashboard overview
        </p>
      </div>

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
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center text-xl`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Category Comparison</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis tick={{ fill: "#475569", fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Distribution View</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={2}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-pie-${entry.name}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default Home;
