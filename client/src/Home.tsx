import React, { useEffect, useState, useCallback } from "react";
import { useStore } from "./state/useStore";
import { useData } from "./data/useData";
import { DownloadJsonButton } from "./Download";
import { Articles } from "./pages/Articles";
import { AdminPanel } from "./admin/AdminPanel";
import { useNavigate } from "react-router-dom";
import { BannerNav } from "./components/banner-nav";
import "./homeStyle.css";

export function Home() {
  const { user, articles, loading, users, setUser } = useStore((s) => s);
  const { refresh } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);
  const login = useCallback(() => {
    navigate('/login');
  }, []);

  const [page, setPage] = useState('home');

 const adminCallback= useCallback(() => {
    navigate('/admin');
 })


  if (loading) return <div>Loading…</div>;
  return (<>
    <BannerNav 
    adminCallback={adminCallback} page='home'/>

    <div className="home">

        <div className="articleList">
        <Articles /></div>
      </div>

      {/* {user?.author &&
        (
          <AdminPanel />
        )} */}
 
  </>
  );

}


