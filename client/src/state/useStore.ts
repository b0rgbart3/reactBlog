// src/state/useStore.ts
import { create } from "zustand";

export type Article = {
  body: string;
  category: string;
  headlineImage?: string;
  originDate: string;
  lastModifiedDate: string;
  randomColor?: string;
  readyToPublish: boolean;
  title: string;
  userID: string;
  _id: string;
}

export type User = {
  _id: string;
  sensi: boolean;
  author: boolean;
  authorName: string;
  loginWord: string;
  phash: String;
  status: String,
  userName: string;
  userEmail: String
}

export type Product = {
  _id: string;
  beauty: string;
  category: string;
  productImages: string[];
  productDescription: string;
  productName: string;
  readyToPublish: boolean;
  thumbnail: string;
}
export type Order = {
  _id: number;
  productID: string;
  quantity: number;
  chosenSize: string;
}

export type Setting = {
  _id: string;
  name: string;
  booleanValue: boolean;
  stringValue: string;
}

type State = {
  articlesById: Record<string, Article>;
  usersById: Record<string, User>;
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  articlesLoaded: boolean;
  setArticlesLoaded: (boolean) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  productsLoaded: boolean;
  setProductsLoaded: (boolean) => void;
  productCategories: string[];
  loginLoaded: boolean;
  setLoginLoaded: (boolean) => void;
  setProductCategories: (productCategories: string[]) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  users: User[] | null;
  usersLoaded: boolean;
  setUsers: (users: User[] | null) => void;
  orders: Order[];
  setOrders: (orders: Order[] | null) => void;
  settings: Setting[];
  setSettings: (settings: Setting[] | null) => void;
  settingsLoaded: boolean;
  setSettingsLoaded: (boolean) => void;
  setUsersLoaded: (boolean) => void;
};

export const useStore = create<State>((set) => ({
  articlesById: {},
  usersById: {},
  articles: [],
  setArticles: (articles) =>
    set({
      articles,
      articlesById: Object.fromEntries(articles.map(a => [a._id, a])),
      articlesLoaded: true, // mark loaded
    }),
  categories: [],
  setCategories: (categories: string[]) => set({ categories: categories }),
  articlesLoaded: false,
  loginLoaded: false,
  products: [],
  productsLoaded: false,
  setProducts: (products: Product[]) => set({ products: products }),
  productCategories: [],
  setProductCategories: (productCategories: string[]) => set({ productCategories: productCategories }),
  setProductsLoaded: (loaded: boolean) => set({ productsLoaded: loaded }),
  setArticlesLoaded: (loaded: boolean) => set({ articlesLoaded: loaded }),
  setSettingsLoaded: (loaded: boolean) => set({ settingsLoaded: loaded }),
  setLoginLoaded: (loaded: boolean) => set({ loginLoaded: loaded }),
  user: null,
  setUser: (u: User | null) => { set({ user: u }) },
  users: [],
  setUsers: (users) =>
    set({
      users,
      usersById: Object.fromEntries(users.map(u => [u._id, u])),
      usersLoaded: true, // mark loaded
    }),
  orders: [],
  setOrders: (orders: Order[] | null) => set({ orders: orders }),
  settings: [],
  settingsLoaded: false,
  setSettings: (settings: Setting[] | null) => set({ settings: settings }),
  usersLoaded: false,
  setUsersLoaded: (loaded: boolean) => set({ usersLoaded: loaded })
}));
