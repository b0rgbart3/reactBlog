'use client';
import React, { useCallback, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Article, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import axios from "axios";
import { ArticleForm } from "./ArticleForm";

export function EditArticlePage() {
  useData();
  const router = useRouter();
  const params = useParams<{ _id: string }>();
  const _id = params._id;
  const { articles, setArticlesLoaded } = useStore((s) => s);
  const categories = useStore((s) => s.categories);
  const [article, setArticle] = useState<Article>(articles.find((a) => a._id === _id));
  const [newCategory, setNewCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { refresh } = useData();

  const routeHome = useCallback(() => {
    refresh();
    router.push(`/`);
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append('headlineImage', selectedFile);
      }

      const srcRegex = /<img[^>]+src="([^"]+)"/gi;
      let match: RegExpExecArray | null;
      while ((match = srcRegex.exec(article.body ?? '')) !== null) {
        formData.append('articleImages', match[1]);
      }

      const skipKeys = new Set(['_id', 'headlineImage', 'articleImages', '__v']);
      Object.entries(article as Record<string, any>).forEach(([key, value]) => {
        if (skipKeys.has(key) || value === null || value === undefined) return;
        formData.append(key, String(value));
      });

      await axios.patch(`/api/articles/${article._id}`, formData);
      setArticlesLoaded(false);
      router.push(`/`);
    } catch (err) {
      console.error("Failed to submit edited article:", err);
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
    <div className={'adminPanel'}>
      <div className="titleBar">
        <span className="adminBack" onClick={routeHome}>← b0rgBlog</span>
        {` :: Edit Article`}
      </div>
      <div className='adminContent'>
        <ArticleForm
          article={article}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          editing
          changeCategory={handleChange}
          changeNewCategory={changeNewCategory}
          newCategory={newCategory}
          onBodyChange={(html) => setArticle((prev) => ({ ...prev, body: html }))}
        />
      </div>
    </div>
  )
}
