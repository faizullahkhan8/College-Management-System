import React, { useEffect, useMemo, useState } from "react";
import { MdLink } from "react-icons/md";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";
import DataTable from "../../components/DataTable";
import NoData from "../../components/NoData";

const Material = () => {
    const [materials, setMaterials] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        subject: "",
        type: "",
    });
    const [filters, setFilters] = useState({
        subject: "",
        type: "",
    });
    const userData = useSelector((state) => state.userData);
    const userToken = localStorage.getItem("userToken");

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (userData.semester)
                    queryParams.append("semester", userData.semester);
                if (userData.branchId?._id)
                    queryParams.append("branch", userData.branchId._id);
                const response = await axiosWrapper.get(
                    `/subject?${queryParams}`,
                    { headers: { Authorization: `Bearer ${userToken}` } },
                );
                if (response.data.success) {
                    setSubjects(response.data.data);
                }
            } catch (error) {
                if (error?.response?.status === 404) {
                    setSubjects([]);
                    return;
                }
                toast.error(
                    error?.response?.data?.message || "Failed to load subjects",
                );
            }
        };
        if (userData) fetchSubjects();
    }, [userData, userToken]);

    useEffect(() => {
        if (userData) fetchMaterials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    const fetchMaterials = async () => {
        setDataLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (userData.semester)
                queryParams.append("semester", userData.semester);
            if (userData.branchId?._id)
                queryParams.append("branch", userData.branchId._id);
            if (filters.subject) queryParams.append("subject", filters.subject);
            if (filters.type) queryParams.append("type", filters.type);

            const response = await axiosWrapper.get(
                `/material?${queryParams}`,
                {
                    headers: { Authorization: `Bearer ${userToken}` },
                },
            );
            if (response.data.success) {
                setMaterials(response.data.data);
            }
        } catch (error) {
            if (error?.response?.status === 404) {
                setMaterials([]);
            } else {
                toast.error(
                    error?.response?.data?.message ||
                        "Failed to load materials",
                );
            }
        } finally {
            setDataLoading(false);
        }
    };

    const handleSearchParamChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        setFilters(searchParams);
        fetchMaterials();
    };

    const columns = useMemo(
        () => [
            {
                header: "File",
                accessorKey: "file",
                cell: ({ row }) => (
                    <CustomButton
                        variant="primary"
                        onClick={() => window.open(row.original.file)}
                    >
                        <MdLink className="text-xl" />
                    </CustomButton>
                ),
            },
            { header: "Title", accessorKey: "title" },
            { header: "Subject", accessorKey: "subject.name" },
            {
                header: "Type",
                accessorKey: "type",
                cell: ({ row }) => (
                    <span className="capitalize">{row.original.type}</span>
                ),
            },
        ],
        [],
    );

    return (
        <div className="w-full mx-auto flex flex-col mb-10">
            <Heading title="Study Materials" />

            {/* Filter Bar */}
            <div className="my-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject
                            </label>
                            <select
                                name="subject"
                                value={searchParams.subject}
                                onChange={handleSearchParamChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Subjects</option>
                                {subjects.map((subject) => (
                                    <option
                                        key={subject._id}
                                        value={subject._id}
                                    >
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                name="type"
                                value={searchParams.type}
                                onChange={handleSearchParamChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Types</option>
                                <option value="notes">Notes</option>
                                <option value="assignment">Assignment</option>
                                <option value="syllabus">Syllabus</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <CustomButton
                                onClick={applyFilters}
                                disabled={dataLoading}
                            >
                                {dataLoading ? "Loading..." : "Apply Filter"}
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            {dataLoading ? (
                <Loading />
            ) : materials.length > 0 ? (
                <DataTable data={materials} columns={columns} pageSize={10} />
            ) : (
                <NoData title="No materials found" />
            )}
        </div>
    );
};

export default Material;
