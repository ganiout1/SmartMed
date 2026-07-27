"use client";

import { useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "Selama mengikuti bimbingan SOCA bersama SmartMed, saya mendapatkan pengalaman yang sangat berkesan. Materi yang disampaikan jelas, pembahasannya mudah dipahami, dan pastinya sangat membantu saya dalam mempersiapkan ujian soca. Terima kasih, SmartMed, atas bimbingan dan dukungannya. Semoga ke depannya SmartMed semakin sukses, terus berkembang, dan semakin banyak membantu mahasiswa meraih hasil yang terbaik.",
    name: "Putu Gede Reinanta Widiarsana",
    from: "Mahasiswa FK",
    to: "Nilai sempurna SOCA blok 5",
  },
  {
    quote:
      "Haloo kakk, sebelumnyaa mau ucapinnn makasii bangett sama semua kakak-kakak smartmedd udah ngebantuu aku buat blok 5, jujur waktu awal-awal masuk blok 5 itu udah takut, karena di blok 5 ini kan ada SOCA untuk yang pertama kalinyaa, tapi dengan ikut smartmed jadi merasa terbantu bangett karena mendekati hari ujian SOCA, kita ada kelas offline simulasi SOCA, jadi punya gambaran mekanisme dan skenario di SOCA nya nanti gimana. Terus dari yang sepengalamanku kemarin, untuk kasus SOCA nya mirip, maksudnya inti dari setiap jawabannya itu miripp. Buat kelas tutornya juga penjelasannya Okee bangettt, kakak-kakaknya juga fast resp kalo ada hak yang mau ditanya-tanya hehe. Mungkin ini aja kalo dari akuu, sekali lagi makasih banyakk kakak-kakak smartmed🤗🫰",
    name: "Areta Salsabila Sukri",
    from: "Mahasiswi FK",
    to: "Nilai sempurna SOCA",
  },
  {
    quote:
      "review dari aku itu yg JUJUR BGT itu aku sangat’ happy belajar sm smartmed, karna se ngebantu itu pahami materi kuliah dan tutorial juga. semua kakak’ smartmed itu expert semuaa, sangat baik dalam menjelaskan dan mudah dipahami🥺🥺🥺 intinya smartmed itu the best si",
    name: "Pasha Mozza Suzetta",
    from: "Mahasiswi FK",
    to: "Top 5 Anatomi blok 4, Nilai SOCA 93.3",
  },
  {
    quote:
      "Selama ikut bimbel di smartmed, bener bener membantu banget. Kakak kakaknya sangat helpful dan materi yang disampaikan juga mudah dipahami, setiap ada materi yang kurang dimengerti kakak kakaknya mau menjelaskan ulang sampe bener bener paham. Waktu persiapan ujian tramed juga membantu banget, apalagi smartmed menyediakan kelas offline buat tramed. Waktu SOCA juga membantu banget, kita diajarin materinya sampe simulasi ujiannya. Overall pengalaman belajar di sana sangat menyenangkan dan bermanfaat 🙌🙌",
    name: "Ni Made Florena Saras Gayatri",
    from: "Mahasiswi FK",
    to: "Top 2 Neuroanatomi, Nilai sempurna SOCA, One-Shoot blok 4",
  },
  {
    quote:
      "Selama saya mengikuti smartmed, blok yang dianggap susah menjadi lebih mudah karena pengajarnya bikin paham bukan hapal. Materi yang diajarkan Smartmed sangat ramah dengan maba karena mudah dipahami, Smartmed all the way!🥳",
    name: "I Gede Lio Suipayana",
    from: "Mahasiswa FK",
    to: "Nilai sempurna SOCA",
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
                color: "#f5b340",
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
            borderRadius: 12,
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
                <span style={{ color: "#f5b340", fontWeight: 600 }}>{t.to}</span>
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
                onMouseEnter={e => { e.currentTarget.style.background = "#f5b340"; e.currentTarget.style.color = "#0A0A0A"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0A0A0A"; e.currentTarget.style.color = "#fff"; }}
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
                onMouseEnter={e => { e.currentTarget.style.background = "#f5b340"; e.currentTarget.style.color = "#0A0A0A"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0A0A0A"; e.currentTarget.style.color = "#fff"; }}
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
