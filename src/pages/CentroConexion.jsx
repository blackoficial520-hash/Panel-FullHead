import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────
// CENTRO DE CONEXIÓN
//  · Medidor: estima la calidad de tu red (latencia, jitter, pérdida, descarga)
//  · Guía de Optimización: checklist interactivo de pasos manuales
//  · DNS: servidores recomendados para copiar y pegar en los ajustes del celular
// Todo corre en el navegador. No toca archivos del juego.
// ─────────────────────────────────────────────────────────

const STYLES = `
  @keyframes cc-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes cc-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(212,170,0,0.35); } 50% { box-shadow:0 0 0 10px rgba(212,170,0,0); } }
  @keyframes cc-spin { to { transform: rotate(360deg); } }
  .cc-fade { animation: cc-in 0.35s ease both; }
  .cc-tab { transition: all 0.2s; }
  .cc-tab:hover { color: var(--text-strong); }
  .cc-btn { transition: all 0.2s; }
  .cc-btn:active { transform: scale(0.98); }
  .cc-check-row { transition: border-color 0.2s, background 0.2s; }
`;

const MONO = "'Barlow Condensed', sans-serif";

// ── Utilidades ─────────────────────────────────────────
function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento disponible: se ignora */
  }
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* cae al método alternativo */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

// ── Medición de red ────────────────────────────────────
const TEST_HOST = "https://speed.cloudflare.com";
const PING_COUNT = 9; // 1 de calentamiento (handshake) + 8 medidos
const DL_MAX_MS = 7000;
const DL_MAX_BYTES = 20000000;

function abortError() {
  const e = new Error("Aborted");
  e.name = "AbortError";
  return e;
}

// Controller hijo: se cancela solo por timeout o si el padre se cancela.
function linkedController(parent, ms) {
  const ctl = new AbortController();
  const onAbort = () => ctl.abort();
  if (parent.aborted) ctl.abort();
  else parent.addEventListener("abort", onAbort);
  const timer = setTimeout(() => ctl.abort(), ms);
  return {
    signal: ctl.signal,
    done: () => {
      clearTimeout(timer);
      parent.removeEventListener("abort", onAbort);
    },
  };
}

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

async function measureLatency(signal, onProgress) {
  const times = [];
  let lost = 0;
  for (let i = 0; i < PING_COUNT; i++) {
    if (signal.aborted) throw abortError();
    const link = linkedController(signal, 2500);
    const t0 = performance.now();
    try {
      const res = await fetch(`${TEST_HOST}/__down?bytes=0&r=${Date.now()}_${i}`, {
        cache: "no-store",
        signal: link.signal,
      });
      await res.arrayBuffer();
      const dt = performance.now() - t0;
      if (i > 0) times.push(dt);
    } catch {
      if (signal.aborted) throw abortError();
      if (i > 0) lost++;
    } finally {
      link.done();
    }
    onProgress?.((i + 1) / PING_COUNT);
  }
  if (times.length === 0) throw new Error("sin-conexion");
  let jitterSum = 0;
  for (let i = 1; i < times.length; i++) jitterSum += Math.abs(times[i] - times[i - 1]);
  const jitter = times.length > 1 ? jitterSum / (times.length - 1) : 0;
  return {
    latency: Math.round(median(times)),
    jitter: Math.round(jitter),
    loss: Math.round((lost / (PING_COUNT - 1)) * 100),
  };
}

async function measureDownload(signal, onProgress) {
  const link = linkedController(signal, DL_MAX_MS + 4000);
  try {
    const res = await fetch(`${TEST_HOST}/__down?bytes=${DL_MAX_BYTES}&r=${Date.now()}`, {
      cache: "no-store",
      signal: link.signal,
    });
    if (!res.ok || !res.body) throw new Error("descarga");
    const reader = res.body.getReader();
    let bytes = 0;
    let start = null;
    let lastElapsed = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      const now = performance.now();
      if (start === null) {
        start = now; // el reloj arranca con el primer bloque recibido
        continue;
      }
      bytes += value.length;
      lastElapsed = now - start;
      if (lastElapsed > 0) {
        onProgress?.(Math.min(1, lastElapsed / DL_MAX_MS), (bytes * 8) / (lastElapsed * 1000));
      }
      if (lastElapsed >= DL_MAX_MS) {
        await reader.cancel();
        break;
      }
    }
    if (start === null || bytes === 0 || lastElapsed <= 0) throw new Error("descarga");
    return (bytes * 8) / (lastElapsed * 1000); // Mbps
  } finally {
    link.done();
  }
}

