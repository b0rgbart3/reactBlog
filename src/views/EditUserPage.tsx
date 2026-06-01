'use client';
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../state/useStore";
import { useData } from "../data/useData";
import axios from "axios";
import { BannerNav } from "../components/banner-nav";

export function EditUserPage() {
  useData();
  const router = useRouter();
  const { user, setUser } = useStore((s) => s);
  const { refresh } = useData();
  const [editUser, setEditUser] = useState(user);

  const routeHome = useCallback(() => {
    refresh();
    router.push(`/`);
  }, [router]);

  const toggleAuthorStatus = useCallback(() => {
    setEditUser((prev) => ({ ...prev, author: !prev.author }));
  }, []);

  useEffect(() => {
    if (!user) routeHome();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/user/${editUser._id}`, editUser, {
        headers: { "Content-Type": "application/json" }
      });
      router.push(`/`);
    } catch (err) {
      console.error("Failed to submit user changes:", err);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  }, []);

  if (!editUser) return null;

  return (
    <>
      <BannerNav page='editUser' />
      <div className='pageLayout'>
        <div className='titleText'>Your Account:</div>
        <div className="basicBox">
          <div className="editUserForm">
            <form onSubmit={handleSubmit}>
              <div>
                {editUser.author === true && (
                  <div className='lineContainer'>
                    <div className='bButton checkBoxSelected' onClick={toggleAuthorStatus}></div>
                    Author
                  </div>
                )}
                {editUser.author && (
                  <div className='lineContainer'>
                    <label id='authorName'>Author Name:</label>
                    <input type='text' value={editUser.authorName} size={24} id='authorName' name='authorName' onChange={handleChange} />
                  </div>
                )}
                {editUser.author === false && (
                  <div className='lineContainer'>
                    <div className='bButton checkBox' onClick={toggleAuthorStatus}></div>
                    Author
                  </div>
                )}
              </div>
              <br />
              <div className='lineContainer'>
                <label id='userName'>Your User Name</label>
                <input type='text' id='userName' value={editUser.userName} onChange={handleChange} name='userName' />
              </div>
              <br />
              <label id='userEmail'>Your email address</label>
              {editUser.userEmail}
              <br /><br />
              <button type="submit" onClick={handleSubmit}>Submit Changes</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
