import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainRoutes from "./routes/pages/mainRoutes";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { checkAuth } from "./auth/slice/authSlice";
import { AppDispatch } from "./store";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      await dispatch(checkAuth());
      setIsAuthChecked(true);
    };
    verifyAuth();
  }, [dispatch]);

  if (!isAuthChecked) {
    return <div>Loading...</div>; // Show loading until auth check completes
  }
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <MainRoutes />
    </>
  );
}

export default App;
