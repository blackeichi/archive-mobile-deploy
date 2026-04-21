export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const lightColors = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceSecondary: "#F3F4F6",
  text: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  border: "#E5E7EB",
  borderStrong: "#D1D5DB",
  primary: "#111827",
  primaryContrast: "#FFFFFF",
  badge: "#E5E7EB",
  badgeText: "#111827",
  accentSoft: "#EEF2FF",
  accentBorder: "#E0E7FF",
  accentText: "#4338CA",
  danger: "#EF4444",
  dangerSoft: "#FEE2E2",
  dangerText: "#DC2626",
  shadow: "#111827",
};

const darkColors = {
  background: "#0B1220",
  surface: "#111827",
  surfaceSecondary: "#1F2937",
  text: "#F9FAFB",
  textSecondary: "#D1D5DB",
  textMuted: "#9CA3AF",
  border: "#374151",
  borderStrong: "#4B5563",
  primary: "#F9FAFB",
  primaryContrast: "#111827",
  badge: "#1F2937",
  badgeText: "#F9FAFB",
  accentSoft: "#312E81",
  accentBorder: "#4338CA",
  accentText: "#C7D2FE",
  danger: "#F87171",
  dangerSoft: "#7F1D1D",
  dangerText: "#FCA5A5",
  shadow: "#000000",
};

export const themeMap = {
  light: {
    mode: "light" as const,
    colors: lightColors,
  },
  dark: {
    mode: "dark" as const,
    colors: darkColors,
  },
};

export type AppTheme = (typeof themeMap)[keyof typeof themeMap];
