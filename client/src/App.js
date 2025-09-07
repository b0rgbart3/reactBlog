import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import { ArticlePage } from "./pages/ArticlePage";
import { useStore } from "./state/useStore";
export default function App() {
    const defaultUser = { name: "Alice", id: "001" };
    const user = useStore((s) => s.user);
    const setUser = useStore((s) => s.setUser);
    useEffect(() => {
        setUser(defaultUser);
    }, []);
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/t", element: _jsx(Home, {}) }), _jsx(Route, { path: "/article/:id", element: _jsx(ArticlePage, {}) })] }) }));
}
//# sourceMappingURL=App.js.map