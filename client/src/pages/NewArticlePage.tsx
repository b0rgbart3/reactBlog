import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Article, useStore } from "../state/useStore";
import "./articleStyle.css";
import "./newArticleStyle.css";
import { useData } from "../data/useData";
import axios from "axios";
import { ArticleForm } from "./ArticleForm";


export function NewArticlePage() {
    const navigate = useNavigate();

    const { user, categories, articles, loading, users, setUser } = useStore((s) => s);
    const [category, setCategory] = useState(categories[0] || "");
    const [newCategory, setNewCategory] = useState('');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { refresh } = useData();

    const routeHome = useCallback(() => {
        refresh();
        navigate(`/`);
    }, []);
    const [article, setArticle] = useState<Partial<Article> | null>(null);
    useEffect(() => {
        if (!article) {
            const freshArticle: Partial<Article> = {
                body: "",
                category: categories[0] || "",
                title: "",
                user_id: user._id
            };
            setArticle(freshArticle);
        }
    }, []);

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

            if (selectedFile) {
                article.headlineImage = selectedFile
            }

            const response = await axios.post("/api/articles", article, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log('Saved article: ', response.data);

            navigate(`/`);
        } catch (err) {
            console.error("Failed to submit article:", err);
        }
    };


    const changeCategory = useCallback((e) => {
        setCategory(e.target.value);
        article.category = e?.target?.value;
        setArticle((prev) => ({
            ...prev,
            category: e?.target?.value,
        }));
    }, []);

    const changeNewCategory = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        console.log(e?.target?.value);
        setNewCategory(e.target.value);
        // article.category = e?.target?.value;
        setArticle((prev) => ({
            ...prev,
            category: e?.target?.value,
        }));
    }, []);


    // Generic change handler
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setArticle((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        []
    );


    return (
        <div className={'article'}>
            <div className="articlePageCategory" onClick={routeHome}>{`<- `}b0rgBlog ::</div>
            <div className='articlePageTitle'>{`New Article:`}</div>
            <ArticleForm
                article={article}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                changeCategory={handleChange}
                changeNewCategory={changeNewCategory}
                newCategory={newCategory}
            />
            <div>
            </div>
        </div>
    )
}