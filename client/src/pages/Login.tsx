import React, { useCallback, useState } from "react";
import "./loginStyle.css";
import { useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { useNavigate } from "react-router-dom";

export function Login() {

    const { user, articles, loading, users, setUser } = useStore((s) => s);
    const { refresh } = useData();
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [phash, setPHash] = useState("");



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // form processing.
        if (userName !== "") {
            console.log('Login as: ', userName);

            const userFound = users.find((user) => user.user_name === userName);
            console.log('Found the user: ', userFound);

            console.log('phash: ', userFound.phash);

            const match = userFound && userFound.phash === phash;
            console.log('match: ', match);

            if (match) {
                setUser(userFound)
                 navigate(`/`);
            }
        }

        // re-route to homepage.

    }

    return (
        <>
            <div className="loginForm">
                Please Log In:

                <form onSubmit={handleSubmit} >
                    <label>User Name: </label>
                    <input type='text' id="user_name" size='50' value={userName}
                        onChange={(e) => setUserName(e.target.value)}></input>
                    <br></br>
                    <label>Password: </label>
                    <input type='password' id="phash" value={phash}
                        onChange={(e) => setPHash(e.target.value)} size='50'></input>
                    <br></br>
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    )
}