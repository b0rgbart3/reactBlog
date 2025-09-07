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

        axios.get("/api/articles") 
        .then((res) => {
          console.log('BD: res: ', res.data.data);
          const data = res.data.data;

            const cats: string[] = data.map((article) => article.category);
            const uniqueCategories: string[] = [...new Set(cats)];
            setArticles(data);
            setCategories(uniqueCategories);
          })
          .catch((err) => {
            console.error("API error:", err);
          });
       
      }

  }, [setArticles, setCategories]);
}


