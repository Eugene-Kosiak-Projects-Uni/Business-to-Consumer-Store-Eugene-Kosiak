"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark"; 

interface ThemeContextProps {
  theme: Theme; // stores current theme
  toggleTheme: () => void; // calls function to switch theme
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// TODOS:
// 1. Create Theme Provider
// 2. Create useTheme hook
// 3. Use the provider in your layout


// ✅ Theme Provider
export function ThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    // Sync with DOM on mount
    document.documentElement.setAttribute("data-theme", theme);
  }, []);
  
  // to change theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    // ✅ Update DOM (THIS is what test checks)
    document.documentElement.setAttribute("data-theme", newTheme);

    // ✅ Persist to cookie
    document.cookie = `theme=${newTheme}; path=/`;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}