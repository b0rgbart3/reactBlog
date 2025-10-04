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
        console.log('BD: about to wipe and re-seed the database.');
        try {
            wiped = await wipeAndSeed({ id: user._id, key: user.phash });
            console.log('BD: wiped in the admin panel: ', wiped);
        } catch (err) {
            console.log('Error wiping the DB.');
        } finally {
            if (wiped.status === 200) {
                refresh();
            }
        }
    }, []);


    return (

        <div className='adminPanel'>
            <div className='adminPanelTitlebar'>Admin Panel</div>
            <div className='adminContent'>
                <div>Current User: {user?.user_name}
                    {user.author && ' | author'}
                    {user.sensi && ' | sensi'}</div>
                <div className="userList">

                    <div>Users:</div>
                    {user.sensi && users.map((user) => (

                        <div>
                            {user.user_name}
                        </div>

                    ))}
                </div>

                <div onClick={newArticle} className="newArticleButton">
                    New Article
                </div>
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

                        <div className="JsonData">
                            <DownloadJsonButton articles={articles} users={users} />
                        </div></>
                )}

            </div>
        </div>

    )
}