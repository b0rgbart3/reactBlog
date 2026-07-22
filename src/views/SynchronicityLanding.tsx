"use client";
import { BannerNav } from "../components/banner-nav";
import Image from "next/image";

export function SynchronicityLanding() {
  return (
    <div className="siteWrapper">
      <BannerNav page="synchronicity" />
      <div className="basicContainer">
        <h1>
          Synchronicity:{" "}
          <span className="subhead">
            A Visualization of the Bitcoin Network
          </span>
        </h1>
        <Image
          src="/synchronicity.jpg"
          alt="Synchronicity visualization"
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
          An interactive 3D globe visualization for Bitcoin data. See the
          Bitcoin network come alive on a spinning globe — block activity, node
          distribution, and live transaction data rendered in real time.
        </p>

        <a
          href="https://synchronicity.moon-math.online/"
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
          Open Synchronicity
        </a>
      </div>
    </div>
  );
}
