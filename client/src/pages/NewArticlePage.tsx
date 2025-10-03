import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Article, useStore } from "../state/useStore";
import "./articleStyle.css";
import "./newArticleStyle.css";
import { useData } from "../data/useData";
import axios from "axios";


export function NewArticlePage() {
    const navigate = useNavigate();
    const { user, categories, articles, loading, users, setUser } = useStore((s) => s);
    const [category, setCategory] = useState(categories[0] || "");
    const [newCategory, setNewCategory] = useState('');
    const [title, setTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [body, setBody] = useState("");
    const { refresh } = useData();
    const routeHome = useCallback(() => {
        refresh();
        navigate(`/`);
    }, []);
    console.log('Current User: ', user);

      // Runs when user picks a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

    useData();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            let postedCategory = category;
            if (newCategory.length) {
                postedCategory = newCategory;
            }
            const newArticle : Partial<Article> = {
                title,
                body,
                category: postedCategory,
                user_id: user._id,
                headlineImage: "",
            };
            if(selectedFile) {
                newArticle.headlineImage = selectedFile
            }

            const response = await axios.post("/api/articles", newArticle, {headers: {
                "Content-Type":"multipart/form-data"}});
            console.log('Saved article: ', response.data);

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
            <div className='articlePageTitle'>{`New Article:`}</div>


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
                     <input id="headlineImage" type="file" accept="image/*" onChange={handleFileChange} />
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

                <button type="submit">Add Article</button>
            </form>

            <div>
            </div>
        </div>

    )
}