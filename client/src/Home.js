import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { ArticleThumbnail } from "./ArticleThumbnail";
import { useStore } from "./state/useStore";
import { useData } from "./data/useData";
import axios from "axios";
export function Home() {
    const user = useStore((s) => s.user);
    const categories = useStore((s) => s.categories);
    const articles = useStore((s) => s.articles);
    const [data, setData] = useState([]);
    useData();
    useEffect(() => {
    }, []);
    return (_jsx("div", { className: 'home', children: _jsxs("div", { className: 'mainMenu', children: [_jsx("div", { className: 'title', children: "b0rgBlog" }), _jsxs("div", { className: 'welcome', children: ["Welcome, ", user?.name, " "] }), categories?.map((c, i) => (_jsxs(_Fragment, { children: [_jsx("div", { children: c }), _jsx("div", { children: articles?.filter((a) => a.category === c).map((a, i) => (_jsx(ArticleThumbnail, { article: a }, i))) })] })))] }) }));
}
//# sourceMappingURL=Home.js.map