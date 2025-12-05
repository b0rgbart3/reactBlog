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

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { refresh } = useData();

    const routeHome = useCallback(() => {
        refresh();
        navigate(`/`);
    }, []);

    const [product, setProduct] = useState<Product>(products.find((product) => product._id === _id));

    console.log('BD: about to edit product: ', product);


    useEffect(() => {
        if (!product) {
            const freshProduct: Partial<Product> = {
                productDescription: "",
                category: productCategories[0] || "",
                productName: "New Product",
            };
            setProduct(freshProduct);
        }
    }, []);

    // Runs when user picks a file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    useData();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            let postedCategory = category;
            if (newCategory.length) {
                postedCategory = newCategory;
            }

            if (selectedFile) {
                product.mainImage = selectedFile
            }

            const response = await axios.patch(`/api/products/${product._id}`, product, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log('Saved product: ', response.data);

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
            <div className='articlePageTitle'>{`New Product:`}</div>
            <ProductForm
                product={product}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
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