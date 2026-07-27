"use client";

import Image from "next/image";
import Link from "next/link";

const IG_ICON = (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x={2} y={2} width={20} height={20} rx={5} />
    <circle cx={12} cy={12} r={4} />
    <circle cx={17.5} cy={6.5} r={1} fill="currentColor" stroke="none" />
  </svg>
);

export function Footer() {
  return (
    <footer style={{ background: "#0F1F6B", color: "#FFFFFF", padding: "40px 0 28px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            paddingBottom: 28,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image src="/logo.png" alt="SmartMED" width={120} height={36} style={{ objectFit: "contain", height: 36, width: "auto", filter: "brightness(0) invert(1)" }} />
            <div>
              <div style={{ fontWeight: 900, fontSize: "0.95rem", letterSpacing: "-0.02em", color: "#ffffff" }}>SmartMED</div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Bimbel Kedokteran</div>
            </div>
          </div>

          {/* Social & contact links */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="https://instagram.com/smartmed_edu"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
            >
              {IG_ICON}
              @smartmed_edu
            </a>
            <a
              href="https://wa.me/6287867141403"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
            >
              +62 878-6714-1403
            </a>
            <a
              href="mailto:smartmededu30@gmail.com"
              style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
            >
              smartmededu30@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{ paddingTop: 20, fontSize: "0.72rem", color: "rgba(255,255,255,0.18)" }}>
          © {new Date().getFullYear()} SmartMED. All rights reserved. · Bimbel Kedokteran Mataram, NTB.
        </div>
      </div>
    </footer>
  );
}
