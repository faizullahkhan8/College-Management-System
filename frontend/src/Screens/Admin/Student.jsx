import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import NoData from "../../components/NoData";
import DataTable from "../../components/DataTable";

const Student = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        enrollmentNo: "",
        name: "",
        semester: "",
        branch: "",
    });
    const [students, setStudents] = useState([]);
    const [branches, setBranches] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const userToken = localStorage.getItem("userToken");

    useEffect(() => {
        getAllStudentsHandler();
        getBranchHandler();
    }, []);

    const getAllStudentsHandler = async () => {
        setDataLoading(true);
        try {
            toast.loading("Loading students...");
            const response = await axiosWrapper.get(`/student`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            if (response.data.success) {
                setStudents(response.data.data || []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setStudents([]);
            } else {
                toast.error(error.response?.data?.message || "Error fetching students");
            }
        } finally {
            setDataLoading(false);
            toast.dismiss();
        }
    };

    const getBranchHandler = async () => {
        try {
            const response = await axiosWrapper.get(`/branch`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            if (response.data.success) {
                setBranches(response.data.data);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setBranches([]);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const searchStudents = async (e) => {
        e.preventDefault();
        if (!searchParams.enrollmentNo && !searchParams.name && !searchParams.semester && !searchParams.branch) {
            toast.error("Please select at least one filter");
            return;
        }
        setSearchLoading(true);
        setHasSearched(true);
        toast.loading("Searching students...");
        try {
            const response = await axiosWrapper.post(`/student/search`, searchParams, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            toast.dismiss();
            if (response.data.success) {
                if (response.data.data.length === 0) {
                    setStudents([]);
                } else {
                    toast.success("Students found!");
                    setStudents(response.data.data);
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            setStudents([]);
            toast.error(error.response?.data?.message || "Error searching students");
        } finally {
            setSearchLoading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            toast.loading("Deleting Student");
            const response = await axiosWrapper.delete(`/student/${selectedStudentId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
            });
            toast.dismiss();
            if (response.data.success) {
                toast.success("Student deleted successfully");
                setIsDeleteConfirmOpen(false);
                getAllStudentsHandler();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Error");
        }
    };

    const studentColumns = useMemo(
        () => [
            {
                header: "Profile",
                cell: ({ row }) => {
                    const student = row.original;
                    return (
                        <img
                            src={student.profile}
                            alt={`${student.firstName}'s profile`}
                            className="w-12 h-12 object-cover rounded-full"
                            onError={(e) => {
                                if (!e.target.dataset.error) {
                                    e.target.dataset.error = "true";
                                    e.target.src =
                                        "https://images.unsplash.com/photo-1744315900478-fa44dc6a4e89?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                                }
                            }}
                        />
                    );
                },
            },
            {
                header: "Name",
                cell: ({ row }) => {
                    const s = row.original;
                    return `${s.firstName} ${s.middleName || ""} ${s.lastName}`;
                },
            },
            { header: "E. No", accessorKey: "enrollmentNo" },
            { header: "Semester", accessorKey: "semester" },
            {
                header: "Branch",
                cell: ({ row }) => row.original.branchId?.name || "-",
            },
            { header: "Email", accessorKey: "email" },
            {
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex justify-center gap-2">
                        <CustomButton
                            variant="secondary"
                            className="!p-2"
                            onClick={() => navigate(`/admin/student/edit/${row.original._id}`)}
                        >
                            <MdEdit />
                        </CustomButton>
                        <CustomButton
                            variant="danger"
                            className="!p-2"
                            onClick={() => {
                                setSelectedStudentId(row.original._id);
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
        <div className="w-full mx-auto flex justify-center items-start flex-col mb-10">
            <div className="flex justify-between items-center w-full">
                <Heading title="Student Management" />
                {branches.length > 0 && (
                    <CustomButton onClick={() => navigate("/admin/student/add")}>
                        <IoMdAdd className="text-2xl" />
                    </CustomButton>
                )}
            </div>

            {branches.length > 0 && (
                <div className="my-6 mx-auto w-full">
                    <form onSubmit={searchStudents} className="flex items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-[90%] mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enrollment Number
                                </label>
                                <input
                                    type="text"
                                    name="enrollmentNo"
                                    value={searchParams.enrollmentNo}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter enrollment number"
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
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter student name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Semester
                                </label>
                                <select
                                    name="semester"
                                    value={searchParams.semester}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                        <option key={sem} value={sem}>Semester {sem}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Branch
                                </label>
                                <select
                                    name="branch"
                                    value={searchParams.branch}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Branch</option>
                                    {branches?.map((branch) => (
                                        <option key={branch._id} value={branch._id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center w-[10%] mx-auto">
                            <CustomButton type="submit" disabled={searchLoading} variant="primary">
                                {searchLoading ? "Searching..." : "Search"}
                            </CustomButton>
                        </div>
                    </form>

                    {hasSearched && students.length === 0 && (
                        <NoData title="No students found" />
                    )}

                    {students && students.length > 0 && (
                        <div className="mt-8">
                            <DataTable data={students} columns={studentColumns} pageSize={10} />
                        </div>
                    )}
                </div>
            )}

            {branches.length === 0 && (
                <div className="flex justify-center items-center flex-col w-full mt-24">
                    <CgDanger className="w-16 h-16 text-yellow-500 mb-4" />
                    <p className="text-center text-lg">
                        Please add branches before adding a student.
                    </p>
                </div>
            )}

            <DeleteConfirm
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this student?"
            />
        </div>
    );
};

export default Student;
