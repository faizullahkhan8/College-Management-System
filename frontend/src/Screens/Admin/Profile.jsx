import React, { useEffect, useState } from "react";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import CustomButton from "../../components/CustomButton";
import axiosWrapper from "../../utils/AxiosWrapper";
import { toast } from "react-hot-toast";

const Profile = ({ profileData }) => {
    const [resolvedProfileData, setResolvedProfileData] = useState(
        profileData || null,
    );
    const [loading, setLoading] = useState(false);
    const [showUpdatePasswordModal, setShowUpdatePasswordModal] =
        useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileFile, setProfileFile] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        bloodGroup: "",
        designation: "",
        dob: "",
        joiningDate: "",
        salary: "",
        status: "active",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        emergencyContact: {
            name: "",
            relationship: "",
            phone: "",
        },
    });

    useEffect(() => {
        setResolvedProfileData(profileData || null);
    }, [profileData]);

    useEffect(() => {
        const fetchMyDetails = async () => {
            if (profileData) return;
            setLoading(true);
            try {
                const response = await axiosWrapper.get("/admin/my-details", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                });

                if (response.data.success) {
                    setResolvedProfileData(response.data.data);
                } else {
                    toast.error(
                        response.data.message || "Unable to load profile",
                    );
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message || "Unable to load profile",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMyDetails();
    }, [profileData]);

    useEffect(() => {
        if (!resolvedProfileData) return;
        setEditForm({
            firstName: resolvedProfileData.firstName || "",
            lastName: resolvedProfileData.lastName || "",
            email: resolvedProfileData.email || "",
            phone: resolvedProfileData.phone || "",
            gender: resolvedProfileData.gender || "",
            bloodGroup: resolvedProfileData.bloodGroup || "",
            designation: resolvedProfileData.designation || "",
            dob: resolvedProfileData.dob
                ? resolvedProfileData.dob.split("T")[0]
                : "",
            joiningDate: resolvedProfileData.joiningDate
                ? resolvedProfileData.joiningDate.split("T")[0]
                : "",
            salary: resolvedProfileData.salary || "",
            status: resolvedProfileData.status || "active",
            address: resolvedProfileData.address || "",
            city: resolvedProfileData.city || "",
            state: resolvedProfileData.state || "",
            pincode: resolvedProfileData.pincode || "",
            country: resolvedProfileData.country || "",
            emergencyContact: {
                name: resolvedProfileData.emergencyContact?.name || "",
                relationship:
                    resolvedProfileData.emergencyContact?.relationship || "",
                phone: resolvedProfileData.emergencyContact?.phone || "",
            },
        });
    }, [resolvedProfileData]);

    const updateField = (field, value) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const updateEmergencyField = (field, value) => {
        setEditForm((prev) => ({
            ...prev,
            emergencyContact: {
                ...prev.emergencyContact,
                [field]: value,
            },
        }));
    };

    const handleUpdateProfile = async () => {
        if (!resolvedProfileData?._id) return;

        setUpdateLoading(true);
        toast.loading("Updating profile...");
        try {
            const formData = new FormData();
            Object.keys(editForm).forEach((key) => {
                if (key === "emergencyContact") {
                    Object.keys(editForm.emergencyContact).forEach((subKey) => {
                        formData.append(
                            `emergencyContact[${subKey}]`,
                            editForm.emergencyContact[subKey],
                        );
                    });
                } else {
                    formData.append(key, editForm[key]);
                }
            });

            if (profileFile) {
                formData.append("file", profileFile);
            }

            const response = await axiosWrapper.patch(
                `/admin/${resolvedProfileData._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                },
            );

            toast.dismiss();
            if (response.data.success) {
                toast.success("Profile updated successfully");
                setResolvedProfileData(response.data.data);
                setIsEditing(false);
                setProfileFile(null);
            } else {
                toast.error(response.data.message || "Update failed");
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading)
        return <div className="text-center py-10">Loading profile...</div>;
    if (!resolvedProfileData)
        return <div className="text-center py-10">No profile data found.</div>;

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-8 mb-12 border-b border-gray-300 pb-8">
                <div className="flex items-center gap-8">
                    <img
                        src={`${resolvedProfileData.profile}`}
                        alt=""
                        className="w-40 h-40 rounded-full object-cover ring-2 ring-green-400 ring-offset-4"
                    />
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {`${resolvedProfileData.firstName} ${resolvedProfileData.lastName}`}
                        </h1>
                        <p className="text-lg text-gray-600 mb-1">
                            Employee ID: {resolvedProfileData.employeeId}
                        </p>
                        <p className="text-lg text-gray-600 font-medium">
                            {resolvedProfileData.designation}
                            {resolvedProfileData.isSuperAdmin &&
                                " (Super Admin)"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <CustomButton
                        onClick={() => setShowUpdatePasswordModal(true)}
                    >
                        Update Password
                    </CustomButton>
                    <CustomButton
                        variant="secondary"
                        onClick={() => setIsEditing((prev) => !prev)}
                    >
                        {isEditing ? "Cancel Edit" : "Edit Profile"}
                    </CustomButton>
                </div>
                {showUpdatePasswordModal && (
                    <UpdatePasswordLoggedIn
                        onClose={() => setShowUpdatePasswordModal(false)}
                    />
                )}
            </div>

            {isEditing && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="First Name"
                            value={editForm.firstName}
                            onChange={(e) =>
                                updateField("firstName", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Last Name"
                            value={editForm.lastName}
                            onChange={(e) =>
                                updateField("lastName", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Email"
                            value={editForm.email}
                            onChange={(e) =>
                                updateField("email", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Phone"
                            value={editForm.phone}
                            onChange={(e) =>
                                updateField("phone", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Designation"
                            value={editForm.designation}
                            onChange={(e) =>
                                updateField("designation", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Blood Group"
                            value={editForm.bloodGroup}
                            onChange={(e) =>
                                updateField("bloodGroup", e.target.value)
                            }
                        />
                        <input
                            type="date"
                            className="px-3 py-2 border-gray-300 border rounded"
                            value={editForm.dob}
                            onChange={(e) => updateField("dob", e.target.value)}
                        />
                        <input
                            type="date"
                            className="px-3 py-2 border-gray-300 border rounded"
                            value={editForm.joiningDate}
                            onChange={(e) =>
                                updateField("joiningDate", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Salary"
                            value={editForm.salary}
                            onChange={(e) =>
                                updateField("salary", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Address"
                            value={editForm.address}
                            onChange={(e) =>
                                updateField("address", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="City"
                            value={editForm.city}
                            onChange={(e) =>
                                updateField("city", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="State"
                            value={editForm.state}
                            onChange={(e) =>
                                updateField("state", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Pincode"
                            value={editForm.pincode}
                            onChange={(e) =>
                                updateField("pincode", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Country"
                            value={editForm.country}
                            onChange={(e) =>
                                updateField("country", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Emergency Name"
                            value={editForm.emergencyContact.name}
                            onChange={(e) =>
                                updateEmergencyField("name", e.target.value)
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Emergency Relationship"
                            value={editForm.emergencyContact.relationship}
                            onChange={(e) =>
                                updateEmergencyField(
                                    "relationship",
                                    e.target.value,
                                )
                            }
                        />
                        <input
                            className="px-3 py-2 border-gray-300 border rounded"
                            placeholder="Emergency Phone"
                            value={editForm.emergencyContact.phone}
                            onChange={(e) =>
                                updateEmergencyField("phone", e.target.value)
                            }
                        />
                        <input
                            type="file"
                            className="px-3 py-2 border-gray-300 border rounded"
                            onChange={(e) => setProfileFile(e.target.files[0])}
                        />
                    </div>
                    <div className="mt-4">
                        <CustomButton
                            onClick={handleUpdateProfile}
                            disabled={updateLoading}
                        >
                            {updateLoading ? "Saving..." : "Save Changes"}
                        </CustomButton>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-12">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-orange-500 mb-6 pb-2 border-b border-gray-200">
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Email
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.email}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Phone
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.phone}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Gender
                            </label>
                            <p className="text-gray-900 capitalize">
                                {resolvedProfileData.gender}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Blood Group
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.bloodGroup}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Date of Birth
                            </label>
                            <p className="text-gray-900">
                                {formatDate(resolvedProfileData.dob)}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Joining Date
                            </label>
                            <p className="text-gray-900">
                                {formatDate(resolvedProfileData.joiningDate)}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Salary
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.salary
                                    ? `Rs ${resolvedProfileData.salary.toLocaleString()}`
                                    : "-"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Status
                            </label>
                            <p className="text-gray-900 capitalize">
                                {resolvedProfileData.status}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Role
                            </label>
                            <p className="text-gray-900 capitalize">
                                {resolvedProfileData.isSuperAdmin
                                    ? "Super Admin"
                                    : "Admin"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-orange-500 mb-6 pb-2 border-b border-gray-200">
                        Address Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Address
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.address}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                City
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.city}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                State
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.state}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Pincode
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.pincode}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Country
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.country}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-orange-500 mb-6 pb-2 border-b border-gray-200">
                        Emergency Contact
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Name
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.emergencyContact?.name ||
                                    "-"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Relationship
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.emergencyContact
                                    ?.relationship || "-"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                Phone
                            </label>
                            <p className="text-gray-900">
                                {resolvedProfileData.emergencyContact?.phone ||
                                    "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
