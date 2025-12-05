
import React, { useCallback, useState } from "react";
import { useData } from "../../data/useData";
import { useNavigate } from "react-router-dom";
import { Article, useStore } from "../../state/useStore";

export type ArticleFormProps = {
    article: Article;
    changeCategory: () => void;
    changeNewCategory: (e: React.FormEvent) => void;
    editing: boolean;
    handleChange: (e: React.FormEvent) => void;
    handleFileChange: (e: React.FormEvent) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    newCategory: string;
}

export function ArticleForm(props: ArticleFormProps) {
    const { article, changeCategory, editing, changeNewCategory, handleSubmit, newCategory, handleChange, handleFileChange } = props;

    const navigate = useNavigate();
    const { user, categories, articles, loading, users, setUser } = useStore((s) => s);
    const { refresh } = useData();
    const [isReady, setIsReady] = useState(article.readyToPublish ? article.readyToPublish  : false);

    const toggleReadyStatus = useCallback(() => {
       const newReadyStatus = isReady;
        setIsReady(!newReadyStatus);
    }, [isReady]);

    const handleFormSubmit = useCallback((e) => {
        article.readyToPublish = isReady;
        handleSubmit(e);
    })

    return (
        <form onSubmit={handleFormSubmit} className="new-article-form">
            <div>
                <label htmlFor="readyToPublish">Ready to Publish</label>
                <br></br>
                {isReady && (<div className='lineContainer'>
                    <div className='bButton checkBoxSelected' onClick={toggleReadyStatus}></div>
                    Ready to publish</div>
                )}
                {!isReady && (<div className='lineContainer'>
                    <div className='bButton checkBox' onClick={toggleReadyStatus}></div>
                    Ready to publish</div>
                )}

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

                {editing && article.headlineImage !== '' && (
                    <div className='headlineImagePreview'>

                        <img src={`${article?.headlineImage}`} />

                    </div>)}
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

            <button type="submit">{editing ? 'Submit Changes' : 'Post Article'}</button>
        </form>
    )

}