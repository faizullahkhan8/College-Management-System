import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosWrapper from "../utils/AxiosWrapper";
import CustomButton from "../components/CustomButton";
import Hero from '../assets/hero.jpg'

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="flex justify-center gap-4 mb-8">
    {Object.values(USER_TYPES).map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`px-5 py-2 text-sm font-medium rounded-full transition duration-200 ${
          selected === type
            ? "bg-green-500 text-white shadow-md scale-105"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
);

const ForgetPassword = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const [selected, setSelected] = useState(USER_TYPES.STUDENT);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userToken) {
      navigate(`/${localStorage.getItem("userType")}`);
    }
  }, [userToken, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Sending reset mail...");
    if (email === "") {
      toast.dismiss();
      toast.error("Please enter your email");
      return;
    }
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const resp = await axiosWrapper.post(
        `/${selected.toLowerCase()}/forget-password`,
        { email },
        { headers }
      );

      if (resp.data.success) {
        toast.dismiss();
        toast.success(resp.data.message);
      } else {
        toast.dismiss();
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Error sending reset mail");
    } finally {
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-2xl border border-gray-200">
        {/* Left Section - Forget Password Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-gray-800">
              Reset Your <span className="text-orange-500">UniCore</span> Password 🔒
            </h1>
            <p className="text-gray-600 mt-2">
              We’ll send you a link to reset your password.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">
            {selected} Password Reset
          </h2>

          <UserTypeSelector selected={selected} onSelect={setSelected} />

          <form
            className="w-full p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 transition-all duration-300"
            onSubmit={onSubmit}
          >
            <div className="mb-6">
              <label
                className="block text-gray-800 text-sm font-medium mb-2"
                htmlFor="email"
              >
                {selected} Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <CustomButton
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300"
            >
              Send Reset Link
            </CustomButton>
          </form>
        </div>

        {/* Right Section - College Image */}
        <div className="w-full md:w-1/2 relative group overflow-hidden">
          <img
            src={Hero}
            alt="College"
            className="h-full w-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute bottom-10 left-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
            <h2 className="text-3xl font-semibold">Secure Your Access</h2>
            <p className="text-sm mt-2 text-gray-200">
              Protecting your account with trust and security 🔐
            </p>
          </div>
        </div>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default ForgetPassword;
