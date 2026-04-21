import type { ThemePreference } from "@/constants/theme";
import * as SecureStore from "expo-secure-store";

const THEME_PREFERENCE_KEY = "theme-preference";

export const themeStorage = {
  async getPreference(): Promise<ThemePreference | null> {
    const value = await SecureStore.getItemAsync(THEME_PREFERENCE_KEY);

    if (value === "system" || value === "light" || value === "dark") {
      return value;
    }

    return null;
  },

  async setPreference(value: ThemePreference) {
    await SecureStore.setItemAsync(THEME_PREFERENCE_KEY, value);
  },
};
