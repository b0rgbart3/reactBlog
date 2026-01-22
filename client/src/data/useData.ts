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
      console.error("Failed to fetch articles:", err);
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  const fetchArticles = useCallback(async () => {
    console.log('BD: called fetchArticles.');
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
    // if (productsLoading || hasFetchedProducts) return;

    if (productsLoaded) return;
    // if (products.length > 0) return;
    setProductsLoaded(true);
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
      setProductsLoaded(false);
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
    } finally {
      //;
    }
  }, [users.length]);


  const createUser = useCallback(async () => {
    try {
      const res = await axios.post("/api/users");
      const data = res;

    } finally {
      fetchUsers();
    }
  })

  const killProduct = useCallback(async (killID: string) => {
    try {
      await axios.delete(`/api/products/${killID}`);
    } catch (err) {
      console.error("Failed to kill product: ", killID);
    } finally {
    }
  }, [])

  const kill = useCallback(async (killID: string) => {
    try {
      await axios.delete(`/api/articles/${killID}`);
    } catch (err) {
      console.error("Failed to kill article: ", killID);
    } finally {
    }
  }, [])

  const login = useCallback(async (newUser: Partial<User>) => {
    let loginResponse;
    let match: User;
    if (loginLoaded) return;

    setLoginLoaded(true);
    try {
      loginResponse = await axios.post('/api/login/', newUser);
    } catch (err) {
      console.log('Failed to login.');
    } finally {
      if (loginResponse) {


        const decoded = jwtDecode<User>(loginResponse.data.token);
        setUser(decoded);

        // Save token to localStorage
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
  })

  const displayMerch = useCallback(async (auth: AuthObject) => {

    try {
      await axios.post('/api/toggleMerch/', auth);
    }
    catch (err) {
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


  return {
    // fetchers
    fetchArticles,
    fetchUsers,
    fetchProducts,
    fetchSettings,

    // actions
    refresh,
    login,
    logout,
    createUser,
    kill,
    killProduct,
    wipeAndSeed,
    backUpDB,
    displayMerch,

    // optional data exposure (not required)
    settings,
  };
}


