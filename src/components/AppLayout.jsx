import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import logoImg from "../assets/fullhead-logo.webp";
import "../styles/layout.css";

const nav = [
  {
    label: "Panel Principal", to: "/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )
  },
  {
    label: "Cómo Usar", to: "/instalacion",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    )
  },
  {
    label: "Sensibilidad", to: "/sensi",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
        <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
      </svg>
    )
  },
  {
    label: "Interfaz", to: "/hud",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    )
  },
  {
    label: "Configuraciones", to: "/configs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    )
  },
  {
    label: "Entrenamientos", to: "/treinos",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    )
  },
  {
    label: "Panel Externo", to: "/painel-externo",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    )
  },
  {
    label: "Premium", to: "/premium", disabled: true, premium: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    )
  },
];

export default function AppLayout({ children }) {
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) setUser(currentUser);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const userName = user?.displayName || user?.email?.split("@")[0] || "Usuario";
  const userInitial = userName.charAt(0).toUpperCase();
  const isFullWidth = pathname === "/painel-externo";
  const isModuleRoute = ["/sensi", "/hud", "/configs", "/treinos", "/instalacion"].includes(pathname);

  if (isFullWidth || isModuleRoute) {
    return <>{children}</>;
  }

  const getNavItemStyle = (item) => {
    const active = pathname === item.to;
    const base = {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 14px",
      borderRadius: "8px",
      cursor: item.disabled ? "not-allowed" : "pointer",
      fontSize: "13px",
      fontWeight: 600,
      letterSpacing: "0.3px",
      textDecoration: "none",
      position: "relative",
      marginBottom: "2px",
      transition: "all 0.2s",
    };
    if (item.disabled) {
      return { ...base, color: item.premium ? "#6D4AFF" : "var(--text-muted)", opacity: 0.5, border: "1px solid transparent" };
    }
    if (active) {
      return {
        ...base,
        background: "rgba(212,170,0,0.08)",
        color: "var(--gold)",
        border: "1px solid rgba(212,170,0,0.18)",
      };
    }
    return { ...base, color: "var(--text-muted)", border: "1px solid transparent" };
  };

  const renderSidebar = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid #10131C", flexShrink: 0, display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", background: "#080A10", border: "1px solid #1C2232", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <img src={logoImg} alt="FH" style={{ width: "30px", height: "30px", objectFit: "contain" }} />
        </div>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "3px", color: "#E8DDB0", lineHeight: 1 }}>
            FULLHEAD
          </div>
          <div style={{ fontSize: "8px", letterSpacing: "4px", color: "#3A4060", marginTop: "3px" }}>
            PANEL · FREE FIRE
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: "16px 12px 6px", flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "var(--text-faint)", textTransform: "uppercase", padding: "0 8px", marginBottom: "8px", fontWeight: 600 }}>
          Navegación
        </div>
        {nav.map((item) => {
          const active = pathname === item.to;
          return item.disabled ? (
            <div key={item.to} style={getNavItemStyle(item)}>
              <span style={{ width: 16, height: 16, flexShrink: 0, display: "inline-flex" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ) : (
            <Link
              key={item.to}
              to={item.to}
              style={getNavItemStyle(item)}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "var(--surface2)";
                  e.currentTarget.style.color = "var(--text-strong)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-muted)";
                }
              }}
            >
              {active && (
                <span style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: "2px", background: "var(--gold)", borderRadius: "2px" }} />
              )}
              <span style={{ width: 16, height: 16, flexShrink: 0, display: "inline-flex" }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 12px", borderTop: "1px solid #10131C", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "#0D1018", border: "1px solid #1A2038", borderRadius: "10px", marginBottom: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "#D4AA00", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 700, color: "#080A0E", flexShrink: 0 }}>
            {userInitial}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#6070A0", letterSpacing: "0.3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
            <div style={{ fontSize: "9px", color: "#3A4060", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "1px" }}>ACTIVO</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "9px", background: "transparent", border: "1px solid #1A2038", borderRadius: "8px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(229,83,83,0.4)"; e.currentTarget.style.color = "#E55353"; e.currentTarget.style.background = "rgba(229,83,83,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1A2038"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar Sesión
        </button>
        <div style={{ textAlign: "center", fontSize: "9px", color: "#1E2235", letterSpacing: "2px", marginTop: "10px" }}>v 1.0</div>
      </div>
    </div>
  );

  return (
    <div className="layout-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--black)" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 30 }} onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      {mobileOpen && (
        <aside style={{ position: "fixed", inset: "0 auto 0 0", zIndex: 40, width: "240px", background: "#09090F", borderRight: "1px solid var(--border)", overflowY: "auto", paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {renderSidebar()}
        </aside>
      )}

      {/* Desktop sidebar */}
      <aside className="layout-sidebar-desktop">{renderSidebar()}</aside>

      {/* Main content */}
      <div className="layout-content">
        {/* Mobile header */}
        <header className="layout-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "env(safe-area-inset-top, 0px) 14px 0 14px", minHeight: "calc(56px + env(safe-area-inset-top, 0px))", height: "calc(56px + env(safe-area-inset-top, 0px))", background: "#09090F", borderBottom: "1px solid #10131C", position: "sticky", top: "0", zIndex: 20, gap: "12px" }}>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: "8px", color: "var(--text-muted)", cursor: "pointer", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", overflow: "hidden", background: "#080A10", border: "1px solid #1C2232", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src={logoImg} alt="FH" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "3px", color: "#E8DDB0", lineHeight: 1 }}>
              FULLHEAD
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", border: "1px solid #1A2038", background: "#0D1018", fontSize: "9px", fontWeight: 600, color: "#3A4060", letterSpacing: "1px", flexShrink: 0 }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22D87A" }} />
            EN LÍNEA
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
