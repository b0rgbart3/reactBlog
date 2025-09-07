export type Article = {
    id: string;
    body: string;
    category: string;
    title: string;
    user_id: string;
};
export type User = {
    id: string;
    name: string;
};
type State = {
    articles: Article[];
    setArticles: (articles: Article[]) => void;
    categories: string[];
    setCategories: (categories: string[]) => void;
    user: User | null;
    setUser: (u: User | null) => void;
};
export declare const useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<State>>;
export {};
//# sourceMappingURL=useStore.d.ts.map