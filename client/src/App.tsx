import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./Home";
import { ArticlePage } from "./pages/Articles/ArticlePage";
import { User, useStore } from "./state/useStore";
import { NewArticlePage } from "./pages/Articles/NewArticlePage";
import { EditArticlePage } from "./pages/Articles/EditArticlePage";
import { Login } from "./pages/Login";
import { CreateAccount } from "./pages/CreateAccount";
import { AdminPage } from "./pages/AdminPage";
import { NewProductPage } from "./pages/Products/NewProductPage";
import { EditUserPage } from "./pages/EditUserPage";
import { ProductPage } from "./pages/Products/ProductPage";
import { EditProductPage } from "./pages/Products/EditProductPage";
import { About } from "./pages/About";
import { Resources } from "./pages/Resources";


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
        <Route path='/about' element={<About />} />
        <Route path='/resources' element={<Resources />} />
        <Route path='/article/new' element={<NewArticlePage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/article/edit/:_id" element={<EditArticlePage />} />
        <Route path='/product/new' element={<NewProductPage />} />
        <Route path='/product/:id' element={<ProductPage />} />
        <Route path="/product/edit/:_id" element={<EditProductPage />} />
        <Route path="/user" element={<EditUserPage />} />
      </Routes>
    </Router>
  );
}