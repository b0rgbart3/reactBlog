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
      console.log('BD: got articles: ', data);

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
      console.log('BD: fetched USERS: ', data.data);
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
    let loginResponse;
    let match: User;
    setLoading(true);
    try {
      loginResponse = await axios.post('/api/login/', newUser);
    } catch (err) {
      console.log('Failed to login.');
    } finally {
      setLoading(false);
      // const user = loginResponse.data;
      // setUser(user);

      // const { token } = await loginResponse.json();
      console.log('TOKEN: ', loginResponse.data.token);
      const decoded = jwtDecode<User>(loginResponse.data.token);
      console.log('decoded: ', decoded);
      setUser(decoded);


      // Save token to localStorage
      localStorage.setItem("jwt", loginResponse.data.token);

      console.log('Server found a match: ', decoded);

      // When login succeeds
      console.log('BD: setting local storage to: ', JSON.stringify({ user: decoded._id }));
      // localStorage.setItem("user", JSON.stringify({ user: decoded._id }));


      // setUser(user)

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
      console.log('local stored user: ', localStorageUserToken);

      if (localStorageUserToken && localStorageUserToken !== 'null') {
        const decoded: any = jwtDecode(localStorageUserToken);

        console.log('BD: decoded: ', decoded);
        const now = Date.now() / 1000; // in seconds

        console.log('decoded.exp: ', decoded.exp);
        console.log('now: ', now);

        if (decoded.exp && decoded.exp > now) {
          // token still valid
          console.log('Token still valid.');
          console.log('users: ', users);
          
          const match : User = users?.find((u) => u._id === decoded?._id);
          console.log('BD: MATCHED Jwt: ', match);
          if (match) {
                console.log('BD: matched user: ', match);
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


