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
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  articlesLoading: boolean;
  setArticlesLoading: (boolean) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  productsLoading: boolean;
  setProductsLoading: (boolean) => void;
  productCategories: string[];
  loginLoading: boolean;
  setLoginLoading: (boolean) => void;
  setProductCategories: ( productCategories: string[]) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  users: User[] | null;
  setUsers: (users: User[] | null) => void;
  orders: Order[];
  setOrders: (orders: Order[] | null) => void;
  settings: Setting[];
  setSettings: (settings: Setting[] | null) => void;
  settingsLoading: boolean;
  setSettingsLoading: (boolean) => void;
  usersLoading: boolean;
  setUsersLoading: (boolean) => void;
};

export const useStore = create<State>((set) => ({
  articles: [],
  setArticles: (articles: Article[]) => set({ articles: articles }),
  categories: [],
  setCategories: (categories: string[]) => set({ categories: categories }),
  articlesLoading: false,
  loginLoading: false,
  products: [],
  productsLoading: false,
  setProducts: (products: Product[]) => set({ products: products }),
  productCategories: [],
  setProductCategories: (productCategories: string[]) => set({ productCategories: productCategories}),
  setProductsLoading: (isLoading: boolean) => set({ productsLoading: isLoading }),
  setArticlesLoading: (isLoading: boolean) => set( { articlesLoading: isLoading}),
  setSettingsLoading: (isLoading: boolean) => set( { settingsLoading: isLoading}),
  setLoginLoading: (isLoading: boolean) => set({ loginLoading: isLoading}),
  user: null,
  setUser: (u: User | null) => { set({ user: u })},
  users: [],
  setUsers: (users: User[] | null) => set({ users: users }),
  orders: [],
  setOrders: (orders: Order[] | null) => set({ orders: orders }),
  settings: [],
  settingsLoading: false,
  setSettings: (settings: Setting[] | null) => set({ settings: settings}),
  usersLoading: false,
  setUsersLoading: (isLoading: boolean) => set({ usersLoading: isLoading})
}));