function evaluate({ latency, jitter, loss, down }) {
  let score = 100;
  if (latency > 150) score -= 45;
  else if (latency > 100) score -= 30;
  else if (latency > 70) score -= 15;
  else if (latency > 45) score -= 5;

  if (jitter > 40) score -= 30;
  else if (jitter > 20) score -= 18;
  else if (jitter > 10) score -= 6;

  if (loss >= 25) score -= 55;
  else if (loss >= 10) score -= 30;
  else if (loss > 0) score -= 10;

  if (down != null) {
    if (down < 2) score -= 25;
    else if (down < 5) score -= 10;
  }
  score = Math.max(0, Math.min(100, score));

  let verdict;
  if (score >= 80) {
    verdict = { key: "ok", color: "#22C97A", title: "Lista para jugar", text: "Tu conexión se ve estable. Buen momento para entrar a una partida." };
  } else if (score >= 55) {
    verdict = { key: "mid", color: "#F0C040", title: "Jugable, con riesgo de tirones", text: "Puedes jugar, pero podrías notar picos de lag. Revisa las recomendaciones de abajo." };
  } else {
    verdict = { key: "bad", color: "#E55353", title: "Conexión inestable", text: "Es probable que tengas lag. Mejor cambia de red o corrige lo que se indica antes de una partida importante." };
  }

  const tips = [];
  if (loss > 0) tips.push("Se perdieron paquetes durante la prueba. Acércate al router, cambia entre Wi-Fi y datos móviles, o reinicia el router.");
  if (jitter > 20) tips.push("Tu latencia varía mucho (jitter alto): eso se siente como tirones. Prueba Wi-Fi de 5 GHz y pausa lo que otros usen en tu red.");
  if (latency > 100) tips.push("Latencia alta. Desactiva la VPN si tienes una y prueba con otra red para comparar.");
  if (down != null && down < 5) tips.push("Descarga baja. Pausa descargas, videos y actualizaciones mientras juegas.");
  if (tips.length === 0) tips.push("Todo se ve bien. Repasa la Guía de Optimización y entra a jugar.");

  return { score, verdict, tips };
}

function metricColor(kind, v) {
  if (v == null) return "#4A5578";
  const G = "#22C97A", Y = "#F0C040", R = "#E55353";
  if (kind === "latency") return v <= 60 ? G : v <= 110 ? Y : R;
  if (kind === "jitter") return v <= 12 ? G : v <= 25 ? Y : R;
  if (kind === "loss") return v === 0 ? G : v < 10 ? Y : R;
  if (kind === "down") return v >= 8 ? G : v >= 4 ? Y : R;
  return "#C8D4F0";
}

const HIST_KEY = "fh_conexion_hist_v1";
const CHECK_KEY = "fh_conexion_check_v1";

