import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Article, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import "./adminStyle.css";
import { DownloadJsonButton } from "../Download";

export function AdminPanel() {


    const categories = useStore((s) => s.categories);
    const { user, articles, loading, users, setUser } = useStore((s) => s);
    const navigate = useNavigate();
    const { refresh, kill, wipeAndSeed } = useData();
    const editArticle = useCallback((article: Article) => {
        navigate(`/article/edit/${article._id}`);
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


    return (

        <div className='basicBox'>
            <div className='titleBar'>Admin Panel</div>
            <div className='adminContent'>

                <div className="userList">

                    {user.sensi && (
                        <div>Users:</div>)}



                    {user.sensi && users.map((user) => (
                        <div className='bUser'>

                            <div className='bRow'>
                                <div className='bItem bLabel'>
                                    User Name
                                </div>       <div className='bItem'>
                                    {user.user_name}
                                </div>
                            </div>

                            <div className='bRow'>

                                <div className='bItem bLabel'>
                                    ID
                                </div>
                                <div className='bItem'>
                                    {user._id}
                                </div>
                            </div>
                            <div className='bRow'>
                                <div className='bItem bLabel'>
                                    Author
                                </div>        <div className='bItem'>
                                    {user.author}
                                </div></div>

                            <div className='bRow'>
                                <div className='bItem bLabel'>
                                    Sensi
                                </div>         <div className='bItem'>
                                    {user.sensi}
                                </div>
                            </div>
                            <div className='bRow'>
                                <div className='bItem bLabel'>
                                    Status
                                </div>        <div className='bItem'>
                                    {user.status}
                                </div></div>

                            <div className='bRow'>
                                <div className='bItem bLabel'>
                                    Hash
                                </div>       <div className='bItem'>
                                    {user.phash}
                                </div>
                            </div>
                            <div className='bRow'>
                                <div className='bItem bLabel'>
                                    Email
                                </div>           <div className='bItem'>
                                    {user.user_email}
                                </div></div>
                        
                        </div>
                    ))}
            </div>

            <br></br>
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
            {user.sensi && (
                <>
                    <div className='dangerous' onClick={() => clearOut()}>
                        Wipe out the DataBase, and start over with original seed data.
                    </div>

                    {/* <div className="JsonData">
                        Stringify Existing Data:<br></br>
                        <div>Stringify existing data to the server.</div>
                    </div> */}

                    <div className="JsonData">
                        Download data to your local download folder:<br></br>
                        <DownloadJsonButton articles={articles} users={users} />
                    </div>
                    
                </>
            )}

        </div>
        </div >

    )
}