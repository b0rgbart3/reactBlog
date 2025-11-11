// UseData.ts
import { useEffect, useCallback, useState } from "react";
import { User, useStore } from "../state/useStore";
import { jwtDecode } from "jwt-decode"; // or write a tiny decoder
import axios from "axios";

export type AuthObject = {
  id: string;
  key: string;
}

export function useData() {
  const { articles, setArticles, setCategories, setLoading, users, setUsers, setUser } = useStore((s) => s);

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
      setUsers(data.data);
      setLoading(false);
    }
    catch (err) {
      console.error("Failed to fetch users:", err);
      setLoading(false);
    } finally {
      setLoading(false);
      return;
    }
  })

  const createUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/users");
      const data = res;
  
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
    let loginResponse;
    let match: User;
    setLoading(true);
    try {
      loginResponse = await axios.post('/api/login/', newUser);
    } catch (err) {
      console.log('Failed to login.');
    } finally {
      setLoading(false);

      const decoded = jwtDecode<User>(loginResponse.data.token);
      setUser(decoded);

      // Save token to localStorage
      localStorage.setItem("jwt", loginResponse.data.token);

      return decoded;
    }

  })

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("jwt");
  })

  const wipeAndSeed = useCallback(async (auth: AuthObject) => {
    let wiped;
    // setLoading(true);
    try {
      wiped = await axios.post('/api/wipe/', auth);
      console.log('BD wiped: ', wiped);
    }
    catch (err) {
      console.log('Failed to wipe database.');
    }
    finally {
      console.log('Done wiping the database.');
      return wiped;
    }
  })

  const refresh = useCallback(async () => {

    await fetchArticles();
    await fetchUsers();
  })

  useEffect(() => {
    if (!articles.length) {
      fetchArticles();
    }
    if (!users.length) {
      fetchUsers();
    } 
      const localStorageUserToken = localStorage.getItem("jwt");


      if (localStorageUserToken && localStorageUserToken !== 'null') {
        const decoded: any = jwtDecode(localStorageUserToken);
        const now = Date.now() / 1000; // in seconds

        if (decoded.exp && decoded.exp > now) {
          // token still valid
 
          const match : User = users?.find((u) => u._id === decoded?._id);

          if (match) {
      
            setUser(match);
          }
        } else {
          // expired
          localStorage.removeItem("jwt");
          setUser(null);
        }


      
    }
  }, [setArticles, setCategories, users]);

  return { articles, refresh, logout, createUser, kill, login, wipeAndSeed };
}


