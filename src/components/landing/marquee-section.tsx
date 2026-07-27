const STAR_ICON = (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, opacity: 0.7 }}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const ITEMS = [
  "Kelas Privat",
  "Paket Platinum",
  "Paket Gold",
  "SMART-Med CBT",
  "Pre-Klinik",
  "OSCE Intensif",
  "Pengajar Berpengalaman",
  "Diskusi Aktif",
  "Jadwal Fleksibel",
  "Drill Soal",
  "Auto Grading",
  "Free Pembahasan",
];

function MarqueeItem({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        fontWeight: 800,
        fontSize: "0.88rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        paddingRight: 36,
      }}
    >
      {STAR_ICON}
      {label}
    </span>
  );
}

export function MarqueeSection() {
  return (
    <div
      aria-hidden="true"
      style={{
        background: "#0F1F6B",
        color: "#ffffff",
        overflow: "hidden",
        padding: "14px 0",
        borderTop: "3px solid #F5C518",
        borderBottom: "3px solid #F5C518",
      }}
    >
      <div className="marquee-track">
        {/* Render twice for seamless loop */}
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <MarqueeItem key={i} label={item} />
        ))}
      </div>
    </div>
  );
}
