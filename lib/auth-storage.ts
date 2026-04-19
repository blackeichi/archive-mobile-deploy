import * as SecureStore from "expo-secure-store";

const REMEMBERED_EMAIL_KEY = "remembered-email";

export const authStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const rememberedEmailStorage = {
  async getEmail() {
    return SecureStore.getItemAsync(REMEMBERED_EMAIL_KEY);
  },
  async setEmail(email: string) {
    return SecureStore.setItemAsync(REMEMBERED_EMAIL_KEY, email);
  },
  async clear() {
    return SecureStore.deleteItemAsync(REMEMBERED_EMAIL_KEY);
  },
};
