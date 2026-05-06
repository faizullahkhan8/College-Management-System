import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import NoData from "../../components/NoData";
import DataTable from "../../components/DataTable";

const Attendance = () => {
    const [filters, setFilters] = useState({
        branch: "",
        semester: "",
        date: new Date().toISOString().split("T")[0],
        subject: "",
    });

    const [branches, setBranches] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const userToken = localStorage.getItem("userToken");
    const [attendanceMap, setAttendanceMap] = useState({});

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axiosWrapper.get("/branch", {
                    headers: { Authorization: `Bearer ${userToken}` },
                });
                if (response.data.success) {
                    setBranches(response.data.data);
                }
            } catch (error) {
                toast.error("Failed to load branches");
            }
        };
        fetchBranches();
    }, [userToken]);

    useEffect(() => {
        if (!filters.branch) {
            setSubjects([]);
            return;
        }
        const fetchSubjects = async () => {
            try {
                const response = await axiosWrapper.get(
                    `/subject?branch=${filters.branch}`,
                    { headers: { Authorization: `Bearer ${userToken}` } },
                );
                if (response.data.success) {
                    setSubjects(response.data.data);
                }
            } catch (error) {
                setSubjects([]);
            }
        };
        fetchSubjects();
    }, [filters.branch, userToken]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const loadStudents = async () => {
        if (!filters.branch || !filters.semester || !filters.date) {
            toast.error("Please select branch, semester and date");
            return;
        }
        setDataLoading(true);
        setHasLoaded(true);
        setStudents([]);
        setAttendanceMap({});
        try {
            let url = `/attendance/students?branchId=${filters.branch}&semester=${filters.semester}&date=${filters.date}`;
            if (filters.subject) url += `&subjectId=${filters.subject}`;
            const response = await axiosWrapper.get(url, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            if (response.data.success) {
                const data = response.data.data;
                setStudents(data);
                const map = {};
                data.forEach((s) => {
                    map[s._id] = s.status || "present";
                });
                setAttendanceMap(map);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load students",
            );
            setStudents([]);
        } finally {
            setDataLoading(false);
        }
    };

    const setAllStatus = (status) => {
        const newMap = {};
        students.forEach((s) => (newMap[s._id] = status));
        setAttendanceMap(newMap);
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
    };

    const saveAttendance = async () => {
        if (students.length === 0) {
            toast.error("No students to save attendance for");
            return;
        }
        setSaving(true);
        try {
            const attendanceList = students.map((s) => ({
                studentId: s._id,
                status: attendanceMap[s._id] || "present",
            }));
            const response = await axiosWrapper.post(
                "/attendance/mark",
                {
                    date: filters.date,
                    semester: filters.semester,
                    branchId: filters.branch,
                    subjectId: filters.subject || null,
                    attendanceList,
                },
                { headers: { Authorization: `Bearer ${userToken}` } },
            );
            if (response.data.success) {
                toast.success("Attendance saved successfully!");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to save attendance",
            );
        } finally {
            setSaving(false);
        }
    };

    const getStatusStats = () => {
        const present = Object.values(attendanceMap).filter(
            (s) => s === "present",
        ).length;
        const absent = Object.values(attendanceMap).filter(
            (s) => s === "absent",
        ).length;
        const late = Object.values(attendanceMap).filter(
            (s) => s === "late",
        ).length;
        return { present, absent, late, total: students.length };
    };

    const attendanceColumns = useMemo(
        () => [
            { header: "Enrollment No", accessorKey: "enrollmentNo" },
            {
                header: "Student Name",
                cell: ({ row }) =>
                    `${row.original.firstName} ${row.original.middleName || ""} ${row.original.lastName}`,
            },
            {
                header: "Status",
                cell: ({ row }) => {
                    const sid = row.original._id;
                    const current = attendanceMap[sid] || "present";
                    return (
                        <div className="flex gap-2">
                            {["present", "absent", "late"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() =>
                                        handleStatusChange(sid, status)
                                    }
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                                        current === status
                                            ? status === "present"
                                                ? "bg-green-500 text-white border-green-500 shadow"
                                                : status === "absent"
                                                  ? "bg-red-500 text-white border-red-500 shadow"
                                                  : "bg-yellow-500 text-white border-yellow-500 shadow"
                                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {status.charAt(0).toUpperCase() +
                                        status.slice(1)}
                                </button>
                            ))}
                        </div>
                    );
                },
            },
        ],
        [attendanceMap],
    );

    const stats = getStatusStats();

    return (
        <div className="w-full mx-auto flex flex-col mb-10">
            <div className="flex justify-between items-center w-full">
                <Heading title="Attendance" />
            </div>

            {/* Filter Bar */}
            <div className="my-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={filters.date}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Branch
                            </label>
                            <select
                                name="branch"
                                value={filters.branch}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Branch</option>
                                {branches.map((b) => (
                                    <option key={b._id} value={b._id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Semester
                            </label>
                            <select
                                name="semester"
                                value={filters.semester}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                                    <option key={s} value={s}>
                                        Semester {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject (Optional)
                            </label>
                            <select
                                name="subject"
                                value={filters.subject}
                                onChange={handleFilterChange}
                                disabled={!filters.branch}
                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    !filters.branch
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                <option value="">All / General</option>
                                {subjects.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <CustomButton
                                onClick={loadStudents}
                                disabled={dataLoading}
                            >
                                {dataLoading ? "Loading..." : "Load Students"}
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats & Bulk Actions */}
            {students.length > 0 && (
                <div className="mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-gray-600">
                                        Present:{" "}
                                        <strong className="text-gray-900">
                                            {stats.present}
                                        </strong>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span className="text-sm text-gray-600">
                                        Absent:{" "}
                                        <strong className="text-gray-900">
                                            {stats.absent}
                                        </strong>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <span className="text-sm text-gray-600">
                                        Late:{" "}
                                        <strong className="text-gray-900">
                                            {stats.late}
                                        </strong>
                                    </span>
                                </div>
                                <div className="h-6 w-px bg-gray-300 mx-2"></div>
                                <span className="text-sm text-gray-600">
                                    Total:{" "}
                                    <strong className="text-gray-900">
                                        {stats.total}
                                    </strong>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                    Mark all as:
                                </span>
                                <button
                                    onClick={() => setAllStatus("present")}
                                    className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-600 rounded-md hover:bg-green-100 border border-green-200"
                                >
                                    Present
                                </button>
                                <button
                                    onClick={() => setAllStatus("absent")}
                                    className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 border border-red-200"
                                >
                                    Absent
                                </button>
                                <button
                                    onClick={() => setAllStatus("late")}
                                    className="px-3 py-1.5 text-xs font-medium bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 border border-yellow-200"
                                >
                                    Late
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Students Table */}
            <div className="flex-1">
                {students.length > 0 ? (
                    <>
                        <DataTable
                            data={students}
                            columns={attendanceColumns}
                            pageSize={15}
                        />

                        {/* Save Button */}
                        <div className="mt-6 flex justify-end">
                            <CustomButton
                                onClick={saveAttendance}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Attendance"}
                            </CustomButton>
                        </div>
                    </>
                ) : hasLoaded ? (
                    <NoData title="No students found for the selected criteria" />
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        Select filters and click "Load Students" to take
                        attendance
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
