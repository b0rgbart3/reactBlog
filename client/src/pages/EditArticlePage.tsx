import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../state/useStore";
import "./articleStyle.css";
import "./newArticleStyle.css";
import { useData } from "../data/useData";
import axios from "axios";


export function EditArticlePage() {
        useData();
    const navigate = useNavigate();



    const { _id } = useParams<{ _id: string }>();
    console.log('_ID: ', _id);

    const articles = useStore((s) => s.articles);
    console.log('articles: ', articles);
    const categories = useStore((s) => s.categories);
    const article = articles.find((article) => article._id === _id);

    

    const [category, setCategory] = useState(article.category);
    const [newCategory, setNewCategory] = useState('');
    const [title, setTitle] = useState(article.title);
    const [body, setBody] = useState(article.body);
    const { refresh } = useData();
    const routeHome = useCallback(() => {
        refresh();
        navigate(`/`);
    }, []);




    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    //     console.log('Category: ', category);
    //     console.log('New Category: ', newCategory);
    //     console.log('Title: ', title);
    //     console.log('Body: ', body);


    //     e.preventDefault(); // prevent page reload
    //     if (!title || !body) return; // simple validation
    //     // onSubmit(title, body);
    //     // setTitle("");
    //     // setBody("");
    // };
    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {

    let postedCategory = category;
    if (newCategory.length) {
        postedCategory = newCategory;
    }


  const response = await axios.patch(`/api/articles/${article._id}`, {
  title: title,
  body: body,
  category: postedCategory
});


    // Optionally reset form
    // setTitle("");
    // setBody("");
    // setCategory("New");

    // Optionally update local state/store
    // addArticle(response.data);
        navigate(`/`);

  } catch (err) {
    console.error("Failed to submit article:", err);
  }
};


    const changeCategory = useCallback((e) => {
        setCategory(e.target.value);
    }, []);

        const changeNewCategory = useCallback((e) => {
        setNewCategory(e.target.value);
    }, []);

    return (

        <div className={'article'}>
            <div className="articlePageCategory" onClick={routeHome}>{`<- `}b0rgBlog ::</div>
            <div className='articlePageTitle'>{`Edit Article:`}</div>


            <form onSubmit={handleSubmit} className="new-article-form">
                <div>
                    <label htmlFor="category">Category:</label>

                    {category !== "New" && (
                        <div className="row">
                            <select
                                id="category"
                                value={category}
                                onChange={changeCategory}
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}

                            </select>
                            <div>
                                <input
                                    id="newCategory"
                                    type="text"
                                    value={newCategory}
                                    placeholder="Choose-- or enter a new category here"
                                       onChange={changeNewCategory}
                                   
                                />
                            </div></div>

                    )}

                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="body">Body:</label>
                    <textarea
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        rows={6}
                    />
                </div>

                <button type="submit">Update Article</button>
            </form>

            <div>
            </div>
        </div>

    )
}