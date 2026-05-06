import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";
import DataTable from "../../components/DataTable";

const Branch = () => {
    const [data, setData] = useState({
        name: "",
        branchId: "",
    });
    const [searchParams, setSearchParams] = useState({
        name: "",
        branchId: "",
    });
    const [branch, setBranch] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        getBranchHandler();
    }, []);

    const getBranchHandler = async () => {
        setDataLoading(true);
        try {
            const response = await axiosWrapper.get(`/branch`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            });
            if (response.data.success) {
                setBranch(response.data.data || []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setBranch([]);
                return;
            }
            toast.error(
                error.response?.data?.message || "Error fetching branches",
            );
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

    const searchBranchHandler = async (e) => {
        e.preventDefault();
        if (!searchParams.name && !searchParams.branchId) {
            toast.error("Please select at least one filter");
            return;
        }

        setDataLoading(true);
        setHasSearched(true);
        toast.loading("Searching branches...");
        try {
            const response = await axiosWrapper.post(
                "/branch/search",
                searchParams,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                },
            );
            toast.dismiss();
            if (response.data.success) {
                setBranch(response.data.data || []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            if (error.response?.status === 404) {
                setBranch([]);
            } else {
                toast.error(
                    error.response?.data?.message || "Error searching branches",
                );
            }
        } finally {
            setDataLoading(false);
        }
    };

    const refreshBranchList = async () => {
        const hasAnyFilter = !!searchParams.name || !!searchParams.branchId;

        if (hasSearched && hasAnyFilter) {
            try {
                const response = await axiosWrapper.post(
                    "/branch/search",
                    searchParams,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                        },
                    },
                );
                setBranch(response.data.data || []);
            } catch (error) {
                setBranch([]);
            }
        } else {
            await getBranchHandler();
        }
    };

    const addBranchHandler = async () => {
        if (!data.name || !data.branchId) {
            toast.dismiss();
            toast.error("Please fill all the fields");
            return;
        }
        try {
            toast.loading(isEditing ? "Updating Branch" : "Adding Branch");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            };
            let response;
            if (isEditing) {
                response = await axiosWrapper.patch(
                    `/branch/${selectedBranchId}`,
                    data,
                    {
                        headers,
                    },
                );
            } else {
                response = await axiosWrapper.post(`/branch`, data, {
                    headers,
                });
            }
            toast.dismiss();
            if (response.data.success) {
                toast.success(response.data.message);
                setData({ name: "", branchId: "" });
                setShowAddForm(false);
                setIsEditing(false);
                setSelectedBranchId(null);
                refreshBranchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Error");
        }
    };

    const deleteBranchHandler = (id) => {
        setIsDeleteConfirmOpen(true);
        setSelectedBranchId(id);
    };

    const editBranchHandler = (branchItem) => {
        setData({
            name: branchItem.name,
            branchId: branchItem.branchId,
        });
        setSelectedBranchId(branchItem._id);
        setIsEditing(true);
        setShowAddForm(true);
    };

    const confirmDelete = async () => {
        try {
            toast.loading("Deleting Branch");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            };
            const response = await axiosWrapper.delete(
                `/branch/${selectedBranchId}`,
                {
                    headers,
                },
            );
            toast.dismiss();
            if (response.data.success) {
                toast.success("Branch has been deleted successfully");
                setIsDeleteConfirmOpen(false);
                refreshBranchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Error");
        }
    };

    const branchColumns = useMemo(
        () => [
            { header: "Branch Name", accessorKey: "name" },
            { header: "Branch ID", accessorKey: "branchId" },
            {
                header: "Created At",
                cell: ({ row }) =>
                    new Date(row.original.createdAt).toLocaleDateString(),
            },
            {
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex justify-center gap-4">
                        <CustomButton
                            variant="secondary"
                            className="!p-2"
                            onClick={() => editBranchHandler(row.original)}
                        >
                            <MdEdit />
                        </CustomButton>
                        <CustomButton
                            variant="danger"
                            className="!p-2"
                            onClick={() =>
                                deleteBranchHandler(row.original._id)
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
        <div className="w-full mx-auto flex justify-center items-start flex-col mb-10 relative">
            <Heading title="Branch Details" />
            <CustomButton
                onClick={() => {
                    setShowAddForm(!showAddForm);
                    if (!showAddForm) {
                        setData({ name: "", branchId: "" });
                        setIsEditing(false);
                        setSelectedBranchId(null);
                    }
                }}
                className="fixed bottom-8 right-8 !rounded-full !p-4"
            >
                {showAddForm ? (
                    <IoMdClose className="text-3xl" />
                ) : (
                    <IoMdAdd className="text-3xl" />
                )}
            </CustomButton>

            {dataLoading && <Loading />}

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold">
                                {isEditing ? "Edit Branch" : "Add New Branch"}
                            </h2>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <IoMdClose className="text-3xl" />
                            </button>
                        </div>

                        <form
                            onSubmit={addBranchHandler}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Branch Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="branchId"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Branch ID
                                </label>
                                <input
                                    type="text"
                                    id="branchId"
                                    value={data.branchId}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            branchId: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t">
                                <CustomButton
                                    variant="secondary"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </CustomButton>
                                <CustomButton
                                    variant="primary"
                                    onClick={addBranchHandler}
                                >
                                    {isEditing ? "Update" : "Add"}
                                </CustomButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {!dataLoading && (
                <div className="mt-8 w-full">
                    <form
                        onSubmit={searchBranchHandler}
                        className="flex items-center mb-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-[90%] mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Branch Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={searchParams.name}
                                    onChange={handleSearchInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter branch name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Branch ID
                                </label>
                                <input
                                    type="text"
                                    name="branchId"
                                    value={searchParams.branchId}
                                    onChange={handleSearchInputChange}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter branch ID"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center w-[10%] mx-auto">
                            <CustomButton
                                type="submit"
                                disabled={dataLoading}
                                variant="primary"
                            >
                                {dataLoading ? "Searching..." : "Search"}
                            </CustomButton>
                        </div>
                    </form>

                    {hasSearched && branch.length === 0 && (
                        <NoData title="No branches found" />
                    )}

                    {branch.length > 0 && (
                        <div className="mt-8">
                            <DataTable
                                data={branch}
                                columns={branchColumns}
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
                message="Are you sure you want to delete this branch?"
            />
        </div>
    );
};

export default Branch;
