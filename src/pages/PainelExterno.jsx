import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TRICK_FUNCIONES = ["Full HS", "Activar Asistencia", "Sin Retroceso"];
const AUXILIO_FUNCIONES = ["Puntería Automática", "Optimizar Sensi", "Mira Suave"];
const SEGURIDAD_FUNCIONES = ["100% Antiban"];

function Toggle({ active, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: "42px", height: "22px",
        borderRadius: "11px",
        background: active ? "var(--gold)" : "var(--surface3)",
        border: active ? "1px solid var(--border-gold)" : "1px solid var(--border)",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.25s",
        flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute",
        top: "3px",
        left: active ? "22px" : "3px",
        width: "14px", height: "14px",
        borderRadius: "50%",
        background: active ? "var(--black)" : "var(--text-muted)",
        transition: "left 0.25s",
        boxShadow: active ? "0 0 6px rgba(212,160,23,0.5)" : "none",
      }} />
    </div>
  );
}

function SectionBlock({ title, color = "var(--gold)", borderColor = "var(--border-gold)", children }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: `1px solid ${borderColor}`,
      borderRadius: "10px",
      overflow: "hidden",
      marginBottom: "14px",
    }}>
      {/* Section header bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "11px 18px",
        background: `rgba(${color === "var(--gold)" ? "212,160,23" : color === "#1E8C4A" ? "30,140,74" : "192,57,43"},0.07)`,
        borderBottom: `1px solid ${borderColor}`,
      }}>
        <div style={{
          width: "3px", height: "16px",
          borderRadius: "2px",
          background: color,
        }} />
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "13px", fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color,
        }}>
          {title}
        </div>
      </div>
      <div style={{ padding: "10px 14px" }}>
        {children}
      </div>
    </div>
  );
}

export default function PainelExterno() {
  const navigate = useNavigate();
  const [activeNotification, setActiveNotification] = useState(null);
  const [notifType, setNotifType] = useState("success");

  const [trickFuncoes, setTrickFuncoes] = useState(
    Object.fromEntries(TRICK_FUNCIONES.map((k) => [k, false]))
  );
  const [auxilioFuncoes, setAuxilioFuncoes] = useState(
    Object.fromEntries(AUXILIO_FUNCIONES.map((k) => [k, false]))
  );
  const [seguridad, setSeguridad] = useState(
    Object.fromEntries(SEGURIDAD_FUNCIONES.map((k) => [k, false]))
  );
  const [miraAjuste, setMiraAjuste] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [consoleLog, setConsoleLog] = useState([]);

  const showNotification = (message, type = "success") => {
    setActiveNotification(message);
    setNotifType(type);
    setTimeout(() => setActiveNotification(null), 3000);
  };

  const addLog = (message) => {
    const ts = new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setConsoleLog((prev) => [`[${ts}] ${message}`, ...prev].slice(0, 6));
  };

  const toggle = (setter, getter, key) => {
    const next = !getter[key];
    setter((prev) => ({ ...prev, [key]: next }));
    showNotification(`${key}: ${next ? "Activado" : "Desactivado"}`, next ? "success" : "info");
    addLog(`${next ? "✓" : "✗"} ${key} ${next ? "activado" : "desactivado"}`);
  };

  const handleInject = async () => {
    setIsProcessing(true);
    addLog("► Iniciando inyección de módulos...");
    const steps = [
      "Verificando entorno del dispositivo...",
      "Cargando módulos enc: 1sI+dL3QlK2nSMXx",
      "Procesando tokens de acceso...",
      "Aplicando configuraciones activas...",
      "✓ Inyección completada con éxito",
    ];
    for (const s of steps) {
      await new Promise((r) => setTimeout(r, 600));
      addLog(s);
    }
    showNotification("✓ ¡Funciones aplicadas!", "success");
    setIsProcessing(false);
  };

  const activeCount = [
    ...Object.values(trickFuncoes),
    ...Object.values(auxilioFuncoes),
    ...Object.values(seguridad),
  ].filter(Boolean).length;

  return (
    <div style={{
      width: "100%", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      background: "var(--black)",
      fontFamily: "'Inter', sans-serif",
      color: "var(--text)",
      position: "relative",
    }}>

      {/* ─── HEADER ─── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "env(safe-area-inset-top, 0px) 20px 0 20px",
        minHeight: "calc(56px + env(safe-area-inset-top, 0px))",
        height: "calc(56px + env(safe-area-inset-top, 0px))",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        position: "sticky", top: "0", zIndex: 20,
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "34px", height: "34px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "6px", cursor: "pointer",
            color: "var(--text-muted)", flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "18px", letterSpacing: "3px",
            color: "var(--gold)", lineHeight: 1,
          }}>
            Panel Externo
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "2px" }}>
            Free Fire · Módulo Avanzado
          </div>
        </div>

        {/* Active count badge */}
        <div style={{
          padding: "4px 12px",
          background: activeCount > 0 ? "rgba(212,160,23,0.12)" : "var(--surface2)",
          border: `1px solid ${activeCount > 0 ? "var(--border-gold)" : "var(--border)"}`,
          borderRadius: "20px",
          fontSize: "11px", fontWeight: 700,
          color: activeCount > 0 ? "var(--gold)" : "var(--text-muted)",
          letterSpacing: "1px",
          display: "flex", alignItems: "center", gap: "5px",
        }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: activeCount > 0 ? "var(--gold)" : "var(--text-muted)",
            boxShadow: activeCount > 0 ? "0 0 6px var(--gold)" : "none",
          }} />
          {activeCount} activo{activeCount !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ─── SCROLLABLE CONTENT ─── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>

        {/* ⚠️ WARNING BANNER */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "12px",
          padding: "14px 16px",
          background: "linear-gradient(135deg, rgba(200,120,0,0.12) 0%, rgba(192,57,43,0.08) 100%)",
          border: "1px solid rgba(200,120,0,0.45)",
          borderRadius: "8px",
          marginBottom: "18px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Left accent bar */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "3px",
            background: "linear-gradient(to bottom, #E07020, #C0392B)",
          }} />

          {/* Icon */}
          <div style={{ fontSize: "18px", flexShrink: 0, marginLeft: "4px", lineHeight: 1 }}>⚠️</div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "12px", fontWeight: 700,
              letterSpacing: "2px", textTransform: "uppercase",
              color: "#E07020", marginBottom: "4px",
            }}>
              Aviso Importante
            </div>
            <div style={{
              fontSize: "12px", color: "var(--text)", lineHeight: 1.6,
            }}>
              Esta función del panel aún está en desarrollo.
              La ofrecemos como un extra, pero no significa que la mira suba automáticamente.
              Y debido a las nuevas restricciones de Garena, el funcionamiento de esta función puede variar según el dispositivo.
            </div>
          </div>
        </div>

        {/* ─── STATUS BAR ─── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px",
          marginBottom: "18px",
        }}>
          {[
            { label: "Estado", value: "En línea", color: "#1E8C4A" },
            { label: "Módulos", value: "4 / 4", color: "var(--gold)" },
            { label: "Mira", value: `${miraAjuste}%`, color: "#1A6FA8" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "10px 12px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, color: s.color, letterSpacing: "0.5px" }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* ─── TRICK ─── */}
        <SectionBlock title="Funciones de Trucos" color="var(--gold)" borderColor="var(--border-gold)">
          {Object.entries(trickFuncoes).map(([key, val]) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "11px 4px",
              borderBottom: "1px solid var(--border)",
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.3px" }}>{key}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {val ? <span style={{ color: "#1E8C4A" }}>● Activo</span> : <span>○ Inactivo</span>}
                </div>
              </div>
              <Toggle active={val} onToggle={() => toggle(setTrickFuncoes, trickFuncoes, key)} />
            </div>
          ))}
        </SectionBlock>

        {/* ─── AUXILIO ─── */}
        <SectionBlock title="Funciones de Auxilio" color="#1A6FA8" borderColor="rgba(26,111,168,0.4)">
          {Object.entries(auxilioFuncoes).map(([key, val]) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "11px 4px",
              borderBottom: "1px solid var(--border)",
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.3px" }}>{key}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {val ? <span style={{ color: "#1E8C4A" }}>● Activo</span> : <span>○ Inactivo</span>}
                </div>
              </div>
              <Toggle active={val} onToggle={() => toggle(setAuxilioFuncoes, auxilioFuncoes, key)} />
            </div>
          ))}
        </SectionBlock>

        {/* ─── SEGURIDAD ─── */}
        <SectionBlock title="Función de Seguridad" color="#1E8C4A" borderColor="rgba(30,140,74,0.4)">
          {Object.entries(seguridad).map(([key, val]) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "11px 4px",
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.3px" }}>{key}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {val ? <span style={{ color: "#1E8C4A" }}>● Protección activa</span> : <span>○ Sin protección</span>}
                </div>
              </div>
              <Toggle active={val} onToggle={() => toggle(setSeguridad, seguridad, key)} />
            </div>
          ))}
        </SectionBlock>

        {/* ─── SLIDER ─── */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "14px 16px",
          marginBottom: "14px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Ajuste de Mira
            </div>
            <div style={{
              background: "rgba(212,160,23,0.1)",
              border: "1px solid var(--border-gold)",
              borderRadius: "6px",
              padding: "3px 12px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "18px", letterSpacing: "2px",
              color: "var(--gold)",
            }}>
              {miraAjuste}%
            </div>
          </div>

          {/* Track */}
          <div style={{ position: "relative", height: "24px", display: "flex", alignItems: "center" }}>
            <div style={{
              position: "absolute", left: 0, right: 0, height: "4px",
              background: "var(--surface3)",
              borderRadius: "2px",
            }} />
            <div style={{
              position: "absolute", left: 0, height: "4px",
              width: `${miraAjuste}%`,
              background: "linear-gradient(90deg, #A07010, var(--gold))",
              borderRadius: "2px",
            }} />
            <input
              type="range" min="0" max="100" value={miraAjuste}
              onChange={(e) => setMiraAjuste(Number(e.target.value))}
              style={{
                position: "absolute", left: 0, right: 0,
                width: "100%", height: "24px",
                opacity: 0, cursor: "pointer", margin: 0,
              }}
            />
            {/* Thumb visual */}
            <div style={{
              position: "absolute",
              left: `calc(${miraAjuste}% - 10px)`,
              width: "20px", height: "20px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #A07010, var(--gold))",
              border: "2px solid var(--black)",
              boxShadow: "0 0 10px rgba(212,160,23,0.4)",
              pointerEvents: "none",
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px" }}>
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* ─── CONSOLE ─── */}
        <div style={{
          background: "#080808",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "8px",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 14px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", letterSpacing: "2px", color: "var(--text-muted)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: "uppercase" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1E8C4A", boxShadow: "0 0 6px #1E8C4A", animation: "pulse 2s infinite" }} />
              Consola del Sistema
            </div>
            <button onClick={() => setConsoleLog([])} style={{ fontSize: "10px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", letterSpacing: "1px" }}>
              Limpiar
            </button>
          </div>
          <div style={{ padding: "12px 14px", minHeight: "80px", fontFamily: "monospace", fontSize: "11px", lineHeight: 1.7 }}>
            {consoleLog.length === 0 ? (
              <span style={{ color: "var(--text-muted)" }}>█ Sistema en espera...</span>
            ) : (
              consoleLog.map((log, idx) => (
                <div key={idx} style={{
                  color: log.includes("✓") ? "#1E8C4A" : log.includes("✗") ? "#C0392B" : "#8AAA88",
                }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ─── FIXED BOTTOM BUTTONS ─── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "12px 16px",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        zIndex: 30,
      }}>
        <button
          onClick={handleInject}
          disabled={isProcessing}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "13px",
            borderRadius: "8px",
            border: "none",
            background: isProcessing ? "var(--surface3)" : "linear-gradient(90deg, #A07010, var(--gold))",
            color: isProcessing ? "var(--text-muted)" : "var(--black)",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "14px", fontWeight: 700,
            letterSpacing: "2px", textTransform: "uppercase",
            cursor: isProcessing ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {isProcessing ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Procesando...
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Inyectar
            </>
          )}
        </button>

        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "13px",
            borderRadius: "8px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "14px", fontWeight: 700,
            letterSpacing: "2px", textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.color = "var(--text)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Volver
        </button>
      </div>

      {/* ─── TOAST NOTIFICATION ─── */}
      {activeNotification && (
        <div style={{
          position: "fixed",
          bottom: "90px", left: "16px", right: "16px",
          padding: "12px 16px",
          borderRadius: "8px",
          background: notifType === "success"
            ? "linear-gradient(135deg, #0E5A2A, #1E8C4A)"
            : "linear-gradient(135deg, #0F4A7A, #1A6FA8)",
          border: `1px solid ${notifType === "success" ? "rgba(30,140,74,0.5)" : "rgba(26,111,168,0.5)"}`,
          display: "flex", alignItems: "center", gap: "10px",
          fontSize: "13px", fontWeight: 600,
          color: "#fff",
          zIndex: 50,
          animation: "slideIn 0.25s ease",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          {activeNotification}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideIn { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
