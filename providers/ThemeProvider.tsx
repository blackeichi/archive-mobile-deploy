import type {
    AppTheme,
    ResolvedTheme,
    ThemePreference,
} from "@/constants/theme";
import { themeMap } from "@/constants/theme";
import { themeStorage } from "@/lib/theme-storage";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useColorScheme } from "react-native";

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  theme: AppTheme;
  loading: boolean;
  setPreference: (value: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const saved = await themeStorage.getPreference();
        if (mounted && saved) {
          setPreferenceState(saved);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const resolvedTheme: ResolvedTheme =
    preference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : preference;

  const theme = themeMap[resolvedTheme];

  const setPreference = async (value: ThemePreference) => {
    setPreferenceState(value);
    await themeStorage.setPreference(value);
  };

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      theme,
      loading,
      setPreference,
    }),
    [preference, resolvedTheme, theme, loading],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }

  return context;
}
