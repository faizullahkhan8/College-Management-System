import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import {
    FiCalendar,
    FiFileText,
    FiBell,
    FiClipboard,
    FiAward,
    FiUser,
} from "react-icons/fi";

const menuCards = [
    {
        label: "Timetable",
        icon: FiCalendar,
        to: "/student/timetable",
        color: "bg-blue-500",
    },
    {
        label: "Material",
        icon: FiFileText,
        to: "/student/material",
        color: "bg-green-500",
    },
    {
        label: "Notice",
        icon: FiBell,
        to: "/student/notice",
        color: "bg-yellow-500",
    },
    {
        label: "Exam",
        icon: FiClipboard,
        to: "/student/exam",
        color: "bg-purple-500",
    },
    {
        label: "Marks",
        icon: FiAward,
        to: "/student/marks",
        color: "bg-red-500",
    },
    {
        label: "Profile",
        icon: FiUser,
        to: "/student/profile",
        color: "bg-indigo-500",
    },
    {
        label: "Fees",
        icon: FiFileText,
        to: "/student/fees",
        color: "bg-orange-500",
    },
];

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const userToken = localStorage.getItem("userToken");
    const userData = useSelector((state) => state.userData);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axiosWrapper.get(`/student/my-details`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });
                if (response.data.success) {
                    dispatch(setUserData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                        "Error fetching user details",
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserDetails();
    }, [dispatch, userToken]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loading />
            </div>
        );
    }

    return (
        <div className="w-full mx-auto flex flex-col mb-10">
            {/* Welcome Section */}
            {userData && (
                <div className="rounded-2xl md:p-8 my-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                    <p className="text-sm uppercase tracking-wider text-green-100">
                        Welcome back
                    </p>
                    <h1 className="text-2xl md:text-4xl font-bold mt-1">
                        {userData
                            ? `${userData.firstName} ${userData.lastName}`
                            : "Faculty Member"}
                    </h1>
                    <p className="mt-2 text-green-100">
                        {userData?.branchId?.name} — Semester{" "}
                        {userData?.semester}
                    </p>
                </div>
            )}

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.to}
                            to={card.to}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                        >
                            <div
                                className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                            >
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {card.label}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Click to view {card.label.toLowerCase()}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
