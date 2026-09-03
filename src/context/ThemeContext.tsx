import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeId = "default" | "night" | "violet" | "amber";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  category: "Day" | "Night" | "Extra";
  description: string;
  previewBg: string;
  previewPrimary: string;
  previewAccent: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "default",
    name: "Day (Default)",
    category: "Day",
    description: "Clean mint & teal emerald",
    previewBg: "#f7fdfc",
    previewPrimary: "#0f766e",
    previewAccent: "#10b981",
  },
  {
    id: "night",
    name: "Night Mode",
    category: "Night",
    description: "Deep ocean teal & luminous mint",
    previewBg: "#0c1d24",
    previewPrimary: "#14b8a6",
    previewAccent: "#2dd4bf",
  },
  {
    id: "violet",
    name: "Royal Violet",
    category: "Extra",
    description: "Deep amethyst & electric violet",
    previewBg: "#170f26",
    previewPrimary: "#a855f7",
    previewAccent: "#ec4899",
  },
  {
    id: "amber",
    name: "Sunset Gold",
    category: "Extra",
    description: "Obsidian charcoal & warm amber gold",
    previewBg: "#1c1815",
    previewPrimary: "#f59e0b",
    previewAccent: "#f97316",
  },
];

const THEME_STORAGE_KEY = "sakib_portfolio_theme";

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  themes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
      if (saved && ["default", "night", "violet", "amber"].includes(saved)) {
        return saved;
      }
    } catch {
      // Ignore localStorage read errors
    }
    return "default";
  });

  const applyThemeToDOM = (themeId: ThemeId) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-theme", themeId);

    // Clean any previous theme classes
    root.classList.remove("dark", "theme-violet", "theme-amber");

    if (themeId === "default") {
      // Default Day theme uses :root without .dark
    } else if (themeId === "night") {
      root.classList.add("dark");
    } else if (themeId === "violet") {
      root.classList.add("dark", "theme-violet");
    } else if (themeId === "amber") {
      root.classList.add("dark", "theme-amber");
    }
  };

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Ignore localStorage write errors
    }
    applyThemeToDOM(newTheme);
  };

  useEffect(() => {
    applyThemeToDOM(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEME_OPTIONS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
