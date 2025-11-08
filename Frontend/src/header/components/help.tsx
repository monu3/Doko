"use client"

import * as React from "react"
import { CircleHelp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const menuItems = [
  {
    value: "chat",
    label: "Chat with us",
    link: "/chat", // Link to the chat page
  },
  {
    value: "help-center",
    label: "Help center",
    link: "/help-center", // Link to the help center
  },
  {
    value: "whats-new",
    label: "What's new",
    link: "/whats-new", // Link to the what's new page
  },
  {
    value: "join-vip",
    label: "Join meroPasal",
    link: "/join-vip", // Link to the VIP page
  },
]

export function HelpPopover() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="menu"
          aria-expanded={open}
          className=" justify-between"
        >
          <CircleHelp className="opacity-50" />
          Help
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 my-3">
        <div>
          {menuItems.map((item) => (
            <div
              key={item.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setOpen(false)
                navigate(item.link) // Navigate to the corresponding page
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
