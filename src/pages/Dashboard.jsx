import { Link } from "react-router-dom";

const modules = [
  {
    title: "Cómo Usar el Panel",
    desc: "Guía rápida de todos los módulos de FullHead.",
    route: "/instalacion",
    accent: "#D4AA00",
    badge: null,
    num: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#D4AA00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    title: "Sensibilidad por Celular",
    desc: "Presets VIP por modelo de dispositivo.",
    route: "/sensi",
    accent: "#3B82F6",
    badge: { text: "NUEVO", bg: "rgba(16,185,129,0.12)", color: "#22C97A", border: "rgba(16,185,129,0.2)" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
        <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
      </svg>
    ),
  },
  {
    title: "HUD Pro",
    desc: "Interfaces recomendadas para mejor visibilidad.",
    route: "/hud",
    accent: "#F97316",
    badge: { text: "PRO", bg: "rgba(212,170,0,0.1)", color: "#D4AA00", border: "rgba(212,170,0,0.2)" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    title: "Configuraciones Pro",
    desc: "Ajustes avanzados para optimizar tu juego.",
    route: "/configs",
    accent: "#06B6D4",
    badge: { text: "PRO", bg: "rgba(212,170,0,0.1)", color: "#D4AA00", border: "rgba(212,170,0,0.2)" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
  {
    title: "Entrenamientos Diarios",
    desc: "Rutinas rápidas para mejorar tu destreza.",
    route: "/treinos",
    accent: "#10B981",
    badge: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    title: "Bono - Beta",
    desc: "Funciones avanzadas y optimizaciones extras.",
    route: "/painel-externo",
    accent: "#D4AA00",
    badge: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#D4AA00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
];

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function ModCard({ mod, idx }) {
  const accent = mod.accent;
  const iconBg = hexToRgba(accent, 0.10);
  const iconBorder = hexToRgba(accent, 0.15);
  const btnBg = hexToRgba(accent, 0.08);
  const btnBorder = hexToRgba(accent, 0.18);
  const btnColor = accent === "#3B82F6" ? "#4A8FFF" : accent === "#10B981" ? "#22C97A" : accent;

  return (
    <Link
      to={mod.route}
      className="card-enter"
      style={{
        background: "#0C0E18",
        border: "1px solid #16192A",
        borderRadius: "13px",
        padding: "14px",
        position: "relative",
        overflow: "hidden",
        textDecoration: "none",
        display: "block",
        animationDelay: `${idx * 0.05 + 0.05}s`,
        transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = hexToRgba(accent, 0.3);
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px ${hexToRgba(accent, 0.1)}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#16192A";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Accent bar top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: accent, borderRadius: "13px 13px 0 0" }} />

      {/* Numero ou Badge */}
      {mod.badge ? (
        <div style={{ position: "absolute", top: "10px", right: "12px", fontSize: "8px", fontWeight: 700, letterSpacing: "1px", padding: "2px 7px", borderRadius: "3px", background: mod.badge.bg, color: mod.badge.color, border: `1px solid ${mod.badge.border}` }}>
          {mod.badge.text}
        </div>
      ) : mod.num ? (
        <div style={{ position: "absolute", top: "10px", right: "12px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "28px", fontWeight: 700, color: "#fff", opacity: 0.04, letterSpacing: "1px", lineHeight: 1, pointerEvents: "none" }}>
          {mod.num}
        </div>
      ) : null}

      {/* Icon */}
      <div style={{ width: "32px", height: "32px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", background: iconBg, border: `1px solid ${iconBorder}` }}>
        <div style={{ width: "15px", height: "15px" }}>{mod.icon}</div>
      </div>

      {/* Title */}
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "1.5px", color: "#C8D4F0", textTransform: "uppercase", lineHeight: 1.2, marginBottom: "5px" }}>
        {mod.title}
      </div>

      {/* Desc */}
      <div style={{ fontSize: "11px", color: "#4A5578", lineHeight: 1.4, marginBottom: "13px" }}>
        {mod.desc}
      </div>

      {/* Button */}
      <div style={{ width: "100%", padding: "7px 10px", borderRadius: "7px", background: btnBg, color: btnColor, border: `1px solid ${btnBorder}`, fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'Inter', sans-serif" }}>
        Acceder <span>›</span>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  return (
    <div style={{ background: "var(--black)", minHeight: "100vh", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>

      {/* CONTEÚDO */}
      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: "18px", maxWidth: "1100px", margin: "0 auto" }}>

        {/* HERO */}
        <section style={{ padding: "18px 20px", borderRadius: "16px", background: "#0C0E18", border: "1px solid #16192A", position: "relative", overflow: "hidden" }}>
          {/* Corner art */}
          <svg style={{ position: "absolute", top: 0, right: 0, width: "110px", height: "110px", pointerEvents: "none" }} viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="110" y1="0" x2="50" y2="0" stroke="#D4AA00" strokeWidth="0.5" opacity="0.18" />
            <line x1="110" y1="0" x2="110" y2="60" stroke="#D4AA00" strokeWidth="0.5" opacity="0.18" />
            <line x1="110" y1="20" x2="80" y2="0" stroke="#D4AA00" strokeWidth="0.3" opacity="0.1" />
            <line x1="110" y1="40" x2="100" y2="0" stroke="#D4AA00" strokeWidth="0.3" opacity="0.1" />
            <circle cx="110" cy="0" r="45" stroke="#D4AA00" strokeWidth="0.4" opacity="0.06" fill="none" />
            <circle cx="110" cy="0" r="75" stroke="#D4AA00" strokeWidth="0.3" opacity="0.04" fill="none" />
          </svg>

          <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "4px", color: "#D4AA00", opacity: 0.7, textTransform: "uppercase", marginBottom: "8px" }}>
            MÓDULOS DISPONIBLES
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "28px", fontWeight: 700, letterSpacing: "2px", color: "#E8DDB0", lineHeight: 1, marginBottom: "5px", textTransform: "uppercase" }}>
            PANEL <span style={{ color: "#D4AA00" }}>FULLHEAD</span>
          </div>
          <div style={{ fontSize: "12px", color: "#4A5578", marginBottom: "14px" }}>
            Selecciona un módulo para optimizar tu rendimiento al máximo
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "18px", fontWeight: 700, color: "#D4AA00", letterSpacing: "1px", lineHeight: 1 }}>6</div>
              <div style={{ fontSize: "9px", color: "#3A4060", letterSpacing: "2px", textTransform: "uppercase" }}>Módulos</div>
            </div>
            <div style={{ width: "1px", background: "#16192A", alignSelf: "stretch" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "18px", fontWeight: 700, color: "#D4AA00", letterSpacing: "1px", lineHeight: 1 }}>7D</div>
              <div style={{ fontSize: "9px", color: "#3A4060", letterSpacing: "2px", textTransform: "uppercase" }}>Actualización</div>
            </div>
            <div style={{ width: "1px", background: "#16192A", alignSelf: "stretch" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "18px", fontWeight: 700, color: "#D4AA00", letterSpacing: "1px", lineHeight: 1 }}>VIP</div>
              <div style={{ fontSize: "9px", color: "#3A4060", letterSpacing: "2px", textTransform: "uppercase" }}>Sensibilidad</div>
            </div>
          </div>
        </section>

        {/* SECTION LABEL */}
        <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "4px", color: "#2A3050", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" }}>
          Módulos
          <span style={{ flex: 1, height: "1px", background: "#10131C" }} />
        </div>

        {/* GRID */}
        <div className="mods-grid-fh">
          {modules.map((mod, i) => (
            <ModCard key={mod.title} mod={mod} idx={i} />
          ))}

          {/* Card Premium violeta */}
          <div className="prem-card-fh card-enter" style={{ background: "#0A0C18", border: "1px solid rgba(109,74,255,0.2)", borderRadius: "13px", padding: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", position: "relative", overflow: "hidden", flexWrap: "wrap", animationDelay: "0.4s" }}>
            <div style={{ position: "absolute", left: "-40px", top: "-40px", width: "140px", height: "140px", borderRadius: "50%", background: "radial-gradient(circle, rgba(109,74,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ minWidth: 0, flex: "1 1 220px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "4px", background: "rgba(109,74,255,0.1)", border: "1px solid rgba(109,74,255,0.2)", marginBottom: "6px" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#7C3AED" }} />
                <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "3px", color: "#8B5CF6" }}>PREMIUM</span>
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "2px", color: "#B8C4E8", textTransform: "uppercase" }}>
                Área Premium
              </div>
              <div style={{ fontSize: "11px", color: "#4A5578", marginTop: "3px" }}>
                Contenido exclusivo VIP — próximamente disponible.
              </div>
            </div>
            <div style={{ padding: "9px 16px", borderRadius: "8px", background: "rgba(109,74,255,0.07)", border: "1px solid rgba(109,74,255,0.15)", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: "#4A3090", cursor: "not-allowed", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "7px", textTransform: "uppercase", flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4A3090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Próximamente
            </div>
          </div>
        </div>

        {/* TIP BAR */}
        <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#0C0E18", border: "1px solid #10131C", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "2px", height: "26px", background: "#D4AA00", opacity: 0.25, borderRadius: "2px", flexShrink: 0 }} />
          <div style={{ fontSize: "11px", color: "#4A5578", lineHeight: 1.5 }}>
            <strong style={{ color: "#6A78A8", fontWeight: 600 }}>Consejo Pro:</strong>{" "}
            Todos los ajustes se sincronizan automáticamente en tu cuenta. Accede desde cualquier dispositivo.
          </div>
        </div>
      </div>

      <style>{`
        .mods-grid-fh {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .mods-grid-fh .prem-card-fh {
          grid-column: 1 / -1;
        }
        @media (min-width: 720px) {
          .mods-grid-fh { grid-template-columns: repeat(3, 1fr); gap: 12px; }
        }
      `}</style>
    </div>
  );
}
