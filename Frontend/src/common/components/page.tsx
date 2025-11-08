import Header from "@/header/pages/header";
import Sidebar from "@/sidebar/pages/sidebar";
import { Outlet } from "react-router-dom";

export default function Page() {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <Header />
      <div className="mt-20 w-full p-4">
      <Outlet />
      </div>
    </div>
  );
}
