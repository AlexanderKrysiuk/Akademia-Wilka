"use client";

import { Button } from "@heroui/button";
import { Moon, Sun } from "lucide-react";
import {useTheme} from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button size="sm" isIconOnly color="primary" variant="light" onPress={toggleTheme} radius="full">
      {theme === 'light' ? (
        <Moon/>
      ) : (
        <Sun/>
      )}
    </Button>
  )
};