'use client';
import Image from "next/image";
import { BannerNav } from "../components/banner-nav";

export function CountdownLanding() {
  return (
    <div className="siteWrapper">
      <BannerNav page="countdown" />
      <div className="basicContainer">
        <h1>The Millionth Block Countdown</h1>
        <p>
          Bitcoin's blockchain grows one block at a time, roughly every 10 minutes — and block
          number 1,000,000 is coming. The Millionth Block Countdown tracks exactly how much time
          remains until this historic milestone is reached.
        </p>
        <p>
          The millionth block is a purely symbolic event, but it's a powerful one. It represents
          nearly two decades of uninterrupted, permissionless, decentralized consensus — a
          testament to the resilience and elegance of Satoshi's design. Whether you're a
          long-time hodler or new to the rabbit hole, this is a moment worth watching.
        </p>
        <Image
          src="/countdown.jpg"
          alt="Millionth block countdown screenshot"
          width={800}
          height={500}
          style={{ width: "100%", height: "auto", borderRadius: "8px", margin: "24px 0" }}
        />
        <a
          href="https://millionthblock-countdown.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "8px",
            padding: "12px 24px",
            backgroundColor: "#367dc7",
            color: "#fff",
            borderRadius: "6px",
            fontWeight: 500,
            fontSize: "16px",
            textDecoration: "none",
          }}
        >
          Open the Countdown
        </a>
      </div>
    </div>
  );
}
