import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./Home";
import { ArticlePage } from "./pages/ArticlePage";
import { User, useStore } from "./state/useStore";
import { NewArticlePage } from "./pages/NewArticlePage";
import { EditArticlePage } from "./pages/EditArticlePage";
import { Login } from "./pages/Login";
import { CreateAccount } from "./pages/CreateAccount";
import { AdminPage } from "./pages/AdminPage";
import { NewProductPage } from "./pages/NewProductPage";
import { EditUserPage } from "./pages/EditUserPage";
import { EditProductPage } from "./pages/EditProductPage";

export default function App() {

  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    setUser(null);
  }, [])


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/newUser' element={<CreateAccount />} />
        <Route path='/article/new' element={<NewArticlePage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/article/edit/:_id" element={<EditArticlePage />} />
        <Route path='/product/new' element={<NewProductPage />} />
        <Route path="/product/edit/:_id" element={<EditProductPage />} />
        <Route path="/user" element={<EditUserPage />} />
      </Routes>
    </Router>
  );
}