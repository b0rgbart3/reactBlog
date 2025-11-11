import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../state/useStore";
import { useData } from "../data/useData";
import "./banner-nav.css";

export type BannerNavProps = {
    page: string;

}

export function BannerNav(props) {
    const { page } = props;
    const { user, articles, loading, users, setUser } = useStore((s) => s);
    const { refresh, logout } = useData();

    const navigate = useNavigate();

    const goHome = useCallback(() => {
        navigate(`/`);
    }, []);
    const goLogout = useCallback(() => {
        logout();
    }, []);
    const login = useCallback(() => {
        navigate('/login');
    }, []);

    const showLogin = page !== "login" && page !== "create";

    return (
        <>
            <div className='navBanner'>
                <div className='left borgLogo titleType' onClick={goHome}>b0rgBlog</div>

                <div className='middle'>

                </div>
                {showLogin &&
                    <div className='newToBorg'>
                        <button onClick={(e) => { e.stopPropagation(); user ? goLogout() : login(); }}
                            className="right logout">{user && (`Logout`)}{!user && (`Login`)}</button>
                    </div>
                }
            </div>
            {user &&
                <div className='loggedInAs'>
                    You are logged in as: {user?.user_name} 
                    {user?.author && ' - author'}
                    {user?.sensi && ' & admin'}
                </div>}
            {!user && page !== 'login' && page !== 'create' &&
                <div className='mildWarning'>
                    You are not logged in.
                </div>}
        </>

    )
}

