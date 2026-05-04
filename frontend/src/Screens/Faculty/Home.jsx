import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import { useLocation } from "react-router-dom";
import Timetable from "./Timetable";
import Material from "./Material";
import StudentFinder from "./StudentFinder";
import Profile from "./Profile";
import Marks from "./AddMarks";
import Exam from "../Exam";
import FacultyDashboard from "./FacultyDashboard";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: FacultyDashboard },
  { id: "timetable", label: "Timetable", component: Timetable },
  { id: "material", label: "Material", component: Material },
  { id: "notice", label: "Notice", component: Notice },
  { id: "student info", label: "Student Info", component: StudentFinder },
  { id: "marks", label: "Marks", component: Marks },
  { id: "exam", label: "Exam", component: Exam },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [profileData, setProfileData] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosWrapper.get("/faculty/my-details", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
          dispatch(setUserData(response.data.data));
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    fetchUserDetails();
  }, [dispatch, userToken]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get("page") || "home";
    setSelectedMenu(page.toLowerCase());
  }, [location.search]);

  const renderContent = () => {


    const menuItem = MENU_ITEMS.find(
      (item) => item.id.toLowerCase() === selectedMenu.toLowerCase()
    );

    if (menuItem && menuItem.component) {
      const Component = menuItem.component;
      return <Component profileData={profileData} />;
    }

    return null;
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;
