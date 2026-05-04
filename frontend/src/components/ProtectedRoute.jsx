import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  const location = useLocation();

  const publicRoutes = ["/", "/login", "/register", "/forget-password"];

  if (
    publicRoutes.includes(location.pathname) ||
    /^\/[^/]+\/update-password\/[^/]+$/.test(location.pathname)
  ) {
    return children;
  }

  const clearAuthAndRedirect = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    return <Navigate to="/" replace />;
  };

  if (!token) {
    return clearAuthAndRedirect();
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return clearAuthAndRedirect();
    }

    const payload = JSON.parse(atob(parts[1]));
    const exp = payload?.exp;

    if (!exp || Date.now() >= exp * 1000) {
      return clearAuthAndRedirect();
    }
  } catch (error) {
    return clearAuthAndRedirect();
  }

  return children;
};

export default ProtectedRoute;
