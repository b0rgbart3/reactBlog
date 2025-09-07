// UseData.ts
import { useEffect } from "react";
import { useStore } from "../state/useStore";
import axios from "axios";
export function useData() {
    const articles = useStore((s) => s.articles);
    const setArticles = useStore((s) => s.setArticles);
    const setCategories = useStore((s) => s.setCategories);
    useEffect(() => {
        if (!articles.length) {
            axios.get("/api/myData")
                .then((res) => {
                const cats = res.data.articles.map((article) => article.category);
                const uniqueCategories = [...new Set(cats)];
                setArticles(res.data.articles);
                setCategories(uniqueCategories);
            })
                .catch((err) => {
                console.error("API error:", err);
            });
        }
    }, [setArticles, setCategories]);
}
//# sourceMappingURL=useData.js.map