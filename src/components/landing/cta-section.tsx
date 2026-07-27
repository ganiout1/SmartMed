"use client";

const WA_ICON = (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function CTASection() {
  return (
    <section style={{ background: "#F7F7F7", padding: "80px 0" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
        <div
          style={{
            background: "#0F1F6B",
            borderRadius: 24,
            padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 40px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 32,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 24px 48px rgba(15, 31, 107, 0.2)",
          }}
        >
          {/* Decorative elements */}
          <div aria-hidden="true" style={{ position: "absolute", top: -120, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(245, 179, 64, 0.15) 0%, rgba(245, 179, 64, 0) 70%)", pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", bottom: -100, right: -50, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)", pointerEvents: "none" }} />
          
          {/* Text */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#F5C518",
                marginBottom: 16,
              }}
            >
              Mulai Perjalananmu
            </p>
            <h2
              style={{
                fontWeight: 900,
                fontSize: "clamp(2.4rem, 6vw, 4rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                color: "#ffffff",
                marginBottom: 20,
                maxWidth: 700,
              }}
            >
              Siap raih nilai terbaik <span style={{ color: "#F5B340" }}>tahun ini?</span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, maxWidth: 500 }}>
              Konsultasi gratis via WhatsApp. Kami bantu temukan program paling sesuai untukmu.
            </p>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
            <a
              href="https://wa.me/6287867141403"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "#ffffff",
                color: "#0F1F6B",
                fontWeight: 800,
                fontSize: "1.1rem",
                padding: "20px 44px",
                borderRadius: 50,
                whiteSpace: "nowrap",
                textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {WA_ICON}
              Chat WhatsApp
            </a>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
              +62 878-6714-1403
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
