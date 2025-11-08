// import { Outlet } from "react-router-dom";
// import Header from "@/header/pages/header";
// import Sidebar from "@/sidebar/pages/sidebar";

// export default function Layout() {
//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//      <Sidebar />

//       {/* header */}
//       <Header />

//       {/* Content area */}
//       <div className=" pt-16 p-4 ">
//         {/* Add pt-16 for the header space */}
//         <Outlet /> {/* Render the content based on route */}
//       </div>
//     </div>
//   );
// }

"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import Header from "@/header/pages/header";
import { Outlet } from "react-router-dom";
import { TentSidebar } from "@/sidebar/components/app-sidebar";

export default function Layout() {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      {/* Sidebar Panel - One */}
      <ResizablePanel
        defaultSize={20}
        minSize={15}
        maxSize={20}
        className="min-w-[200px]"
      >
        <SidebarProvider>
          <Sidebar collapsible="none">
            <SidebarHeader className="h-14 border-b" />
            <SidebarContent>
              {/* Your sidebar content here */}
              <TentSidebar />
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
        </SidebarProvider>
      </ResizablePanel>

      {/* Main Content Panel */}
      <ResizablePanel defaultSize={80}>
        <div className="flex h-full flex-col">
          {/* Header - Two */}
          <div className="w-full fixed top-0 z-10">
            <Header />
          </div>

          {/* Main Content - Three */}
          <main className="flex-1 overflow-hidden p-6 mt-16">
            <Outlet />
          </main>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
