import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";

const EMPTY_FORM = {
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    semester: "",
    branchId: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    profile: "",
    status: "active",
    bloodGroup: "",
    emergencyContact: { name: "", relationship: "", phone: "" },
    password: "",
};

const AddEditStudent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const userToken = localStorage.getItem("userToken");

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [file, setFile] = useState(null);
    const [branches, setBranches] = useState([]);
    const [pageLoading, setPageLoading] = useState(isEditing);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Load branches
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await axiosWrapper.get("/branch", {
                    headers: { Authorization: `Bearer ${userToken}` },
                });
                if (res.data.success) setBranches(res.data.data || []);
            } catch { /* silent */ }
        };
        fetchBranches();
    }, []);

    // Load existing student when editing
    useEffect(() => {
        if (!isEditing) return;
        const fetchStudent = async () => {
            setPageLoading(true);
            try {
                const res = await axiosWrapper.get(`/student/${id}`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });
                if (res.data.success) {
                    const s = res.data.data;
                    setFormData({
                        firstName: s.firstName || "",
                        middleName: s.middleName || "",
                        lastName: s.lastName || "",
                        phone: s.phone || "",
                        semester: s.semester || "",
                        branchId: s.branchId?._id || s.branchId || "",
                        gender: s.gender || "",
                        dob: s.dob?.split("T")[0] || "",
                        address: s.address || "",
                        city: s.city || "",
                        state: s.state || "",
                        pincode: s.pincode || "",
                        country: s.country || "",
                        profile: s.profile || "",
                        status: s.status || "active",
                        bloodGroup: s.bloodGroup || "",
                        emergencyContact: {
                            name: s.emergencyContact?.name || "",
                            relationship: s.emergencyContact?.relationship || "",
                            phone: s.emergencyContact?.phone || "",
                        },
                        password: "",
                    });
                } else {
                    toast.error("Student not found");
                    navigate("/admin/student");
                }
            } catch {
                toast.error("Error loading student data");
                navigate("/admin/student");
            } finally {
                setPageLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleEmergencyChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            emergencyContact: { ...prev.emergencyContact, [field]: value },
        }));
    };

    const validate = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = "First name is required.";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
        if (!formData.phone.trim()) errors.phone = "Phone number is required.";
        else if (!/^\d{10,15}$/.test(formData.phone.replace(/[\s+\-]/g, "")))
            errors.phone = "Enter a valid phone number.";
        if (!formData.semester) errors.semester = "Please select a semester.";
        if (!formData.branchId) errors.branchId = "Please select a branch.";
        if (!formData.gender) errors.gender = "Please select a gender.";
        if (isEditing && formData.password && formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters.";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        try {
            setSubmitLoading(true);
            toast.loading(isEditing ? "Updating Student..." : "Adding Student...");

            const formDataToSend = new FormData();
            for (const key in formData) {
                if (key === "emergencyContact") {
                    for (const sub in formData.emergencyContact) {
                        formDataToSend.append(`emergencyContact[${sub}]`, formData.emergencyContact[sub]);
                    }
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }
            if (file) formDataToSend.append("file", file);

            const headers = {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userToken}`,
            };

            const res = isEditing
                ? await axiosWrapper.patch(`/student/${id}`, formDataToSend, { headers })
                : await axiosWrapper.post("/student/register", formDataToSend, { headers });

            toast.dismiss();
            if (res.data.success) {
                toast.success(
                    isEditing
                        ? res.data.message
                        : "Student created! Default password: student123",
                );
                navigate("/admin/student");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setSubmitLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            formErrors[field] ? "border-red-500" : "border-gray-300"
        }`;

    if (pageLoading) return <Loading />;

    return (
        <div className="w-full max-w-5xl mx-auto mb-12">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => navigate("/admin/student")}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <FiArrowLeft className="text-xl text-gray-600" />
                </button>
                <Heading title={isEditing ? "Edit Student" : "Add New Student"} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                            <input type="text" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className={inputClass("firstName")} />
                            {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                            <input type="text" value={formData.middleName} onChange={(e) => handleChange("middleName", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                            <input type="text" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className={inputClass("lastName")} />
                            {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                            <input type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass("phone")} />
                            {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                            <select value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)} className={inputClass("gender")}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {formErrors.gender && <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" value={formData.dob} onChange={(e) => handleChange("dob", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                            <select value={formData.bloodGroup} onChange={(e) => handleChange("bloodGroup", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Blood Group</option>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Academic Information */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                        Academic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Semester <span className="text-red-500">*</span></label>
                            <select value={formData.semester} onChange={(e) => handleChange("semester", e.target.value)} className={inputClass("semester")}>
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                            {formErrors.semester && <p className="text-red-500 text-xs mt-1">{formErrors.semester}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch <span className="text-red-500">*</span></label>
                            <select value={formData.branchId} onChange={(e) => handleChange("branchId", e.target.value)} className={inputClass("branchId")}>
                                <option value="">Select Branch</option>
                                {branches.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
                            </select>
                            {formErrors.branchId && <p className="text-red-500 text-xs mt-1">{formErrors.branchId}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Address */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input type="text" value={formData.address} onChange={(e) => handleChange("address", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input type="text" value={formData.city} onChange={(e) => handleChange("city", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input type="text" value={formData.state} onChange={(e) => handleChange("state", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                            <input type="text" value={formData.pincode} onChange={(e) => handleChange("pincode", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input type="text" value={formData.country} onChange={(e) => handleChange("country", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </section>

                {/* Emergency Contact */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" value={formData.emergencyContact.name} onChange={(e) => handleEmergencyChange("name", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                            <input type="text" value={formData.emergencyContact.relationship} onChange={(e) => handleEmergencyChange("relationship", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" value={formData.emergencyContact.phone} onChange={(e) => handleEmergencyChange("phone", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </section>

                {/* Account Security (Only visible in Edit mode) */}
                {isEditing && (
                    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">Account Security</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                                <input type="password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.password ? "border-red-500 bg-red-50" : "border-gray-300"}`} placeholder="••••••••" />
                                {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                            </div>
                        </div>
                    </section>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    {!isEditing && (
                        <p className="text-sm text-gray-500">
                            Default password:{" "}
                            <span className="font-semibold text-gray-700">student123</span>
                        </p>
                    )}
                    <div className="flex gap-3 ml-auto">
                        <CustomButton type="button" variant="secondary" onClick={() => navigate("/admin/student")}>
                            Cancel
                        </CustomButton>
                        <CustomButton type="submit" variant="primary" disabled={submitLoading}>
                            {submitLoading
                                ? isEditing ? "Updating..." : "Adding..."
                                : isEditing ? "Update Student" : "Add Student"}
                        </CustomButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddEditStudent;
