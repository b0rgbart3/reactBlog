
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
        // console.log('BD: back from use Store.');
    const { refresh } = useData();
    const [images, setImages] = useState<string[]>([]);

    const [isReady, setIsReady] = useState<boolean>(product?.readyToPublish ? product?.readyToPublish : false);

    const toggleReadyStatus = useCallback(() => {
        const newReadyStatus = isReady;
        setIsReady(!newReadyStatus);
    }, [isReady]);

    const handleFormSubmit = useCallback((e) => {
        product.readyToPublish = isReady;
        handleSubmit(e);
    })

    const addAnotherImage = useCallback((e) => {
        setImages(prev => [...prev, ""]);
        // console.log('BD: images: ', images);
    }, [images]);

    const killProductImage = useCallback((imageNumber: number) => {
        console.log('BD: about to kill: ', imageNumber);
        product.productImages.splice(imageNumber,1);
    }, [product])

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
                <label>Images:</label>
            </div>

            <div className='imageUploadContainer'>
                existing images:

                {product?.productImages?.map((productImage, imageNumber) => (
                    <>
                        <div className='productImagePreview'>
                            <div className='productImagePreviewThumbnail'>
                                <img src={`${product.productImages[imageNumber]}`} />
                            </div>
                        <div className='productImagePreviewKill' onClick={()=>killProductImage(imageNumber)}>
                            X
                        </div>
                      </div>
                    </>
                ))}
            </div>

            <div>
                {images.map((image, imageNumber) => {
                    return (
                        <>Image: {image}
                            <input id={`image_${imageNumber}`} type="file" accept="image/*" onChange={handleFileChange} name="images" />
                        </>)
                })}
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