'use client';
import Image from "next/image";
import { BannerNav } from "../components/banner-nav";

export function CalculatorLanding() {
  return (
    <div className="siteWrapper">
      <BannerNav page="calculator" />
      <div className="basicContainer">
        <h1>Bitcoin Retirement Calculator</h1>
        <p>
          How much Bitcoin do you need to retire? This calculator helps you model your path to
          financial independence using Bitcoin as your primary savings vehicle. Enter your current
          stack, monthly savings rate, expected appreciation, and target retirement income — and
          see how the numbers play out over time.
        </p>
        <p>
          Unlike traditional retirement calculators, this one accounts for Bitcoin's unique
          supply-capped monetary properties. Whether you're just starting to stack or already
          deep in the rabbit hole, plug in your numbers and see where the math takes you.
        </p>
        <Image
          src="/calculator.jpg"
          alt="Bitcoin retirement calculator screenshot"
          width={800}
          height={500}
          style={{ width: "100%", height: "auto", borderRadius: "8px", margin: "24px 0" }}
        />
        <a
          href="/calculator"
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
          Open the Calculator
        </a>
      </div>
    </div>
  );
}
