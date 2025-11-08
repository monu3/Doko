"use client";

import {
  Home,
  LayoutGrid,
  Package,
  Settings,
  Users,
  Diamond,
  Palette,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { useShop } from "@/shop/api/shopService";

export function TentSidebar() {
  const navigate = useNavigate();
  const { shop, status } = useShop();
  const location = useLocation(); // Hook to get the current route
  const [openProducts, setOpenProducts] = useState(false);
  const [openAppearance, setOpenAppearance] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Package, label: "Orders", path: "/orders" },
    {
      icon: LayoutGrid,
      label: "Products",
      path: "/products",
      children: [
        { label: "All Products", path: "/products" },
        { label: "Categorize", path: "/products/categories" },
      ],
    },
    // { icon: BarChart3, label: "Analytics", path: "/analytics" },
    // { icon: CreditCard, label: "Payments", path: "/payments" },
    // { icon: Tags, label: "Discounts", path: "/discounts" },
    { icon: Users, label: "Audience", path: "/audience" },
    {
      icon: Palette,
      label: "Appearance",
      path: "/appearance",
      children: [
        { label: "Themes", path: "/appearance" },
        { label: "Pages", path: "/appearance/pages" },
        { label: "Menus", path: "/appearance/menus" },
        { label: "Blog", path: "/appearance/blog" },
        { label: "Media", path: "/appearance/media" },
      ],
    },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  // Automatically open the parent menu if the current route matches a child route
  useEffect(() => {
    if (location.pathname.startsWith("/products")) {
      setOpenProducts(true); // Automatically open the Products collapsible
    }
    if (location.pathname.startsWith("/appearance")) {
      setOpenAppearance(true); // Automatically open the Appearance collapsible
    }
  }, [location.pathname]); // Trigger on route change

  return (
    <Sidebar className="border-r-0 bg-[#0f1011]">
      <SidebarHeader className="border-b border-white/5 hover:text-black">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              {status === "loading" ? (
                <span className="flex items-center gap-5 border-b-2 h-14 text-gray-400">
                  Loading...
                </span>
              ) : shop?.shopUrl ? (
                <a
                  href={`/shop/${shop.shopUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 border-b-2 h-14"
                >
                  <img
                    src={shop.logoUrl}
                    alt="Shop Logo"
                    className="h-10 w-10 rounded-full"
                  />
                  <span className="font-semibold text-white">
                    {shop.shopUrl}
                  </span>
                </a>
              ) : (
                <span className="flex items-center gap-5 border-b-2 h-14 text-gray-400">
                  No Shop Found
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              {item.children ? (
                <Collapsible
                  open={
                    item.label === "Products" ? openProducts : openAppearance
                  }
                  onOpenChange={
                    item.label === "Products"
                      ? setOpenProducts
                      : setOpenAppearance
                  }
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="text-gray-400 hover:bg-black/5 hover:text-white w-full justify-between"
                      onClick={() => {
                        if (item.label === "Products") {
                          navigate("/products"); // Navigate to "All Products" when clicking the parent
                        }
                        if (item.label === "Appearance") {
                          navigate("/appearance"); // Navigate to "All Products" when clicking the parent
                        }
                      }}
                    >
                      <div className="flex items-center gap-5">
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </div>
                      {item.label === "Products" &&
                        (openProducts ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        ))}
                      {item.label === "Appearance" &&
                        (openAppearance ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((child) => (
                        <SidebarMenuSubItem key={child.label}>
                          <SidebarMenuSubButton
                            onClick={() => navigate(child.path)}
                            className={`text-gray-400 hover:bg-black/5 hover:text-white ${
                              location.pathname === child.path
                                ? "bg-black/5 text-white"
                                : ""
                            }`} // Add active styling for current route
                          >
                            {child.label}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton
                  className={`text-gray-400 hover:bg-black/5 hover:text-white ${
                    location.pathname === item.path
                      ? "bg-black/5 text-white"
                      : ""
                  }`} // Add active styling for current route
                  onClick={() => navigate(item.path)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <a href="#" className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2">
                  <Diamond className="h-5 w-5" />
                  <span>Upgrade plan</span>
                </span>
                <span className="pl-7 text-sm text-gray-500">
                  Get extra benefits
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
