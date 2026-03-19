'use client';
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Article, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import axios from "axios";
import { ArticleForm } from "./ArticleForm";

export function NewArticlePage() {
  const router = useRouter();
  const { user, categories } = useStore((s) => s);
  const [category, setCategory] = useState(categories[0] || "");
  const [newCategory, setNewCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { refresh } = useData();
  const [article, setArticle] = useState<Partial<Article> | null>(null);

  useEffect(() => {
    if (!article) {
      const freshArticle: Partial<Article> = {
        body: "",
        category: categories[0] || "",
        readyToPublish: false,
        summary: "",
        title: "",
        userID: user._id
      };
      setArticle(freshArticle);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const routeHome = useCallback(() => {
    refresh();
    router.push(`/`);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedFile) {
        article.headlineImage = selectedFile as any;
      }
      article.userID = user._id;
      await axios.post("/api/articles", article, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      router.push(`/`);
    } catch (err) {
      console.error("Failed to submit article:", err);
    }
  };

  const changeNewCategory = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewCategory(e.target.value);
    setArticle((prev) => ({ ...prev, category: e?.target?.value }));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className={'article'}>
      <div className="articlePageCategory" onClick={routeHome}>{`<- `}b0rgBlog ::</div>
      <div className='articlePageTitle'>{`New Article:`}</div>
      {article && (
        <ArticleForm
          article={article as Article}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          editing={false}
          changeCategory={handleChange}
          changeNewCategory={changeNewCategory}
          newCategory={newCategory}
        />
      )}
    </div>
  )
}
