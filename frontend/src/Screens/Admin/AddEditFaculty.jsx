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
    lastName: "",
    email: "",
    phone: "",
    profile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    gender: "",
    dob: "",
    designation: "",
    joiningDate: "",
    salary: "",
    status: "active",
    emergencyContact: { name: "", relationship: "", phone: "" },
    bloodGroup: "",
    branchId: "",
    password: "",
};

const AddEditFaculty = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const userToken = localStorage.getItem("userToken");

    const [data, setData] = useState(EMPTY_FORM);
    const [file, setFile] = useState(null);
    const [branches, setBranches] = useState([]);
    const [pageLoading, setPageLoading] = useState(isEditing);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

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

    useEffect(() => {
        if (!isEditing) return;
        const fetchFaculty = async () => {
            setPageLoading(true);
            try {
                const res = await axiosWrapper.get(`/faculty/${id}`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });
                if (res.data.success) {
                    const f = res.data.data;
                    setData({
                        firstName: f.firstName || "",
                        lastName: f.lastName || "",
                        email: f.email || "",
                        phone: f.phone || "",
                        profile: f.profile || "",
                        address: f.address || "",
                        city: f.city || "",
                        state: f.state || "",
                        pincode: f.pincode || "",
                        country: f.country || "",
                        gender: f.gender || "",
                        dob: f.dob?.split("T")[0] || "",
                        designation: f.designation || "",
                        joiningDate: f.joiningDate?.split("T")[0] || "",
                        salary: f.salary || "",
                        status: f.status || "active",
                        emergencyContact: {
                            name: f.emergencyContact?.name || "",
                            relationship: f.emergencyContact?.relationship || "",
                            phone: f.emergencyContact?.phone || "",
                        },
                        bloodGroup: f.bloodGroup || "",
                        branchId: f.branchId || "",
                        password: "",
                    });
                } else {
                    toast.error("Faculty not found");
                    navigate("/admin/faculty");
                }
            } catch {
                toast.error("Error loading faculty data");
                navigate("/admin/faculty");
            } finally {
                setPageLoading(false);
            }
        };
        fetchFaculty();
    }, [id]);

    const handleChange = (field, value) => {
        setData((prev) => ({ ...prev, [field]: value }));
        if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleEmergencyChange = (field, value) => {
        setData((prev) => ({
            ...prev,
            emergencyContact: { ...prev.emergencyContact, [field]: value },
        }));
    };

    const validate = () => {
        const errors = {};
        if (!data.firstName.trim()) errors.firstName = "First name is required.";
        if (!data.lastName.trim()) errors.lastName = "Last name is required.";
        if (!data.email.trim()) errors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
            errors.email = "Enter a valid email address.";
        if (!data.phone.trim()) errors.phone = "Phone number is required.";
        else if (!/^\d{10,15}$/.test(data.phone.replace(/[\s+\-]/g, "")))
            errors.phone = "Enter a valid phone number.";
        if (!data.gender) errors.gender = "Please select a gender.";
        if (!data.branchId) errors.branchId = "Please select a branch.";
        if (isEditing && data.password && data.password.length < 8) {
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
            toast.loading(isEditing ? "Updating Faculty..." : "Adding Faculty...");
            const formData = new FormData();
            for (const key in data) {
                if (key === "emergencyContact") {
                    for (const sub in data.emergencyContact) {
                        formData.append(`emergencyContact[${sub}]`, data.emergencyContact[sub]);
                    }
                } else {
                    formData.append(key, data[key]);
                }
            }
            if (file) formData.append("file", file);
            const headers = {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userToken}`,
            };
            const res = isEditing
                ? await axiosWrapper.patch(`/faculty/${id}`, formData, { headers })
                : await axiosWrapper.post("/faculty/register", formData, { headers });
            toast.dismiss();
            if (res.data.success) {
                toast.success(
                    isEditing ? res.data.message : "Faculty created! Default password: faculty123",
                );
                navigate("/admin/faculty");
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
                    onClick={() => navigate("/admin/faculty")}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <FiArrowLeft className="text-xl text-gray-600" />
                </button>
                <Heading title={isEditing ? "Edit Faculty" : "Add New Faculty"} />
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
                            <input type="text" value={data.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className={inputClass("firstName")} />
                            {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                            <input type="text" value={data.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className={inputClass("lastName")} />
                            {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                            <input type="email" value={data.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass("email")} />
                            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                            <input type="tel" value={data.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass("phone")} />
                            {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                            <select value={data.gender} onChange={(e) => handleChange("gender", e.target.value)} className={inputClass("gender")}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {formErrors.gender && <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" value={data.dob} onChange={(e) => handleChange("dob", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                            <select value={data.bloodGroup} onChange={(e) => handleChange("bloodGroup", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Blood Group</option>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Professional Information */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                        Professional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                            <input type="text" value={data.designation} onChange={(e) => handleChange("designation", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch <span className="text-red-500">*</span></label>
                            <select value={data.branchId} onChange={(e) => handleChange("branchId", e.target.value)} className={inputClass("branchId")}>
                                <option value="">Select Branch</option>
                                {branches.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
                            </select>
                            {formErrors.branchId && <p className="text-red-500 text-xs mt-1">{formErrors.branchId}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                            <input type="date" value={data.joiningDate} onChange={(e) => handleChange("joiningDate", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                            <input type="number" value={data.salary} onChange={(e) => handleChange("salary", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={data.status} onChange={(e) => handleChange("status", e.target.value)}
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
                            <input type="text" value={data.address} onChange={(e) => handleChange("address", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input type="text" value={data.city} onChange={(e) => handleChange("city", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input type="text" value={data.state} onChange={(e) => handleChange("state", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                            <input type="text" value={data.pincode} onChange={(e) => handleChange("pincode", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input type="text" value={data.country} onChange={(e) => handleChange("country", e.target.value)}
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
                            <input type="text" value={data.emergencyContact.name} onChange={(e) => handleEmergencyChange("name", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                            <input type="text" value={data.emergencyContact.relationship} onChange={(e) => handleEmergencyChange("relationship", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" value={data.emergencyContact.phone} onChange={(e) => handleEmergencyChange("phone", e.target.value)}
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
                                <input type="password" value={data.password} onChange={(e) => handleChange("password", e.target.value)}
                                    className={inputClass("password")} placeholder="••••••••" />
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
                            <span className="font-semibold text-gray-700">faculty123</span>
                        </p>
                    )}
                    <div className="flex gap-3 ml-auto">
                        <CustomButton type="button" variant="secondary" onClick={() => navigate("/admin/faculty")}>
                            Cancel
                        </CustomButton>
                        <CustomButton type="submit" variant="primary" disabled={submitLoading}>
                            {submitLoading
                                ? isEditing ? "Updating..." : "Adding..."
                                : isEditing ? "Update Faculty" : "Add Faculty"}
                        </CustomButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddEditFaculty;
