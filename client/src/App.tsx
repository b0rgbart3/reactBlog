import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./Home";
import { ArticlePage } from "./pages/ArticlePage";
import { User, useStore } from "./state/useStore";
import { NewArticlePage } from "./pages/NewArticlePage";
import { EditArticlePage } from "./pages/EditArticlePage";
import { Login } from "./pages/Login";




export default function App() {
  const defaultUser : User = {
    user_name: "Alice", _id: "001",
    status: undefined,
    user_email: undefined
  };

  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    setUser(null);
  }, [])


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/article/new' element={<NewArticlePage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/article/edit/:_id" element={<EditArticlePage />} />
      </Routes>
    </Router>
  );
}