'use client';
import React, { useCallback, useState } from "react";
import { User, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { useRouter } from "next/navigation";
import { BannerNav } from "../components/banner-nav";

export function CreateAccount() {
  const { users, setUser } = useStore((s) => s);
  const { createUser } = useData();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [phash, setPHash] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      user_name: userName,
      user_email: userEmail,
      phash,
      _id: "",
      sensi: false,
      author: false,
      status: undefined,
    } as any;

    if (userName !== "") {
      const preExisting = users?.find((user) => user.userEmail === userEmail);
      if (!preExisting) {
        createUser();
        setUser(newUser);
        router.push(`/`);
      }
    }
  };

  const jumpToLogin = useCallback(() => { router.push(`/login`); }, [router]);

  return (
    <>
      <BannerNav page="create" />
      <div className="loginForm">
        <form onSubmit={handleSubmit}>
          <div>
            <h2>Welcome to MoonMath</h2>
            Choose a username and password, to create an account.
          </div>
          <br></br>
          <label>User Name: </label>
          <input type="text" id="user_name" size={50} value={userName} onChange={(e) => setUserName(e.target.value)} />
          <br></br>
          <label>Password: </label>
          <input type="password" id="phash" value={phash} onChange={(e) => setPHash(e.target.value)} size={50} />
          <br></br>
          <label>Email: </label>
          <input type="text" id="user_email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} size={50} />
          <br></br><br></br>
          <button type="submit">Create a new Account</button>
        </form>
      </div>
      <div className="newToBorg">
        <button onClick={jumpToLogin}>Already have an account? - then click here to Login.</button>
      </div>
    </>
  );
}
