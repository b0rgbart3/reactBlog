// src/state/useStore.ts
import { create } from "zustand";
export const useStore = create((set) => ({
    articles: [],
    setArticles: (articles) => set({ articles: articles }),
    categories: [],
    setCategories: (categories) => set({ categories: categories }),
    user: null,
    setUser: (u) => set({ user: u }),
}));
//# sourceMappingURL=useStore.js.map