
import { useShop } from "@/shop/api/shopService";
import { HelpPopover } from "../../header/components/help";
import { NotificationPopover } from "../../header/components/notification";
import { ProfilePopover } from "../../header/components/profile";
import { ReportSheet } from "../../header/components/report";
import Follower from "../components/follower";


export default function Header() {
  const { shop } = useShop();
  return (
    <div className="flex w-5/6 h-20 p-2 border-b-2 items-center justify-between fixed top-0 left-64 z-10 bg-white shadow-md">
      <div className="font-bold text-3xl">{shop?.businessName}</div>
      <div className="flex gap-7">
        <div>
          <HelpPopover />
        </div>
        <div>
          <Follower />
        </div>
        <div className="border-r-2"></div>
        <div>
          <NotificationPopover />
        </div>
        <div>
          <ReportSheet />
        </div>
        <div>
          <ProfilePopover />
        </div>
      </div>
    </div>
  );
}
