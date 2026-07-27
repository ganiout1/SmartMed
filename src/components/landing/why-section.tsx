const ADVANTAGES = [
  {
    num: "01",
    title: "Pengajar Terbaik & Berpengalaman",
    desc: "Tim pengajar terbaik, ramah, dan pastinya berpengalaman sesuai bidang keahlian.",
  },
  {
    num: "02",
    title: "Bentuk Fondasi Belajar",
    desc: "Memastikan mahasiswa baru memiliki fondasi belajar dengan memberikan Tips & Strategi belajar ala anak FK.",
  },
  {
    num: "03",
    title: "Kelas Kecil & Personal",
    desc: "Maksimal 8–15 peserta per kelas memungkinkan interaksi yang lebih intens dan pemahaman yang lebih mendalam.",
  },
  {
    num: "04",
    title: "Simulasi CBT Realistis",
    desc: "Latihan dengan SMART-Med yang dirancang menyerupai UI ujian CBT asli untuk membangun kesiapan mental dan teknis.",
  },
  {
    num: "05",
    title: "Discussion Service Time",
    desc: "Fasilitas konsultasi di luar jam kelas regular 1x/minggu. Di DST, siswa dapat membahas tutorial, perkuliahan, OSCE, dll.",
  },
  {
    num: "06",
    title: "Jadwal Fleksibel",
    desc: "Pilih jadwal belajar yang sesuai dengan kesibukan Anda. Tersedia kelas pagi, siang, dan malam serta opsi online.",
  },
  {
    num: "07",
    title: "Modul Sesuai Kurikulum",
    desc: "Materi disesuaikan dengan kurikulum fakultas kedokteran dari universitas masing-masing.",
  },
  {
    num: "08",
    title: "Pilih Lokasi Les",
    desc: "Bisa les online, offline di rumah, atau di kafe sesuai kebutuhan dan kenyamanan Anda.",
  },
];

export function WhySection() {
  return (
    <section id="keunggulan" style={{ background: "#FFFFFF", padding: "100px 0" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
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
            Kenapa SmartMED?
          </p>
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "#0A0A0A",
              maxWidth: 600,
            }}
          >
            Keunggulan yang <span className="lp-mark">nyata.</span>
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {ADVANTAGES.map((adv) => (
            <div
              key={adv.num}
              className="lp-lift"
              style={{
                background: "#F7F7F7",
                border: "1px solid #E5E7EB",
                borderRadius: 20,
                padding: "32px 28px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Big watermark number */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "-0.1em",
                  right: "-0.05em",
                  fontWeight: 900,
                  fontSize: "9rem",
                  letterSpacing: "-0.05em",
                  color: "rgba(0,0,0,0.04)",
                  lineHeight: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {adv.num}
              </div>

              {/* Yellow circle icon */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#F5C518",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span style={{ fontWeight: 900, fontSize: "0.75rem", color: "#0A0A0A" }}>{adv.num}</span>
              </div>

              <h3
                style={{
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                  marginBottom: 10,
                  lineHeight: 1.25,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {adv.title}
              </h3>
              <p
                style={{
                  fontSize: "0.86rem",
                  color: "#5A6272",
                  lineHeight: 1.65,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {adv.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
