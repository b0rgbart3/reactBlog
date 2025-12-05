import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Article, Product, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import "./adminStyle.css";
import { DownloadJsonButton } from "./Download";
import { UsersForm } from "./UsersForm";
import { TableHeader } from "./TableHeader";
import { ExpandableTable } from "./ExpandableTable";

export function AdminPanel() {

    const { user, articles, categories, loading, products, productCategories, users, setUser } = useStore((s) => s);
    console.log('BD: categories: ', categories);
    const navigate = useNavigate();
    const { refresh, kill, backUpDB, wipeAndSeed } = useData();
    const editArticle = useCallback((article: Article) => {
        navigate(`/article/edit/${article._id}`);
    }, []);

    const editProduct = useCallback((product: Product) => {
        navigate(`/product/edit/${product._id}`);
    }, []);

    const killArticle = useCallback((article: Article) => {
        const confirmDelete =
            window.confirm(`Are you sure you want to delete this article, 
            titled: ${article.title} ?
            \nIt will be complete deleted from the database, and cannot be restored.`);
        if (!confirmDelete) return; // cancel if user clicks "Cancel"
        kill(article._id);
        refresh();
    }, []);

    const newArticle = useCallback(() => {
        navigate(`/article/new`);
    }, []);

    const newProduct = useCallback(() => {
        navigate(`/product/new`);
    }, []);

    const clearOut = useCallback(async () => {
        let wiped;

        try {
            wiped = await wipeAndSeed({ id: user._id, key: user.phash });

        } catch (err) {

        } finally {
            if (wiped.status === 200) {
                refresh();
            }
        }
    }, []);
    
    const backUp = useCallback(async () => {
        let wiped;

        try {
            wiped = await backUpDB({ id: user._id, key: user.phash });

        } catch (err) {

        } finally {
            if (wiped.status === 200) {
                refresh();
            }
        }
    }, []);

    return (

        <>
            <div className='titleBar'>Admin Panel</div>
            <div className='adminContent'>
                <ExpandableTable title='users' open={false}>
                  <UsersForm />
                </ExpandableTable>

                <ExpandableTable title='articles' open={false}>
                <div onClick={newArticle} className="newArticleButton">
                    New Article
                </div>
                <br></br>
                {categories?.map((category, categoryIndex) => (
                    <div key={`category-${category}-${categoryIndex}`}>
                        <div className="killCategory">{category}</div>
                        <div>
                            {articles
                                ?.filter((a) => a.category === category)
                                .map((a) => (
                                    <React.Fragment key={a._id} >
                                        <div className="aaRow">
                                            <div className="aaItem" onClick={() => editArticle(a)}>
                                                {a.title}</div>
                                            <div className="killButton" onClick={() => killArticle(a)}>X</div>


                                        </div>
                                    </React.Fragment>
                                ))}
                        </div>
                    </div>
                ))}
               </ExpandableTable>

                <ExpandableTable title='merchandise' open={false}>
                <div onClick={newProduct} className="newArticleButton">
                    New Product
                </div>

                {products && ( <>
                Products:
                <br>
                </br>
                {products.map((product) => {
                    return (
                        <div>
                        <div  onClick={() => editProduct(product)}>
                            {product.productName}
                        </div>
                        <div>{product.productDescription}</div>
                        </div>
                    )
                })}


                </>)}
               </ExpandableTable>

                <ExpandableTable title='database' open={false}>
                {user.sensi && (
                    <>
                        <div className='dangerous' onClick={() => clearOut()}>
                            Wipe out the DataBase, and start over with original seed data.
                        </div>
                        <br></br>
                        <div className='caution' onClick={() => backUp()}>
                           Backup the current DataBase.
                        </div>

                        <div className="JsonData">
                            Download data to your local download folder:<br></br>
                            <DownloadJsonButton articles={articles} users={users} />
                        </div>

                    </>
                )}</ExpandableTable>
                
            </div>
  
        </>
    )
}