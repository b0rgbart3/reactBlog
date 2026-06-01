'use client';
import React, { useCallback, useState } from "react";
import { Meme } from "../state/useStore";

type MemeFormProps = {
  meme: Partial<Meme>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  editing: boolean;
};

export function MemeForm({ meme, handleChange, handleFileChange, handleSubmit, editing }: MemeFormProps) {
  const [isReady, setIsReady] = useState(meme.readyToPublish ?? false);

  const toggleReadyStatus = useCallback(() => {
    setIsReady((prev) => !prev);
  }, []);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    meme.readyToPublish = isReady;
    handleSubmit(e);
  }, [isReady, handleSubmit, meme]);

  return (
    <form onSubmit={handleFormSubmit} className="new-article-form">
      <div>
        <label htmlFor="readyToPublish">Ready to Publish</label>
        <br />
        {isReady ? (
          <div className="lineContainer">
            <div className="bButton checkBoxSelected" onClick={toggleReadyStatus}></div>
            Ready to publish
          </div>
        ) : (
          <div className="lineContainer">
            <div className="bButton checkBox" onClick={toggleReadyStatus}></div>
            Ready to publish
          </div>
        )}

        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          name="title"
          value={meme.title ?? ""}
          onChange={handleChange}
          placeholder="Meme title"
        />

        <label htmlFor="description">Description (optional):</label>
        <textarea
          id="description"
          name="description"
          value={meme.description ?? ""}
          onChange={handleChange}
          placeholder="Optional description"
          rows={3}
        />

        <label htmlFor="category">Category (optional):</label>
        <input
          id="category"
          type="text"
          name="category"
          value={meme.category ?? ""}
          onChange={handleChange}
          placeholder="e.g. Bitcoin, Crypto"
        />

        <label htmlFor="image">Image:</label>
        {editing && meme.image && (
          <img
            src={meme.image}
            alt="current meme"
            style={{ maxWidth: 200, display: 'block', marginBottom: 8 }}
          />
        )}
        <input id="image" type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button type="submit">{editing ? "Save Changes" : "Create Meme"}</button>
    </form>
  );
}
