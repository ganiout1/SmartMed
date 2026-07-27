const MAP_PIN = (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2.5}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx={12} cy={10} r={3} />
  </svg>
);

const WHATSAPP_ICON = (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const EMAIL_ICON = (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const INSTAGRAM_ICON = (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
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
    title: "WhatsApp",
    desc: "+62 878-6714-1403",
    link: "https://wa.me/6287867141403",
    linkLabel: "Buka WhatsApp",
    icon: WHATSAPP_ICON,
  },
  {
    num: "02",
    label: "Email",
    title: "EMAIL",
    desc: "smartmededu30@gmail.com",
    link: "mailto:smartmededu30@gmail.com",
    linkLabel: "Kirim Email",
    icon: EMAIL_ICON,
  },
  {
    num: "03",
    label: "Instagram",
    title: "INSTAGRAM",
    desc: "@smartmed_edu",
    link: "https://instagram.com/smartmed_edu",
    linkLabel: "Buka Instagram",
    icon: INSTAGRAM_ICON,
  },
  {
    num: "04",
    label: "Lokasi",
    title: "LOKASI",
    desc: "Mataram, Nusa Tenggara Barat",
    link: "#",
    linkLabel: "Lihat di Maps",
    icon: MAP_PIN,
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
                color: "#f5b340",
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
                {c.icon}
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
