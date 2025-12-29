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
  _id: string;
  productID: string;
  quantity: number;
  chosenSize: string;
}

type State = {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  loading: boolean;
  setLoading: (boolean) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  productCategories: string[];
  setProductCategories: ( productCategories: string[]) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  users: User[] | null;
  setUsers: (users: User[] | null) => void;
  orders: Order[];
  setOrders: (orders: Order[] | null) => void;
};

export const useStore = create<State>((set) => ({
  articles: [],
  setArticles: (articles: Article[]) => set({ articles: articles }),
  categories: [],
  setCategories: (categories: string[]) => set({ categories: categories }),
  loading: false,
  products: [],
  setProducts: (products: Product[]) => set({ products: products }),
  productCategories: [],
  setProductCategories: (productCategories: string[]) => set({ productCategories: productCategories}),
  setLoading: (isLoading: boolean) => set({ loading: isLoading }),
  user: null,
  setUser: (u: User | null) => { set({ user: u })},
  users: [],
  setUsers: (users: User[] | null) => set({ users: users }),
  orders: [],
  setOrders: (orders: Order[] | null) => set({ orders: orders }),
}));
