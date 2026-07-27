const MAP_PIN = (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2.5}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx={12} cy={10} r={3} />
  </svg>
);

const EXT_ICON = (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

const CONTACTS = [
  {
    num: "01",
    label: "WhatsApp",
    title: "Chat Langsung",
    desc: "+62 878-6714-1403",
    link: "https://wa.me/6287867141403",
    linkLabel: "Buka WhatsApp",
  },
  {
    num: "02",
    label: "Email",
    title: "Email Kami",
    desc: "smartmededu30@gmail.com",
    link: "mailto:smartmededu30@gmail.com",
    linkLabel: "Kirim Email",
  },
  {
    num: "03",
    label: "Instagram",
    title: "Follow Kami",
    desc: "@smartmed_edu",
    link: "https://instagram.com/smartmed_edu",
    linkLabel: "Buka Instagram",
  },
  {
    num: "04",
    label: "Lokasi",
    title: "Alamat",
    desc: "Mataram, Nusa Tenggara Barat",
    link: "#",
    linkLabel: "Lihat di Maps",
  },
];

export function ContactSection() {
  return (
    <section id="kontak" style={{ background: "#FFFFFF", padding: "100px 0" }}>
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
                color: "#2563EB",
                marginBottom: 12,
              }}
            >
              Hubungi Kami
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
              Kami siap <span className="lp-mark">membantu.</span>
            </h2>
          </div>
          <p style={{ fontSize: "0.92rem", color: "#5A6272", maxWidth: 280, lineHeight: 1.7 }}>
            Konsultasi gratis, tanpa biaya apapun. Hubungi kami via saluran yang paling nyaman.
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
          {CONTACTS.map((c) => (
            <a
              key={c.num}
              href={c.link}
              target={c.link.startsWith("http") ? "_blank" : undefined}
              rel={c.link.startsWith("http") ? "noopener noreferrer" : undefined}
              className="lp-lift"
              style={{
                display: "block",
                background: "#F7F7F7",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: "32px 28px",
                position: "relative",
                overflow: "hidden",
                textDecoration: "none",
              }}
            >
              {/* Watermark number */}
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
                {c.num}
              </div>

              {/* Yellow circle */}
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
                }}
              >
                {MAP_PIN}
              </div>

              <div style={{ fontWeight: 600, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A6272", marginBottom: 6 }}>
                {c.label}
              </div>
              <h3 style={{ fontWeight: 900, fontSize: "1.6rem", letterSpacing: "-0.04em", color: "#0A0A0A", lineHeight: 1.05, marginBottom: 4 }}>
                {c.title}
              </h3>
              <p style={{ fontSize: "0.86rem", color: "#5A6272", marginBottom: 24 }}>
                {c.desc}
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: "0.82rem", color: "#0F1F6B" }}>
                {c.linkLabel}
                {EXT_ICON}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
