import React, { useCallback, useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Article, useStore } from "../state/useStore";
import "./articleStyle.css";
import "./newArticleStyle.css";
import "./editUserStyle.css";
import { useData } from "../data/useData";
import axios from "axios";
import { ArticleForm } from "./Articles/ArticleForm";
import { BannerNav } from "../components/banner-nav";


export function EditUserPage() {
    useData();
    const navigate = useNavigate();
    const { user, articles, loading, users, setUser } = useStore((s) => s);
    const { _id } = useParams<{ _id: string }>();
    const { refresh } = useData();

    const [editUser, setEditUser] = useState(user);

    const routeHome = useCallback(() => {
        refresh();
        navigate(`/`);
    }, []);

    const toggleAuthorStatus = useCallback(() => {
        const updatedUser = { ...editUser };
        console.log('BD: useditUserr.author: ', editUser.author);
        updatedUser.author = !updatedUser.author;
        setEditUser(updatedUser)

    }, [editUser, editUser.author])

    useEffect(() => {
        if (!user) {
            console.log('BD: user not logged in.');
            routeHome();
        }
    },[user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const response = await axios.patch(`api/user/${editUser._id}`, editUser, {
                headers: {
                    "Content-Type": "application/json"
                }
            });


            navigate(`/`);
        } catch (err) {
            console.error("Failed to submit user changes:", err);
        }
    };

        const handleChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                const { name, value } = e.target;

                console.log('BD: fieldName: ', name);
                console.log('BD: value: ', value);

                editUser[name] = value;

                setUser(({
                    ...editUser,
                    [name]: value,
                }));
            },
            [user]
        );

    return (
        <>
            <BannerNav page='editUser' />

            <div className='pageLayout'>
                <div className='titleText'>Your Account:</div>
                <div className="basicBox">

                    <div className="editUserForm">
                        <form onSubmit={handleSubmit} >
                            <div>
                                {editUser.author === true && (<div className='lineContainer'>
                                    <div className='bButton checkBoxSelected' onClick={toggleAuthorStatus}></div>
                                    Author</div>
                                )}
                                {editUser.author && (
                                    <div className='lineContainer'>  
                                    <label id='authorName'>Author Name:</label>
                                        <input type='text' value={editUser.authorName} size='24' id='authorName' name='authorName' onChange={handleChange}></input>
                                        </div>
                                )}

                                {editUser.author === false && (<div className='lineContainer'>
                                    <div className='bButton checkBox' onClick={toggleAuthorStatus}></div>
                                    Author</div>
                                )}

                            </div>
                            <br>
                            </br><div className='lineContainer'>
                                <label id='userName'>Your User Name</label>
                                <input type='text' id='userName' value={editUser.userName} onChange={handleChange} name='userName'>
                                </input>
                          
                        </div>
                            <br>
                            </br>
                            <label id='userEmail'>Your email address</label>
                            {editUser.userEmail}
                        
                            <br></br><br></br>
                    

                            <br></br><br></br>
                    <button type="submit" onClick={handleSubmit}>Submit Changes</button>
  
                        </form>
                    </div></div></div>
        </>

    )
}

