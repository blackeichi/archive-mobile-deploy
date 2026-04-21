import * as SecureStore from "expo-secure-store";

const getKey = (postId: number) => `bookmark-post-${postId}`;

export const bookmarkStorage = {
  async getPosition(postId: number): Promise<number | null> {
    const value = await SecureStore.getItemAsync(getKey(postId));
    if (value === null) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  },

  async setPosition(postId: number, y: number): Promise<void> {
    await SecureStore.setItemAsync(getKey(postId), String(y));
  },

  async remove(postId: number): Promise<void> {
    await SecureStore.deleteItemAsync(getKey(postId));
  },
};
