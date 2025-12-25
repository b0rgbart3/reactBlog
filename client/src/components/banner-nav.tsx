import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../state/useStore";
import { useData } from "../data/useData";
import Tagline from "../assets/tagline.svg";
import "./banner-nav.css";
import { useClickOutside } from "../hooks/useClickOutside";


export type BannerNavProps = {
    page: string;
    adminCallback: () => void;
}

export function BannerNav(props) {
    const { adminCallback, page } = props;
    const { user, articles, loading, users, setUser } = useStore((s) => s);
    const { refresh, logout } = useData();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const showLogin = page !== "login" && page !== "create";
    const showAdminButton = (page === "home" && user?.sensi);
    
    const navigate = useNavigate();

    const goHome = useCallback(() => {
        navigate(`/`);
    }, []);
    const goLogout = useCallback(() => {
        logout();
    }, []);
    const login = useCallback((e) => {
        e.stopPropagation();
        console.log('BD: in the login method.');
        navigate('/login');
    }, []);

    const about = useCallback((e) => {
        e.stopPropagation();
        navigate('/about');
    }, []);

    const editUser = useCallback(() => {
        navigate('/user');
    })

    const openMenu = useCallback(() => {;
        setTimeout(() => {
            setIsMenuOpen(!isMenuOpen);
        }, 100)
      
    }, [isMenuOpen])

    const burgerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(menuRef, () => {
        console.log('BD: menu open: ', isMenuOpen);
        if (isMenuOpen) {
        setIsMenuOpen(false);
        }
    });

    const itemClick = useCallback((e) => {
        e.stopPropagation();
        const navItem = e.target?.dataset?.nav;

        switch(navItem) {
            case 'login':         navigate('/login'); break;
            case 'about':         navigate('/about'); break;
            case 'resources':    navigate('/resources');
            break;
            default: break;
        }
    }, []);


    const menuActions = [
        { label: 'Login', action: login },
        { label: 'About', action: about }
    ]
    return (
        <>
            <div className='navBanner'>
                <div className='left moonMathLogo' onClick={goHome}>
                </div>

                <div className='middleBannerNav'>

                    {user?.sensi && showAdminButton && (<div className='bButton grayButton midSizeButton adminButton' onClick={adminCallback}>Admin</div>)}
                </div>

                <div className='right'>
                    <div id='burger' className='burger' onMouseDown={openMenu}>
                        <div className='patty'></div>
                        <div className='patty'></div>
                        <div className='patty'></div>
                    </div>

                    <div id='menu' className={`menu ${isMenuOpen ? "open" : "closed"}`} ref={menuRef}>
                        <div data-nav='login' data-type='menuItem' className='innerMenuOption' id='menuItem1' onClick={itemClick}>Login</div>
                        <div data-nav='about' data-type='menuItem' className='innerMenuOption' id='menuItem2' onClick={itemClick}>About Moon-Math</div>
                        <div data-nav='resources' data-type='menuItem' className='innerMenuOption' id='menuItem3' onClick={itemClick}>Resources</div>
                    </div>
                </div>

            </div>
            <div className="divider"></div>
            <div className="tagline">
                <img src={Tagline} />
            </div>
            {user &&
                <div className='loggedInAs'>
                    You are logged in as: {user?.user_name}
                    {user?.author && ' - author'}
                    {user?.sensi && ' & admin'}
                </div>}
            {!user && page !== 'login' && page !== 'create' &&
                <div className='notLoggedIn'>
                    {/* You are not logged in. */}
                </div>}
        </>

    )
}

