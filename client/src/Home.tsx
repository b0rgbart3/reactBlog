import React, { useEffect, useState, useCallback } from "react";
import { useStore } from "./state/useStore";
import { useData } from "./data/useData";
import { DownloadJsonButton } from "./Download";
import { Articles } from "./pages/Articles";
import { AdminPanel } from "./admin/AdminPanel";
import { useNavigate } from "react-router-dom";
import { BannerNav } from "./components/banner-nav";

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



  if (loading) return <div>Loading…</div>;
  return (<>
    <BannerNav />

    <div className="home">
      <div className="mainMenu">
        <div className="title">b0rgBlog</div>
        {user?.user_name && (
        <div className="welcome">Welcome, {user?.user_name}</div>)}
        <Articles />
      </div>

      {user?.sensi &&
        (<>
          <div className="userList">
            <div>Current User: {user?.user_name}</div>
            <div>Users:</div>
            {users.map((user) => (
              <>
                <div>
                  {user.user_name}
                </div>
              </>
            ))}
          </div>
          <div className="newArticleButtonContainer">
            <div>
              <AdminPanel />
            </div>

            <div className="JsonData">
              <DownloadJsonButton articles={articles} users={users} />
            </div>
          </div>
        </>)}


    </div>
  </>
  );

}


