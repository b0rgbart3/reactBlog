
import React, { useCallback, useState } from "react";
import { useData } from "../data/useData";
import { useNavigate } from "react-router-dom";
import { Article, useStore } from "../state/useStore";

export type ArticleFormProps = {
    article: Article;
    changeCategory: () => void;
    changeNewCategory: (e: React.FormEvent) => void;
    handleChange: (e: React.FormEvent) => void;
    handleFileChange: (e: React.FormEvent) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    newCategory: string;
}

export function ArticleForm(props: ArticleFormProps) {
    const { article, changeCategory, changeNewCategory, handleSubmit, newCategory, handleChange, handleFileChange } = props;

    const navigate = useNavigate();
    const { user, categories, articles, loading, users, setUser } = useStore((s) => s);
    const { refresh } = useData();


    return (
        <form onSubmit={handleSubmit} className="new-article-form">
            <div>
                <label htmlFor="category">Category:</label>

                {article?.category !== "New" && (
                    <div className="row">
                        <select
                            id="category"
                            name='category'
                            value={article?.category}
                            onChange={handleChange}
                            required
                        >
                            {categories?.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}

                        </select>
                        <div>
                            <input
                                id="newCategory"
                                name="category"
                                type="text"
                                value={newCategory}
                                placeholder="Choose-- or enter a new category here"
                                onChange={changeNewCategory}

                            />
                        </div>
                    </div>

                )}

                <label htmlFor="title">Title:</label>
                <input
                    id="title"
                    type="text"
                    name='title'
                    value={article?.title ?? ''}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor='headlineImage'>Headline Image:</label>
                <input id="headlineImage" type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div>
                <label htmlFor="body">Body:</label>
                <textarea
                    id="body"
                    name='body'
                    value={article?.body ?? ''}
                    onChange={handleChange}
                    required
                    rows={6}
                />
            </div>

            <button type="submit">Add Article</button>
        </form>
    )

}