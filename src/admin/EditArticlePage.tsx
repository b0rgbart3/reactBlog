'use client';
import React, { useCallback, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Article, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import axios from "axios";
import { ArticleForm } from "./ArticleForm";

export function EditArticlePage() {
  const router = useRouter();
  const params = useParams<{ _id: string }>();
  const _id = params._id;
  const { articles, setArticlesLoaded } = useStore((s) => s);
  const [article, setArticle] = useState<Article | undefined>(() => articles.find((a) => a._id === _id));
  const [newCategory, setNewCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { fetchArticles, refresh } = useData();

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (!article) {
      const found = articles.find((a) => a._id === _id);
      if (found) setArticle(found);
    }
  }, [articles, _id]);

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
    if (!article) {
      setSubmitError("Article data not loaded — please wait a moment and try again.");
      return;
    }
    setSubmitError(null);
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
    } catch (err: any) {
      const message = err?.response?.data?.error ?? err?.message ?? "Unknown error";
      setSubmitError(`Failed to save: ${message}`);
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

  if (!article) {
    return (
      <div className={'adminPanel'}>
        <div className="titleBar">
          <span className="adminBack" onClick={routeHome}>← b0rgBlog</span>
          {` :: Edit Article`}
        </div>
        <div className='adminContent'>Loading article...</div>
      </div>
    );
  }

  return (
    <div className={'adminPanel'}>
      <div className="titleBar">
        <span className="adminBack" onClick={routeHome}>← b0rgBlog</span>
        {` :: Edit Article`}
      </div>
      <div className='adminContent'>
        {submitError && <div style={{ color: 'red', marginBottom: '1rem' }}>{submitError}</div>}
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
