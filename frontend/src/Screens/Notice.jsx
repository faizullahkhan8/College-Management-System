import React, { useEffect, useMemo, useState } from "react";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import axiosWrapper from "../utils/AxiosWrapper";
import CustomButton from "../components/CustomButton";
import DeleteConfirm from "../components/DeleteConfirm";
import Loading from "../components/Loading";
import DataTable from "../components/DataTable";

const Notice = () => {
    const router = useLocation();
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedNoticeId, setSelectedNoticeId] = useState(null);
    const [dataLoading, setDataLoading] = useState(false);
    const token = localStorage.getItem("userToken");
    const [filters, setFilters] = useState({ title: "", type: "" });

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "student",
        link: "",
    });

    useEffect(() => {
        if (!token) {
            toast.error("Please login to continue");
            navigate("/login");
        }
    }, [token, navigate]);

    const getNotices = async () => {
        try {
            setDataLoading(true);
            const response = await axiosWrapper.get("/notice", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setNotices(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setNotices([]);
            } else {
                toast.error(
                    error.response?.data?.message || "Failed to load notices",
                );
            }
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        getNotices();
    }, [router.pathname]);

    const filteredNotices = useMemo(() => {
        return (notices || []).filter((notice) => {
            const byTitle = filters.title
                ? notice.title
                      ?.toLowerCase()
                      .includes(filters.title.toLowerCase())
                : true;
            const byType = filters.type ? notice.type === filters.type : true;
            return byTitle && byType;
        });
    }, [notices, filters]);

    const noticeColumns = useMemo(
        () => [
            { header: "Title", accessorKey: "title" },
            { header: "Description", accessorKey: "description" },
            {
                header: "Type",
                cell: ({ row }) => (
                    <span className="capitalize">
                        {row.original.type === "both"
                            ? "Both"
                            : row.original.type}
                    </span>
                ),
            },
            {
                header: "Date",
                cell: ({ row }) =>
                    new Date(row.original.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        },
                    ),
            },
            {
                header: "Link",
                cell: ({ row }) =>
                    row.original.link ? (
                        <a
                            href={row.original.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            Open
                        </a>
                    ) : (
                        "-"
                    ),
            },
            ...(router.pathname === "/faculty" || router.pathname === "/admin"
                ? [
                      {
                          header: "Actions",
                          cell: ({ row }) => (
                              <div className="flex gap-2">
                                  <CustomButton
                                      onClick={() => {
                                          setSelectedNoticeId(row.original._id);
                                          setIsDeleteConfirmOpen(true);
                                      }}
                                      variant="danger"
                                      className="!p-1.5 rounded-full"
                                      title="Delete Notice"
                                  >
                                      <MdDeleteOutline size={18} />
                                  </CustomButton>
                                  <CustomButton
                                      onClick={() => handleEdit(row.original)}
                                      variant="secondary"
                                      className="!p-1.5 rounded-full"
                                      title="Edit Notice"
                                  >
                                      <MdEditNote size={18} />
                                  </CustomButton>
                              </div>
                          ),
                      },
                  ]
                : []),
        ],
        [router.pathname],
    );

    const openAddModal = () => {
        setEditingNotice(null);
        setFormData({
            title: "",
            description: "",
            type: "student",
            link: "",
        });
        setShowAddModal(true);
    };

    const handleEdit = (notice) => {
        setEditingNotice(notice);
        setFormData({
            title: notice.title || "",
            description: notice.description || "",
            type: notice.type || "student",
            link: notice.link || "",
        });
        setShowAddModal(true);
    };

    const handleSubmitNotice = async (e) => {
        e.preventDefault();
        const { title, description, type } = formData;

        if (!title || !description || !type) {
            toast.dismiss();
            toast.error("Please fill all the fields");
            return;
        }

        try {
            toast.loading(editingNotice ? "Updating Notice" : "Adding Notice");

            const response = await axiosWrapper[editingNotice ? "put" : "post"](
                `/notice${editingNotice ? `/${editingNotice._id}` : ""}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            toast.dismiss();
            if (response.data.success) {
                toast.success(response.data.message);
                getNotices();
                setShowAddModal(false);
                setEditingNotice(null);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async () => {
        try {
            toast.loading("Deleting Notice");
            const response = await axiosWrapper.delete(
                `/notice/${selectedNoticeId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            toast.dismiss();
            if (response.data.success) {
                toast.success("Notice deleted successfully");
                setIsDeleteConfirmOpen(false);
                getNotices();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(
                error.response?.data?.message || "Failed to delete notice",
            );
        }
    };

    return (
        <div className="w-full mx-auto flex justify-center items-start flex-col">
            <div className="relative flex justify-between items-center w-full">
                <Heading title="Notices" />
                {!dataLoading &&
                    (router.pathname === "/faculty" ||
                        router.pathname === "/admin") && (
                        <CustomButton onClick={openAddModal}>
                            <IoMdAdd className="text-2xl" />
                        </CustomButton>
                    )}
            </div>

            {dataLoading && <Loading />}

            {!dataLoading && (
                <>
                    {/* Filters */}
                    <div className="w-full mt-8">
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Filter by Title
                                </label>
                                <input
                                    type="text"
                                    value={filters.title}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    placeholder="Search title..."
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Filter by Type
                                </label>
                                <select
                                    value={filters.type}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            type: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Types</option>
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-8 overflow-x-auto">
                        {filteredNotices.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No notices found
                            </div>
                        ) : (
                            <DataTable
                                data={filteredNotices}
                                columns={noticeColumns}
                                pageSize={10}
                            />
                        )}
                    </div>
                </>
            )}

            {/* Modal UI */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold">
                                {editingNotice
                                    ? "Edit Notice"
                                    : "Add New Notice"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingNotice(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <IoMdClose className="text-3xl" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmitNotice}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notice Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notice Description
                                </label>
                                <textarea
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notice Link (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.link}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            link: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type Of Notice
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            type: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Type</option>
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t">
                                <CustomButton
                                    variant="secondary"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingNotice(null);
                                    }}
                                >
                                    Cancel
                                </CustomButton>
                                <CustomButton type="submit" variant="primary">
                                    {editingNotice ? "Update" : "Add"}
                                </CustomButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirm
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this notice?"
            />
        </div>
    );
};

export default Notice;
