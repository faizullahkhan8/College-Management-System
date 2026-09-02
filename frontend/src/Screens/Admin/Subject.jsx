import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import { CgDanger } from "react-icons/cg";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";
import DataTable from "../../components/DataTable";

const Subject = () => {
    const [data, setData] = useState({
        name: "",
        code: "",
        branch: "",
        semester: "",
        credits: "",
    });
    const [searchParams, setSearchParams] = useState({
        name: "",
        code: "",
        branch: "",
        semester: "",
        credits: "",
    });
    const [subject, setSubject] = useState([]);
    const [branch, setBranches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const userToken = localStorage.getItem("userToken");
    const [dataLoading, setDataLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        getSubjectHandler();
        getBranchHandler();
    }, []);

    const getSubjectHandler = async () => {
        try {
            setDataLoading(true);
            const response = await axiosWrapper.get(`/subject`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            if (response.data.success) {
                setSubject(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setSubject([]);
            } else {
                toast.error(
                    error.response?.data?.message || "Error fetching subjects",
                );
            }
        } finally {
            setDataLoading(false);
        }
    };

    const handleSearchInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const searchSubjectHandler = async (e) => {
        e.preventDefault();

        if (
            !searchParams.name &&
            !searchParams.code &&
            !searchParams.branch &&
            !searchParams.semester &&
            !searchParams.credits
        ) {
            toast.error("Please select at least one filter");
            return;
        }

        setSearchLoading(true);
        setHasSearched(true);
        toast.loading("Searching subjects...");
        try {
            const response = await axiosWrapper.post(
                "/subject/search",
                searchParams,
                {
                    headers: { Authorization: `Bearer ${userToken}` },
                },
            );

            toast.dismiss();
            if (response.data.success) {
                setSubject(response.data.data || []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            if (error.response?.status === 404) {
                setSubject([]);
            } else {
                toast.error(
                    error.response?.data?.message || "Error searching subjects",
                );
            }
        } finally {
            setSearchLoading(false);
        }
    };

    const refreshSubjectList = async () => {
        const hasAnyFilter =
            !!searchParams.name ||
            !!searchParams.code ||
            !!searchParams.branch ||
            !!searchParams.semester ||
            !!searchParams.credits;

        if (hasSearched && hasAnyFilter) {
            try {
                const response = await axiosWrapper.post(
                    "/subject/search",
                    searchParams,
                    {
                        headers: { Authorization: `Bearer ${userToken}` },
                    },
                );
                setSubject(response.data.data || []);
            } catch (error) {
                setSubject([]);
            }
        } else {
            await getSubjectHandler();
        }
    };

    const getBranchHandler = async () => {
        try {
            setDataLoading(true);
            const response = await axiosWrapper.get(`/branch`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            if (response.data.success) {
                setBranches(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setBranches([]);
            } else {
                toast.error(
                    error.response?.data?.message || "Error fetching branches",
                );
            }
        } finally {
            setDataLoading(false);
        }
    };

    const addSubjectHandler = async () => {
        const errors = {};
        if (!data.name.trim()) errors.name = "Subject name is required.";
        if (!data.code.trim()) errors.code = "Subject code is required.";
        if (!data.branch) errors.branch = "Please select a branch.";
        if (!data.semester) errors.semester = "Please select a semester.";
        if (!data.credits || Number(data.credits) <= 0) errors.credits = "Credits must be a positive number.";
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        try {
            setSubmitLoading(true);
            toast.loading(isEditing ? "Updating Subject" : "Adding Subject");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            };
            let response;
            if (isEditing) {
                response = await axiosWrapper.patch(
                    `/subject/${selectedSubjectId}`,
                    data,
                    {
                        headers,
                    },
                );
            } else {
                response = await axiosWrapper.post(`/subject`, data, {
                    headers,
                });
            }
            toast.dismiss();
            if (response.data.success) {
                toast.success(response.data.message);
                resetForm();
                refreshSubjectList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Error");
        } finally {
            setSubmitLoading(false);
        }
    };

    const resetForm = () => {
        setData({
            name: "",
            code: "",
            branch: "",
            semester: "",
            credits: "",
        });
        setShowModal(false);
        setIsEditing(false);
        setSelectedSubjectId(null);
    };

    const deleteSubjectHandler = (id) => {
        setIsDeleteConfirmOpen(true);
        setSelectedSubjectId(id);
    };

    const editSubjectHandler = (subjectItem) => {
        setData({
            name: subjectItem.name,
            code: subjectItem.code,
            branch: subjectItem.branch?._id,
            semester: subjectItem.semester,
            credits: subjectItem.credits,
        });
        setSelectedSubjectId(subjectItem._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            setDataLoading(true);
            toast.loading("Deleting Subject");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            };
            const response = await axiosWrapper.delete(
                `/subject/${selectedSubjectId}`,
                {
                    headers,
                },
            );
            toast.dismiss();
            if (response.data.success) {
                toast.success("Subject has been deleted successfully");
                setIsDeleteConfirmOpen(false);
                refreshSubjectList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Error");
        } finally {
            setDataLoading(false);
        }
    };

    const subjectColumns = useMemo(
        () => [
            { header: "Name", accessorKey: "name" },
            { header: "Code", accessorKey: "code" },
            {
                header: "Branch",
                cell: ({ row }) => row.original.branch?.name || "-",
            },
            { header: "Semester", accessorKey: "semester" },
            { header: "Credits", accessorKey: "credits" },
            {
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex justify-center gap-4">
                        <CustomButton
                            variant="secondary"
                            className="!p-2"
                            onClick={() => editSubjectHandler(row.original)}
                        >
                            <MdEdit />
                        </CustomButton>
                        <CustomButton
                            variant="danger"
                            className="!p-2"
                            onClick={() =>
                                deleteSubjectHandler(row.original._id)
                            }
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
                <Heading title="Subject Details" />
                {branch.length > 0 && (
                    <CustomButton onClick={() => setShowModal(true)}>
                        <IoMdAdd className="text-2xl" />
                    </CustomButton>
                )}
            </div>
            {dataLoading && <Loading />}

            {!dataLoading && branch.length == 0 && (
                <div className="flex justify-center items-center flex-col w-full mt-24">
                    <CgDanger className="w-16 h-16 text-yellow-500 mb-4" />
                    <p className="text-center text-lg">
                        Please add branches before adding a subject.
                    </p>
                </div>
            )}

            {!dataLoading && branch.length > 0 && (
                <div className="mt-8 w-full">
                    <form
                        onSubmit={searchSubjectHandler}
                        className="flex items-center mb-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-[90%] mx-auto">
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
                                    placeholder="Enter subject name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Code
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={searchParams.code}
                                    onChange={handleSearchInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter subject code"
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
                                    {branch.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name}
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
                                    value={searchParams.semester}
                                    onChange={handleSearchInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                        <option key={sem} value={sem}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Credits
                                </label>
                                <input
                                    type="number"
                                    name="credits"
                                    value={searchParams.credits}
                                    onChange={handleSearchInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter credits"
                                />
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

                    {hasSearched && subject.length === 0 && (
                        <NoData title="No subjects found" />
                    )}

                    {subject && subject.length > 0 && (
                        <div className="mt-8">
                            <DataTable
                                data={subject}
                                columns={subjectColumns}
                                pageSize={10}
                            />
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {isEditing ? "Edit Subject" : "Add New Subject"}
                            </h2>
                            <CustomButton
                                onClick={resetForm}
                                variant="secondary"
                            >
                                <AiOutlineClose size={24} />
                            </CustomButton>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => {
                                        setData({ ...data, name: e.target.value });
                                        if (formErrors.name) setFormErrors((p) => ({ ...p, name: "" }));
                                    }}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        formErrors.name ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject Code
                                </label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => {
                                        setData({ ...data, code: e.target.value });
                                        if (formErrors.code) setFormErrors((p) => ({ ...p, code: "" }));
                                    }}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        formErrors.code ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Branch
                                </label>
                                <select
                                    value={data.branch}
                                    onChange={(e) => {
                                        setData({ ...data, branch: e.target.value });
                                        if (formErrors.branch) setFormErrors((p) => ({ ...p, branch: "" }));
                                    }}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        formErrors.branch ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Select Branch</option>
                                    {branch.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.branch && <p className="text-red-500 text-xs mt-1">{formErrors.branch}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Semester
                                </label>
                                <select
                                    value={data.semester}
                                    onChange={(e) => {
                                        setData({ ...data, semester: e.target.value });
                                        if (formErrors.semester) setFormErrors((p) => ({ ...p, semester: "" }));
                                    }}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        formErrors.semester ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Select Semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                        <option key={sem} value={sem}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.semester && <p className="text-red-500 text-xs mt-1">{formErrors.semester}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Credits
                                </label>
                                <input
                                    type="number"
                                    value={data.credits}
                                    onChange={(e) => {
                                        setData({ ...data, credits: e.target.value });
                                        if (formErrors.credits) setFormErrors((p) => ({ ...p, credits: "" }));
                                    }}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        formErrors.credits ? "border-red-500" : "border-gray-300"
                                    }`}
                                    min="1"
                                />
                                {formErrors.credits && <p className="text-red-500 text-xs mt-1">{formErrors.credits}</p>}
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <CustomButton
                                    onClick={resetForm}
                                    variant="secondary"
                                >
                                    Cancel
                                </CustomButton>
                                <CustomButton
                                    onClick={addSubjectHandler}
                                    disabled={submitLoading}
                                >
                                    {submitLoading
                                        ? isEditing
                                            ? "Updating..."
                                            : "Adding..."
                                        : isEditing
                                          ? "Update Subject"
                                          : "Add Subject"}
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirm
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this subject?"
            />
        </div>
    );
};

export default Subject;
