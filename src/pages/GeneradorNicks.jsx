import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ── MAPAS DE FUENTES UNICODE ────────────────────────────
function buildMap(upperStart, lowerStart, digitStart, upperExceptions = {}, lowerExceptions = {}) {
  const map = {};
  for (let i = 0; i < 26; i++) {
    const upperChar = String.fromCharCode(65 + i);
    const lowerChar = String.fromCharCode(97 + i);
    map[upperChar] = upperExceptions[upperChar] || String.fromCodePoint(upperStart + i);
    map[lowerChar] = lowerExceptions[lowerChar] || String.fromCodePoint(lowerStart + i);
  }
  if (digitStart !== null) {
    for (let i = 0; i < 10; i++) map[String(i)] = String.fromCodePoint(digitStart + i);
  }
  return map;
}

const FONT_BOLD = buildMap(0x1D400, 0x1D41A, 0x1D7CE);
const FONT_FULLWIDTH = buildMap(0xFF21, 0xFF41, 0xFF10);
const FONT_DOBLE = buildMap(0x1D538, 0x1D552, 0x1D7D8, {
  C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ",
});
const FONT_GOTICA = buildMap(0x1D504, 0x1D51E, null, {
  C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ",
});
const FONT_SCRIPT = buildMap(0x1D49C, 0x1D4B6, null, {
  B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ",
});
const FONT_CIRCULAR = buildMap(0x24B6, 0x24D0, null);

const SMALLCAPS = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ",
  k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "q", r: "ʀ", s: "s", t: "ᴛ",
  u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
};

function applyFont(name, map) {
  return name.split("").map((ch) => map[ch] || map[ch.toUpperCase()] || ch).join("");
}
function applyVersalitas(name) {
  return name.split("").map((ch) => SMALLCAPS[ch.toLowerCase()] || ch).join("");
}
function applyBurbuja(name) {
  return name.split("").map((ch) => {
    const idx = ch.toLowerCase().charCodeAt(0) - 97;
    return idx >= 0 && idx < 26 ? String.fromCodePoint(0x249C + idx) : ch;
  }).join("");
}
function applyTachado(name) {
  return name.split("").map((ch) => ch + "\u0336").join("");
}

// ── CATEGORIAS ──────────────────────────────────────────
function buildVariants(name) {
  const n = name.trim() || "Player";

  const simbolos = [
    { label: "Sniper", text: `▄︻デ══━一 ${n} 一━══デ︻▄` },
    { label: "Imperial", text: `『${n}』` },
    { label: "Corchetes", text: `【${n}】` },
    { label: "Estrella", text: `★彡 ${n} 彡★` },
    { label: "Doble Estrella", text: `☆ ${n} ☆` },
    { label: "Diamante", text: `❖ ${n} ❖` },
    { label: "Árabe Gamer", text: `๖ۣۜ${n}` },
    { label: "Flor", text: `✿ ${n} ✿` },
    { label: "Espadas", text: `⚔ ${n} ⚔` },
    { label: "Om Gamer", text: `☬${n}☬` },
    { label: "Comillas Pro", text: `„${n}”` },
    { label: "Ying Yang", text: `☯ ${n} ☯` },
    { label: "Ojos", text: `×͜× ${n} ×͜×` },
    { label: "God Mode", text: `『ᴳᵒᵈ』${n}` },
    { label: "Relámpago", text: `⚡ ${n} ⚡` },
    { label: "Corona", text: `♛${n}♛` },
    { label: "Calavera", text: `☠${n}☠` },
    { label: "Fuego", text: `🔥${n}🔥` },
    { label: "Guadaña", text: `⚔${n}⚔` },
    { label: "Diamante Sólido", text: `◈${n}◈` },
    { label: "Rayo", text: `⚡${n}⚡` },
    { label: "Vaporwave", text: `꧁${n}꧂` },
  ];

  const fuentes = [
    { label: "Negrita Elegante", text: applyFont(n, FONT_BOLD) },
    { label: "Ancho Completo", text: applyFont(n, FONT_FULLWIDTH) },
    { label: "Doble Trazo", text: applyFont(n, FONT_DOBLE) },
    { label: "Gótica", text: applyFont(n, FONT_GOTICA) },
    { label: "Versalitas", text: applyVersalitas(n) },
    { label: "Cursiva Pro", text: applyFont(n, FONT_SCRIPT) },
    { label: "Burbuja", text: applyBurbuja(n) },
    { label: "Tachado", text: applyTachado(n) },
    { label: "Circular", text: applyFont(n, FONT_CIRCULAR) },
  ];

  const clan = [
    { label: "Marca Registrada", text: `${n}™` },
    { label: "Tag Competitivo", text: `[GTz] ${n}` },
    { label: "VIP", text: `[VIP] ${n}` },
    { label: "Minimalista", text: `• ${n} •` },
    { label: "Guiones", text: `- ${n} -` },
    { label: "Dios del FF", text: `ᴳᵒᴰ${n}FF` },
    { label: "Pro Player", text: `${n}™FF` },
    { label: "Tag Clan", text: `【FH】${n}` },
    { label: "Escudo", text: `卂${n}卂` },
    { label: "Elite Bracket", text: `「${n}」` },
    { label: "Team Style", text: `{${n}}` },
  ];

  const emojis = [
    { label: "Fuego", text: `🔥 ${n} 🔥` },
    { label: "Calavera", text: `💀 ${n} 💀` },
    { label: "Corona", text: `👑 ${n} 👑` },
    { label: "Rayo", text: `⚡ ${n} ⚡` },
    { label: "Diana", text: `🎯 ${n} 🎯` },
    { label: "Demonio", text: `😈 ${n} 😈` },
    { label: "Sangre", text: `血${n}血` },
    { label: "Ojo de Dragón", text: `ᴿᴬW${n}` },
    { label: "Ninja", text: `忍${n}忍` },
    { label: "God Mode", text: `ᴳᵒᵈ${n}` },
  ];

  const pro = [
    { label: "Firma Elite", text: `⚡${n}⚡` },
    { label: "Firma Elite Doble", text: `乂⚡${n}⚡乂` },
    { label: "Firma Real", text: `⚡ᴾʳᵒ${n}` },
  ];

  return { simbolos, fuentes, clan, emojis, pro };
}

