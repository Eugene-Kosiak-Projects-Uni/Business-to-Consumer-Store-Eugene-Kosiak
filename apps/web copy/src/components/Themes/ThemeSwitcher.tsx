"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "./ThemeContext";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme}
    className="border rounded px-3 py-2
        bg-white text-gray-900 border-black
        dark:bg-gray-900 dark:text-white dark:border-white
        hover:opacity-80 transition">
      {theme === "light" ? "Dark Mode 🌙" : "Light Mode 💡"}
    </Button>
  );
};

export default ThemeSwitch;
