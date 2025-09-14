import React, { useEffect, useState, useCallback } from "react";
import { useStore } from "./state/useStore";
import { useData } from "./data/useData";
import { DownloadJsonButton } from "./Download";
import { Articles } from "./pages/Articles";
import { AdminPanel } from "./admin/AdminPanel";
import { useNavigate } from "react-router-dom";

export function Home() {
  const { user, articles, loading, users, setUser } = useStore((s) => s);
  const { refresh } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

  console.log('user: ', user);

  // useEffect(() => {
  //   if (!user) {
  //     navigate(`/login`);
  //   } else {
  //     console.log('BD: user on homepage: ', user);
  //   }
  // })
  const logout = useCallback(() => {
    setUser(null);
  }, []);
  const login = useCallback(() => {
    navigate('/login');
  }, []);



  if (loading) return <div>Loading…</div>;
  return (<>
    <div className='navBannter'>
      <div className='left borgLogo'>b0rgBlog</div>
      <div className='middle'>
        {user && (`Logged in as: ${user.user_name}`)}
        </div>
      <div onClick={(e) => { e.stopPropagation(); user ? logout() : login(); }} className="right logout">{user && (`Logout`)}{!user &&(`Login`)}</div>
    </div>



    <div className="home">
      <div className="mainMenu">
        <div className="title">b0rgBlog</div>
        <div className="welcome">Welcome, {user?.user_name}</div>
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


