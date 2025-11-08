
import { SidebarProvider } from "@/components/ui/sidebar";
import { TentSidebar } from "../components/app-sidebar";


export default function Sidebar() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarProvider>
        <TentSidebar />
      </SidebarProvider>
    </div>
  );
}
