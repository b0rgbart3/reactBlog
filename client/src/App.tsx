import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./Home";
import { ArticlePage } from "./ArticlePage";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/t" element={<Home />} />
        <Route path="/article/:id" element={<ArticlePage />} />
      </Routes>
    </Router>
  );
}