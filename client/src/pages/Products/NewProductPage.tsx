import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Article, Product, useStore } from "../../state/useStore";
import { useData } from "../../data/useData";
import axios from "axios";
import { ProductForm } from "./ProductForm";


export function NewProductPage() {
    const navigate = useNavigate();

    const { user, categories, products, productCategories, articles, loading, users, setUser } = useStore((s) => s);
    const [category, setCategory] = useState(categories[0] || "");
    const [newCategory, setNewCategory] = useState('');

    // const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [beauty, setBeauty] = useState<File>({});
    const [thumbnail, setThumbnail] = useState<File>({});

    const { refresh } = useData();

    const routeHome = useCallback(() => {
        refresh();
        navigate(`/`);
    }, []);

    const [product, setProduct] = useState<Partial<Product>>(null);

    // console.log('BD: new product: ', product);

    useEffect(() => {
        // console.log('BD: looking for a product...');
        if (!product) {
            const freshProduct: Partial<Product> = {
                productDescription: "",
                category: productCategories[0] || "",
                productName: "New Product",
            };
            setProduct(freshProduct);
            // console.log('BD: fresh Product: ', freshProduct);
        }
    }, [product]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImages(prev => [...prev, e.target.files[0]]);
        }
    };
    const handleBeautyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                console.log('BD: target: ', e.target);
        if (e.target.files && e.target.files[0]) {
            setBeauty(e.target.files[0]);
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                console.log('BD: target: ', e.target);
        if (e.target.files && e.target.files[0]) {
            setThumbnail( e.target.files[0]);
        }
    };


    useData();
    // console.log('BD: after useData call.');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            let postedCategory = category;
            if (newCategory.length) {
                postedCategory = newCategory;
            }
            const formData = new FormData();

            // Add text fields
            formData.append("productName", product.productName);
            // console.log('BD: about to append product description of: ', product.productDescription);
            formData.append("productDescription", product.productDescription);
            formData.append("readyToPublish", product.readyToPublish);
            formData.append("category", newCategory.length ? newCategory : category);
            // formData.append("beauty", beauty);
            // formData.append("thumbnail", thumbnail);

                        if (beauty) {
            formData.append('newBoeaty', beauty);
            }

            if (thumbnail) {
            formData.append('newThumbnail', thumbnail);
            }


            // Add images 
            images.forEach((img) => {
                formData.append("images", img);   // <--- name must match upload.array("images")
            });


            const response = await axios.post("/api/products", formData, {
                headers: {
                    // "Content-Type": "multipart/form-data"
                }
            });
            // console.log('Saved product: ', response.data);

            navigate(`/`);
        } catch (err) {
            console.error("Failed to submit product:", err);
        }
    };

    // console.log('BD: after processing images.');

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

    // console.log('BD: about to render.');

    return (
        <div className={'article'}>
            <div className="articlePageCategory" onClick={routeHome}>{`<- `}b0rgBlog ::</div>
            <div className='articlePageTitle'>{`New Product:`}</div>
            <ProductForm
                product={product}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleBeautyChange={handleBeautyChange}
                handleThumbnailChange={handleThumbnailChange}
                editing={false}
                changeCategory={handleChange}
                changeNewCategory={changeNewCategory}
                newCategory={newCategory}
            />
            <div>
            </div>
        </div>
    )
}