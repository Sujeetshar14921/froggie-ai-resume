/**
 * Froggie Theme & Dark Mode Manager
 */

export const THEME_STORAGE_KEY = "froggie-theme";

/**
 * Get the currently configured theme ('light', 'dark', or 'system')
 */
export const getSavedTheme = () => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(THEME_STORAGE_KEY) || "light";
};

/**
 * Check if the active theme resolves to dark mode
 */
export const isDarkEffective = (theme = getSavedTheme()) => {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

/**
 * Apply the theme setting to documentElement and persist to localStorage
 */
export const applyTheme = (theme) => {
  if (typeof window === "undefined") return;

  const validTheme = ["light", "dark", "system"].includes(theme) ? theme : "light";
  localStorage.setItem(THEME_STORAGE_KEY, validTheme);

  const shouldBeDark = isDarkEffective(validTheme);
  if (shouldBeDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Dispatch custom event for reactive subscribers
  window.dispatchEvent(new CustomEvent("froggie-theme-change", { detail: { theme: validTheme, isDark: shouldBeDark } }));
};

/**
 * Initialize theme at application start
 */
export const initTheme = () => {
  const saved = getSavedTheme();
  applyTheme(saved);

  // Listen to system dark mode changes if 'system' is selected
  if (typeof window !== "undefined" && window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (getSavedTheme() === "system") {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    });
  }
};
