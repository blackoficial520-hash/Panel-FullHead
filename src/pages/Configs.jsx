import { useEffect, useMemo, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";

// ── TOAST ──────────────────────────────────────────────
function Toast({ visible }) {
  return (
    <div style={{
      position: "fixed",
      bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
      left: "50%",
      transform: `translateX(-50%) translateY(${visible ? "0" : "20px"})`,
      opacity: visible ? 1 : 0,
      transition: "all 0.3s ease",
      background: "linear-gradient(90deg, #A07010, var(--gold))",
      color: "#000",
      fontFamily: "'Rajdhani', sans-serif",
      fontWeight: 700,
      fontSize: "13px",
      letterSpacing: "1.5px",
      padding: "10px 24px",
      borderRadius: "99px",
      boxShadow: "0 8px 32px rgba(212,160,23,0.35)",
      zIndex: 999,
      pointerEvents: "none",
      whiteSpace: "nowrap",
    }}>
      ✓ CONFIG COPIADA
    </div>
  );
}

// ── BADGE DE GAMA ──────────────────────────────────────
function GamaBadge({ notes }) {
  const n = notes?.toLowerCase() || "";
  let label, color;
  if (n.includes("120hz")) { label = "120Hz · PRO"; color = "var(--gold)"; }
  else if (n.includes("90hz")) { label = "90Hz · MED"; color = "#1A6FA8"; }
  else if (n.includes("144hz")) { label = "144Hz · ELITE"; color = "#C0392B"; }
  else if (n.includes("ios")) { label = "iOS"; color = "#888"; }
  else { label = "60Hz · BASE"; color = "var(--text-muted)"; }

  return (
    <span style={{
      display: "inline-block",
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${color}44`,
      color,
      fontSize: "9px",
      fontWeight: 700,
      letterSpacing: "1.5px",
      padding: "2px 8px",
      borderRadius: "3px",
      textTransform: "uppercase",
    }}>
      {label}
    </span>
  );
}

// ── CONFIG ROW ─────────────────────────────────────────
function ConfigRow({ icon, label, value, highlight }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 12px",
      background: highlight ? "rgba(212,160,23,0.06)" : "var(--surface2)",
      border: `1px solid ${highlight ? "rgba(212,160,23,0.2)" : "var(--border)"}`,
      borderRadius: "6px",
      gap: "8px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px" }}>{icon}</span>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px" }}>{label}</span>
      </div>
      <span style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: "13px",
        fontWeight: 700,
        color: highlight ? "var(--gold)" : "var(--text)",
      }}>
        {value ?? "—"}
      </span>
    </div>
  );
}

// ── TIP ITEM ───────────────────────────────────────────
function TipItem({ text }) {
  const clean = text.replace(/^[•\-]\s*/, "").trim();
  if (!clean) return null;
  return (
    <div style={{
      display: "flex",
      gap: "8px",
      alignItems: "flex-start",
      fontSize: "12px",
      color: "rgba(232,224,204,0.65)",
      lineHeight: 1.5,
    }}>
      <span style={{ color: "var(--gold-dim)", flexShrink: 0, marginTop: "2px" }}>▸</span>
      <span>{clean}</span>
    </div>
  );
}

// ── CARD DE CONFIG ─────────────────────────────────────
function ConfigCard({ c, onCopy }) {
  const [expanded, setExpanded] = useState(false);
  const tips = c.tips?.split("\n").filter(Boolean) || [];

  return (
    <div className="data-card card-enter" style={{ position: "relative", overflow: "hidden" }}>
      {/* Linha topo */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent, var(--gold-dim), transparent)",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "14px" }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--gold)",
            letterSpacing: "0.5px",
            marginBottom: "6px",
          }}>
            {c.brand} {c.model}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            <GamaBadge notes={c.notes} />
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>DPI</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--text)" }}>
            {c.dpi > 0 ? c.dpi : "iOS"}
          </div>
        </div>
      </div>

      {/* Seção: Gráficos */}
      <div className="section-header-fh" style={{ marginBottom: "8px" }}>
        <span className="section-label-fh">Gráficos & FPS</span>
        <div className="section-line-fh" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
        <ConfigRow icon="🎨" label="Gráficos" value={c.graphics} />
        <ConfigRow icon="⚡" label="FPS Alto" value={c.highFps} highlight />
        <ConfigRow icon="🌑" label="Sombras" value={c.shadow} />
        <ConfigRow icon="🎭" label="Filtro" value={c.filters} />
      </div>

      {/* Seção: Botões */}
      <div className="section-header-fh" style={{ marginBottom: "8px" }}>
        <span className="section-label-fh">Botones de disparo</span>
        <div className="section-line-fh" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
        <ConfigRow icon="🎯" label="Botón disparo" value={c.fireButton} highlight />
        <ConfigRow icon="👁️" label="Botón puntería" value={c.aimButton} />
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <>
          <div className="section-header-fh" style={{ marginBottom: "8px" }}>
            <span className="section-label-fh">Consejos Pro</span>
            <div className="section-line-fh" />
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            marginBottom: "14px",
            padding: "10px 12px",
            background: "rgba(212,160,23,0.04)",
            border: "1px solid rgba(212,160,23,0.1)",
            borderRadius: "8px",
          }}>
            {(expanded ? tips : tips.slice(0, 2)).map((t, i) => (
              <TipItem key={i} text={t} />
            ))}
            {tips.length > 2 && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--gold-dim)",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: "4px 0 0",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {expanded ? "▲ Ver menos" : `▼ +${tips.length - 2} consejos`}
              </button>
            )}
          </div>
        </>
      )}

      {/* Nota */}
      {c.notes && (
        <div style={{
          display: "flex",
          gap: "8px",
          alignItems: "flex-start",
          padding: "8px 12px",
          background: "rgba(30,140,74,0.06)",
          border: "1px solid rgba(30,140,74,0.2)",
          borderRadius: "6px",
          marginBottom: "14px",
          fontSize: "11px",
          color: "rgba(232,224,204,0.6)",
          lineHeight: 1.5,
        }}>
          <span style={{ flexShrink: 0 }}>✓</span>
          <span>{c.notes}</span>
        </div>
      )}

      {/* Botão copiar */}
      <button
        className="btn-copy"
        style={{ width: "100%", justifyContent: "center", gap: "8px" }}
        onClick={() => onCopy(c)}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        COPIAR CONFIG
      </button>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ───────────────────────────────
export default function Configs() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [brand, setBrand] = useState("Todos");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(false);

  const brands = useMemo(() => {
    const set = new Set(items.map((i) => i.brand));
    return ["Todos", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return items
      .filter((i) => brand === "Todos" ? true : i.brand === brand)
      .filter((i) => {
        if (!s) return true;
        const haystack = `${i.brand} ${i.model}`.toLowerCase();
        return s.split(/\s+/).every((token) => haystack.includes(token));
      })
      .sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
  }, [items, brand, search]);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const snap = await getDocs(collection(db, "configs"));
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
        setError("Error al cargar las configuraciones.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const handleCopy = useCallback((c) => {
    const text =
      `⚙️ Config Pro — ${c.brand} ${c.model}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `DPI:            ${c.dpi > 0 ? c.dpi : "iOS"}\n` +
      `Gráficos:       ${c.graphics}\n` +
      `FPS Alto:       ${c.highFps}\n` +
      `Sombras:        ${c.shadow}\n` +
      `Filtro:         ${c.filters}\n` +
      `Btn Disparo:    ${c.fireButton}\n` +
      `Btn Puntería:   ${c.aimButton}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      (c.tips ? `Consejos:\n${c.tips}\n` : "") +
      `Panel FullHead ⚡`;
    navigator.clipboard.writeText(text);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }, []);

  return (
    <div className="module-page">
      <Toast visible={toast} />

      {/* Header */}
      <div className="module-header">
        <button className="module-back-btn" onClick={() => navigate("/")} title="Volver">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <div className="module-title">Configuraciones Pro</div>
          <div className="module-subtitle">Ajustes optimizados para tu dispositivo</div>
        </div>
      </div>

      <div style={{ padding: "20px 16px 80px" }}>

        {/* Info banner */}
        <div style={{
          background: "rgba(212,160,23,0.06)",
          border: "1px solid var(--border-gold)",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "20px",
          fontSize: "12px",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}>
          <span style={{ color: "var(--gold)", fontWeight: 700 }}>⚙️ Config Pro:</span>{" "}
          Gráficos, FPS y botones calibrados para tu celular. Aplica todo junto con tu sensibilidad FullHead para el máximo rendimiento.
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="fh-select"
            style={{ flex: "1", minWidth: "130px", maxWidth: "180px" }}
          >
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar modelo..."
            className="fh-input"
            style={{ flex: "2", minWidth: "150px" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <span className="count-tag">
            {loading ? "Cargando..." : `${filtered.length} configuración(es)`}
          </span>
        </div>

        {/* Erro */}
        {error && (
          <div style={{
            marginBottom: "16px",
            padding: "12px 16px",
            background: "rgba(192,57,43,0.1)",
            border: "1px solid rgba(192,57,43,0.4)",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#e57373",
          }}>
            {error}
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>⚙️</div>
            <div className="loading-text">Cargando configuraciones...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>📱</div>
            <div className="loading-text">No se encontró tu modelo.</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
              Busca solo la marca para ver todos los modelos
            </div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "12px",
          }}>
            {filtered.map((c, i) => (
              <div key={c.id} style={{ animationDelay: `${i * 0.04}s` }}>
                <ConfigCard c={c} onCopy={handleCopy} />
              </div>
            ))}
          </div>
        )}

        {/* Pro tip */}
        {!loading && filtered.length > 0 && (
          <div style={{
            marginTop: "32px",
            padding: "14px 16px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "11px",
            color: "var(--text-muted)",
            lineHeight: 1.7,
          }}>
            <span style={{ color: "var(--gold)", fontWeight: 700 }}>💡 Pro tip:</span>{" "}
            Aplica primero la sensibilidad del módulo Sensi, luego estas configuraciones de gráficos y botones. Cierra todas las apps antes de jugar y activa el modo rendimiento de tu celular si está disponible.
          </div>
        )}
      </div>
    </div>
  );
}
