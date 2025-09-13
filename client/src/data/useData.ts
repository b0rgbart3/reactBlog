// UseData.ts
import { useEffect, useCallback, useState } from "react";
import { User, useStore } from "../state/useStore";
import axios from "axios";

export type AuthObject = {
  id: string;
  key: string;
}

export function useData() {
  const {articles, setArticles, setCategories, setLoading, users, setUsers, setUser } = useStore((s) => s);

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
      setLoading(false);
    } finally {
      setLoading(false);
    }
  })

  const createUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/users");
      const data = res;
      console.log('RESPONSE: ', res);
    } finally {
      fetchUsers();
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

  const login = useCallback(async (newUser: Partial<User>) => {
    let match: User;
    setLoading(true);
    try {
      match = await axios.post('/api/login/', newUser);
    } catch (err) {
      console.log('Failed to login.');
    } finally {
      setLoading(false);
      setUser(match);
      return match;
    }

  })

  const wipeAndSeed = useCallback(async (auth: AuthObject ) => {
    let wiped;
    // setLoading(true);
    try {
      wiped = await axios.post('/api/wipe/', auth);
      console.log('BD wiped: ', wiped);
    }
    catch(err) {
      console.log('Failed to wipe database.');
    }
    finally {
      console.log('Done wiping the database.');
      return wiped;
    }
  })


  useEffect(() => {
    if (!articles.length) {
      fetchArticles();
    }
    if (!users.length) {
      fetchUsers();
    }
  }, [setArticles, setCategories]);

  return { articles, refresh: fetchArticles, createUser, kill, login, wipeAndSeed };
}


