"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Settings, Palette, Zap, Volume2 } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useTheme } from "next-themes"

export function SettingsDrawer() {
  const [animationsEnabled, setAnimationsEnabled] = React.useState(true)
  const [soundEnabled, setSoundEnabled] = React.useState(false)
  const [aiModel, setAiModel] = React.useState("gpt-4")
  const { theme, setTheme } = useTheme()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed bottom-4 right-4 z-50 shadow-lg">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </SheetTitle>
          <SheetDescription>Customize your AiGenZone experience</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Theme Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle" className="text-sm">
                Theme
              </Label>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="animations" className="text-sm">
                Animations
              </Label>
              <Switch id="animations" checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
            </div>
          </div>

          <Separator />

          {/* AI Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Configuration
            </Label>
            <div className="space-y-2">
              <Label htmlFor="ai-model" className="text-sm">
                AI Model
              </Label>
              <Select value={aiModel} onValueChange={setAiModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3">Claude 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Audio Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Audio
            </Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="text-sm">
                Sound Effects
              </Label>
              <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
