export const createJSONStorage = (getStorage: () => Storage) => ({
  getItem: (name: string) => {
    const str = getStorage().getItem(name);
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  },
  setItem: (name: string, value: any) => {
    getStorage().setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => getStorage().removeItem(name),
});
