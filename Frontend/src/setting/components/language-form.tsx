"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { LanguageSettings } from "../settings"

export function LanguagesForm() {
  const [settings, setSettings] = useState<LanguageSettings>({
    defaultLanguage: "en",
    supportedLanguages: ["en", "es"],
    rtlSupport: false,
  })

  const availableLanguages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Language settings updated:", settings)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Languages</h2>
        <p className="text-muted-foreground">Configure language and localization settings for your store.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Default Language</CardTitle>
            <CardDescription>Set the primary language for your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">Default Language</Label>
              <Select
                value={settings.defaultLanguage}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, defaultLanguage: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default language" />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supported Languages</CardTitle>
            <CardDescription>Choose which languages your store will support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableLanguages.map((lang) => (
              <div key={lang.code} className="flex items-center space-x-2">
                <Checkbox
                  id={lang.code}
                  checked={settings.supportedLanguages.includes(lang.code)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSettings((prev) => ({
                        ...prev,
                        supportedLanguages: [...prev.supportedLanguages, lang.code],
                      }))
                    } else {
                      setSettings((prev) => ({
                        ...prev,
                        supportedLanguages: prev.supportedLanguages.filter((code) => code !== lang.code),
                      }))
                    }
                  }}
                />
                <Label htmlFor={lang.code}>{lang.name}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Text Direction</CardTitle>
            <CardDescription>Configure text direction for right-to-left languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="rtl-support">Right-to-Left (RTL) Support</Label>
                <p className="text-sm text-muted-foreground">Enable support for RTL languages like Arabic and Hebrew</p>
              </div>
              <Switch
                id="rtl-support"
                checked={settings.rtlSupport}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, rtlSupport: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Language Settings</Button>
        </div>
      </form>
    </div>
  )
}
