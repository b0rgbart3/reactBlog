import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Article, useStore } from "./state/useStore";
import { useData } from "./data/useData";


export function AdminPanel() {
    const user = useStore((s) => s.user);
    const categories = useStore((s) => s.categories);
    const navigate = useNavigate();
    const [data, setData] = useState([])

    const { articles, loading, refresh, kill } = useData();

    const editArticle = useCallback((article: Article) => {
        navigate(`/article/edit/${article._id}`);
    }, []);

    const killArticle = useCallback((article: Article) => {
        const confirmDelete =
            window.confirm(`Are you sure you want to delete this article, 
            titled: ${article.title} ?
            \nIt will be complete deleted from the database, and cannot be restored.`);
        if (!confirmDelete) return; // cancel if user clicks "Cancel"
        kill(article._id);
        refresh();
    }, []);

    return (
        <>

            {categories?.map((category, categoryIndex) => (
                <div key={`category-${category}-${categoryIndex}`}>
                    <div className="killCategory">{category}</div>
                    <div>
                        {articles
                            ?.filter((a) => a.category === category)
                            .map((a) => (
                                <React.Fragment key={a._id} >
                                    <div className="killItem">
                                        <div className="killTitle" onClick={() => editArticle(a)}>{a.title} </div>

                                        <div className="killButton" onClick={() => killArticle(a)}>X</div>

                                    </div>

                                </React.Fragment>
                            ))}
                    </div>
                </div>
            ))}

        </>


    )
}