import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";
import DataTable from "../../components/DataTable";

const Faculty = () => {
    const navigate = useNavigate();
    const [faculty, setFaculty] = useState([]);
    const [branch, setBranches] = useState([]);
    const [searchParams, setSearchParams] = useState({
        employeeId: "",
        name: "",
        designation: "",
        branch: "",
    });
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedFacultyId, setSelectedFacultyId] = useState(null);
    const userToken = localStorage.getItem("userToken");
    const [dataLoading, setDataLoading] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        getFacultyHandler();
        getBranchHandler();
    }, []);

    const getBranchHandler = async () => {
        try {
            setDataLoading(true);
            const response = await axiosWrapper.get(`/branch`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            if (response.data.success) {
                setBranches(response.data.data);
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                toast.error(error.response?.data?.message || "Error fetching branches");
            }
        } finally {
            setDataLoading(false);
        }
    };

    const getFacultyHandler = async () => {
        try {
            toast.loading("Loading faculty...");
            const response = await axiosWrapper.get(`/faculty`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            if (response.data.success) {
                setFaculty(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setFaculty([]);
            } else {
                toast.error(error.response?.data?.message || "Error fetching faculty");
            }
        } finally {
            toast.dismiss();
        }
    };

    const handleSearchInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const searchFacultyHandler = async (e) => {
        e.preventDefault();
        if (!searchParams.employeeId && !searchParams.name && !searchParams.designation && !searchParams.branch) {
            toast.error("Please select at least one filter");
            return;
        }
        setSearchLoading(true);
        setHasSearched(true);
        toast.loading("Searching faculty...");
        try {
            const response = await axiosWrapper.post("/faculty/search", searchParams, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            toast.dismiss();
            if (response.data.success) {
                setFaculty(response.data.data || []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            if (error.response?.status === 404) {
                setFaculty([]);
            } else {
                toast.error(error.response?.data?.message || "Error searching faculty");
            }
        } finally {
            setSearchLoading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            toast.loading("Deleting Faculty");
            const response = await axiosWrapper.delete(`/faculty/${selectedFacultyId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
            });
            toast.dismiss();
            if (response.data.success) {
                toast.success("Faculty deleted successfully");
                setIsDeleteConfirmOpen(false);
                getFacultyHandler();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Error");
        }
    };

    const resolveProfileImage = (profile) => {
        if (!profile) return "https://via.placeholder.com/48?text=User";
        if (/^https?:\/\//i.test(profile)) return profile;
        const mediaBase = import.meta.env.VITE_MEDIA_LINK || "";
        return `${mediaBase}/${profile}`.replace(/([^:]\/)\/+/g, "$1");
    };

    const facultyColumns = useMemo(
        () => [
            {
                header: "Profile",
                cell: ({ row }) => (
                    <img
                        src={resolveProfileImage(row.original.profile)}
                        alt={`${row.original.firstName || "Faculty"} profile`}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                            if (!e.currentTarget.dataset.error) {
                                e.currentTarget.dataset.error = "true";
                                e.currentTarget.src = "https://via.placeholder.com/48?text=User";
                            }
                        }}
                    />
                ),
            },
            {
                header: "Name",
                cell: ({ row }) =>
                    `${row.original.firstName || ""} ${row.original.lastName || ""}`,
            },
            { header: "Email", accessorKey: "email" },
            { header: "Phone", accessorKey: "phone" },
            { header: "Employee ID", accessorKey: "employeeId" },
            { header: "Designation", accessorKey: "designation" },
            {
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex justify-center gap-4">
                        <CustomButton
                            variant="secondary"
                            className="!p-2"
                            onClick={() => navigate(`/admin/faculty/edit/${row.original._id}`)}
                        >
                            <MdEdit />
                        </CustomButton>
                        <CustomButton
                            variant="danger"
                            className="!p-2"
                            onClick={() => {
                                setSelectedFacultyId(row.original._id);
                                setIsDeleteConfirmOpen(true);
                            }}
                        >
                            <MdOutlineDelete />
                        </CustomButton>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <div className="w-full mx-auto flex justify-center items-start flex-col mb-10 relative">
            <div className="flex justify-between items-center w-full">
                <Heading title="Faculty Management" />
                <CustomButton onClick={() => navigate("/admin/faculty/add")}>
                    <IoMdAdd className="text-2xl" />
                </CustomButton>
            </div>

            {dataLoading && <Loading />}

            {!dataLoading && (
                <div className="mt-8 w-full">
                    <form onSubmit={searchFacultyHandler} className="flex items-center mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-[90%] mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Employee ID
                                </label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={searchParams.employeeId}
                                    onChange={handleSearchInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter employee id"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={searchParams.name}
                                    onChange={handleSearchInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter faculty name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Designation
                                </label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={searchParams.designation}
                                    onChange={handleSearchInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter designation"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Branch
                                </label>
                                <select
                                    name="branch"
                                    value={searchParams.branch}
                                    onChange={handleSearchInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Branch</option>
                                    {branch?.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center w-[10%] mx-auto">
                            <CustomButton
                                type="submit"
                                disabled={searchLoading}
                                variant="primary"
                            >
                                {searchLoading ? "Searching..." : "Search"}
                            </CustomButton>
                        </div>
                    </form>

                    {hasSearched && faculty.length === 0 && (
                        <NoData title="No faculty found" />
                    )}

                    {faculty && faculty.length > 0 && (
                        <div className="mt-8">
                            <DataTable
                                data={faculty}
                                columns={facultyColumns}
                                pageSize={10}
                            />
                        </div>
                    )}
                </div>
            )}

            <DeleteConfirm
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this faculty?"
            />
        </div>
    );
};

export default Faculty;
