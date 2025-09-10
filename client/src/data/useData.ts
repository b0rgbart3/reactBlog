// UseData.ts
import { useEffect, useCallback, useState } from "react";
import { User, useStore } from "../state/useStore";
import axios from "axios";


export function useData() {
  const {articles, setArticles, setCategories, setLoading, users, setUsers } = useStore((s) => s);
    const defaultUser : User  = {
      user_name: "Alice", _id: "00001",
      status: "active",
      user_email: undefined
    };

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/articles");
      const data = res.data.data;
      const cats: string[] = data.map((article) => article.category);
      const uniqueCategories: string[] = [...new Set(cats)];
      setArticles(data);
      setCategories(uniqueCategories);
     
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
    const res = await axios.get("/api/users");
     const data = res.data;
      console.log('BD: USERS: ', data.data);
            setUsers(data.data);
      setLoading(false);
    }
    catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([defaultUser]);
          setLoading(false);
    } finally {
      setLoading(false);
    }
  })

  const kill = useCallback(async (killID: string) => {
    setLoading(true);
    try {
      await axios.delete(`/api/articles/${killID}`);
    } catch (err) {
      console.error("Failed to kill article: ", killID);
    } finally {
      setLoading(false);
    }
  }, [])


  useEffect(() => {
    if (!articles.length) {
      fetchArticles();
    }
    if (!users.length) {
      fetchUsers();
    }
  }, [setArticles, setCategories]);

  return { articles, refresh: fetchArticles, kill };
}


