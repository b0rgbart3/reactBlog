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
    const [inMenu, setInMenu] = useState(false);

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
    const editUser = useCallback(() => {
        navigate('/user');
    })

    const openMenu = useCallback(() => {
        // console.log('BD: setting menu open.');
        if (!isMenuOpen) {
            setInMenu(true);
        }
        setIsMenuOpen(!isMenuOpen);
    }, [isMenuOpen, inMenu])

    const showLogin = page !== "login" && page !== "create";
    const showAdminButton = (page === "home" && user?.sensi);

    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, () => {
        setIsMenuOpen(false);
        // setInMenu(false);
    });

    const mouseOverMenu = useCallback(() => {
        // console.log('setting IN MENU TO TRUE .');
        setInMenu(true);
    }, [inMenu])

    const mouseLeaveOutOfMenu = useCallback((e) => {
         const causeOfLeave = e.relatedTarget as HTMLElement | null;
        //  console.log('BD: cause of leave:', causeOfLeave);

         setTimeout(() => {
        // console.log('BD: mousing out, and target = ', e.target?.id);
        // console.log('mouseing out.');
        if ( causeOfLeave.id !== 'burger') {
        setIsMenuOpen(false);
        }
        }, 200);
        // setInMenu(false);
    }, [isMenuOpen])

    const mouseLeaveOutOfBurger = useCallback((e) => {
         const causeOfLeave = e.relatedTarget as HTMLElement | null;
        // console.log('BD: closing:', isMenuOpen);
        // console.log('BD: mouseout of burger');
        // console.log('BD: menu is open.');
        // console.log('BD: in menu: ', inMenu);

        const menuTimer = setTimeout(() => {
                 if (isMenuOpen) {
            if (!inMenu) {
            // console.log('BD: checking... in Menu?: ', inMenu);

            // console.log('BD: ABout to clear.');
            setIsMenuOpen(false);
            } else {
                // console.log('BD: mouseLeave Burger with menu open');
                // setTimeout(() => {
                if (causeOfLeave?.id !== 'menu') {
                    setIsMenuOpen(false);
                    setInMenu(false);
                }
                // }, 600);
            }
        }
        }, 200);



    }, [isMenuOpen, inMenu]);


    return (
        <>
            <div className='navBanner'>
                <div className='left moonMathLogo' onClick={goHome}>
                </div>

                <div className='middleBannerNav'>

                    {user?.sensi && showAdminButton && (<div className='bButton grayButton midSizeButton adminButton' onClick={adminCallback}>Admin</div>)}
                </div>

                <div className='right'>
                    <div id='burger' className='burger' onMouseDown={openMenu} onMouseLeave={mouseLeaveOutOfBurger} ref={ref}>
                        <div className='patty'></div>
                        <div className='patty'></div>
                        <div className='patty'></div>
                    </div>

                    <div id='menu' className={`menu ${isMenuOpen ? "open" : "closed"}`} onMouseOver={mouseOverMenu} onMouseLeave={mouseLeaveOutOfMenu}>

                        <div id='innerMenu' className='innerMenu'>Test
                            Test Again
                        </div>
                    </div>
                </div>

                {/* {showLogin &&
                    <div className='userAccountIconContainer'>
                        <button onClick={(e) => { e.stopPropagation(); user ? goLogout() : login(); }}
                            className="bButton logout">{user && (`Logout`)}
                            {!user && (`Login`)}</button>
                        {user && (<div className='bButton userIcon' onClick={editUser}></div>)}
                    </div>
                } */}
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

