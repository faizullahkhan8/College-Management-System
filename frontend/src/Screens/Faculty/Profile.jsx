import React, { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import axiosWrapper from "../../utils/AxiosWrapper";
import { toast } from "react-hot-toast";

const Profile = ({ profileData }) => {
    const [resolvedProfileData, setResolvedProfileData] = useState(
        profileData || null,
    );
    const [loading, setLoading] = useState(false);
    const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
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
        if (profileData) {
            setResolvedProfileData(profileData);
        }
    }, [profileData]);

    useEffect(() => {
        const fetchMyDetails = async () => {
            if (resolvedProfileData) return;
            setLoading(true);
            try {
                const response = await axiosWrapper.get("/faculty/my-details", {
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
    }, [resolvedProfileData]);

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
                `/faculty/${resolvedProfileData._id}`,
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
        return (
            <div className="text-center py-10 font-medium text-gray-600">
                Loading profile data...
            </div>
        );
    if (!resolvedProfileData)
        return (
            <div className="text-center py-10 font-medium text-red-500">
                No profile data found.
            </div>
        );

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
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-gray-300 pb-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <img
                            src={`${resolvedProfileData.profile}`}
                            alt="Profile"
                            className="w-40 h-40 rounded-full object-cover ring-2 ring-green-500 ring-offset-4 transition-all group-hover:ring-4"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {`${resolvedProfileData.firstName} ${resolvedProfileData.lastName}`}
                        </h1>
                        <p className="text-lg text-gray-600 mb-1">
                            Employee ID: {resolvedProfileData.employeeId}
                        </p>
                        <p className="text-lg text-green-600 font-bold uppercase tracking-wide">
                            {resolvedProfileData.designation}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 justify-center">
                    <CustomButton
                        onClick={() =>
                            setShowPasswordUpdate(!showPasswordUpdate)
                        }
                        variant={showPasswordUpdate ? "secondary" : "primary"}
                    >
                        {showPasswordUpdate ? "Cancel" : "Update Password"}
                    </CustomButton>
                    <CustomButton
                        variant={isEditing ? "secondary" : "primary"}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Cancel Edit" : "Edit Profile"}
                    </CustomButton>
                </div>
            </div>

            {showPasswordUpdate && (
                <div className="mb-12 bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                    <h2 className="text-xl font-bold mb-4">Security Update</h2>
                    <UpdatePasswordLoggedIn
                        onClose={() => setShowPasswordUpdate(false)}
                    />
                </div>
            )}

            {isEditing && (
                <div className="bg-white rounded-xl shadow-xl p-8 mb-12 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                        Edit Your Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">
                                First Name
                            </label>
                            <input
                                className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                value={editForm.firstName}
                                onChange={(e) =>
                                    updateField("firstName", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">
                                Last Name
                            </label>
                            <input
                                className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                value={editForm.lastName}
                                onChange={(e) =>
                                    updateField("lastName", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">
                                Phone
                            </label>
                            <input
                                className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                value={editForm.phone}
                                onChange={(e) =>
                                    updateField("phone", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">
                                Blood Group
                            </label>
                            <input
                                className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                value={editForm.bloodGroup}
                                onChange={(e) =>
                                    updateField("bloodGroup", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">
                                Address
                            </label>
                            <input
                                className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                value={editForm.address}
                                onChange={(e) =>
                                    updateField("address", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">
                                City
                            </label>
                            <input
                                className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                value={editForm.city}
                                onChange={(e) =>
                                    updateField("city", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">
                                State
                            </label>
                            <input
                                className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                value={editForm.state}
                                onChange={(e) =>
                                    updateField("state", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">
                                Pincode
                            </label>
                            <input
                                className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                value={editForm.pincode}
                                onChange={(e) =>
                                    updateField("pincode", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">
                                Profile Photo
                            </label>
                            <input
                                type="file"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                onChange={(e) =>
                                    setProfileFile(e.target.files[0])
                                }
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <CustomButton
                            onClick={handleUpdateProfile}
                            disabled={updateLoading}
                        >
                            {updateLoading ? "Saving..." : "Save Profile"}
                        </CustomButton>
                        <CustomButton
                            variant="secondary"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </CustomButton>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-12">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl">
                    <h2 className="text-2xl font-bold text-green-700 mb-6 pb-2 border-b-2 border-green-100 flex items-center gap-2">
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <InfoItem
                            label="Email"
                            value={resolvedProfileData.email}
                        />
                        <InfoItem
                            label="Phone"
                            value={resolvedProfileData.phone}
                        />
                        <InfoItem
                            label="Gender"
                            value={resolvedProfileData.gender}
                            className="capitalize"
                        />
                        <InfoItem
                            label="Blood Group"
                            value={resolvedProfileData.bloodGroup}
                        />
                        <InfoItem
                            label="Date of Birth"
                            value={formatDate(resolvedProfileData.dob)}
                        />
                        <InfoItem
                            label="Joining Date"
                            value={formatDate(resolvedProfileData.joiningDate)}
                        />
                        <InfoItem
                            label="Salary"
                            value={`₹${resolvedProfileData.salary?.toLocaleString()}`}
                        />
                        <InfoItem
                            label="Status"
                            value={resolvedProfileData.status}
                            className="capitalize text-green-600 font-semibold"
                        />
                    </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl border-t-4 border-green-500">
                    <h2 className="text-2xl font-bold text-green-700 mb-6 pb-2 border-b-2 border-green-100">
                        Address Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <InfoItem
                            label="Address"
                            value={resolvedProfileData.address}
                        />
                        <InfoItem
                            label="City"
                            value={resolvedProfileData.city}
                        />
                        <InfoItem
                            label="State"
                            value={resolvedProfileData.state}
                        />
                        <InfoItem
                            label="Pincode"
                            value={resolvedProfileData.pincode}
                        />
                        <InfoItem
                            label="Country"
                            value={resolvedProfileData.country}
                        />
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl">
                    <h2 className="text-2xl font-bold text-red-600 mb-6 pb-2 border-b-2 border-red-500/10">
                        Emergency Contact
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <InfoItem
                            label="Name"
                            value={resolvedProfileData.emergencyContact?.name}
                        />
                        <InfoItem
                            label="Relationship"
                            value={
                                resolvedProfileData.emergencyContact
                                    ?.relationship
                            }
                        />
                        <InfoItem
                            label="Phone"
                            value={resolvedProfileData.emergencyContact?.phone}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ label, value, className = "" }) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {label}
        </label>
        <p className={`text-gray-800 text-lg font-medium ${className}`}>
            {value || "Not provided"}
        </p>
    </div>
);

export default Profile;
