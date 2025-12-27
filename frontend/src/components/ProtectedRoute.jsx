import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken"); // ✅ match Login.jsx
  const location = useLocation();

  // ✅ Public routes allowed without login
  const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

  if (publicRoutes.includes(location.pathname)) {
    return children;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
