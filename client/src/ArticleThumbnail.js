import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Article } from "./state/useStore";
export function ArticleThumbnail({ article }) {
    const navigate = useNavigate();
    const readArticle = useCallback(() => {
        navigate(`/article/${article.id}`);
    }, [navigate, article.id]);
    return (_jsx("div", { className: "articleThumb", onClick: readArticle, children: article.title }));
}
//# sourceMappingURL=ArticleThumbnail.js.map