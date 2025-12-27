import React from "react";
import { FaUserCog, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

const roles = [
  {
    title: "Admin",
    icon: <FaUserCog />,
    color: "text-purple-600",
    bg: "hover:bg-purple-50/40",
    description:
      "Admins have Complete control over the System, ensuring the Campus runs Efficiently and Data stays Organized.",
    benefits: [
      "Manage Branches and Departments",
      "Manage Exams for Students",
      "Student and Faculty Details Management",
      "Monitor Campus Notices and Announcements",
      "Oversee Fee and Profile management",
    ],
  },
  {
    title: "Faculty",
    icon: <FaChalkboardTeacher />,
    color: "text-blue-600",
    bg: "hover:bg-blue-50/40",
    description:
      "Faculty members get powerful tools to manage classes, materials, and student progress effortlessly.",
    benefits: [
      "Upload course materials and assignments",
      "Track student attendance and results",
      "Communicate directly with students",
      "Analyze academic performance",
    ],
  },
  {
    title: "Students",
    icon: <FaUserGraduate />,
    color: "text-green-600",
    bg: "hover:bg-green-50/40",
    description:
      "Students can easily access learning materials, stay informed, and manage their academic activities.",
    benefits: [
      "View Attendance, Results, and Notices",
      "Download course materials",
      "Update Personal and Academic profiles",
      "Stay Connected with faculty updates",
    ],
  },
];

const RoleBenefits = () => {
  return (
    <section className="mt-20 px-6 md:px-12 text-center flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
        🎯 Role-Based Benefits
      </h2>
      <p className="text-gray-500 mb-12 max-w-2xl">
        Each user role in <span className="font-semibold text-blue-600">campusConnect</span> is
        designed with specific tools and privileges to enhance productivity and communication across
        the Institution.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {roles.map((role, index) => (
          <div
            key={index}
            className={`group bg-white/40 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl py-8 px-6 
            flex flex-col items-center text-center transition-all duration-500 ease-in-out hover:scale-105 
            hover:shadow-2xl ${role.bg}`}
          >
            <div
              className={`${role.color} text-5xl mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              {role.icon}
            </div>
            <h3
              className={`text-xl font-bold text-slate-800 mb-2 group-hover:${role.color.replace(
                "text-",
                "text-"
              )}`}
            >
              {role.title}
            </h3>
            <p className="text-gray-600 mb-4 text-sm md:text-base">{role.description}</p>
            <ul className="text-sm text-gray-700 text-left mt-2 space-y-1">
              {role.benefits.map((b, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 before:content-['✓'] before:text-green-500 before:font-bold"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoleBenefits;
