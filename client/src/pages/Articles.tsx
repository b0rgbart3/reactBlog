import React, { useEffect, useState, useCallback } from "react";
import { ArticleThumbnail } from "../ArticleThumbnail";
import { useData } from "../data/useData";
import { useStore } from "../state/useStore";
import "./articleStyle.css";
import { all } from "axios";


export function Articles() {

    const user = useStore((s) => s.user);
    const categories = useStore((s) => s.categories);
    const { articles, loading, refresh, kill } = useData();
    return (
        <>
            <div className='articleBlock'>
                {articles
                    .filter(a => a.readyToPublish)
                    .map(a => (
                        <React.Fragment key={a._id}>
                            <ArticleThumbnail article={a} />
                        </React.Fragment>
                    ))}
            </div>
        </>
    )
}
