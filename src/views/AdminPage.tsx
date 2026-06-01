'use client';
import { useStore } from "../state/useStore";
import { AdminPanel } from "../admin/AdminPanel";
import { useData } from "../data/useData";
import { useEffect } from "react";
import { BannerNav } from "../components/banner-nav";

export function AdminPage() {
  const { user, articlesLoaded, usersLoaded, settingsLoaded, productsLoaded } = useStore((s) => s);
  const { fetchArticles, fetchUsers, fetchSettings, fetchProducts } = useData();

  useEffect(() => {
    fetchArticles();
    fetchUsers();
    fetchSettings();
    fetchProducts();
  }, []);

  if (!user?.author) return <div>Access denied.</div>;

  return (
    <>
      <div className="siteWrapper">
        <BannerNav page="login" />
        <AdminPanel />
      </div>
    </>
  );
}
