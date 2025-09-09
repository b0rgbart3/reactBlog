// UseData.ts
import { useEffect, useCallback, useState} from "react";
import { useStore } from "../state/useStore";
import axios from "axios";
  

export function useData() {
  const articles = useStore((s) => s.articles);
  const setArticles = useStore((s) => s.setArticles);
  const setCategories = useStore((s) => s.setCategories);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/articles");
      const data = res.data.data;
      const cats: string[] = data.map((article) => article.category);
      const uniqueCategories: string[] = [...new Set(cats)];
      setArticles(data);
      setCategories(uniqueCategories);
      setArticles(data);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const kill = useCallback(async (killID: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/articles/${killID}`);
    } catch(err) {
      console.error("Failed to kill article: ", killID);
    } finally {
      setLoading(false);
    }
  }, [])


  useEffect(() => {

      if (!articles.length) {
        fetchArticles();
        // axios.get("/api/articles") 
        // .then((res) => {
        //   console.log('BD: res: ', res.data.data);
        //   const data = res.data.data;

        //     const cats: string[] = data.map((article) => article.category);
        //     const uniqueCategories: string[] = [...new Set(cats)];
        //     setArticles(data);
        //     setCategories(uniqueCategories);
        //   })
        //   .catch((err) => {
        //     console.error("API error:", err);
        //   });
       
      }

  }, [setArticles, setCategories]);

  return { articles, loading, refresh: fetchArticles, kill};
}


