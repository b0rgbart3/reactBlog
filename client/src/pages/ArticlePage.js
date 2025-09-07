import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../state/useStore";
import "./articleStyle.css";
import { useData } from "../data/useData";
export function ArticlePage() {
    useData();
    const { id } = useParams();
    const articles = useStore((s) => s.articles);
    const article = articles.find((article) => article.id === id);
    const navigate = useNavigate();
    const routeHome = useCallback(() => {
        navigate(`/t`);
    }, []);
    return (_jsxs("div", { className: 'article', children: [_jsxs("div", { className: "articlePageCategory", onClick: routeHome, children: [`<- `, "b0rgBlog :: ", article?.category] }), _jsx("div", { className: 'articlePageTitle', children: article?.title }), _jsx("p", { children: article?.body })] }));
}
//# sourceMappingURL=ArticlePage.js.map