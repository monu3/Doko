import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button";

export function NotificationPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" > <Bell size={100}/> </Button>
      </PopoverTrigger>
      <PopoverContent className="my-3">
        <div>Notification</div>
      </PopoverContent>
    </Popover>
  );
}
