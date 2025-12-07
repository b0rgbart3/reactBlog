import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Article, Product, useStore } from "../../state/useStore";
import "../articleStyle.css";
import "../newArticleStyle.css";
import { useData } from "../../data/useData";
import axios from "axios";
import { ProductForm } from "./ProductForm";


export function EditProductPage() {
    const navigate = useNavigate();
    const { _id } = useParams<{ _id: string }>();
    const { user, categories, products, productCategories, articles, loading, users, setUser } = useStore((s) => s);
    const [category, setCategory] = useState(categories[0] || "");
    const [newCategory, setNewCategory] = useState('');
    const [product, setProduct] = useState<Product>(products.find((product) => product._id === _id));
    const [images, setImages] = useState<File[]>([]);
    const [beauty, setBeauty] = useState<File>(null);
    const [thumbnail, setThumbnail] = useState<File>(null);
    const { refresh } = useData();

    const routeHome = useCallback(() => {
        refresh();
        navigate(`/`);
    }, []);


    useEffect(() => {
        if (!product) {
            const freshProduct: Partial<Product> = {
                productDescription: "",
                category: productCategories[0] || "",
                productName: "Edit Product",
            };
            setProduct(freshProduct);
        }
    }, []);

    // Runs when user picks a file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // setFileCount(fileCount + 1);
            // const newFiles = [...selectedFiles, e.target.files[0]];
            // setSelectedFiles(newFiles);
            setImages(prev => [...prev, e.target.files[0]]);
        }
        // console.log('BD: images: ', images);
    };

    const handleBeautyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('BD: target: ', e.target);

        if (e.target.files && e.target.files[0]) {
            setBeauty(e.target.files[0]);
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
        }
    };


    useData();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {


            const formData = new FormData();

            // Add text fields
            formData.append("productName", product.productName);
            formData.append("productDescription", product.productDescription);
            formData.append("readyToPublish", product.readyToPublish);
            formData.append("category", newCategory.length ? newCategory : category);
            formData.append('productImages', product.productImages)
            formData.append('beauty', product.beauty);
            formData.append('thumbnail', product.thumbnail);
            if (beauty) {
            formData.append('newBeauty', beauty);
            }

            if (thumbnail) {
            formData.append('newThumbnail', thumbnail);
            }

            

            // Add images (very important!)
            images.forEach((img) => {
                formData.append("images", img);   // <--- name must match upload.array("images")
            });


            let postedCategory = category;
            if (newCategory.length) {
                postedCategory = newCategory;
            }


            const response = await axios.patch(`/api/products/${product._id}`, formData, {
                headers: {
                    // "Content-Type": "multipart/form-data"
                }
            });

            navigate(`/`);
        } catch (err) {
            console.error("Failed to submit product:", err);
        }
    };


    const changeCategory = useCallback((e) => {
        setCategory(e.target.value);
        product.category = e?.target?.value;
        setProduct((prev) => ({
            ...prev,
            category: e?.target?.value,
        }));
    }, []);

    const changeNewCategory = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        console.log(e?.target?.value);
        setNewCategory(e.target.value);
        // article.category = e?.target?.value;
        setProduct((prev) => ({
            ...prev,
            category: e?.target?.value,
        }));
    }, []);


    // Generic change handler
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setProduct((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        []
    );


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
            <div>
            </div>
        </div>
    )
}