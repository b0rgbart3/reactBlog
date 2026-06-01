'use client';
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Meme, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import axios from "axios";
import { MemeForm } from "./MemeForm";

export function EditMemePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { memes, setMemesLoaded } = useStore((s) => s);
  const [meme, setMeme] = useState<Meme | undefined>(() => memes.find((m) => m._id === id));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { fetchMemes, refresh } = useData();

  useEffect(() => {
    fetchMemes();
  }, []);

  useEffect(() => {
    if (!meme) {
      const found = memes.find((m) => m._id === id);
      if (found) setMeme(found);
    }
  }, [memes, id]);

  const routeBack = useCallback(() => {
    router.push("/admin");
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'readyToPublish') {
      setMeme((prev) => ({ ...prev, readyToPublish: value === 'true' }));
    } else {
      setMeme((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meme) {
      setSubmitError("Meme data not loaded — please wait and try again.");
      return;
    }
    setSubmitError(null);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append('image', selectedFile);
      const skipKeys = new Set(['_id', 'image', '__v']);
      Object.entries(meme as Record<string, any>).forEach(([key, value]) => {
        if (skipKeys.has(key) || value === null || value === undefined) return;
        formData.append(key, String(value));
      });
      await axios.patch(`/api/memes/${meme._id}`, formData);
      setMemesLoaded(false);
      refresh();
      router.push("/admin");
    } catch (err: any) {
      const message = err?.response?.data?.error ?? err?.message ?? "Unknown error";
      setSubmitError(`Failed to save: ${message}`);
      console.error("Failed to update meme:", err);
    }
  };

  if (!meme) {
    return (
      <div className="adminPanel">
        <div className="titleBar">
          <span className="adminBack" onClick={routeBack}>← b0rgBlog</span>
          {" :: Edit Meme"}
        </div>
        <div className="adminContent">Loading meme...</div>
      </div>
    );
  }

  return (
    <div className="adminPanel">
      <div className="titleBar">
        <span className="adminBack" onClick={routeBack}>← b0rgBlog</span>
        {" :: Edit Meme"}
      </div>
      <div className="adminContent">
        {submitError && <div style={{ color: 'red', marginBottom: '1rem' }}>{submitError}</div>}
        <MemeForm
          meme={meme}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          editing
        />
      </div>
    </div>
  );
}
