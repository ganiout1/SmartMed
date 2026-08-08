"use client";

import Image from "next/image";
import Link from "next/link";

const WA_LINK = "https://wa.me/6287867141403";

const WA_ICON = (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ARROW_RIGHT = (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export function HeroSection() {
  return (
    <section
      id="tentang"
      style={{
        background: "#FFFFFF",
        minHeight: "100svh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 70,
        position: "relative",
        overflowX: "clip",
      }}
    >
      {/* Dot grid background */}
      <div
        aria-hidden="true"
        className="dot-grid"
        style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }}
      />
      {/* Yellow blob bottom left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-8%",
          left: "-8%",
          width: "34vw",
          maxWidth: 380,
          aspectRatio: "1/1",
          borderRadius: "50%",
          background: "#f5b340",
          opacity: 0.07,
          pointerEvents: "none",
        }}
      />

      {/* Main content grid */}
      <div
        style={{
          maxWidth: 1120,
          width: "100%",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
        className="hero-grid"
      >
        {/* LEFT: Text */}
        <div>
          {/* Pill badges */}
          <div className="hero-pills">
            <span className="lp-pill" style={{ background: "#f5b340", color: "#0A0A0A" }}>
              Bimbel Kedokteran
            </span>
            <span className="lp-pill" style={{ background: "#0F1F6B", color: "#fff" }}>
              Pre-Klinik & CBT & SOCA
            </span>
          </div>

          {/* H1 */}
          <h1
            className="hero-heading"
            style={{
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.94,
              color: "#0A0A0A",
              marginBottom: 28,
            }}
          >
            Partner Belajar<br />
            Mahasiswa<br />
            Kedokteran.<br />
            <span style={{ fontStyle: "italic", color: "#f5b340" }}>Target Lulus</span><br />
            <span style={{ fontStyle: "italic", color: "#f5b340" }}>One Shot.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle"
            style={{
              color: "#5A6272",
              lineHeight: 1.72,
              maxWidth: 520,
              marginBottom: 40,
              fontWeight: 400,
            }}
          >
            Bimbingan intensif dari asisten dosen dan lulusan top angkatan. Materi dibedah tuntas, soal dilatih, sampai kamu siap tempur dan lulus tanpa remedial dalam ujian blok, praktikum, dan SOCA.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta" style={{ marginBottom: 52 }}>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#f5b340",
                color: "#0A0A0A",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "15px 30px",
                borderRadius: 12,
                textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(211,47,47,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {WA_ICON}
              Konsultasi Gratis
            </a>
            <a
              href="#program"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                border: "2px solid #E5E7EB",
                color: "#374151",
                fontWeight: 500,
                fontSize: "0.95rem",
                padding: "15px 26px",
                borderRadius: 12,
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#f5b340"; e.currentTarget.style.color = "#f5b340"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#374151"; }}
            >
              Lihat Program
              {ARROW_RIGHT}
            </a>
          </div>
        </div>


        {/* RIGHT: Logo - absolute on mobile, grid column on desktop */}
        <div
          className="hero-logo-wrapper"
          style={{ overflow: "visible", zIndex: 2 }}
        >
          {/* Yellow blob tied to the logo */}
          <div
            aria-hidden="true"
            className="hero-blob"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              aspectRatio: "1/1",
              background: "#F5C518",
              opacity: 0.2,
              zIndex: -1,
              pointerEvents: "none",
            }}
          />

          <Image
            src="/logo.png"
            alt="SmartMED"
            width={3040}
            height={912}
            className="hero-logo-img"
            style={{ objectFit: "contain", height: "auto", flexShrink: 0 }}
            priority
          />
        </div>

      </div>
    </section>
  );
}

