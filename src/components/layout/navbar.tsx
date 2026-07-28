"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const WA_LINK = "https://wa.me/6287867141403";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleToggleMenu = () => setMenuOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-menu", handleToggleMenu);
    return () => window.removeEventListener("toggle-mobile-menu", handleToggleMenu);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { label: "Program", href: "#program" },
    { label: "Keunggulan", href: "#keunggulan" },
    { label: "Testimoni", href: "#testimoni" },
    { label: "Kontak", href: "#kontak" },
  ];

  return (
    <header
      className="md:pointer-events-auto"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",
        background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
        borderBottom: scrolled ? "1px solid #E5E7EB" : "1px solid transparent",
        pointerEvents: !scrolled ? "none" : "auto",
      }}
    >
      <div className="gap-6 lg:gap-8" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 pointer-events-auto" style={{ textDecoration: "none" }}>
          <Image src="/logo.png" alt="SmartMED" width={360} height={108} style={{ objectFit: "contain", height: 108, width: "auto" }} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-9 pointer-events-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{ fontWeight: 500, fontSize: "0.9rem", color: "#374151", transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f5b340")}
              onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            style={{
              fontWeight: 600,
              fontSize: "0.85rem",
              color: "#0F1F6B",
              padding: "11px 20px",
              borderRadius: 12,
              border: "1.5px solid #0F1F6B",
              transition: "background 0.2s, color 0.2s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#0F1F6B"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0F1F6B"; }}
          >
            Masuk
          </Link>
          <a
            href="https://wa.me/6287867141403"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#f5b340",
              color: "#0A0A0A",
              fontWeight: 600,
              fontSize: "0.85rem",
              padding: "11px 24px",
              borderRadius: 12,
              transition: "background 0.2s, transform 0.15s",
              textDecoration: "none",
              display: "inline-block",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e0a030"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f5b340"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Daftar Sekarang
          </a>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className="pointer-events-auto"
        style={{
          overflow: "hidden",
          maxHeight: menuOpen ? 400 : 0,
          transition: "max-height 0.3s ease",
          background: "rgba(255,255,255,0.98)",
          borderTop: menuOpen ? "1px solid #E5E7EB" : "none",
        }}
      >
        <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.02em", color: "#0A0A0A", textDecoration: "none" }}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            style={{
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#0F1F6B",
              padding: 14,
              borderRadius: 12,
              border: "1.5px solid #0F1F6B",
              textAlign: "center",
              textDecoration: "none",
              display: "block",
            }}
          >
            Masuk
          </Link>
          <a
            href="https://wa.me/6287867141403"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              background: "#f5b340",
              color: "#0A0A0A",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: 14,
              borderRadius: 12,
              textAlign: "center",
              textDecoration: "none",
              display: "block",
            }}
          >
            Daftar Sekarang
          </a>
        </div>
      </div>
    </header>
  );
}
