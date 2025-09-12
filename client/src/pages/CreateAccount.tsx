import React, { useCallback, useState } from "react";
import "./loginStyle.css";
import { User, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { useNavigate } from "react-router-dom";

export function CreateAccount() {

    const { user, articles, loading, users, setUser } = useStore((s) => s);
    const { refresh, createUser } = useData();
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [phash, setPHash] = useState("");
    const [userEmail, setUserEmail] = useState("");



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // form processing.

        const newUser: User = {
            user_name: userName,
            user_email: userEmail,
            phash: phash,
            _id: "",
            sensi: false,
            author: false,
            status: undefined
        }

        if (userName !== "") {
        

            const preExisting = users.find((user) => user.user_email=== userEmail);
 
            console.log('match: ', preExisting);

            if (!preExisting) {
                createUser(newUser);
                setUser(newUser)
                navigate(`/`);
            }
        }

        // re-route to homepage.

    }

    const newUser = useCallback(() => {
        navigate(`/newUser`);
    }, []);

    return (
        <>
        <div>   Welcome to B0rgBart - please choose a username and password.</div>
            <div className="loginForm">
             

                <form onSubmit={handleSubmit} >
                    <label>User Name: </label>
                    <input type='text' id="user_name" size='50' value={userName}
                        onChange={(e) => setUserName(e.target.value)}></input>
                    <br></br>
                    <label>Password: </label>
                    <input type='password' id="phash" value={phash}
                        onChange={(e) => setPHash(e.target.value)} size='50'></input>
                    <br></br>
                     <label>Email: </label>
                                     <input type='text' id="user_email" value={userEmail}
                        onChange={(e) => setPHash(e.target.value)} size='50'></input>
                    <br></br>
                    <button type="submit">Login</button>
                </form>
            </div>

            <div onClick={newUser}>New to B0rgBlog?</div>
        </>
    )
}