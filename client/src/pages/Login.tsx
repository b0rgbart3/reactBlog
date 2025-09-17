import React, { useCallback, useState } from "react";
import "./loginStyle.css";
import { User, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { useNavigate } from "react-router-dom";
import { BannerNav } from "../components/banner-nav";

export function Login() {

    const { user, articles, loading, users, setUser } = useStore((s) => s);
    const { refresh, login } = useData();
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [loginWord, setLoginWord] = useState("");



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // form processing.
        if (userName !== "") {
            const activeUser: Partial<User> = {
                user_name: userName,
                loginWord: loginWord,
            }
            const match = await login(activeUser);
            console.log('Login as: ', JSON.stringify(activeUser));

        

            if (match) {
 
                navigate(`/`);
            }
        }

    }

    const newUser = useCallback(() => {
        navigate(`/newUser`);
    }, []);

    const goHome = useCallback(() => {
        navigate(`/`);
    }, []);


    return (
        <>
     <BannerNav page='login'/>

            <div className="loginForm">
                Please Log In:

                <form onSubmit={handleSubmit} >
                    <label>User Name: </label>
                    <input type='text' id="user_name" size='50' value={userName}
                        onChange={(e) => setUserName(e.target.value)}></input>
                    <br></br>
                    <label>Password: </label>
                    <input type='password' id="phash" value={loginWord}
                        onChange={(e) => setLoginWord(e.target.value)} size='50'></input>
                    <br></br><br></br>
                    <button type="submit">Login</button>
                </form>
            </div>

            <div className="newToBorg"><button onClick={newUser}>New to the B0rgBlog?</button></div>
        </>
    )
}