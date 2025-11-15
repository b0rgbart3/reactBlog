import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Article, useStore } from "../state/useStore";
import "./articleStyle.css";
import "./newArticleStyle.css";
import { useData } from "../data/useData";
import axios from "axios";
import { ArticleForm } from "./ArticleForm";


export function EditArticlePage() {
    useData();
    const navigate = useNavigate();
    const { _id } = useParams<{ _id: string }>();
    const articles = useStore((s) => s.articles);
    const categories = useStore((s) => s.categories);
    const [article, setArticle]  = useState<Article>(articles.find((article) => article._id === _id));
    const [category, setCategory] = useState(article.category);
    const [selectedFile, setSelectedFile] = useState<File | null>(article?.headlineImage);
    const [newCategory, setNewCategory] = useState('');
    const [title, setTitle] = useState(article.title);
    const [body, setBody] = useState(article.body);
    const { refresh } = useData();
    const routeHome = useCallback(() => {
        refresh();
        navigate(`/`);
    }, []);



    // Runs when user picks a file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

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

            console.log('BD: selected file: ', selectedFile);
            console.log('BD: about to save article: ', article);
            
            const response = await axios.patch(`/api/articles/${article._id}`, article, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            // const response = await axios.patch(`/api/articles/${article._id}`, {
            //     title: article?.title,
            //     body: article?.body,
            //     category: article?.category
            // });

            navigate(`/`);

        } catch (err) {
            console.error("Failed to submit edited article:", err);
        }
    };


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
            <div className='articlePageTitle'>{`Edit Article:`}</div>


            <ArticleForm
                article={article}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                editing
                changeCategory={handleChange}
                changeNewCategory={changeNewCategory}
                newCategory={newCategory}
            />

            <div>
            </div>
        </div>

    )
}