"use client";

import { useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "SmartMED benar-benar mengubah cara saya belajar kedokteran. Materi yang terstruktur dan pengajar yang sabar membuat saya lebih percaya diri menghadapi ujian blok.",
    name: "Anisa Rahmawati",
    from: "Mahasiswi FK",
    to: "Nilai Blok Meningkat Drastis",
  },
  {
    quote:
      "Simulasi CBT di SmartMED sangat membantu. Soal-soalnya berkualitas dan sangat mirip dengan ujian asli. Saya jadi terbiasa dengan format dan tekanan waktu ujian.",
    name: "Farhan Pratama",
    from: "Mahasiswa FK",
    to: "Peringkat 5 Besar Angkatan",
  },
  {
    quote:
      "Kelas intensif menjelang OSCE sangat bermanfaat. Latihan keterampilan klinis dengan bimbingan pengajar berpengalaman membuat saya siap menghadapi ujian praktik.",
    name: "Siti Nurhaliza",
    from: "Mahasiswi FK",
    to: "Lulus OSCE dengan Predikat Istimewa",
  },
  {
    quote:
      "Bimbingan privat di SmartMED sangat fleksibel. Tutor saya memahami kelemahan saya dan membuat rencana belajar yang sesuai. Hasilnya, nilai saya meningkat drastis.",
    name: "Muhammad Rizki",
    from: "Mahasiswa FK",
    to: "Peningkatan Nilai 30% dalam 2 Bulan",
  },
  {
    quote:
      "Yang saya suka dari SmartMED adalah kelasnya yang kecil. Saya bisa bertanya sepuasnya tanpa merasa canggung. Pengajarnya pun sangat responsif dan supportif.",
    name: "Dian Permatasari",
    from: "Mahasiswi FK",
    to: "Lulus Semua Ujian Blok Semester 1–4",
  },
];

const QUOTE_ICON = (
  <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
    <text x="0" y="36" fontFamily="Georgia, serif" fontSize="52" fill="#F5C518" opacity="0.35">&ldquo;</text>
  </svg>
);

const PREV_ICON = (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const NEXT_ICON = (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const total = TESTIMONIALS.length;
  const t = TESTIMONIALS[idx];

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <section id="testimoni" style={{ background: "#F7F7F7", padding: "100px 0" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 56,
          }}
        >
          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#D32F2F",
                marginBottom: 12,
              }}
            >
              Kata Mereka
            </p>
            <h2
              style={{
                fontWeight: 900,
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "#0A0A0A",
              }}
            >
              Kisah <span className="lp-mark">sukses</span> alumni.
            </h2>
          </div>
          <p style={{ fontSize: "0.92rem", color: "#5A6272", maxWidth: 280, lineHeight: 1.7 }}>
            Ratusan mahasiswa telah merasakan manfaat bimbingan SmartMED.
          </p>
        </div>

        {/* Testimonial card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            border: "1px solid #E5E7EB",
            padding: "clamp(32px, 5vw, 60px)",
            position: "relative",
            minHeight: 280,
          }}
        >
          {/* Quote decoration */}
          <div style={{ position: "absolute", top: 24, left: 32, opacity: 0.4, fontSize: "5rem", lineHeight: 1, fontFamily: "Georgia, serif", color: "#F5C518", userSelect: "none" }}>
            &ldquo;
          </div>

          {/* Quote text */}
          <p
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.3rem)",
              fontWeight: 500,
              color: "#374151",
              lineHeight: 1.72,
              marginBottom: 40,
              paddingTop: 40,
              fontStyle: "italic",
            }}
          >
            {t.quote}
          </p>

          {/* Author + nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: "1rem", color: "#0A0A0A", letterSpacing: "-0.02em" }}>
                {t.name}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#888", marginTop: 3 }}>
                <span>{t.from}</span>
                <span style={{ margin: "0 6px", color: "#ccc" }}>→</span>
                <span style={{ color: "#D32F2F", fontWeight: 600 }}>{t.to}</span>
              </div>
            </div>
            {/* Arrow nav */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={prev}
                aria-label="Sebelumnya"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "#0A0A0A",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#D32F2F")}
                onMouseLeave={e => (e.currentTarget.style.background = "#0A0A0A")}
              >
                {PREV_ICON}
              </button>
              <button
                onClick={next}
                aria-label="Berikutnya"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "#0A0A0A",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#D32F2F")}
                onMouseLeave={e => (e.currentTarget.style.background = "#0A0A0A")}
              >
                {NEXT_ICON}
              </button>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 20 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Testimoni ${i + 1}`}
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                borderRadius: 99,
                background: i === idx ? "#0A0A0A" : "#D1D5DB",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.3s, background 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