// ── Datos de la guía ───────────────────────────────────
const CHECK_GROUPS = [
  {
    title: "Tu red",
    icon: "📡",
    items: [
      { id: "wifi5", title: "Usa Wi-Fi de 5 GHz y acércate al router", how: "Si tu router tiene dos redes (2.4 y 5 GHz), conéctate a la de 5 GHz: suele ser más rápida y con menos interferencia, aunque alcanza menos distancia. Evita paredes entre tú y el router." },
      { id: "otros", title: "Pausa descargas y otros dispositivos", how: "Streaming, descargas y actualizaciones en otros dispositivos compiten por tu conexión. Pausa lo que no necesites mientras juegas." },
      { id: "vpn", title: "Desactiva la VPN", how: "Una VPN agrega un salto extra en el camino y casi siempre suma latencia. Desactívala mientras juegas." },
      { id: "ahorrodatos", title: "Desactiva el Ahorro de datos", how: "Android: Ajustes → Red e Internet (o Conexiones) → Ahorro de datos. iPhone: Ajustes → Datos móviles → Opciones de datos → Modo de datos bajos. Los nombres pueden variar según tu marca y versión." },
      { id: "router", title: "Reinicia el router si el lag es frecuente", how: "Apágalo 30 segundos y vuelve a encenderlo. Suele ayudar cuando la conexión se degrada tras muchos días encendido." },
    ],
  },
  {
    title: "Tu celular",
    icon: "📱",
    items: [
      { id: "dnd", title: "Activa No molestar", how: "Evita que llamadas y notificaciones te saquen de la partida. Android: desliza el panel rápido y toca No molestar. iPhone: Centro de control → Concentración → No molestar." },
      { id: "segundoplano", title: "Cierra apps en segundo plano", how: "Cierra las apps pesadas o que usan internet (redes sociales, video, mensajería con descargas). Libera memoria y ancho de banda." },
      { id: "bateria", title: "Desactiva el ahorro de batería", how: "Los modos de ahorro limitan el rendimiento del celular y pueden pausar procesos en segundo plano. Si la batería está baja, mejor conecta el cargador." },
      { id: "cache", title: "Libera espacio y limpia la caché de otras apps", how: "Android: Ajustes → Almacenamiento (o Aplicaciones) y limpia la caché de las apps que no uses. Importante: no borres los datos de Free Fire, porque tendrías que volver a descargar sus recursos y quizás iniciar sesión de nuevo." },
      { id: "calor", title: "Mantén el celular fresco", how: "Si se calienta, el sistema reduce su rendimiento para protegerse. Quita la funda gruesa, evita el sol directo y no juegues sobre superficies calientes." },
      { id: "modojuego", title: "Activa el modo juego de tu marca (si lo tiene)", how: "Muchas marcas incluyen un modo o centro de juegos (Game Booster, Game Space, Modo Juego, etc.) que prioriza recursos y silencia notificaciones. Búscalo en Ajustes o en tu cajón de apps." },
      { id: "animaciones", title: "Reduce las animaciones del sistema (Android, opcional)", how: "Ajustes → Acerca del teléfono → toca 7 veces \"Número de compilación\" para activar las Opciones de desarrollador. Ahí baja \"Escala de animación de ventana / transición / duración\" a 0.5x o desactívalas. Es un ajuste oficial de Android.", note: "Hace que el sistema se sienta más ágil, pero no cambia tu ping ni los FPS dentro del juego." },
    ],
  },
  {
    title: "Justo antes de jugar",
    icon: "🎮",
    items: [
      { id: "medidor", title: "Corre el Medidor de Conexión", how: "Ve a la pestaña Medidor y haz el test. Si sale \"inestable\", cambia de red (Wi-Fi o datos móviles) antes de entrar a una partida importante." },
      { id: "ajustes", title: "Confirma tu sensibilidad y tu HUD", how: "Revisa que tengas aplicada la sensibilidad de tu modelo (módulo Sensibilidad) y tu HUD. Ajusta de a poco: 2 a 3 puntos por vez." },
      { id: "warmup", title: "Haz 5 minutos de calentamiento", how: "En el módulo Entrenamientos elige la categoría Warm-Up antes de entrar a jugar." },
    ],
  },
];
const TOTAL_ITEMS = CHECK_GROUPS.reduce((n, g) => n + g.items.length, 0);

const DNS_PROVIDERS = [
  { id: "cloudflare", name: "Cloudflare", tag: "Popular por su velocidad y enfoque en privacidad", primary: "1.1.1.1", secondary: "1.0.0.1", host: "one.one.one.one", color: "#F38020" },
  { id: "google", name: "Google Public DNS", tag: "El más conocido y con muy buena disponibilidad", primary: "8.8.8.8", secondary: "8.8.4.4", host: "dns.google", color: "#4A8FFF" },
  { id: "quad9", name: "Quad9", tag: "Bloquea dominios maliciosos conocidos", primary: "9.9.9.9", secondary: "149.112.112.112", host: "dns.quad9.net", color: "#22C97A" },
];

