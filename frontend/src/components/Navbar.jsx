import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import CustomButton from "./CustomButton";

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();

  const logouthandler = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <div
      className="
        fixed top-4 left-1/2 transform -translate-x-1/2 
        w-[70%] backdrop-blur-lg bg-white/20 border border-white/30
        rounded-2xl shadow-lg z-50
        px-6 py-4
      "
    >
      <div className="flex justify-between items-center">
        <p
          className="font-semibold text-xl flex items-center gap-2 cursor-pointer text-gray-500"
          onClick={() => navigate("/")}
        >
          <RxDashboard className="text-green-400 text-2xl" />
          {router.state && router.state.type} UniCore
        </p>

        <CustomButton
          variant="danger"
          onClick={logouthandler}
          className="flex items-center gap-2 font-semibold"
        >
          Logout <FiLogOut />
        </CustomButton>
      </div>
    </div>
  );
};

export default Navbar;
