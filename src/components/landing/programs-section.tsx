const PROGRAMS = [
  {
    tag: "Privat",
    tagBg: "#F5C518",
    tagColor: "#0A0A0A",
    accentColor: "#F5C518",
    title: "Kelas\nPrivat",
    description: "Bimbingan tatap muka satu-satu dengan tutor berpengalaman. Materi dan jadwal disesuaikan sepenuhnya dengan kebutuhan mahasiswa.",
    benefits: ["Jadwal Fleksibel", "Latihan soal rutin", "SMART Access", "Personal"],
  },
  {
    tag: "Platinum",
    tagBg: "#0F1F6B",
    tagColor: "#fff",
    accentColor: "#0F1F6B",
    title: "Paket\nPlatinum",
    description: "Bimbingan belajar rutin per blok dengan jadwal terstruktur. Cocok untuk mahasiswa yang ingin mempersiapkan diri secara konsisten sepanjang semester.",
    benefits: ["Per Blok", "Grup kecil", "Diskusi aktif"],
  },
  {
    tag: "Gold",
    tagBg: "#f5b340",
    tagColor: "#0A0A0A",
    accentColor: "#f5b340",
    title: "Paket\nGold",
    description: "Program intensif persiapan ujian yang berfokus pada diskusi 2 arah antara pengajar dan siswa.",
    benefits: ["DST 1x/minggu", "Grup kecil", "Diskusi aktif", "Drill soal"],
  },
  {
    tag: "SMART-Med",
    tagBg: "#22C55E",
    tagColor: "#fff",
    accentColor: "#22C55E",
    title: "Akses\nSMART-Med",
    description: "Simulasi Medis Akademik Realistis Terstandar — Try Out CBT dengan soal berkualitas, timer, dan pembahasan untuk persiapan real CBT.",
    benefits: ["Online", "Auto Grading", "Sesuai kurikulum", "Free pembahasan"],
  },
];

const CHECK_ICON = (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export function ProgramsSection() {
  return (
    <section id="program" style={{ background: "#F7F7F7", padding: "100px 0" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 60,
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
              Program Belajar
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
              Pilih yang <span className="lp-mark">cocok</span> untukmu.
            </h2>
          </div>
          <p style={{ fontSize: "0.95rem", color: "#5A6272", maxWidth: 300, lineHeight: 1.7 }}>
            Setiap program dirancang untuk memaksimalkan persiapan ujian kedokteranmu.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {PROGRAMS.map((prog) => (
            <div
              key={prog.tag}
              className="lp-lift"
              style={{
                background: "#FFFFFF",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #E5E7EB",
              }}
            >
              {/* Accent top bar */}
              <div style={{ height: 8, background: prog.accentColor }} />
              <div style={{ padding: "28px 24px 26px" }}>
                <span
                  style={{
                    display: "inline-block",
                    background: prog.tagBg,
                    color: prog.tagColor,
                    fontWeight: 700,
                    fontSize: "0.62rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "4px 11px",
                    borderRadius: 6,
                    marginBottom: 18,
                  }}
                >
                  {prog.tag}
                </span>
                <h3
                  style={{
                    fontWeight: 900,
                    fontSize: "1.85rem",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: "#0A0A0A",
                    marginBottom: 14,
                    whiteSpace: "pre-line",
                  }}
                >
                  {prog.title}
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#5A6272", lineHeight: 1.65, marginBottom: 20 }}>
                  {prog.description}
                </p>
                {/* Benefits */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {prog.benefits.map((b) => (
                    <li key={b} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.84rem", color: "#374151", fontWeight: 500 }}>
                      <span style={{ color: prog.accentColor, flexShrink: 0 }}>{CHECK_ICON}</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