// ── Componentes pequeños ───────────────────────────────
function CopyButton({ text, label }) {
  const [ok, setOk] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const handle = async () => {
    const done = await copyText(text);
    if (done) {
      setOk(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setOk(false), 1600);
    }
  };
  return (
    <button
      className="cc-btn"
      onClick={handle}
      style={{
        padding: "7px 12px",
        borderRadius: "7px",
        background: ok ? "rgba(34,201,122,0.12)" : "rgba(212,170,0,0.08)",
        border: `1px solid ${ok ? "rgba(34,201,122,0.4)" : "rgba(212,170,0,0.25)"}`,
        color: ok ? "#22C97A" : "var(--gold)",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "1px",
        textTransform: "uppercase",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {ok ? "¡Copiado!" : label || "Copiar"}
    </button>
  );
}

function StatTile({ label, value, unit, color }) {
  return (
    <div style={{ background: "#0C0E18", border: "1px solid #16192A", borderRadius: "11px", padding: "12px 12px 10px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: color, opacity: 0.8 }} />
      <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#4A5578", textTransform: "uppercase", marginBottom: "6px" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span style={{ fontFamily: MONO, fontSize: "26px", fontWeight: 700, color, lineHeight: 1 }}>{value ?? "—"}</span>
        {value != null && <span style={{ fontSize: "10px", color: "#4A5578" }}>{unit}</span>}
      </div>
    </div>
  );
}

function ScoreRing({ score, color, busy }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const pct = score == null ? 0 : score / 100;
  return (
    <div style={{ position: "relative", width: "132px", height: "132px", flexShrink: 0 }}>
      <svg width="132" height="132" viewBox="0 0 132 132" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="66" cy="66" r={R} fill="none" stroke="#141826" strokeWidth="9" />
        <circle
          cx="66" cy="66" r={R} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {busy ? (
          <div style={{ width: "26px", height: "26px", border: "3px solid #1C2232", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "cc-spin 0.8s linear infinite" }} />
        ) : (
          <>
            <div style={{ fontFamily: MONO, fontSize: "38px", fontWeight: 700, color: score == null ? "#2A3050" : color, lineHeight: 1 }}>{score ?? "--"}</div>
            <div style={{ fontSize: "8px", letterSpacing: "2px", color: "#4A5578", marginTop: "4px", textTransform: "uppercase" }}>Calidad</div>
          </>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "3px", color: "#3A4468", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px", margin: "22px 0 12px" }}>
      {children}
      <span style={{ flex: 1, height: "1px", background: "#10131C" }} />
    </div>
  );
}

// ── PESTAÑA: MEDIDOR ───────────────────────────────────
function Medidor() {
  const [netType, setNetType] = useState(() => {
    const t = typeof navigator !== "undefined" ? navigator.connection?.type : null;
    return t === "cellular" ? "datos" : "wifi";
  });
  const [phase, setPhase] = useState("idle"); // idle | latency | download | done | error
  const [prog, setProg] = useState(0);
  const [live, setLive] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => readLS(HIST_KEY, []));
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const running = phase === "latency" || phase === "download";

  const run = useCallback(async () => {
    if (running) return;
    const ctl = new AbortController();
    abortRef.current = ctl;
    setError(null);
    setResult(null);
    setLive({});
    setProg(0);
    setPhase("latency");
    try {
      const lat = await measureLatency(ctl.signal, (p) => setProg(p));
      setLive((l) => ({ ...l, ...lat }));
      setPhase("download");
      setProg(0);

      let down = null;
      try {
        down = await measureDownload(ctl.signal, (p, mbps) => {
          setProg(p);
          setLive((l) => ({ ...l, down: mbps }));
        });
      } catch (e) {
        if (ctl.signal.aborted) throw e;
        down = null; // la descarga falló pero la latencia sí se midió: se muestra sin ella
      }

      const metrics = { ...lat, down: down != null ? Math.round(down * 10) / 10 : null };
      const ev = evaluate(metrics);
      const res = { ...metrics, ...ev, net: netType, t: Date.now() };
      setResult(res);
      setLive({});
      setPhase("done");

      const entry = { t: res.t, net: res.net, latency: res.latency, jitter: res.jitter, loss: res.loss, down: res.down, score: res.score };
      setHistory((h) => {
        const next = [entry, ...h].slice(0, 8);
        writeLS(HIST_KEY, next);
        return next;
      });
    } catch {
      if (ctl.signal.aborted) {
        setPhase("idle");
        return;
      }
      setPhase("error");
      setError("No pudimos conectar con el servidor de prueba. Revisa tu conexión (o desactiva la VPN y los bloqueadores) e inténtalo de nuevo.");
    }
  }, [running, netType]);

  const cancel = () => abortRef.current?.abort();

  const shown = result || live;
  const ringColor = result ? result.verdict.color : "var(--gold)";

  const lastByNet = (net) => history.find((h) => h.net === net);
  const wifiLast = lastByNet("wifi");
  const datosLast = lastByNet("datos");
  let bestNet = null;
  if (wifiLast && datosLast) {
    bestNet = wifiLast.score === datosLast.score ? null : wifiLast.score > datosLast.score ? "wifi" : "datos";
  }

  const clearHistory = () => {
    setHistory([]);
    writeLS(HIST_KEY, []);
  };

  const phaseText =
    phase === "latency" ? "Midiendo latencia y estabilidad…" : phase === "download" ? "Midiendo velocidad de descarga…" : "";

  return (
    <div className="cc-fade">
      {/* Aviso honesto */}
      <div style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(74,143,255,0.05)", border: "1px solid rgba(74,143,255,0.2)", fontSize: "11.5px", color: "#8A93B8", lineHeight: 1.6, marginBottom: "16px" }}>
        <strong style={{ color: "#C8D4F0" }}>Es una estimación.</strong> Mide la calidad de tu red hacia un servidor de prueba. No muestra el ping exacto dentro de Free Fire, que depende de los servidores del juego. Sirve para saber si tu conexión está lista <em>antes</em> de abrirlo.
      </div>

      {/* Red actual */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[
          { id: "wifi", label: "Wi-Fi", icon: "📶" },
          { id: "datos", label: "Datos móviles", icon: "📱" },
        ].map((n) => {
          const active = netType === n.id;
          return (
            <button
              key={n.id}
              disabled={running}
              onClick={() => setNetType(n.id)}
              className="cc-btn"
              style={{
                flex: 1, padding: "10px 12px", borderRadius: "9px",
                background: active ? "rgba(212,170,0,0.1)" : "#0C0E18",
                border: `1px solid ${active ? "rgba(212,170,0,0.4)" : "#16192A"}`,
                color: active ? "var(--gold)" : "#6A78A8",
                fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                cursor: running ? "not-allowed" : "pointer", opacity: running ? 0.6 : 1,
              }}
            >
              {n.icon}&nbsp; {n.label}
            </button>
          );
        })}
      </div>

      {/* Panel principal */}
      <div className="data-card" style={{ padding: "20px 18px", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <ScoreRing score={result?.score} color={ringColor} busy={running} />
          <div style={{ flex: 1, minWidth: "200px" }}>
            {running && (
              <>
                <div style={{ fontFamily: MONO, fontSize: "15px", fontWeight: 700, letterSpacing: "1px", color: "#E8DDB0", marginBottom: "10px" }}>{phaseText}</div>
                <div style={{ height: "5px", borderRadius: "3px", background: "#141826", overflow: "hidden", marginBottom: "12px" }}>
                  <div style={{ width: `${Math.round(prog * 100)}%`, height: "100%", background: "var(--gold)", transition: "width 0.2s" }} />
                </div>
                <button
                  onClick={cancel}
                  className="cc-btn"
                  style={{ padding: "8px 14px", borderRadius: "8px", background: "transparent", border: "1px solid #1A2038", color: "#6A78A8", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Cancelar
                </button>
              </>
            )}
            {!running && result && (
              <>
                <div style={{ fontFamily: MONO, fontSize: "19px", fontWeight: 700, letterSpacing: "1px", color: result.verdict.color, marginBottom: "6px", textTransform: "uppercase" }}>{result.verdict.title}</div>
                <div style={{ fontSize: "12px", color: "#8A93B8", lineHeight: 1.6, marginBottom: "12px" }}>{result.verdict.text}</div>
                <button
                  onClick={run}
                  className="cc-btn"
                  style={{ padding: "9px 16px", borderRadius: "8px", background: "rgba(212,170,0,0.08)", border: "1px solid rgba(212,170,0,0.3)", color: "var(--gold)", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Repetir test
                </button>
              </>
            )}
            {!running && !result && (
              <>
                <div style={{ fontFamily: MONO, fontSize: "18px", fontWeight: 700, letterSpacing: "1px", color: "#E8DDB0", marginBottom: "6px", textTransform: "uppercase" }}>¿Tu conexión está lista?</div>
                <div style={{ fontSize: "12px", color: "#6A78A8", lineHeight: 1.6, marginBottom: "12px" }}>
                  Mide latencia, estabilidad, pérdida de paquetes y velocidad de descarga en unos 15 segundos.
                </div>
                <button
                  onClick={run}
                  className="cc-btn"
                  style={{ padding: "12px 22px", borderRadius: "9px", background: "var(--gold)", border: "none", color: "#080A0E", fontSize: "12px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", animation: "cc-pulse 2.2s infinite" }}
                >
                  Iniciar test
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div style={{ marginTop: "14px", padding: "10px 12px", borderRadius: "8px", background: "rgba(229,83,83,0.07)", border: "1px solid rgba(229,83,83,0.3)", fontSize: "11.5px", color: "#E58A8A", lineHeight: 1.6 }}>
            {error}
          </div>
        )}
      </div>

      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "6px" }}>
        <StatTile label="Latencia" value={shown.latency} unit="ms" color={metricColor("latency", shown.latency)} />
        <StatTile label="Jitter" value={shown.jitter} unit="ms" color={metricColor("jitter", shown.jitter)} />
        <StatTile label="Pérdida" value={shown.loss} unit="%" color={metricColor("loss", shown.loss)} />
        <StatTile label="Descarga" value={shown.down != null ? Math.round(shown.down * 10) / 10 : null} unit="Mbps" color={metricColor("down", shown.down)} />
      </div>
      <div style={{ fontSize: "10.5px", color: "#3A4468", lineHeight: 1.5, marginTop: "8px" }}>
        Latencia baja y jitter bajo importan más que una descarga alta: en juegos en línea la estabilidad pesa más que la velocidad.
      </div>

      {/* Recomendaciones */}
      {result && (
        <>
          <SectionLabel>Qué hacer ahora</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {result.tips.map((t, i) => (
              <div key={i} className="cc-fade" style={{ display: "flex", gap: "10px", padding: "11px 13px", borderRadius: "10px", background: "#0C0E18", border: "1px solid #16192A", animationDelay: `${i * 0.06}s` }}>
                <span style={{ color: "var(--gold)", flexShrink: 0 }}>›</span>
                <span style={{ fontSize: "12px", color: "#8A93B8", lineHeight: 1.6 }}>{t}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Comparación de redes */}
      {wifiLast && datosLast && (
        <>
          <SectionLabel>Wi-Fi vs. datos móviles</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[{ id: "wifi", label: "Wi-Fi", d: wifiLast }, { id: "datos", label: "Datos móviles", d: datosLast }].map(({ id, label, d }) => {
              const best = bestNet === id;
              return (
                <div key={id} style={{ padding: "12px", borderRadius: "11px", background: best ? "rgba(34,201,122,0.06)" : "#0C0E18", border: `1px solid ${best ? "rgba(34,201,122,0.35)" : "#16192A"}` }}>
                  <div style={{ fontSize: "9px", letterSpacing: "2px", color: best ? "#22C97A" : "#4A5578", textTransform: "uppercase", marginBottom: "6px" }}>
                    {label}{best ? " · mejor" : ""}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: "24px", fontWeight: 700, color: "#C8D4F0", lineHeight: 1 }}>{d.score}</div>
                  <div style={{ fontSize: "10px", color: "#4A5578", marginTop: "6px", lineHeight: 1.5 }}>
                    {d.latency} ms · jitter {d.jitter} ms
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Historial */}
      {history.length > 0 && (
        <>
          <SectionLabel>Últimos tests</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {history.slice(0, 5).map((h, i) => (
              <div key={h.t + "-" + i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "9px", background: "#0C0E18", border: "1px solid #10131C", fontSize: "11px", color: "#6A78A8" }}>
                <span style={{ width: "62px", flexShrink: 0, color: "#4A5578" }}>{new Date(h.t).toLocaleString("es", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                <span style={{ flexShrink: 0 }}>{h.net === "wifi" ? "📶" : "📱"}</span>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {h.latency} ms · jitter {h.jitter} ms{h.down != null ? ` · ${h.down} Mbps` : ""}
                </span>
                <span style={{ fontFamily: MONO, fontSize: "15px", fontWeight: 700, color: h.score >= 80 ? "#22C97A" : h.score >= 55 ? "#F0C040" : "#E55353" }}>{h.score}</span>
              </div>
            ))}
          </div>
          <button onClick={clearHistory} style={{ marginTop: "10px", background: "none", border: "none", color: "#3A4468", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", padding: "4px 0" }}>
            Borrar historial
          </button>
        </>
      )}

      <div style={{ marginTop: "20px", fontSize: "10.5px", color: "#3A4468", lineHeight: 1.6 }}>
        El test descarga hasta ~20 MB de datos (menos si tu conexión es lenta). Si estás con datos móviles, tenlo en cuenta. El historial se guarda solo en este dispositivo.
      </div>
    </div>
  );
}

// ── PESTAÑA: GUÍA DE OPTIMIZACIÓN ──────────────────────
function Guia() {
  const [done, setDone] = useState(() => readLS(CHECK_KEY, {}));
  const [open, setOpen] = useState(null);

  const count = CHECK_GROUPS.reduce((n, g) => n + g.items.filter((it) => done[it.id]).length, 0);
  const pct = Math.round((count / TOTAL_ITEMS) * 100);

  const toggle = (id) => {
    setDone((d) => {
      const next = { ...d, [id]: !d[id] };
      if (!next[id]) delete next[id];
      writeLS(CHECK_KEY, next);
      return next;
    });
  };
  const reset = () => {
    setDone({});
    writeLS(CHECK_KEY, {});
  };

  return (
    <div className="cc-fade">
      <div className="data-card" style={{ padding: "16px 18px", marginBottom: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
          <div style={{ fontFamily: MONO, fontSize: "15px", fontWeight: 700, letterSpacing: "1.5px", color: "#E8DDB0", textTransform: "uppercase" }}>
            {count === TOTAL_ITEMS ? "¡Todo listo!" : "Tu progreso"}
          </div>
          <div style={{ fontFamily: MONO, fontSize: "18px", fontWeight: 700, color: pct === 100 ? "#22C97A" : "var(--gold)" }}>{count}/{TOTAL_ITEMS}</div>
        </div>
        <div style={{ height: "6px", borderRadius: "3px", background: "#141826", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#22C97A" : "var(--gold)", transition: "width 0.4s ease, background 0.3s" }} />
        </div>
        <div style={{ fontSize: "11px", color: "#4A5578", lineHeight: 1.6, marginTop: "10px" }}>
          Pasos manuales que tú haces en tu celular, con ajustes normales del sistema. Toca el círculo para marcar y la flecha para ver cómo se hace. Tu progreso se guarda en este dispositivo.
        </div>
      </div>

      {CHECK_GROUPS.map((g) => (
        <div key={g.title}>
          <SectionLabel>{g.icon}&nbsp; {g.title}</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {g.items.map((it) => {
              const isDone = !!done[it.id];
              const isOpen = open === it.id;
              return (
                <div
                  key={it.id}
                  className="cc-check-row"
                  style={{
                    borderRadius: "11px",
                    background: isDone ? "rgba(34,201,122,0.04)" : "#0C0E18",
                    border: `1px solid ${isDone ? "rgba(34,201,122,0.28)" : "#16192A"}`,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 13px" }}>
                    <button
                      role="checkbox"
                      aria-checked={isDone}
                      aria-label={it.title}
                      onClick={() => toggle(it.id)}
                      style={{
                        width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0, cursor: "pointer",
                        background: isDone ? "#22C97A" : "transparent",
                        border: `2px solid ${isDone ? "#22C97A" : "#2A3050"}`,
                        display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                        transition: "all 0.2s",
                      }}
                    >
                      {isDone && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06140C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      )}
                    </button>
                    <div
                      onClick={() => setOpen(isOpen ? null : it.id)}
                      style={{ flex: 1, minWidth: 0, cursor: "pointer", fontSize: "13px", fontWeight: 600, color: isDone ? "#6A9A80" : "#C8D4F0", lineHeight: 1.4, textDecoration: isDone ? "line-through" : "none", textDecorationColor: "rgba(106,154,128,0.5)" }}
                    >
                      {it.title}
                    </div>
                    <button
                      onClick={() => setOpen(isOpen ? null : it.id)}
                      aria-label="Ver cómo se hace"
                      style={{ background: "none", border: "none", color: "#4A5578", cursor: "pointer", padding: "4px", lineHeight: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                  </div>
                  {isOpen && (
                    <div style={{ padding: "0 14px 13px 49px", fontSize: "12px", color: "#8A93B8", lineHeight: 1.7 }}>
                      {it.how}
                      {it.note && (
                        <div style={{ marginTop: "8px", padding: "8px 10px", borderRadius: "7px", background: "rgba(212,170,0,0.05)", border: "1px solid rgba(212,170,0,0.2)", fontSize: "11px", color: "#8A7A40", lineHeight: 1.6 }}>
                          <strong style={{ color: "var(--gold-dim)" }}>Ojo:</strong> {it.note}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {count > 0 && (
        <button onClick={reset} style={{ marginTop: "18px", background: "none", border: "none", color: "#3A4468", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", padding: "4px 0" }}>
          Reiniciar checklist
        </button>
      )}
    </div>
  );
}

// ── PESTAÑA: DNS ───────────────────────────────────────
function DnsTab() {
  const [os, setOs] = useState("android");

  const android = [
    "Abre Ajustes → Red e Internet (en algunas marcas: Conexiones → Más ajustes de conexión).",
    "Entra a \"DNS privado\".",
    "Elige \"Nombre de host del proveedor de DNS privado\" y pega el nombre de host de abajo (por ejemplo, one.one.one.one).",
    "Guarda. Aplica tanto para Wi-Fi como para datos móviles (Android 9 o superior).",
  ];
  const ios = [
    "Abre Ajustes → Wi-Fi y toca la (i) junto a tu red.",
    "Entra a \"Configurar DNS\" y elige \"Manual\".",
    "Elimina los servidores que haya y agrega el primario y el secundario de abajo.",
    "Guarda. En iPhone este ajuste aplica solo a esa red Wi-Fi.",
  ];
  const steps = os === "android" ? android : ios;

  return (
    <div className="cc-fade">
      <div style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(240,192,64,0.05)", border: "1px solid rgba(240,192,64,0.22)", fontSize: "11.5px", color: "#9A8A50", lineHeight: 1.6, marginBottom: "16px" }}>
        <strong style={{ color: "#E8C040" }}>Expectativa realista:</strong> el DNS no baja tu ping dentro de la partida. Ayuda a que la conexión inicial (iniciar sesión, entrar a la sala) resuelva más rápido y, en algunas redes, más estable. Prueba y quédate con el que mejor te funcione.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {DNS_PROVIDERS.map((p) => (
          <div key={p.id} className="data-card" style={{ padding: "16px" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: p.color }} />
            <div style={{ fontFamily: MONO, fontSize: "16px", fontWeight: 700, letterSpacing: "1.5px", color: "#E8DDB0", textTransform: "uppercase", marginBottom: "2px" }}>{p.name}</div>
            <div style={{ fontSize: "11px", color: "#4A5578", marginBottom: "12px" }}>{p.tag}</div>
            {[
              { label: "Primario", value: p.primary },
              { label: "Secundario", value: p.secondary },
              { label: "Nombre de host (Android)", value: p.host },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", background: "#080A10", border: "1px solid #12151F", marginBottom: "6px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "8.5px", letterSpacing: "1.5px", color: "#3A4468", textTransform: "uppercase", marginBottom: "2px" }}>{row.label}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', ui-monospace, monospace", fontSize: "14px", color: "#C8D4F0", overflow: "hidden", textOverflow: "ellipsis" }}>{row.value}</div>
                </div>
                <CopyButton text={row.value} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <SectionLabel>Cómo aplicarlo</SectionLabel>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {[{ id: "android", label: "Android" }, { id: "ios", label: "iPhone" }].map((o) => {
          const active = os === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setOs(o.id)}
              className="cc-btn"
              style={{
                flex: 1, padding: "9px", borderRadius: "9px",
                background: active ? "rgba(212,170,0,0.1)" : "#0C0E18",
                border: `1px solid ${active ? "rgba(212,170,0,0.4)" : "#16192A"}`,
                color: active ? "var(--gold)" : "#6A78A8",
                fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      <div className="data-card" style={{ padding: "16px" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", marginBottom: i < steps.length - 1 ? "12px" : 0 }}>
            <div style={{ fontFamily: MONO, fontSize: "20px", fontWeight: 700, color: "var(--gold-dim)", lineHeight: 1.1, width: "22px", flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: "12.5px", color: "#8A93B8", lineHeight: 1.65 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "12px", padding: "11px 13px", borderRadius: "10px", background: "#0C0E18", border: "1px solid #16192A", fontSize: "11.5px", color: "#6A78A8", lineHeight: 1.6 }}>
        <strong style={{ color: "#8A93B8" }}>¿Quieres volver atrás?</strong> Android: DNS privado → Automático. iPhone: Configurar DNS → Automático. Es un ajuste normal del sistema y siempre puedes revertirlo. No instala nada ni toca archivos del juego.
      </div>
    </div>
  );
}

// ── PÁGINA ─────────────────────────────────────────────
const TABS = [
  { id: "medidor", label: "Medidor" },
  { id: "guia", label: "Guía" },
  { id: "dns", label: "DNS" },
];

export default function CentroConexion() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("medidor");

  return (
    <div className="module-page" style={{ overflowY: "auto" }}>
      <style>{STYLES}</style>

      <div className="module-header">
        <button className="module-back-btn" onClick={() => navigate("/")} title="Volver">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <div className="module-title">Centro de Conexión</div>
          <div className="module-subtitle">Prepara tu partida: mide, ajusta y conéctate mejor</div>
        </div>
      </div>

      <div style={{ padding: "18px 18px 60px", maxWidth: "720px", margin: "0 auto" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "11px", background: "#0A0C14", border: "1px solid #12151F", marginBottom: "18px" }}>
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                className="cc-tab"
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: "10px 6px", borderRadius: "8px", cursor: "pointer",
                  background: active ? "rgba(212,170,0,0.12)" : "transparent",
                  border: `1px solid ${active ? "rgba(212,170,0,0.3)" : "transparent"}`,
                  color: active ? "var(--gold)" : "#4A5578",
                  fontFamily: MONO, fontSize: "14px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "medidor" && <Medidor />}
        {tab === "guia" && <Guia />}
        {tab === "dns" && <DnsTab />}
      </div>
    </div>
  );
}
