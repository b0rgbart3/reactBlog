
import React, { useCallback, useState } from "react";
import { useData } from "../../data/useData";
import { useNavigate } from "react-router-dom";
import { Product, useStore } from "../../state/useStore";

export type ProductFormProps = {
    product: Product;
    changeCategory: () => void;
    changeNewCategory: (e: React.FormEvent) => void;
    editing: boolean;
    handleChange: (e: React.FormEvent) => void;
    handleFileChange: (e: React.FormEvent) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    newCategory: string;
}

export function ProductForm(props: ProductFormProps) {
    const { product, changeCategory, editing, changeNewCategory, 
        handleSubmit, newCategory, handleChange, handleFileChange } = props;
    const navigate = useNavigate();
    const { user, categories, articles, products, 
        productCategories, loading, users, setUser } = useStore((s) => s);
    const { refresh } = useData();
    const [imageCount, setImageCount] = useState<number>(product?.imageCount ? product.imageCount : 0);
    const [images, setImages] = useState<string[]>(product?.images ? product.images : []);

    const [isReady, setIsReady] = useState<boolean>(product?.readyToPublish ? product?.readyToPublish  : false);

    const toggleReadyStatus = useCallback(() => {
       const newReadyStatus = isReady;
        setIsReady(!newReadyStatus);
    }, [isReady]);

    const handleFormSubmit = useCallback((e) => {
        product.readyToPublish = isReady;
        handleSubmit(e);
    })

    const addAnotherImage = useCallback((e) => {
        const newImageCount = imageCount + 1;
        setImageCount(newImageCount);
        setImages(prev => [...prev, ""]);
    },[]);

    return (
        <form onSubmit={handleFormSubmit} className="new-article-form">
            <div>
                <label htmlFor="readyToPublish">Ready to Publish</label>
                <br></br>
                {isReady && (<div className='lineContainer'>
                    <div className='bButton checkBoxSelected' onClick={toggleReadyStatus}></div>
                    Ready to publish</div>
                )}
                {!isReady && (<div className='lineContainer'>
                    <div className='bButton checkBox' onClick={toggleReadyStatus}></div>
                    Ready to publish</div>
                )}

                <label htmlFor="category">Category:</label>

                {product?.category !== "New" && (
                    <div className="row">
                        <select
                            id="category"
                            name='category'
                            value={product?.category}
                            onChange={handleChange}
                        >
                            {categories?.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}

                        </select>
                        <div>
                            <input
                                id="newCategory"
                                name="category"
                                type="text"
                                value={newCategory}
                                placeholder="Choose-- or enter a new category here"
                                onChange={changeNewCategory}

                            />
                        </div>
                    </div>

                )}

                <label htmlFor="productName">Product Name:</label>
                <input
                    id="productName"
                    type="text"
                    name='productName'
                    value={product?.productName ?? ''}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor='headlineImage'>Main Image:</label>

                {/* {editing && product?.mainImage !== '' && (
                    <div className='headlineImagePreview'>

                        <img src={`${product?.mainImage}`} />

                    </div>)} */}
                {/* <input id="headlineImage" type="file" accept="image/*" onChange={handleFileChange} /> */}
            </div>

            <div className='imageUploadContainer'>
                {images.map((productImage, imageNumber) => (
                    <>
                    <div className='productImagePreview'>
                           <input id={`image_${imageNumber}`} type="file" accept="image/*" onChange={handleFileChange} name="images"/>
                    </div>
                    </>
                ))}
            </div>
            
            <div onClick={addAnotherImage}>
                Add another image
            </div>

            <div>
                <label htmlFor="body">Product Description:</label>
                <textarea
                    id="productDescription"
                    name='productDescription'
                    value={product?.productDescription ?? ''}
                    onChange={handleChange}
                    required
                    rows={6}
                />
            </div>

            <button type="submit">{editing ? 'Submit Changes' : 'Post Product'}</button>
        </form>
    )

}