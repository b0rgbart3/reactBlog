"use client";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { useClickOutside } from "../hooks/useClickOutside";

export type BannerNavProps = {
  page: string;
};

export function BannerNav(props) {
  const { page } = props;
  const { user, orders, cartFlashCount } = useStore((s) => s);
  const [cartFlashing, setCartFlashing] = useState(false);
  const { logout } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const router = useRouter();

  const goHome = useCallback(() => {
    router.push(`/`);
  }, [router]);
  const gotoShoppingCart = useCallback(() => {
    router.push("/cart");
  }, [router]);
  const editUser = useCallback(() => {
    router.push("/user");
  }, [router]);

  const openMenu = useCallback(() => {
    setTimeout(() => {
      setIsMenuOpen(!isMenuOpen);
    }, 100);
  }, [isMenuOpen]);

  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  });

  const prevCartFlashCount = useRef(cartFlashCount);

  useEffect(() => {
    if (cartFlashCount <= prevCartFlashCount.current) {
      prevCartFlashCount.current = cartFlashCount;
      return;
    }
    prevCartFlashCount.current = cartFlashCount;
    setCartFlashing(true);
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
    const timer = setTimeout(() => setCartFlashing(false), 500);
    return () => clearTimeout(timer);
  }, [cartFlashCount]);

  const itemClick = useCallback(
    (e) => {
      e.stopPropagation();
      const navItem = e.target?.dataset?.nav;

      switch (navItem) {
        case "home":
          router.push("/");
          break;
        case "cart":
          router.push("/cart");
          break;
        case "login":
          router.push("/login");
          break;
        case "about":
          router.push("/about");
          break;
        case "resources":
          router.push("/resources");
          break;
        case "articles":
          router.push("/articles");
          break;
        case "memes":
          router.push("/memes");
          break;
        case "calculator":
          router.push("/calculator");
          break;
        case "products":
          router.push("/products");
          break;
        case "logout":
          logout();
          setIsMenuOpen(false);
          break;
        case "admin":
          router.push("/admin");
          break;
        default:
          break;
      }
    },
    [router, logout],
  );

  return (
    <div className="banner">
      <div className="navBanner">
        <div className="bannerLeft moonMathLogo" onClick={goHome}></div>
        <div className="middleBannerNav"></div>
        <div className="bannerRight">
          {orders.length > 0 && !isMenuOpen && (
            <div
              className={`orderInfo${cartFlashing ? " orderInfo--flash" : ""}`}
              onClick={gotoShoppingCart}
            >
              Orders: {orders.length}
            </div>
          )}
          <div id="burger" className="burger" onMouseDown={openMenu}>
            <div className="patty"></div>
            <div className="patty"></div>
            <div className="patty"></div>
          </div>

          <div
            id="menu"
            className={`menu ${isMenuOpen ? "open" : "closed"}`}
            ref={menuRef}
          >
            <div
              data-nav="home"
              data-type="menuItem"
              className="innerMenuOption"
              id="menuItem0"
              onClick={itemClick}
            >
              Home
            </div>
            <div
              data-nav="about"
              data-type="menuItem"
              className="innerMenuOption"
              id="menuItem2"
              onClick={itemClick}
            >
              About Moon-Math
            </div>
            <div
              data-nav="resources"
              data-type="menuItem"
              className="innerMenuOption"
              id="menuItem3"
              onClick={itemClick}
            >
              Resources
            </div>
            <div
              data-nav="articles"
              data-type="menuItem"
              className="innerMenuOption"
              onClick={itemClick}
            >
              Articles
            </div>
            <div
              data-nav="memes"
              data-type="menuItem"
              className="innerMenuOption"
              id="menuItem6"
              onClick={itemClick}
            >
              Memes
            </div>
            <div
              data-nav="products"
              data-type="menuItem"
              className="innerMenuOption"
              onClick={itemClick}
            >
              Merch
            </div>
            <div
              data-nav="calculator"
              data-type="menuItem"
              className="innerMenuOption"
              onClick={itemClick}
            >
              Bitcoin Retirement Calculator
            </div>
            {orders && orders.length > 0 && (
              <div
                data-nav="cart"
                data-type="menuItem"
                className="innerMenuOption"
                id="menuItem4"
                onClick={itemClick}
              >
                Your Shopping Cart
              </div>
            )}
            {user && (
              <div
                data-nav="logout"
                data-type="menuItem"
                className="innerMenuOption"
                id="menuItem6"
                onClick={itemClick}
              >
                Logout
              </div>
            )}
            {!user && (
              <div
                data-nav="login"
                data-type="menuItem"
                className="innerMenuOption"
                id="menuItem1"
                onClick={itemClick}
              >
                Login
              </div>
            )}
            {user && user.sensi && (
              <div
                data-nav="admin"
                data-type="menuItem"
                className="innerMenuOption"
                id="menuItem5"
                onClick={itemClick}
              >
                Admin
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="tagline">
        <p className="hero-title ">A blog about bitcoin.</p>
      </div>
      {user && (
        <div className="loggedInAs">
          You are logged in as: {user?.userName}
          {user?.author && " - author"}
          {user?.sensi && " & admin"}
        </div>
      )}
      {!user && page !== "login" && page !== "create" && (
        <div className="notLoggedIn"></div>
      )}
    </div>
  );
}
