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
  const {categories, articles, articlesLoading, usersLoading, setUsersLoading, 
    productsLoading, setProductsLoading, settingsLoading, setSettingsLoading, 
    setArticlesLoading, setArticles, setProducts, setProductCategories, setCategories, 
    setLoginLoading, loginLoading, 
    users, setUsers, setUser, setSettings, settings } = useStore((s) => s);

  const fetchSettings = useCallback(async () => {
    if (settingsLoading) return;
    setSettingsLoading(true);
    try {
      const res = await axios.get("/api/settings");
      const data = res.data.data;

      setSettings(data);

    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
       setSettingsLoading(false);
    }
  }, []);


  const fetchArticles = useCallback(async () => {
    console.log("FETCH ARTICLES");
    console.log('articles loading: ', articlesLoading);
    if (articlesLoading) return;
    setArticlesLoading(true);
    try {
      const res = await axios.get("/api/articles");
      const data = res.data.data;
      const cats: string[] = data.map((article) => article.category);


      const uniqueCategories: string[] = [...new Set(cats)];
      setArticles(data);
   
      if (uniqueCategories && uniqueCategories[0] !== '') {
        setCategories(uniqueCategories);
      }

    } catch (err) {
      console.error("Failed to fetch articles:", err);
          setArticlesLoading(false);
    } finally {
      setArticlesLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
     if (productsLoading) return;
    setProductsLoading(true);
    try {
      const res = await axios.get("/api/products");
      const data = res.data.data;
      const cats: string[] = data.map((product) => product.category).filter(category => category && category.trim() !== "");

    
      const uniqueProductCategories: string[] = [...new Set(cats)];
 

      setProducts(data);
      setProductCategories(uniqueProductCategories);

    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get("/api/users");
      const data = res.data;
      setUsers(data.data);
      // setUsersLoading(false);
    }
    catch (err) {
      console.error("Failed to fetch users:", err);
      setUsersLoading(false);
    } finally {
      setUsersLoading(false);
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

  const killProduct = useCallback(async (killID: string) => {
    setLoading(true);
    try {
      await axios.delete(`/api/products/${killID}`);
    } catch (err) {
      console.error("Failed to kill product: ", killID);
    } finally {
      setLoading(false);
    }
  }, [])

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
    setLoginLoading(true);
    try {
      loginResponse = await axios.post('/api/login/', newUser);
    } catch (err) {
      console.log('Failed to login.');
    } finally {
      if (loginResponse) {
        setLoginLoading(false);

        const decoded = jwtDecode<User>(loginResponse.data.token);
        setUser(decoded);

        // Save token to localStorage
        localStorage.setItem("jwt", loginResponse.data.token);

        return decoded;
      } else {
        return undefined;
      }
    }

  })

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("jwt");
  })

  const displayMerch = useCallback(async (auth: AuthObject) => {

    try {
      await axios.post('/api/toggleMerch/', auth);
    }
    catch(err) {
      console.log('Failed to toggle merch.');
    }
    
  });

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
  });

  const backUpDB = useCallback(async (auth: AuthObject) => {
    let backedUp;
    try {
      backedUp = await axios.post('/api/backup/', auth);
      console.log('BD backedUp: ', backedUp);
    }
    catch (err) {
      console.log('Failed to back up database.');
    }
    finally {
      console.log('Done backing up the database.');
      return backedUp;
    }

  })

const refresh = useCallback(async () => {
  console.log('BD: refreshing...');
  await fetchSettings();
  await fetchArticles();
  await fetchProducts();
  await fetchUsers();
}, [fetchSettings, fetchArticles, fetchProducts, fetchUsers]);


  return { articles, backUpDB, displayMerch, fetchArticles, fetchUsers, refresh, settings, logout, createUser, kill, killProduct, login, wipeAndSeed };
}