const CATEGORIES = [
  { key: "simbolos", label: "Símbolos Gamer", icon: "⚔️", color: "#D4A017" },
  { key: "fuentes", label: "Fuentes Especiales", icon: "🔤", color: "#1A6FA8" },
  { key: "clan", label: "Clan / Competitivo", icon: "🏆", color: "#8E44AD" },
  { key: "emojis", label: "Combos con Emojis", icon: "🔥", color: "#E67E22" },
  { key: "pro", label: "Exclusivos PRO", icon: "⚡", color: "#F0C040" },
];

const STYLES = `
  @keyframes nk-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .nk-card { animation: nk-in 0.25s ease both; }
  @keyframes nk-copied { 0% { transform:scale(1); } 50% { transform:scale(1.06); } 100% { transform:scale(1); } }
  .nk-copied-anim { animation: nk-copied 0.25s ease; }
`;

export default function GeneradorNicks() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [activeCat, setActiveCat] = useState("simbolos");
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const variants = useMemo(() => buildVariants(name), [name]);
  const activeList = useMemo(() => {
    const list = variants[activeCat];
    if (activeCat === "simbolos" && shuffleSeed > 0) {
      const arr = [...list];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants, activeCat, shuffleSeed]);

  function handleCopy(text, idx) {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1200);
  }

  function handleShare(text) {
    const msg = encodeURIComponent(`Mira mi nueva Firma PRO: ${text} 🔥 Generado en FullHead`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  return (
    <div className="module-page" style={{ overflowY: "auto", paddingBottom: "60px" }}>
      <style>{STYLES}</style>

      <div className="module-header">
        <button className="module-back-btn" onClick={() => navigate("/")} title="Volver">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <div className="module-title">Firma PRO</div>
          <div className="module-subtitle">Crea tu firma estilo pro-player con símbolos y fuentes especiales</div>
        </div>
      </div>

      <div style={{ padding: "20px 16px 20px", maxWidth: "760px", margin: "0 auto" }}>

        {/* Input */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{
            display: "block", fontFamily: "'Rajdhani', sans-serif", fontSize: "12px",
            fontWeight: 700, letterSpacing: "1px", color: "var(--gold-dim)", marginBottom: "6px",
            textTransform: "uppercase",
          }}>
            Escribe tu nombre base
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: DarkKiller"
            maxLength={16}
            className="fh-input"
            style={{
              width: "100%", fontSize: "18px", padding: "14px 16px",
              fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "1px",
            }}
          />
        </div>

        {/* Categorías */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", marginBottom: "16px", paddingBottom: "4px" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              style={{
                flexShrink: 0,
                display: "flex", alignItems: "center", gap: "6px",
                padding: "9px 14px", borderRadius: "8px",
                border: `1px solid ${activeCat === c.key ? c.color : "rgba(255,255,255,0.08)"}`,
                background: activeCat === c.key ? `${c.color}18` : "transparent",
                color: activeCat === c.key ? c.color : "var(--text-muted)",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", fontWeight: 700,
                letterSpacing: "0.3px", cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              <span>{c.icon}</span>{c.label}
            </button>
          ))}
        </div>

        <>
            {activeCat === "simbolos" && (
              <button
                onClick={() => setShuffleSeed((s) => s + 1)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px",
                  background: "none", border: "1px solid var(--border-gold)", borderRadius: "7px",
                  padding: "7px 12px", color: "var(--gold)", fontSize: "12px",
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, cursor: "pointer",
                }}
              >
                🎲 Mezclar orden
              </button>
            )}

            {/* Lista de variantes */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {activeList.map((v, idx) => (
                <div
                  key={`${activeCat}-${v.label}-${idx}`}
                  className={`nk-card${copiedIdx === idx ? " nk-copied-anim" : ""}`}
                  style={{
                    animationDelay: `${idx * 0.03}s`,
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px",
                    padding: "14px 16px", borderRadius: "10px",
                    background: activeCat === "pro" ? "rgba(240,192,64,0.04)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${activeCat === "pro" ? "rgba(240,192,64,0.2)" : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontSize: "9px", letterSpacing: "1.5px", color: "var(--text-muted)",
                      textTransform: "uppercase", marginBottom: "4px",
                    }}>
                      {v.label}
                    </div>
                    <div style={{
                      fontSize: "16px", color: "var(--text)", wordBreak: "break-word",
                      fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.3px",
                    }}>
                      {v.text}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <button
                      onClick={() => handleCopy(v.text, idx)}
                      title="Copiar"
                      style={{
                        background: copiedIdx === idx ? "rgba(30,140,74,0.15)" : "rgba(212,160,23,0.08)",
                        border: `1px solid ${copiedIdx === idx ? "rgba(30,140,74,0.4)" : "var(--border-gold)"}`,
                        borderRadius: "7px", padding: "8px 10px", cursor: "pointer",
                        color: copiedIdx === idx ? "#1E8C4A" : "var(--gold)",
                      }}
                    >
                      {copiedIdx === idx ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleShare(v.text)}
                      title="Compartir por WhatsApp"
                      style={{
                        background: "rgba(30,140,74,0.08)", border: "1px solid rgba(30,140,74,0.3)",
                        borderRadius: "7px", padding: "8px 10px", cursor: "pointer", color: "#1E8C4A",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A8.5 8.5 0 0 0 3.8 16.3L2 22l5.9-1.6a8.5 8.5 0 0 0 12.2-7.6 8.4 8.4 0 0 0-2.5-6.5zM12 19a7 7 0 0 1-3.6-1l-.3-.2-3 .8.8-2.9-.2-.3A7 7 0 1 1 12 19zm3.8-5.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1s-.6.7-.7.8-.3.2-.5.1a5.7 5.7 0 0 1-1.7-1 6.4 6.4 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.3-.4.2-.3v-.3c0-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.4a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2 4.7 4.7 0 0 0 1 2.5 10.7 10.7 0 0 0 4.1 3.6c.6.2 1 .4 1.4.5a3.3 3.3 0 0 0 1.5.1 2.5 2.5 0 0 0 1.6-1.1 1.9 1.9 0 0 0 .1-1.1c-.1-.1-.2-.2-.4-.3z"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>

        <div style={{
          marginTop: "20px", padding: "12px 16px", borderRadius: "8px",
          background: "rgba(212,160,23,0.05)", border: "1px solid rgba(212,160,23,0.15)",
          fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.6,
        }}>
          💡 Toca en <strong style={{ color: "var(--gold-dim)" }}>copiar</strong> y pega el nombre directo en Free Fire → Editar Perfil → Nombre.
        </div>

      </div>
    </div>
  );
}
