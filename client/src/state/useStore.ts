// src/state/useStore.ts
import { create } from "zustand";

export type Article = {
  body: string;
  category: string;
  title: string;
  user_id: string;
  _id: string;
}

export type User = {
  _id: string;
  status: String,
  user_name: string;
  user_email: String
}

type State = {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  loading: boolean;
  setLoading: (boolean) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  users: User[] | null;
  setUsers: (users: User[] | null) => void;
};

export const useStore = create<State>((set) => ({
  articles: [],
  setArticles: (articles: Article[]) => set({ articles: articles }),
  categories: [],
  setCategories: (categories: string[]) => set({ categories: categories }),
  loading: false,
  setLoading: (isLoading: boolean) => set({ loading: isLoading }),
  user: null,
  setUser: (u: User | null) => set({ user: u }),
  users: [],
  setUsers: (users: User[] | null) => set({ users: users })
}));
