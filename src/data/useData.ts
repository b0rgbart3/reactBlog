'use client';
// UseData.ts
import { useCallback } from "react";
import { User, useStore } from "../state/useStore";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export type AuthObject = {
  id: string;
  key: string;
}

export function useData() {
  const { categories, articles, articlesLoaded, usersLoaded,
    productsLoaded, settingsLoaded, setSettingsLoaded, products,
    setArticlesLoaded, setArticles, setProducts, setProductCategories, setCategories,
    setLoginLoaded, loginLoaded, users, setUsers, setProductsLoaded,
    setUser, setSettings, settings } = useStore((s) => s);

  const fetchSettings = useCallback(async () => {
    if (settingsLoaded) return;

    try {
      const res = await axios.get("/api/settings");
      const data = res.data.data;
      setSettings(data);
      setSettingsLoaded(true);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  const fetchArticles = useCallback(async () => {
    if (articlesLoaded) return;

    try {
      const res = await axios.get("/api/articles");
      setArticles(res.data.data);
      const cats: string[] = res.data.data.map((article) => article.category);
      const uniqueCategories: string[] = [...new Set(cats)];
      if (uniqueCategories && uniqueCategories[0] !== '') {
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    }
  }, [articlesLoaded, articles.length]);

  const fetchProducts = useCallback(async () => {
    if (productsLoaded) return;
    setProductsLoaded(true);
    try {
      const res = await axios.get("/api/products");
      const data = res.data.data;
      const cats: string[] = data.map((product) => product.category).filter(category => category && category.trim() !== "");
      const uniqueProductCategories: string[] = [...new Set(cats)];
      setProducts(data);
      setProductCategories(uniqueProductCategories);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  }, [productsLoaded, setProductsLoaded]);

  const fetchUsers = useCallback(async () => {
    if (usersLoaded) return;
    if (users.length > 0) return;

    try {
      const res = await axios.get("/api/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, [users.length]);

  const createUser = useCallback(async () => {
    try {
      await axios.post("/api/users");
    } finally {
      fetchUsers();
    }
  }, [fetchUsers])

  const killProduct = useCallback(async (killID: string) => {
    try {
      await axios.delete(`/api/products/${killID}`);
    } catch (err) {
      console.error("Failed to kill product: ", killID);
    }
  }, [])

  const kill = useCallback(async (killID: string) => {
    try {
      await axios.delete(`/api/articles/${killID}`);
    } catch (err) {
      console.error("Failed to kill article: ", killID);
    }
  }, [])

  const login = useCallback(async (newUser: Partial<User>) => {
    let loginResponse;
    if (loginLoaded) return;

    setLoginLoaded(true);
    try {
      loginResponse = await axios.post('/api/login/', newUser);
    } catch (err) {
      console.log('Failed to login.');
    } finally {
      setLoginLoaded(false);
      if (loginResponse) {
        const decoded = jwtDecode<User>(loginResponse.data.token);
        setUser(decoded);
        localStorage.setItem("jwt", loginResponse.data.token);
        return decoded;
      } else {
        return undefined;
      }
    }
  }, [loginLoaded])

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("jwt");
  }, [setUser])

  const displayMerch = useCallback(async (auth: AuthObject) => {
    try {
      await axios.post('/api/toggleMerch/', auth);
      const res = await axios.get("/api/settings");
      setSettings(res.data.data);
    }
    catch (err) {
      console.log('Failed to toggle merch.');
    }
  }, [setSettings]);

  const wipeAndSeed = useCallback(async (auth: AuthObject) => {
    let wiped;
    try {
      wiped = await axios.post('/api/wipe/', auth);
    }
    catch (err) {
      console.log('Failed to wipe database.');
    }
    finally {
      return wiped;
    }
  }, []);

  const backUpDB = useCallback(async (auth: AuthObject) => {
    let backedUp;
    try {
      backedUp = await axios.post('/api/backup/', auth);
    }
    catch (err) {
      console.log('Failed to back up database.');
    }
    finally {
      return backedUp;
    }
  }, [])

  const refresh = useCallback(async () => {
    await fetchSettings();
    await fetchArticles();
    await fetchProducts();
    await fetchUsers();
  }, [fetchSettings, fetchArticles, fetchProducts, fetchUsers]);

  return {
    fetchArticles,
    fetchUsers,
    fetchProducts,
    fetchSettings,
    refresh,
    login,
    logout,
    createUser,
    kill,
    killProduct,
    wipeAndSeed,
    backUpDB,
    displayMerch,
    settings,
  };
}
