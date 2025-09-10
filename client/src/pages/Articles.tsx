import React, { useEffect, useState, useCallback } from "react";
import { ArticleThumbnail } from "../ArticleThumbnail";
import { useData } from "../data/useData";
import { useStore } from "../state/useStore";


export function Articles() {

    const user = useStore((s) => s.user);
    const categories = useStore((s) => s.categories);
    const { articles, loading, refresh, kill } = useData();
    return (
        <>
            {categories?.map((category, categoryIndex) => (
                <div key={`category-${category}-${categoryIndex}`}>
                    <div>{category}</div>
                    <div>
                        {articles
                            ?.filter((a) => a.category === category)
                            .map((a) => (
                                <React.Fragment key={a._id} >
                                    <ArticleThumbnail article={a} />
                                </React.Fragment>
                            ))}
                    </div>
                </div>
            ))}
        </>
    )
}
