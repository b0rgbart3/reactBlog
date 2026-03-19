// src/state/useStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Article = {
  body: string;
  category: string;
  headlineImage?: string;
  originDate: string;
  lastModifiedDate: string;
  randomColor?: string;
  readyToPublish: boolean;
  summary?: string;
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
  phash: string;
  status: string,
  userName: string;
  userEmail: string
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
  price: number;
}
export type Order = {
  _id: number;
  productID: string;
  quantity: number;
  chosenSize: string;
}

export type PlacedOrderItem = {
  productID: string;
  productName: string;
  quantity: number;
  chosenSize: string;
  unitAmount: number;
}

export type ShippingAddress = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PlacedOrder = {
  _id: string;
  stripeSessionId: string;
  status: 'pending' | 'paid';
  customerEmail: string;
  customerName: string;
  amountTotal: number;
  items: PlacedOrderItem[];
  shippingAddress?: ShippingAddress;
  createdAt: string;
  sentToPrinter: boolean;
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
  cartFlashCount: number;
  setCartFlashCount: (n: number) => void;
  settings: Setting[];
  setSettings: (settings: Setting[] | null) => void;
  settingsLoaded: boolean;
  setSettingsLoaded: (boolean) => void;
  setUsersLoaded: (boolean) => void;
  placedOrders: PlacedOrder[];
  setPlacedOrders: (orders: PlacedOrder[]) => void;
  placedOrdersLoaded: boolean;
  setPlacedOrdersLoaded: (boolean) => void;
};

export const useStore = create<State>()(persist((set) => ({
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
  cartFlashCount: 0,
  setCartFlashCount: (n: number) => set({ cartFlashCount: n }),
  settings: [],
  settingsLoaded: false,
  setSettings: (settings: Setting[] | null) => set({ settings: settings }),
  usersLoaded: false,
  setUsersLoaded: (loaded: boolean) => set({ usersLoaded: loaded }),
  placedOrders: [],
  setPlacedOrders: (placedOrders: PlacedOrder[]) => set({ placedOrders }),
  placedOrdersLoaded: false,
  setPlacedOrdersLoaded: (loaded: boolean) => set({ placedOrdersLoaded: loaded }),
}), {
  name: 'cart-storage',
  partialize: (state) => ({ orders: state.orders }),
}));
