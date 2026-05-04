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
            <Heading title="Student Dashboard" />

            {/* Welcome Section */}
            {userData && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-center gap-4">
                        <img
                            src={userData.profile}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-green-500"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Welcome, {userData.firstName}{" "}
                                {userData.lastName}
                            </h2>
                            <p className="text-gray-600">
                                {userData.enrollmentNo} |{" "}
                                {userData.branchId?.name} | Semester{" "}
                                {userData.semester}
                            </p>
                        </div>
                    </div>
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
