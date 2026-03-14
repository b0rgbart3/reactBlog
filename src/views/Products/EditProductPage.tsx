'use client';
import React, { useCallback, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Product, useStore } from "../../state/useStore";
import { useData } from "../../data/useData";
import axios from "axios";
import { ProductForm } from "./ProductForm";

export function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ _id: string }>();
  const _id = params._id;
  const { user, categories, products, productCategories } = useStore((s) => s);
  const [category, setCategory] = useState(categories[0] || "");
  const [newCategory, setNewCategory] = useState('');
  const [product, setProduct] = useState<Product>(products.find((p) => p._id === _id));
  const [images, setImages] = useState<File[]>([]);
  const [beauty, setBeauty] = useState<File>(null);
  const [thumbnail, setThumbnail] = useState<File>(null);
  const { refresh } = useData();

  useEffect(() => {
    if (!product) {
      setProduct({
        productDescription: "",
        category: productCategories[0] || "",
        productName: "Edit Product",
      } as Product);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImages(prev => [...prev, e.target.files[0]]);
  };
  const handleBeautyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setBeauty(e.target.files[0]);
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setThumbnail(e.target.files[0]);
  };

  const routeHome = useCallback(() => {
    refresh();
    router.push(`/`);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("productName", product.productName);
      formData.append("productDescription", product.productDescription);
      formData.append("readyToPublish", String(product.readyToPublish));
      formData.append("category", newCategory.length ? newCategory : category);
      formData.append("price", String(product.price ?? 0));
      formData.append('productImages', product.productImages as any);
      formData.append('beauty', product.beauty);
      formData.append('thumbnail', product.thumbnail);
      if (beauty) formData.append('newBeauty', beauty);
      if (thumbnail) formData.append('newThumbnail', thumbnail);
      images.forEach((img) => formData.append("images", img));
      await axios.patch(`/api/products/${product._id}`, formData);
      router.push(`/`);
    } catch (err) {
      console.error("Failed to submit product:", err);
    }
  };

  const changeNewCategory = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewCategory(e.target.value);
    setProduct((prev) => ({ ...prev, category: e?.target?.value }));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className={'article'}>
      <div className="articlePageCategory" onClick={routeHome}>{`<- `}b0rgBlog ::</div>
      <div className='articlePageTitle'>{`Edit Product:`}</div>
      <ProductForm
        product={product}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleBeautyChange={handleBeautyChange}
        handleThumbnailChange={handleThumbnailChange}
        editing={true}
        changeCategory={handleChange}
        changeNewCategory={changeNewCategory}
        newCategory={newCategory}
      />
    </div>
  )
}
