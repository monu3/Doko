import type  React  from "react"
import { Card } from "@/components/ui/card"
import { SettingsSidebar } from "./settings-sidebar"
import type { SettingsSection } from "./settings"

interface SettingsLayoutProps {
  children: React.ReactNode
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
}

export function SettingsLayout({ children, activeSection, onSectionChange }: SettingsLayoutProps) {
  return (
    <div className="container mx-auto p-7">
    
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SettingsSidebar activeSection={activeSection} onSectionChange={onSectionChange} />
        </div>

        <div className="lg:col-span-3">
          <Card className="p-6">{children}</Card>
        </div>
      </div>
    </div>
  )
}
