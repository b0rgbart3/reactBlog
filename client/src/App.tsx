import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./Home";
import { ArticlePage } from "./pages/ArticlePage";
import { useStore } from "./state/useStore";
import { NewArticlePage } from "./pages/NewArticlePage";



export default function App() {
  const defaultUser = { name: "Alice", id: "001" };

  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    setUser(defaultUser);
  }, [])


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/article/new' element={<NewArticlePage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
      </Routes>
    </Router>
  );
}