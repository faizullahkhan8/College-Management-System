import React from "react";
import {
  FaUserShield,
  FaUniversity,
  FaClipboardCheck,
  FaFileAlt,
  FaBullhorn,
  FaPenFancy,
  FaCloudUploadAlt,
  FaCreditCard,
  FaUserEdit,
} from "react-icons/fa";

const features = [
  { name: "Registration & Login", icon: <FaUserShield /> },
  { name: "Branch Management", icon: <FaUniversity /> },
  { name: "Attendance Tracking", icon: <FaClipboardCheck /> },
  { name: "Results Upload", icon: <FaFileAlt /> },
  { name: "Notices", icon: <FaBullhorn /> },
  { name: "Exams", icon: <FaPenFancy /> },
  { name: "Material Uploads", icon: <FaCloudUploadAlt /> },
  { name: "Fee Management", icon: <FaCreditCard /> },
  { name: "Profile Updates", icon: <FaUserEdit /> },
];

const KeyFeatures = () => {
  return (
    <section
      id="features"
      className="mt-16 px-6 md:px-12 text-center flex flex-col items-center"
    >
      
      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
        🚀 Key Features
      </h2>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Explore the essential tools that make <span className="font-semibold text-blue-600">campusConnect</span> your all-in-one College Management Platform.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group bg-white/30 backdrop-blur-lg border border-white/20 
              shadow-lg rounded-2xl py-8 px-6 flex flex-col items-center justify-center 
              transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl 
              hover:bg-white/50 cursor-pointer"
          >
            <div
              className="text-blue-600 text-4xl mb-3 group-hover:text-blue-700 
                transition-all duration-300"
            >
              {feature.icon}
            </div>
            <h3
              className="font-semibold text-gray-800 text-base md:text-lg 
                group-hover:text-blue-700 transition-colors duration-300"
            >
              {feature.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeyFeatures;
