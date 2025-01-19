"use client";

import { Button } from "@heroui/button";
import { Switch } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher({ useSwitch = false }: { useSwitch?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return useSwitch ? (
    <Switch
      isSelected={theme === "dark"}
      onChange={toggleTheme}
      color="primary"
      size="md"
      thumbIcon={({isSelected, className}) =>
        isSelected ? <Sun className={className} /> : <Moon className={className} />
      }      
      aria-label="Theme toggle switch"
    />
  ) : (
    <Button
      size="sm"
      isIconOnly
      color="primary"
      variant="light"
      onPress={toggleTheme}
      radius="full"
      aria-label="Theme toggle button"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}
