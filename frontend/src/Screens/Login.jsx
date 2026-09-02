import React, { useState, useEffect } from "react";
import { FiLogIn, FiLoader } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setUserToken } from "../redux/actions";
import { useDispatch } from "react-redux";
import axiosWrapper from "../utils/AxiosWrapper";
import Hero from "../assets/hero.jpg";

const USER_TYPES = {
    STUDENT: "Student",
    FACULTY: "Faculty",
    ADMIN: "Admin",
};

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const type = searchParams.get("type");

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [selected, setSelected] = useState(USER_TYPES.STUDENT);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

    // If already logged in, redirect immediately
    useEffect(() => {
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
            const savedType = localStorage.getItem("userType") || "student";
            navigate(`/${savedType.toLowerCase()}`);
        }
    }, [navigate]);

    // Sync type from URL
    useEffect(() => {
        if (type) {
            const capitalizedType =
                type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
            if (Object.values(USER_TYPES).includes(capitalizedType)) {
                setSelected(capitalizedType);
            }
        }
    }, [type]);

    const handleUserTypeSelect = (userType) => {
        setSelected(userType);
        setSearchParams({ type: userType.toLowerCase() });
        // Clear errors when switching user type
        setFieldErrors({ email: "", password: "" });
    };

    const validate = () => {
        const errors = { email: "", password: "" };
        let valid = true;

        if (!formData.email.trim()) {
            errors.email = "Email is required.";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Enter a valid email address.";
            valid = false;
        }

        if (!formData.password) {
            errors.password = "Password is required.";
            valid = false;
        } else if (formData.password.length < 4) {
            errors.password = "Password must be at least 4 characters.";
            valid = false;
        }

        setFieldErrors(errors);
        return valid;
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const toastId = toast.loading(`Signing in as ${selected}...`);

        try {
            const response = await axiosWrapper.post(
                `/${selected.toLowerCase()}/login`,
                formData,
                { headers: { "Content-Type": "application/json" } },
            );

            const { token } = response.data.data;
            localStorage.setItem("userToken", token);
            localStorage.setItem("userType", selected);
            dispatch(setUserToken(token));

            toast.success(`Welcome back! Redirecting...`, { id: toastId });

            setTimeout(() => {
                navigate(`/${selected.toLowerCase()}`);
            }, 600);
        } catch (error) {
            if (!error.response) {
                // Network / server unreachable
                toast.error("Cannot reach the server. Check your connection.", {
                    id: toastId,
                });
            } else if (error.response.status === 401) {
                toast.error("Invalid email or password.", { id: toastId });
                setFieldErrors((prev) => ({
                    ...prev,
                    password: "Incorrect credentials. Please try again.",
                }));
            } else if (error.response.status === 404) {
                toast.error("Account not found.", { id: toastId });
                setFieldErrors((prev) => ({
                    ...prev,
                    email: "No account found with this email.",
                }));
            } else {
                toast.error(
                    error.response?.data?.message || "Login failed. Please try again.",
                    { id: toastId },
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-2xl border border-gray-200">

                {/* Left — Login Form */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-800">
                            Welcome to{" "}
                            <span className="text-orange-500">UniCore</span> 🎓
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Sign in to continue your journey with us.
                        </p>
                    </div>

                    {/* User Type Selector */}
                    <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">
                        {selected} Login
                    </h2>
                    <div className="flex justify-center gap-3 mb-8">
                        {Object.values(USER_TYPES).map((userType) => (
                            <button
                                key={userType}
                                type="button"
                                onClick={() => handleUserTypeSelect(userType)}
                                className={`px-5 py-2 text-sm font-medium rounded-full transition duration-200 ${
                                    selected === userType
                                        ? "bg-orange-400 text-white shadow-md scale-105"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {userType}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form
                        className="w-full p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {/* Email */}
                        <div className="mb-5">
                            <label
                                className="block text-gray-800 text-sm font-medium mb-1"
                                htmlFor="email"
                            >
                                {selected} Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                autoComplete="email"
                                disabled={loading}
                                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60 ${
                                    fieldErrors.email
                                        ? "border-red-400 bg-red-50"
                                        : "border-gray-300"
                                }`}
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="you@example.com"
                            />
                            {fieldErrors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label
                                className="block text-gray-800 text-sm font-medium mb-1"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                disabled={loading}
                                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60 ${
                                    fieldErrors.password
                                        ? "border-red-400 bg-red-50"
                                        : "border-gray-300"
                                }`}
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                placeholder="••••••••"
                            />
                            {fieldErrors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 flex justify-center items-center gap-2 shadow-sm"
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="animate-spin text-lg" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <FiLogIn className="text-lg" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right — Hero Image */}
                <div className="w-full md:w-1/2 relative group overflow-hidden">
                    <img
                        src={Hero}
                        alt="College campus"
                        className="h-full w-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute bottom-10 left-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                        <h2 className="text-3xl font-semibold">
                            Empowering Future Minds
                        </h2>
                        <p className="text-sm mt-2 text-gray-200">
                            Where knowledge meets innovation 🌟
                        </p>
                    </div>
                </div>
            </div>

            <Toaster position="top-right" />
        </div>
    );
};

export default Login;
