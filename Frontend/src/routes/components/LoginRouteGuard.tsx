import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks";

interface LoginRouteGuardProps {
  children: ReactNode; // Define the type for the children prop
}

const LoginRouteGuard = ({ children }: LoginRouteGuardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect authenticated users to the dashboard
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null; // Prevents the login page from flashing before redirect
  }
  return <>{children}</>; // Render the login page if the user is not authenticated
};

export default LoginRouteGuard;
