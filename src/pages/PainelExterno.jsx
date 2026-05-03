import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── ESTILOS GLOBAIS ────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&family=Bebas+Neue&display=swap');

  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes blink {
    0%,100% { opacity: 1; } 50% { opacity: 0; }
  }
  @keyframes pulse-gold {
    0%,100% { box-shadow: 0 0 0 0 rgba(212,160,23,0.4); }
    50% { box-shadow: 0 0 0 8px rgba(212,160,23,0); }
  }
  @keyframes pulse-green {
    0%,100% { box-shadow: 0 0 0 0 rgba(30,140,74,0.5); }
    50% { box-shadow: 0 0 0 6px rgba(30,140,74,0); }
  }
  @keyframes glow-in {
    from { opacity:0; transform:translateY(10px); }
    to { opacity:1; transform:translateY(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes inject-scan {
    0% { left: -100%; }
    100% { left: 200%; }
  }
  @keyframes flicker {
    0%,95%,100% { opacity:1; }
    96% { opacity:0.4; }
    98% { opacity:1; }
    99% { opacity:0.6; }
  }
  @keyframes slide-up {
    from { transform:translateY(16px); opacity:0; }
    to { transform:translateY(0); opacity:1; }
  }
  @keyframes row-in {
    from { opacity:0; transform:translateX(-8px); }
    to { opacity:1; transform:translateX(0); }
  }
  .pe-row { animation: row-in 0.3s ease both; }
  .pe-section { animation: glow-in 0.4s ease both; }
  .console-line { animation: glow-in 0.2s ease both; }
`;

const TRICK_FUNCIONES = ["Full HS", "Activar Asistencia", "Sin Retroceso"];
const AUXILIO_FUNCIONES = ["Puntería Automática", "Optimizar Sensi", "Mira Suave"];
const SEGURIDAD_FUNCIONES = ["100% Antiban"];

const FUNC_DESCRIPTIONS = {
  "Full HS": "Modo headshot calibrado para tu sensi",
  "Activar Asistencia": "Asistencia de puntería experimental",
  "Sin Retroceso": "Estabilización de retroceso de arma",
  "Puntería Automática": "Ajuste automático de eje de mira",
  "Optimizar Sensi": "Optimización dinámica de sensibilidad",
  "Mira Suave": "Suavizado de movimiento de cámara",
  "100% Antiban": "Modo protección activa habilitado",
};

// ── TOGGLE PREMIUM ─────────────────────────────────────
function Toggle({ active, onToggle, color = "#D4A017" }) {
  return (
    <div onClick={onToggle} style={{
      width: "48px", height: "26px",
      borderRadius: "13px",
      background: active
        ? `linear-gradient(90deg, ${color}88, ${color})`
        : "rgba(255,255,255,0.05)",
      border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
      cursor: "pointer",
      position: "relative",
      transition: "all 0.3s cubic-bezier(.34,1.56,.64,1)",
      flexShrink: 0,
      boxShadow: active ? `0 0 12px ${color}55` : "none",
    }}>
      <div style={{
        position: "absolute",
        top: "4px",
        left: active ? "24px" : "4px",
        width: "16px", height: "16px",
        borderRadius: "50%",
        background: active ? "#000" : "rgba(255,255,255,0.3)",
        transition: "left 0.3s cubic-bezier(.34,1.56,.64,1)",
        boxShadow: active ? `0 0 8px ${color}` : "none",
      }}/>
    </div>
  );
}

// ── SECTION BLOCK ──────────────────────────────────────
function SectionBlock({ title, icon, color, borderColor, bgColor, children, delay = "0s" }) {
  return (
    <div className="pe-section" style={{
      animationDelay: delay,
      background: `linear-gradient(135deg, ${bgColor} 0%, rgba(10,10,10,0) 60%)`,
      border: `1px solid ${borderColor}`,
      borderRadius: "12px",
      overflow: "hidden",
      marginBottom: "12px",
      position: "relative",
    }}>
      {/* Acento lateral */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: "3px",
        background: `linear-gradient(to bottom, ${color}, ${color}44)`,
      }}/>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "10px 14px 10px 18px",
        borderBottom: `1px solid ${borderColor}`,
        background: `${bgColor}`,
      }}>
        <span style={{ fontSize: "14px" }}>{icon}</span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "11px",
          letterSpacing: "3px",
          color,
          textTransform: "uppercase",
        }}>{title}</span>
        <div style={{ flex: 1 }}/>
        <div style={{
          width: "6px", height: "6px",
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
          animation: "pulse-gold 2s infinite",
        }}/>
      </div>

      <div style={{ padding: "4px 14px 4px 18px" }}>
        {children}
      </div>
    </div>
  );
}

// ── FUNÇÃO ROW ─────────────────────────────────────────
function FuncRow({ label, active, onToggle, color, delay }) {
  return (
    <div className="pe-row" style={{
      animationDelay: delay,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "11px 0",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      gap: "12px",
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "15px",
          fontWeight: 700,
          color: active ? "var(--text)" : "rgba(232,224,204,0.5)",
          letterSpacing: "0.5px",
          transition: "color 0.3s",
          marginBottom: "2px",
        }}>{label}</div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px",
          color: active ? color : "rgba(255,255,255,0.2)",
          letterSpacing: "1px",
          transition: "color 0.3s",
        }}>
          {active ? `● ${FUNC_DESCRIPTIONS[label]}` : "○ INACTIVO"}
        </div>
      </div>
      <Toggle active={active} onToggle={onToggle} color={color}/>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ───────────────────────────────
export default function PainelExterno() {
  const navigate = useNavigate();
  const [trickFuncoes, setTrickFuncoes] = useState(Object.fromEntries(TRICK_FUNCIONES.map(k => [k, false])));
  const [auxilioFuncoes, setAuxilioFuncoes] = useState(Object.fromEntries(AUXILIO_FUNCIONES.map(k => [k, false])));
  const [seguridad, setSeguridad] = useState(Object.fromEntries(SEGURIDAD_FUNCIONES.map(k => [k, false])));
  const [miraAjuste, setMiraAjuste] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [consoleLog, setConsoleLog] = useState([]);
  const [toast, setToast] = useState(null);
  const [uptime, setUptime] = useState(0);
  const consoleRef = useRef(null);

  // Uptime counter
  useEffect(() => {
    const t = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmtUptime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2,"0");
    const ss = (s % 60).toString().padStart(2,"0");
    return `${m}:${ss}`;
  };

  const activeCount = [
    ...Object.values(trickFuncoes),
    ...Object.values(auxilioFuncoes),
    ...Object.values(seguridad),
  ].filter(Boolean).length;

  const addLog = (msg, type = "info") => {
    const ts = new Date().toLocaleTimeString("es", { hour:"2-digit", minute:"2-digit", second:"2-digit" });
    setConsoleLog(prev => [{ ts, msg, type }, ...prev].slice(0, 8));
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const toggle = (setter, getter, key, color) => {
    const next = !getter[key];
    setter(prev => ({ ...prev, [key]: next }));
    addLog(`${next ? "ENABLE" : "DISABLE"} :: ${key.toUpperCase()}`, next ? "success" : "warn");
    showToast(`${key}: ${next ? "Activado ✓" : "Desactivado"}`, next ? "success" : "info");
  };

  const handleInject = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    addLog("► INIT INJECTION SEQUENCE...", "system");
    const steps = [
      { msg: "Verificando entorno del dispositivo...", type: "info" },
      { msg: "Cargando módulos enc: 1sI+dL3QlK2nSMXx", type: "info" },
      { msg: "Procesando tokens de acceso...", type: "info" },
      { msg: "Aplicando configuraciones activas...", type: "info" },
      { msg: "✓ INYECCIÓN COMPLETADA CON ÉXITO", type: "success" },
    ];
    for (const s of steps) {
      await new Promise(r => setTimeout(r, 550));
      addLog(s.msg, s.type);
    }
    showToast("✓ Funciones aplicadas exitosamente", "success");
    setIsProcessing(false);
  };

  const logColors = { success: "#1E8C4A", warn: "#D4A017", info: "#4A8AAA", system: "#8E44AD" };

  return (
    <div style={{
      width: "100%", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      background: "#060608",
      fontFamily: "'Rajdhani', sans-serif",
      color: "var(--text)",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{STYLES}</style>

      {/* BG Grid */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(212,160,23,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(212,160,23,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
        zIndex: 0,
      }}/>

      {/* Scanline effect */}
      <div style={{
        position: "fixed", inset: 0,
        background: "linear-gradient(transparent 50%, rgba(0,0,0,0.03) 50%)",
        backgroundSize: "100% 4px",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.5,
      }}/>

      {/* Glow top */}
      <div style={{
        position: "fixed", top: -200, left: "50%",
        transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse, rgba(212,160,23,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }}/>

      {/* ── HEADER ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(6,6,8,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(212,160,23,0.15)",
        padding: "0 16px",
        display: "flex", alignItems: "center", gap: "12px",
        height: "calc(56px + env(safe-area-inset-top,0px))",
        paddingTop: "env(safe-area-inset-top,0px)",
      }}>
        {/* Linha dourada topo */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, transparent, #D4A017, transparent)",
        }}/>

        <button onClick={() => navigate("/")} style={{
          display:"flex",alignItems:"center",justifyContent:"center",
          width:"34px",height:"34px",
          background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:"6px",cursor:"pointer",
          color:"rgba(255,255,255,0.4)",flexShrink:0,
          transition:"all 0.2s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(212,160,23,0.4)";e.currentTarget.style.color="#D4A017";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.color="rgba(255,255,255,0.4)";}}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
            <div style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"20px",letterSpacing:"4px",
              color:"#D4A017",lineHeight:1,
              animation:"flicker 8s infinite",
            }}>Panel Externo</div>
            <div style={{
              fontSize:"9px",fontFamily:"'Share Tech Mono',monospace",
              color:"rgba(212,160,23,0.4)",letterSpacing:"2px",
              border:"1px solid rgba(212,160,23,0.2)",
              padding:"2px 6px",borderRadius:"3px",
            }}>BETA</div>
          </div>
          <div style={{
            fontFamily:"'Share Tech Mono',monospace",
            fontSize:"9px",color:"rgba(255,255,255,0.2)",
            letterSpacing:"2px",marginTop:"1px",
          }}>
            FREE FIRE · MÓDULO AVANZADO · UP {fmtUptime(uptime)}
          </div>
        </div>

        {/* Badge activos */}
        <div style={{
          display:"flex",alignItems:"center",gap:"6px",
          padding:"5px 12px",
          background: activeCount > 0 ? "rgba(212,160,23,0.08)" : "rgba(255,255,255,0.03)",
          border:`1px solid ${activeCount > 0 ? "rgba(212,160,23,0.3)" : "rgba(255,255,255,0.07)"}`,
          borderRadius:"20px",
          fontFamily:"'Share Tech Mono',monospace",
          fontSize:"11px",
          color: activeCount > 0 ? "#D4A017" : "rgba(255,255,255,0.3)",
          transition:"all 0.3s",
          boxShadow: activeCount > 0 ? "0 0 16px rgba(212,160,23,0.15)" : "none",
        }}>
          <div style={{
            width:"6px",height:"6px",borderRadius:"50%",
            background: activeCount > 0 ? "#D4A017" : "rgba(255,255,255,0.2)",
            boxShadow: activeCount > 0 ? "0 0 8px #D4A017" : "none",
            animation: activeCount > 0 ? "pulse-gold 1.5s infinite" : "none",
          }}/>
          {activeCount} ACTIVO{activeCount !== 1 ? "S" : ""}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 110px", position:"relative", zIndex:1 }}>

        {/* ⚠️ AVISO */}
        <div className="pe-section" style={{
          animationDelay:"0s",
          display:"flex",alignItems:"flex-start",gap:"12px",
          padding:"14px 16px",
          background:"linear-gradient(135deg,rgba(200,100,0,0.08),rgba(192,57,43,0.05))",
          border:"1px solid rgba(200,100,0,0.3)",
          borderRadius:"10px",
          marginBottom:"14px",
          position:"relative",
          overflow:"hidden",
        }}>
          <div style={{ position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"linear-gradient(to bottom,#E07020,#C0392B44)" }}/>
          <div style={{ fontSize:"16px",flexShrink:0,marginLeft:"4px" }}>⚠️</div>
          <div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"10px",letterSpacing:"2px",color:"#E07020",marginBottom:"5px",textTransform:"uppercase" }}>
              Aviso Importante · Módulo Beta
            </div>
            <div style={{ fontSize:"12px",color:"rgba(232,224,204,0.6)",lineHeight:1.7 }}>
              Esta función del panel aún está en desarrollo. La ofrecemos como un extra, pero <strong style={{color:"rgba(232,224,204,0.85)"}}>no significa que la mira suba automáticamente</strong>. Debido a las nuevas restricciones de Garena, el funcionamiento puede variar según el dispositivo.
            </div>
          </div>
        </div>

        {/* STATUS BAR */}
        <div className="pe-section" style={{
          animationDelay:"0.05s",
          display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px",
          marginBottom:"14px",
        }}>
          {[
            { label:"Estado", value:"EN LÍNEA", color:"#1E8C4A", glow:true },
            { label:"Módulos", value:"4 / 4", color:"#D4A017", glow:false },
            { label:"Mira", value:`${miraAjuste}%`, color:"#1A6FA8", glow:false },
          ].map((s,i) => (
            <div key={s.label} style={{
              background:"rgba(255,255,255,0.02)",
              border:`1px solid ${s.glow?"rgba(30,140,74,0.3)":"rgba(255,255,255,0.06)"}`,
              borderRadius:"10px",
              padding:"12px 10px",
              textAlign:"center",
              position:"relative",
              overflow:"hidden",
              boxShadow: s.glow ? "0 0 20px rgba(30,140,74,0.08)" : "none",
            }}>
              {s.glow && <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(30,140,74,0.08),transparent 70%)",pointerEvents:"none" }}/>}
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"9px",letterSpacing:"2px",color:"rgba(255,255,255,0.25)",textTransform:"uppercase",marginBottom:"6px" }}>
                {s.label}
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",color:s.color,letterSpacing:"2px",lineHeight:1 }}>
                {s.value}
              </div>
              {s.glow && (
                <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",marginTop:"4px" }}>
                  <div style={{ width:"5px",height:"5px",borderRadius:"50%",background:"#1E8C4A",boxShadow:"0 0 6px #1E8C4A",animation:"pulse-green 1.5s infinite" }}/>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── TRICK ── */}
        <SectionBlock
          title="Funciones de Trucos"
          icon="⚡"
          color="#D4A017"
          borderColor="rgba(212,160,23,0.2)"
          bgColor="rgba(212,160,23,0.04)"
          delay="0.1s"
        >
          {TRICK_FUNCIONES.map((k, i) => (
            <FuncRow
              key={k} label={k}
              active={trickFuncoes[k]}
              onToggle={() => toggle(setTrickFuncoes, trickFuncoes, k, "#D4A017")}
              color="#D4A017"
              delay={`${0.1 + i * 0.05}s`}
            />
          ))}
        </SectionBlock>

        {/* ── AUXILIO ── */}
        <SectionBlock
          title="Funciones de Auxilio"
          icon="🎯"
          color="#1A6FA8"
          borderColor="rgba(26,111,168,0.2)"
          bgColor="rgba(26,111,168,0.04)"
          delay="0.2s"
        >
          {AUXILIO_FUNCIONES.map((k, i) => (
            <FuncRow
              key={k} label={k}
              active={auxilioFuncoes[k]}
              onToggle={() => toggle(setAuxilioFuncoes, auxilioFuncoes, k, "#1A6FA8")}
              color="#1A6FA8"
              delay={`${0.2 + i * 0.05}s`}
            />
          ))}
        </SectionBlock>

        {/* ── SEGURIDAD ── */}
        <SectionBlock
          title="Función de Seguridad"
          icon="🛡️"
          color="#1E8C4A"
          borderColor="rgba(30,140,74,0.2)"
          bgColor="rgba(30,140,74,0.04)"
          delay="0.3s"
        >
          {SEGURIDAD_FUNCIONES.map((k, i) => (
            <FuncRow
              key={k} label={k}
              active={seguridad[k]}
              onToggle={() => toggle(setSeguridad, seguridad, k, "#1E8C4A")}
              color="#1E8C4A"
              delay={`${0.3 + i * 0.05}s`}
            />
          ))}
        </SectionBlock>

        {/* ── SLIDER MIRA ── */}
        <div className="pe-section" style={{
          animationDelay:"0.35s",
          background:"rgba(255,255,255,0.02)",
          border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:"12px",
          padding:"14px 16px",
          marginBottom:"12px",
        }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px" }}>
            <div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"10px",letterSpacing:"3px",color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginBottom:"2px" }}>
                Ajuste de Mira
              </div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:"12px",color:"rgba(255,255,255,0.3)" }}>
                Calibración de eje vertical
              </div>
            </div>
            <div style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"28px",letterSpacing:"2px",
              color:"#D4A017",lineHeight:1,
              textShadow:"0 0 20px rgba(212,160,23,0.5)",
            }}>
              {miraAjuste}<span style={{ fontSize:"16px" }}>%</span>
            </div>
          </div>

          {/* Slider */}
          <div style={{ position:"relative",height:"28px",display:"flex",alignItems:"center" }}>
            {/* Track bg */}
            <div style={{ position:"absolute",left:0,right:0,height:"3px",background:"rgba(255,255,255,0.06)",borderRadius:"2px" }}/>
            {/* Track fill */}
            <div style={{ position:"absolute",left:0,height:"3px",width:`${miraAjuste}%`,background:"linear-gradient(90deg,#8A6610,#D4A017)",borderRadius:"2px",boxShadow:"0 0 8px rgba(212,160,23,0.4)",transition:"width 0.1s" }}/>
            {/* Marcas */}
            {[0,25,50,75,100].map(v => (
              <div key={v} style={{ position:"absolute",left:`${v}%`,width:"1px",height:"8px",background:"rgba(255,255,255,0.1)",bottom:"calc(50% - 4px)",transform:v===0?"none":"translateX(-50%)" }}/>
            ))}
            {/* Input */}
            <input type="range" min="0" max="100" value={miraAjuste}
              onChange={e => setMiraAjuste(Number(e.target.value))}
              style={{ position:"absolute",left:0,right:0,width:"100%",height:"28px",opacity:0,cursor:"pointer",margin:0 }}
            />
            {/* Thumb */}
            <div style={{
              position:"absolute",
              left:`calc(${miraAjuste}% - 12px)`,
              width:"24px",height:"24px",borderRadius:"50%",
              background:"linear-gradient(135deg,#8A6610,#D4A017)",
              border:"2px solid #060608",
              boxShadow:"0 0 16px rgba(212,160,23,0.6)",
              pointerEvents:"none",
              transition:"left 0.05s",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>
              <div style={{ width:"4px",height:"4px",borderRadius:"50%",background:"rgba(0,0,0,0.5)" }}/>
            </div>
          </div>

          <div style={{ display:"flex",justifyContent:"space-between",marginTop:"8px" }}>
            {["0%","25%","50%","75%","100%"].map(v => (
              <span key={v} style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"9px",color:"rgba(255,255,255,0.2)",letterSpacing:"1px" }}>{v}</span>
            ))}
          </div>
        </div>

        {/* ── CONSOLE ── */}
        <div className="pe-section" style={{
          animationDelay:"0.4s",
          background:"#040406",
          border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:"12px",
          overflow:"hidden",
          marginBottom:"8px",
        }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 14px",borderBottom:"1px solid rgba(255,255,255,0.04)",background:"rgba(255,255,255,0.02)" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
              <div style={{ display:"flex",gap:"5px" }}>
                {["#C0392B","#D4A017","#1E8C4A"].map((c,i) => (
                  <div key={i} style={{ width:"8px",height:"8px",borderRadius:"50%",background:c,opacity:0.7 }}/>
                ))}
              </div>
              <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"10px",letterSpacing:"2px",color:"rgba(255,255,255,0.2)",textTransform:"uppercase" }}>
                Consola del Sistema
              </span>
            </div>
            <button onClick={() => setConsoleLog([])} style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"9px",color:"rgba(255,255,255,0.2)",background:"none",border:"none",cursor:"pointer",letterSpacing:"1px",textTransform:"uppercase" }}>
              CLR
            </button>
          </div>
          <div ref={consoleRef} style={{ padding:"12px 14px",minHeight:"90px",fontFamily:"'Share Tech Mono',monospace",fontSize:"11px",lineHeight:1.8 }}>
            {consoleLog.length === 0 ? (
              <span style={{ color:"rgba(255,255,255,0.15)" }}>
                █ SISTEMA EN ESPERA<span style={{ animation:"blink 1s infinite",display:"inline-block" }}>_</span>
              </span>
            ) : (
              consoleLog.map((log, i) => (
                <div key={i} className="console-line" style={{ animationDelay:`${i*0.03}s`,color:logColors[log.type]||"rgba(255,255,255,0.4)" }}>
                  <span style={{ color:"rgba(255,255,255,0.2)" }}>[{log.ts}]</span>{" "}{log.msg}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ── BOTTOM BUTTONS ── */}
      <div style={{
        position:"fixed",bottom:0,left:0,right:0,zIndex:30,
        background:"rgba(6,6,8,0.97)",
        backdropFilter:"blur(12px)",
        borderTop:"1px solid rgba(212,160,23,0.1)",
        padding:"12px 14px calc(12px + env(safe-area-inset-bottom,0px))",
        display:"grid",gridTemplateColumns:"1fr auto",
        gap:"10px",
      }}>
        {/* Botão injetar */}
        <button
          onClick={handleInject}
          disabled={isProcessing}
          style={{
            display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",
            padding:"14px",borderRadius:"10px",border:"none",
            background: isProcessing
              ? "rgba(212,160,23,0.1)"
              : "linear-gradient(90deg,#8A6610,#D4A017,#F0C040,#D4A017)",
            backgroundSize:"200% auto",
            color: isProcessing ? "rgba(212,160,23,0.4)" : "#000",
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"18px",letterSpacing:"3px",
            cursor: isProcessing ? "not-allowed" : "pointer",
            transition:"all 0.3s",
            position:"relative",
            overflow:"hidden",
            boxShadow: isProcessing ? "none" : "0 4px 24px rgba(212,160,23,0.3)",
          }}
        >
          {/* Scan effect */}
          {!isProcessing && (
            <div style={{
              position:"absolute",top:0,bottom:0,width:"60px",
              background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)",
              animation:"inject-scan 2s linear infinite",
              pointerEvents:"none",
            }}/>
          )}

          {isProcessing ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation:"spin 0.8s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              PROCESANDO...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              INYECTAR
            </>
          )}
        </button>

        {/* Botão voltar */}
        <button
          onClick={() => navigate("/")}
          style={{
            display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",
            padding:"14px 20px",borderRadius:"10px",
            background:"rgba(255,255,255,0.03)",
            border:"1px solid rgba(255,255,255,0.07)",
            color:"rgba(255,255,255,0.3)",
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"16px",letterSpacing:"2px",
            cursor:"pointer",
            transition:"all 0.2s",
            whiteSpace:"nowrap",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(212,160,23,0.3)";e.currentTarget.style.color="#D4A017";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.color="rgba(255,255,255,0.3)";}}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          VOLVER
        </button>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position:"fixed",
          bottom:"90px",left:"14px",right:"14px",
          padding:"12px 16px",
          borderRadius:"10px",
          background: toast.type==="success"
            ? "linear-gradient(135deg,rgba(15,70,35,0.98),rgba(20,100,50,0.98))"
            : "linear-gradient(135deg,rgba(15,50,80,0.98),rgba(20,80,120,0.98))",
          border:`1px solid ${toast.type==="success"?"rgba(30,140,74,0.5)":"rgba(26,111,168,0.5)"}`,
          display:"flex",alignItems:"center",gap:"10px",
          fontSize:"13px",fontWeight:600,
          color:"#fff",
          zIndex:50,
          animation:"slide-up 0.25s cubic-bezier(.34,1.56,.64,1)",
          boxShadow:`0 8px 32px ${toast.type==="success"?"rgba(30,140,74,0.3)":"rgba(26,111,168,0.3)"}`,
          fontFamily:"'Rajdhani',sans-serif",
          letterSpacing:"0.5px",
        }}>
          <div style={{ width:"8px",height:"8px",borderRadius:"50%",background:toast.type==="success"?"#1E8C4A":"#1A6FA8",boxShadow:`0 0 8px ${toast.type==="success"?"#1E8C4A":"#1A6FA8"}`,flexShrink:0 }}/>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
