import { Navigate, Outlet } from "react-router-dom";

import {  useAppSelector } from "@/hooks";

const ProtectedRoute = () => {
  const { isAuthenticated, status } = useAppSelector((state) => state.auth);

  if (status === "loading") {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
