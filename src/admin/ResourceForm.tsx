'use client';
import React, { useCallback, useState } from "react";
import { Resource, useStore } from "../state/useStore";

export type ResourceFormProps = {
  resource: Partial<Resource>;
  editing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  newType: string;
  changeNewType: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ResourceForm(props: ResourceFormProps) {
  const { resource, editing, handleChange, handleSubmit, newType, changeNewType } = props;
  const { resourceTypes } = useStore((s) => s);
  const [isReady, setIsReady] = useState(resource.readyToPublish ?? false);

  const toggleReadyStatus = useCallback(() => {
    setIsReady(!isReady);
  }, [isReady]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    resource.readyToPublish = isReady;
    handleSubmit(e);
  }, [isReady, handleSubmit, resource]);

  return (
    <form onSubmit={handleFormSubmit} className="new-article-form">
      <div>
        <label htmlFor="readyToPublish">Ready to Publish</label>
        <br />
        {isReady && (
          <div className="lineContainer">
            <div className="bButton checkBoxSelected" onClick={toggleReadyStatus}></div>
            Ready to publish
          </div>
        )}
        {!isReady && (
          <div className="lineContainer">
            <div className="bButton checkBox" onClick={toggleReadyStatus}></div>
            Ready to publish
          </div>
        )}

        <label htmlFor="type">Type:</label>
        <div className="row">
          {resourceTypes.length > 0 && (
            <select id="type" name="type" value={resource.type ?? ""} onChange={handleChange}>
              {resourceTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
          <div>
            <input
              id="newType"
              name="type"
              type="text"
              value={newType}
              placeholder={resourceTypes.length > 0 ? "Or enter a new type here" : "Enter type (e.g. Book, Podcast, Product, Business)"}
              onChange={changeNewType}
            />
          </div>
        </div>

        <label htmlFor="title">Title: *</label>
        <input id="title" type="text" name="title" value={resource.title ?? ""} onChange={handleChange} required />

        <label htmlFor="author">Author (optional):</label>
        <input id="author" type="text" name="author" value={resource.author ?? ""} onChange={handleChange} />

        <label htmlFor="description">Description (optional):</label>
        <textarea id="description" name="description" value={resource.description ?? ""} onChange={handleChange} rows={3} />

        <label htmlFor="imageURL">Image URL (optional):</label>
        <input id="imageURL" type="text" name="imageURL" value={resource.imageURL ?? ""} onChange={handleChange} placeholder="https://..." />

        <label htmlFor="linkURL">Link URL: *</label>
        <input id="linkURL" type="text" name="linkURL" value={resource.linkURL ?? ""} onChange={handleChange} required placeholder="https://..." />
      </div>

      <button type="submit">{editing ? "Save Changes" : "Create Resource"}</button>
    </form>
  );
}
