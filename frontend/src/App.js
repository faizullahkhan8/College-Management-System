import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import mystore from "./redux/store";

import ProtectedRoute from "./components/ProtectedRoute";

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

// ---------- Faculty Screens ----------
import FacultyHome from "./Screens/Faculty/Home";
import UploadMarks from "./Screens/Faculty/AddMarks";

// ---------- Student Screens ----------
import StudentHome from "./Screens/Student/Home";
import Profile from "./Screens/Admin/Profile";

const App = () => {
  return (
    <Provider store={mystore}>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route path="/" element={<Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route
            path="/:type/update-password/:resetId"
            element={<UpdatePassword />}
          />

          {/* ---------- ADMIN ROUTES ---------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/student"
            element={
              <ProtectedRoute>
                <Student />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faculty"
            element={
              <ProtectedRoute>
                <Faculty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subject"
            element={
              <ProtectedRoute>
                <Subject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/branch"
            element={
              <ProtectedRoute>
                <Branch />
              </ProtectedRoute>
            }
          />

          {/* ---------- FACULTY ROUTES ---------- */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute>
                <FacultyHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/upload-marks"
            element={
              <ProtectedRoute>
                <UploadMarks />
              </ProtectedRoute>
            }
          />

          {/* ---------- STUDENT ROUTES ---------- */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentHome />
              </ProtectedRoute>
            }
          />

          {/* ---------- COMMON ROUTES ---------- */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
