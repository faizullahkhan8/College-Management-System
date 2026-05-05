import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import mystore from "./redux/store";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import StudentLayout from "./layouts/StudentLayout";

// ---------- Public Screens ----------
import Landing from "./Screens/landing";
import Login from "./Screens/Login";
import ForgetPassword from "./Screens/ForgetPassword";
import UpdatePassword from "./Screens/UpdatePassword";

// ---------- Admin Screens ----------
import AdminHome from "./Screens/Admin/Home";
import Student from "./Screens/Admin/Student";
import Faculty from "./Screens/Admin/Faculty";
import Subject from "./Screens/Admin/Subject";
import Branch from "./Screens/Admin/Branch";
import AdminProfile from "./Screens/Admin/Profile";
import AdminFees from "./Screens/Admin/Fees";

// ---------- Faculty Screens ----------
import FacultyHome from "./Screens/Faculty/Home";
import FacultyProfile from "./Screens/Faculty/Profile";
import FacultyAttendance from "./Screens/Faculty/Attendance";
import FacultyTimetable from "./Screens/Faculty/Timetable";
import FacultyMaterial from "./Screens/Faculty/Material";
import FacultyNotice from "./Screens/Notice";
import FacultyStudentInfo from "./Screens/Faculty/StudentFinder";
import FacultyMarks from "./Screens/Faculty/AddMarks";
import FacultyExam from "./Screens/Exam";

// ---------- Student Screens ----------
import StudentHome from "./Screens/Student/Home";
import StudentTimetable from "./Screens/Student/Timetable";
import StudentMaterial from "./Screens/Student/Material";
import StudentNotice from "./Screens/Notice";
import StudentExam from "./Screens/Exam";
import StudentMarks from "./Screens/Student/ViewMarks";
import StudentProfile from "./Screens/Student/Profile";
import StudentFees from "./Screens/Student/Fees";

const App = () => {
    return (
        <Provider store={mystore}>
            <Router>
                <Toaster position="top-center" reverseOrder={false} />

                <Routes>
                    {/* ---------- PUBLIC ROUTES ---------- */}
                    <Route path="/" element={<Login />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route
                        path="/forget-password"
                        element={<ForgetPassword />}
                    />
                    <Route
                        path="/:type/update-password/:resetId"
                        element={<UpdatePassword />}
                    />

                    {/* ---------- ADMIN ROUTES ---------- */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminLayout>
                                    <AdminHome />
                                </AdminLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/student"
                        element={
                            <ProtectedRoute>
                                <AdminLayout>
                                    <Student />
                                </AdminLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/faculty"
                        element={
                            <ProtectedRoute>
                                <AdminLayout>
                                    <Faculty />
                                </AdminLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/subject"
                        element={
                            <ProtectedRoute>
                                <AdminLayout>
                                    <Subject />
                                </AdminLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/branch"
                        element={
                            <ProtectedRoute>
                                <AdminLayout>
                                    <Branch />
                                </AdminLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/fees"
                        element={
                            <ProtectedRoute>
                                <AdminLayout>
                                    <AdminFees />
                                </AdminLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* ---------- FACULTY ROUTES ---------- */}
                    <Route
                        path="/faculty"
                        element={
                            <ProtectedRoute>
                                <FacultyLayout>
                                    <FacultyHome />
                                </FacultyLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/faculty/timetable"
                        element={
                            <ProtectedRoute>
                                <FacultyLayout>
                                    <FacultyTimetable />
                                </FacultyLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/faculty/material"
                        element={
                            <ProtectedRoute>
                                <FacultyLayout>
                                    <FacultyMaterial />
                                </FacultyLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/faculty/notice"
                        element={
                            <ProtectedRoute>
                                <FacultyLayout>
                                    <FacultyNotice />
                                </FacultyLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/faculty/student-info"
                        element={
                            <ProtectedRoute>
                                <FacultyLayout>
                                    <FacultyStudentInfo />
                                </FacultyLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/faculty/marks"
                        element={
                            <ProtectedRoute>
                                <FacultyLayout>
                                    <FacultyMarks />
                                </FacultyLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/faculty/exam"
                        element={
                            <ProtectedRoute>
                                <FacultyLayout>
                                    <FacultyExam />
                                </FacultyLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/faculty/profile"
                        element={
                            <ProtectedRoute>
                                <FacultyLayout>
                                    <FacultyProfile />
                                </FacultyLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/faculty/attendance"
                        element={
                            <ProtectedRoute>
                                <FacultyLayout>
                                    <FacultyAttendance />
                                </FacultyLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* ---------- STUDENT ROUTES ---------- */}
                    <Route
                        path="/student"
                        element={
                            <ProtectedRoute>
                                <StudentLayout>
                                    <StudentHome />
                                </StudentLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/timetable"
                        element={
                            <ProtectedRoute>
                                <StudentLayout>
                                    <StudentTimetable />
                                </StudentLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/material"
                        element={
                            <ProtectedRoute>
                                <StudentLayout>
                                    <StudentMaterial />
                                </StudentLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/notice"
                        element={
                            <ProtectedRoute>
                                <StudentLayout>
                                    <StudentNotice />
                                </StudentLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/exam"
                        element={
                            <ProtectedRoute>
                                <StudentLayout>
                                    <StudentExam />
                                </StudentLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/marks"
                        element={
                            <ProtectedRoute>
                                <StudentLayout>
                                    <StudentMarks />
                                </StudentLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/profile"
                        element={
                            <ProtectedRoute>
                                <StudentLayout>
                                    <StudentProfile />
                                </StudentLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/fees"
                        element={
                            <ProtectedRoute>
                                <StudentLayout>
                                    <StudentFees />
                                </StudentLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* ---------- COMMON ROUTES ---------- */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <AdminLayout>
                                    <AdminProfile />
                                </AdminLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch-all for debugging */}
                    <Route
                        path="*"
                        element={
                            <div className="p-10 text-center">
                                404 - Page Not Found
                            </div>
                        }
                    />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
