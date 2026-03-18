'use client';
import React, { useCallback, useState } from "react";
import { Product, useStore } from "../../state/useStore";

export type ProductFormProps = {
  product: Product;
  changeCategory: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  changeNewCategory: (e: React.FormEvent) => void;
  editing: boolean;
  handleChange: (e: React.FormEvent) => void;
  handleFileChange: (e: React.FormEvent) => void;
  handleBeautyChange: (e: React.FormEvent) => void;
  handleThumbnailChange: (e: React.FormEvent) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  newCategory: string;
  removeProductImage?: (index: number) => void;
}

export function ProductForm(props: ProductFormProps) {
  const { product, editing, changeNewCategory, handleSubmit, newCategory, handleChange, handleFileChange, handleBeautyChange, handleThumbnailChange, removeProductImage } = props;
  const { categories } = useStore((s) => s);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isReady, setIsReady] = useState<boolean>(product?.readyToPublish ?? false);

  const toggleReadyStatus = useCallback(() => {
    setIsReady(prev => !prev);
  }, []);

  const handleFormSubmit = useCallback((e) => {
    product.readyToPublish = isReady;
    handleSubmit(e);
  }, [isReady, handleSubmit, product]);

  const addAnotherImage = useCallback(() => {
    setImagePreviews(prev => [...prev, ""]);
  }, []);

  const handleGalleryFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImagePreviews(prev => {
        const next = [...prev];
        next[index] = url;
        return next;
      });
    }
    handleFileChange(e);
  }, [handleFileChange]);

  const killProductImage = useCallback((imageNumber: number) => {
    if (removeProductImage) {
      removeProductImage(imageNumber);
    }
  }, [removeProductImage]);

  return (
    <div className="pf-shell">

      {/* Header bar */}
      <div className="pf-header">
        <span className="pf-header-title">
          {editing ? "Edit Product" : "New Product"}
        </span>
        <div className="pf-publish-toggle" onClick={toggleReadyStatus}>
          <div className={isReady ? "pf-checkbox pf-checkbox--on" : "pf-checkbox"} />
          <span className="pf-publish-toggle-label">Ready to Publish</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleFormSubmit} className="pf-form">

        {/* Name + Price */}
        <div className="pf-row-2">
          <div className="pf-field">
            <label className="pf-label" htmlFor="productName">Product Name</label>
            <input
              id="productName"
              type="text"
              name="productName"
              value={product?.productName ?? ''}
              onChange={handleChange}
              required
              placeholder="Product name"
            />
          </div>
          <div className="pf-field">
            <label className="pf-label" htmlFor="price">Price (USD)</label>
            <input
              id="price"
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={product?.price != null ? (product.price / 100).toFixed(2) : ''}
              onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'price', value: String(Math.round(parseFloat(e.target.value || '0') * 100)) } } as React.ChangeEvent<HTMLInputElement>)}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Category */}
        {product?.category !== "New" && (
          <div className="pf-field">
            <label className="pf-label" htmlFor="category">Category</label>
            <div className="pf-category-row">
              <select id="category" name="category" value={product?.category} onChange={handleChange}>
                {categories?.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                id="newCategory"
                name="category"
                type="text"
                value={newCategory}
                placeholder="or enter a new category"
                onChange={changeNewCategory}
              />
            </div>
          </div>
        )}

        {/* Images: beauty + thumbnail */}
        <div className="pf-section-label">Images</div>

        <div className="pf-image-grid">
          <div className="pf-image-slot">
            <div className="pf-image-slot-label">Beauty Shot</div>
            {product.beauty && product.beauty !== '' && (
              <div className="pf-preview-wrap">
                <img src={product.beauty} alt="Beauty preview" />
              </div>
            )}
            <input className="pf-file-input" id="beauty" type="file" accept="image/*" onChange={handleBeautyChange} name="beauty" />
          </div>

          <div className="pf-image-slot">
            <div className="pf-image-slot-label">Thumbnail</div>
            {product.thumbnail && product.thumbnail !== '' && (
              <div className="pf-preview-wrap">
                <img src={product.thumbnail} alt="Thumbnail preview" />
              </div>
            )}
            <input className="pf-file-input" id="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} name="thumbnail" />
          </div>
        </div>

        {/* Existing gallery images */}
        {editing && product?.productImages?.length > 0 && (
          <div className="pf-field">
            <div className="pf-section-label">Gallery Images</div>
            <div className="pf-gallery-grid">
              {product.productImages.map((productImage, imageNumber) => (
                <div className="pf-gallery-item" key={imageNumber}>
                  <img src={productImage} alt={`Gallery ${imageNumber + 1}`} />
                  <div className="pf-gallery-kill" onClick={() => killProductImage(imageNumber)}>✕</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional image inputs */}
        {imagePreviews.length > 0 && (
          <div className="pf-extra-images">
            {imagePreviews.map((preview, imageNumber) => (
              <div className="pf-extra-image-row" key={imageNumber}>
                <span className="pf-image-slot-label">Image {imageNumber + 1}</span>
                {preview && (
                  <div className="pf-preview-wrap">
                    <img src={preview} alt={`New image ${imageNumber + 1} preview`} />
                  </div>
                )}
                <input className="pf-file-input" id={`image_${imageNumber}`} type="file" accept="image/*" onChange={(e) => handleGalleryFileChange(e, imageNumber)} name="images" />
              </div>
            ))}
          </div>
        )}

        <div className="pf-add-image-btn" onClick={addAnotherImage}>
          Add Image
        </div>

        {/* Description */}
        <div className="pf-field">
          <label className="pf-label" htmlFor="productDescription">Description</label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={product?.productDescription ?? ''}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Describe the product…"
          />
        </div>

        {/* Submit */}
        <div className="pf-submit-row">
          <button type="submit" className="pf-submit-btn">
            {editing ? 'Save Changes' : 'Post Product'}
          </button>
        </div>

      </form>
    </div>
  );
}
