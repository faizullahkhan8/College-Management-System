import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axiosWrapper from "../utils/AxiosWrapper";
import { IoMdClose } from "react-icons/io";
import CustomButton from "./CustomButton";
import Hero from '../assets/hero.jpg'

const UpdatePasswordLoggedIn = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match ❌");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long 🔒");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosWrapper.post(
        `/${userType.toLowerCase()}/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Password updated successfully 🎉");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-lg rounded-2xl p-8 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold tracking-wide">🔑 Update Password</h2>
          <CustomButton
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 transition-all p-2 rounded-full text-white"
          >
            <IoMdClose className="text-xl" />
          </CustomButton>
        </div>

        {/* Form */}
        <form onSubmit={handlePasswordUpdate} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-500/40 bg-white/10 text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-300"
              placeholder="Enter current password"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-500/40 bg-white/10 text-gray-100 focus:ring-2 focus:ring-green-400 outline-none placeholder-gray-300"
              placeholder="Enter new password"
              required
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-500/40 bg-white/10 text-gray-100 focus:ring-2 focus:ring-purple-400 outline-none placeholder-gray-300"
              placeholder="Confirm new password"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg"
            }`}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default UpdatePasswordLoggedIn;
