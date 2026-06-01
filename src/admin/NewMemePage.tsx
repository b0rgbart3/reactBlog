'use client';
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Meme, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import axios from "axios";
import { MemeForm } from "./MemeForm";

export function NewMemePage() {
  const router = useRouter();
  const { setMemesLoaded } = useStore((s) => s);
  const { refresh } = useData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [meme, setMeme] = useState<Partial<Meme>>({
    title: "",
    description: "",
    category: "",
    readyToPublish: false,
  });

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
    try {
      const formData = new FormData();
      if (selectedFile) formData.append('image', selectedFile);
      const skipKeys = new Set(['image', '__v']);
      Object.entries(meme as Record<string, any>).forEach(([key, value]) => {
        if (skipKeys.has(key) || value === null || value === undefined) return;
        formData.append(key, String(value));
      });
      await axios.post("/api/memes", formData);
      setMemesLoaded(false);
      refresh();
      router.push("/admin");
    } catch (err) {
      console.error("Failed to create meme:", err);
    }
  };

  return (
    <div className="adminPanel">
      <div className="titleBar">
        <span className="adminBack" onClick={routeBack}>← b0rgBlog</span>
        {" :: New Meme"}
      </div>
      <div className="adminContent">
        <MemeForm
          meme={meme}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          editing={false}
        />
      </div>
    </div>
  );
}
