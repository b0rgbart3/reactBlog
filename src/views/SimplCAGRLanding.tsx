"use client";
import Image from "next/image";
import { BannerNav } from "../components/banner-nav";

export function SimplCAGRLanding() {
  return (
    <div className="siteWrapper">
      <BannerNav page="simplcagr" />
      <div className="basicContainer">
        <h1>
          SimplCAGR —{" "}
          <span className="subhead">
            Compound Annual Growth Rate Calculator
          </span>
        </h1>
        <Image
          src="/simplCAGR.jpg"
          alt="simplCAGR calculator screenshot"
          width={800}
          height={450}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        />
        <p>
          CAGR (Compound Annual Growth Rate) tells you the steady annual rate at
          which an investment would have grown from its starting value to its
          ending value over a given period. It smooths out volatility and gives
          you a clean, comparable number — great for benchmarking Bitcoin's
          performance against stocks, real estate, or any other asset.
        </p>
        <p>
          Enter a start value, growth rate, and number of years, and simplCAGR
          does the math instantly. No spreadsheet required.
        </p>
        <a
          href="/simplCAGR"
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
          Open simplCAGR
        </a>
      </div>
    </div>
  );
}
