import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../state/useStore";
import { useData } from "../data/useData";

import "./banner-nav.css";
import { useClickOutside } from "../hooks/useClickOutside";




export function Footer() {


    const navigate = useNavigate();

    const goHome = useCallback(() => {
        navigate(`/`);
    }, []);
    const goLogout = useCallback(() => {
        logout();
    }, []);

          const copyrightInfo = useCallback(() => {
              navigate('/about');
          })
    

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


    return (
        <>

            <div className="divider" />
            <div className='footer'><p onClick={copyrightInfo}>Moon-Math @copyright 2026 Bart Dority - see full rights disclaimer</p></div>
         
        </>

    )
}

