"use client"

import * as React from "react"
import { LuMoonStar, LuSun } from "react-icons/lu";
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeButton() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure theme is mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === "light" ? (
        <LuMoonStar/>
      ) : (
        <LuSun/>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}