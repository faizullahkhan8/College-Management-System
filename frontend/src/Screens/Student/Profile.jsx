import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/CustomButton";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import Heading from "../../components/Heading";
import Loading from "../../components/Loading";
import axiosWrapper from "../../utils/AxiosWrapper";
import { setUserData } from "../../redux/actions";

const Profile = () => {
    const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userData);
    const userToken = localStorage.getItem("userToken");

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (userData) return;
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
                    error.response?.data?.message || "Error fetching profile",
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserDetails();
    }, [dispatch, userToken, userData]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loading />
            </div>
        );
    }

    if (!userData) return null;

    const profileData = userData;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="w-full mx-auto flex flex-col mb-10">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex items-center gap-8 mb-12 border-b border-gray-300 pb-8 justify-between">
                    <div className="flex items-center gap-8">
                        <img
                            src={profileData.profile}
                            alt="Profile"
                            className="w-40 h-40 rounded-full object-cover ring-2 ring-green-500 ring-offset-4"
                        />
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                {`${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`}
                            </h1>
                            <p className="text-lg text-gray-600 mb-1">
                                {profileData.enrollmentNo}
                            </p>
                            <p className="text-lg text-green-600 font-bold">
                                {profileData.branchId?.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8 justify-end">
                        <CustomButton
                            onClick={() =>
                                setShowPasswordUpdate(!showPasswordUpdate)
                            }
                            variant="primary"
                        >
                            {showPasswordUpdate ? "Hide" : "Update Password"}
                        </CustomButton>
                    </div>
                    {showPasswordUpdate && (
                        <UpdatePasswordLoggedIn
                            onClose={() => setShowPasswordUpdate(false)}
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {/* Personal Information */}
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
                                    {profileData.email}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Phone
                                </label>
                                <p className="text-gray-900">
                                    {profileData.phone}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Gender
                                </label>
                                <p className="text-gray-900 capitalize">
                                    {profileData.gender}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Blood Group
                                </label>
                                <p className="text-gray-900">
                                    {profileData.bloodGroup}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Date of Birth
                                </label>
                                <p className="text-gray-900">
                                    {formatDate(profileData.dob)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Semester
                                </label>
                                <p className="text-gray-900">
                                    {profileData.semester}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
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
                                    {profileData.address}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    City
                                </label>
                                <p className="text-gray-900">
                                    {profileData.city}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    State
                                </label>
                                <p className="text-gray-900">
                                    {profileData.state}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Pincode
                                </label>
                                <p className="text-gray-900">
                                    {profileData.pincode}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Country
                                </label>
                                <p className="text-gray-900">
                                    {profileData.country}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
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
                                    {profileData.emergencyContact?.name}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Relationship
                                </label>
                                <p className="text-gray-900">
                                    {profileData.emergencyContact?.relationship}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Phone
                                </label>
                                <p className="text-gray-900">
                                    {profileData.emergencyContact?.phone}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
