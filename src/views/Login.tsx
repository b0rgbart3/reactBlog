"use client";
import React, { useCallback, useState } from "react";
import { User, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { useRouter } from "next/navigation";
import { BannerNav } from "../components/banner-nav";

export function Login() {
  const { user, setUser } = useStore((s) => s);
  const { login } = useData();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [loginWord, setLoginWord] = useState("");
  const [errorState, setErrorState] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName !== "") {
      const activeUser: Partial<User> = { userName, loginWord };
      const match = await login(activeUser);
      if (match) {
        router.push(`/`);
      } else {
        setErrorState(true);
      }
    }
  };

  const newUser = useCallback(() => {
    router.push(`/newUser`);
  }, [router]);

  return (
    <>
      <div className="siteWrapper">
        <BannerNav page="login" />
        <div className="loginForm">
          <h2>Please Log In:</h2>
          <form onSubmit={handleSubmit}>
            <label>User Name: </label>
            <input
              type="text"
              id="user_name"
              size={50}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <br></br>
            <label>Password: </label>
            <input
              type="password"
              id="phash"
              value={loginWord}
              onChange={(e) => setLoginWord(e.target.value)}
              size={50}
            />
            {errorState && (
              <div className="errorMessage">
                Not able to login, please try again.
              </div>
            )}
            <br></br>
            <br></br>
            <button type="submit">Login</button>
          </form>
        </div>
        {/* <div className="newToBorg">
          <button onClick={newUser}>New to MoonMath?</button>
        </div> */}
      </div>
    </>
  );
}
