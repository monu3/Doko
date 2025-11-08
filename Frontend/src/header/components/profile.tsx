import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as React from "react";
import { DollarSign, Gem, LogOut } from "lucide-react";
import { useAppDispatch } from "@/hooks";
import { logoutUser } from "@/auth/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import loginbg1 from "/loginbg1.jpg";
import { toast } from "react-toastify";
import { Switch } from "@/components/ui/switch";
import { resetShopState } from "@/shop/slice/shopSlice";
import { resetCategoryState } from "@/category/slice/categorySlice";
import { resetProductState } from "@/product/slice/productSlice";

const menuItems = [
  {
    value: "Billing and Invoice",
    label: "Billing and Invoice",
    link: "/billing",
    icon: DollarSign,
  },
  {
    value: "Subscription",
    label: "Subscription",
    link: "/subscription",
    icon: Gem,
  },
  {
    value: "Log-out",
    label: "Log out",
    link: "/log-out",
    icon: LogOut,
  },
];

export function ProfilePopover() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [shopActive, setShopActive] = React.useState(false);

  // State for confirmation dialog and loading
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await dispatch(logoutUser()).then(() => {
        dispatch(resetCategoryState()); // Reset category state if needed
        dispatch(resetProductState()); // Reset product state if needed
        dispatch(resetShopState()); // Ensure shop data is cleared // Dispatch logout action

        toast.success("Logout successful! Redirecting to login...");

        navigate("/login"); // Redirect after logout
      });
    } catch (error: any) {
      toast.error(error || "Logout failed. Please try again.");
    } finally {
      setLoading(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="menu"
          aria-expanded={open}
          className="justify-between"
        >
          <Avatar>
            <AvatarImage src={loginbg1} />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 my-3">
        <div>
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Shop Status</span>
            </div>
            <Switch checked={shopActive} onCheckedChange={setShopActive} />
          </div>
        </div>

        <hr />
        <div>
          {menuItems.map((item) => (
            <div
              key={item.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex gap-2 my-3"
              onClick={() => {
                if (item.value === "Log-out") {
                  setShowLogoutConfirm(true); // Show confirmation dialog
                } else {
                  setOpen(false);
                  navigate(item.link);
                }
              }}
            >
              <item.icon /> {item.label}
            </div>
          ))}
        </div>
      </PopoverContent>

      {/* Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30 animate-in fade-in-0 duration-300">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">Do you really want to log out?</p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowLogoutConfirm(false)}
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="ml-2"
                disabled={loading}
              >
                {loading ? "Logging Out..." : "Log Out"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Popover>
  );
}
