'use client';
import { BannerNav } from "../components/banner-nav";
import { BitcoinPrice, BlockHeight, HalvingCountdown } from "bitcoin-widgets";

export function BitcoinWidgetsLanding() {
  return (
    <div className="siteWrapper">
      <BannerNav page="bitcoin-widgets" />
      <div className="basicContainer">
        <h1>Bitcoin Widgets</h1>
        <p>
          React components for real-time Bitcoin data. Drop them into any React app — no API keys,
          no configuration required. Three plug-and-play widgets, each polling a live public API
          and updating automatically.
        </p>

        <h2>Live Demo</h2>
        <p>These widgets are running live on this page right now:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", margin: "16px 0 32px" }}>
          <BitcoinPrice theme="tech-dark" />
          <BlockHeight theme="tech-dark" />
          <HalvingCountdown theme="tech-dark" />
        </div>

        <h2>Install</h2>
        <pre style={{
          background: "#1a1a1a",
          color: "#e2e8f0",
          padding: "16px 20px",
          borderRadius: "6px",
          fontFamily: "monospace",
          fontSize: "15px",
          overflowX: "auto",
          margin: "0 0 24px",
        }}>
          npm install bitcoin-widgets
        </pre>

        <h2>Quick Start</h2>
        <pre style={{
          background: "#1a1a1a",
          color: "#e2e8f0",
          padding: "16px 20px",
          borderRadius: "6px",
          fontFamily: "monospace",
          fontSize: "14px",
          overflowX: "auto",
          margin: "0 0 32px",
        }}>{`import { BitcoinPrice, BlockHeight, HalvingCountdown } from 'bitcoin-widgets'

export default function App() {
  return (
    <>
      <BitcoinPrice />
      <BlockHeight />
      <HalvingCountdown />
    </>
  )
}`}</pre>

        <h2>Components</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #334155" }}>
              <th style={{ textAlign: "left", padding: "8px 12px" }}>Component</th>
              <th style={{ textAlign: "left", padding: "8px 12px" }}>Data source</th>
              <th style={{ textAlign: "left", padding: "8px 12px" }}>Default refresh</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #1e293b" }}>
              <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>&lt;BitcoinPrice /&gt;</td>
              <td style={{ padding: "8px 12px" }}>blockchain.info</td>
              <td style={{ padding: "8px 12px" }}>30s</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #1e293b" }}>
              <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>&lt;BlockHeight /&gt;</td>
              <td style={{ padding: "8px 12px" }}>mempool.space</td>
              <td style={{ padding: "8px 12px" }}>30s</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>&lt;HalvingCountdown /&gt;</td>
              <td style={{ padding: "8px 12px" }}>mempool.space</td>
              <td style={{ padding: "8px 12px" }}>60s</td>
            </tr>
          </tbody>
        </table>

        <h2>Themes</h2>
        <p>Every widget ships with five built-in themes:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", margin: "16px 0 32px" }}>
          <BitcoinPrice theme="minimal" />
          <BitcoinPrice theme="classic" />
          <BitcoinPrice theme="tech-dark" />
          <BitcoinPrice theme="tech-light" />
          <BitcoinPrice theme="terminal" />
        </div>
        <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "32px" }}>
          From left to right: <code>minimal</code>, <code>classic</code>, <code>tech-dark</code>,{" "}
          <code>tech-light</code>, <code>terminal</code>. Each theme is also customizable via the{" "}
          <code>styleOverrides</code> prop.
        </p>

        <h2>Peer Dependencies</h2>
        <p>Requires React ≥ 17. No API keys. No accounts.</p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
          <a
            href="https://www.npmjs.com/package/bitcoin-widgets"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#cc3534",
              color: "#fff",
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "16px",
              textDecoration: "none",
            }}
          >
            View on npm
          </a>
          <a
            href="https://github.com/b0rgbart3/bitcoin-widgets"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#24292e",
              color: "#fff",
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "16px",
              textDecoration: "none",
            }}
          >
            View on GitHub
          </a>
          <a
            href="https://b0rgbart3.github.io/bitcoin-widgets/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#367dc7",
              color: "#fff",
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "16px",
              textDecoration: "none",
            }}
          >
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
}
