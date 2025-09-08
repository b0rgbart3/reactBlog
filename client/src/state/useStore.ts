// src/state/useStore.ts
import { create } from "zustand";

export type Article = {
  id: string;
  body: string;
  category: string;
  title: string;
  user_id: string;
  _id: string;
}

export type User = {
  id: string;
  name: string;
}

type State = {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  user: User | null;
  setUser: (u: User | null) => void;
};

export const useStore = create<State>((set) => ({
  articles: [],
  setArticles: (articles: Article[]) => set({ articles: articles }),
  categories: [],
  setCategories: (categories: string[]) => set({ categories: categories }),
  user: null,
  setUser: (u: User | null) => set({ user: u }),
}));
