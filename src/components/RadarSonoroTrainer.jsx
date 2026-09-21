import { useState, useRef, useCallback, useEffect } from "react";

const STYLES = `
  @keyframes radar-ping {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes radar-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  .radar-ping-ring { animation: radar-ping 0.9s ease-out; }
`;

const ROUNDS_PER_SESSION = 10;
const DIRECTIONS = [
  { key: "izq", label: "Izquierda", icon: "◀", pan: -0.9 },
  { key: "centro", label: "Centro", icon: "●", pan: 0 },
  { key: "der", label: "Derecha", icon: "▶", pan: 0.9 },
];

export default function RadarSonoroTrainer() {
  const audioCtxRef = useRef(null);
  const [phase, setPhase] = useState("idle"); // idle | waiting | playing | answered | summary
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(null);
  const [picked, setPicked] = useState(null);
  const [hits, setHits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => Number(localStorage.getItem("fh_radar_best") || 0));
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function getCtx() {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AC();
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }

  function playPing(pan) {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    osc.type = "sine";
    osc.frequency.value = 620;
    panner.pan.value = pan;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
    osc.connect(gain).connect(panner).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  }

  const startRound = useCallback(() => {
    setPicked(null);
    setPhase("waiting");
    const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    setTarget(dir);
    const delay = 700 + Math.random() * 1500;
    timerRef.current = setTimeout(() => {
      playPing(dir.pan);
      setPhase("playing");
      setTimeout(() => setPhase((p) => (p === "playing" ? "answered_missed" : p)), 1500);
    }, delay);
  }, []);

  function startSession() {
    getCtx(); // desbloquea el audio con el gesto del usuario
    setRound(1);
    setHits(0);
    setStreak(0);
    startRound();
  }

  function handlePick(dirKey) {
    if (phase !== "playing") return;
    clearTimeout(timerRef.current);
    setPicked(dirKey);
    const correct = dirKey === target.key;
    if (correct) {
      setHits((h) => h + 1);
      setStreak((s) => {
        const ns = s + 1;
        if (ns > bestStreak) {
          setBestStreak(ns);
          localStorage.setItem("fh_radar_best", String(ns));
        }
        return ns;
      });
    } else {
      setStreak(0);
    }
    setPhase("answered");
    setTimeout(() => {
      if (round >= ROUNDS_PER_SESSION) {
        setPhase("summary");
      } else {
        setRound((r) => r + 1);
        startRound();
      }
    }, 900);
  }

  const acc = round > 0 ? Math.round((hits / Math.max(round - (phase === "summary" ? 0 : 1), 1)) * 100) : 0;

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
      <style>{STYLES}</style>

      {phase === "idle" && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{
            width: "68px", height: "68px", borderRadius: "50%", margin: "0 auto 16px",
            background: "rgba(212,160,23,0.1)", border: "1px solid var(--border-gold)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px",
          }}>🎧</div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "18px", maxWidth: "340px", marginLeft: "auto", marginRight: "auto" }}>
            Vas a escuchar un sonido desde la izquierda, el centro o la derecha. Toca el botón correcto lo más rápido posible — entrenar tu oído mejora tu reacción real en partida.
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: "18px", marginBottom: "20px",
            fontSize: "11px", color: "var(--text-muted)",
          }}>
            <div><div style={{ fontSize: "18px", fontWeight: 800, color: "var(--gold)" }}>{bestStreak}</div>Mejor racha</div>
          </div>
          <button
            onClick={startSession}
            style={{
              padding: "13px 28px", borderRadius: "10px", border: "none",
              background: "linear-gradient(90deg,#8A6610,#D4A017,#F0C040,#D4A017)",
              color: "#000", fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px",
              letterSpacing: "2px", cursor: "pointer",
            }}
          >
            🎧 INICIAR ENTRENAMIENTO
          </button>
          <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "12px" }}>
            Usa audífonos para mejores resultados
          </p>
        </div>
      )}

      {(phase === "waiting" || phase === "playing" || phase === "answered" || phase === "answered_missed") && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px", fontSize: "11px", color: "var(--text-muted)" }}>
            <span>Ronda {round}/{ROUNDS_PER_SESSION}</span>
            <span>Aciertos: <strong style={{ color: "var(--gold)" }}>{hits}</strong></span>
            <span>Racha: <strong style={{ color: "var(--gold)" }}>{streak}</strong></span>
          </div>

          <div style={{
            position: "relative", height: "120px", display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "24px",
          }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              background: phase === "playing" ? "rgba(212,160,23,0.2)" : "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-gold)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px",
              animation: phase === "waiting" ? "radar-pulse 1s ease infinite" : "none",
            }}>
              {phase === "waiting" ? "👂" : "🔊"}
            </div>
            {phase === "playing" && (
              <div className="radar-ping-ring" style={{
                position: "absolute", width: "60px", height: "60px", borderRadius: "50%",
                border: "2px solid var(--gold)",
              }} />
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {DIRECTIONS.map((d) => {
              const isPicked = picked === d.key;
              const isCorrectAnswer = (phase === "answered" || phase === "answered_missed") && target?.key === d.key;
              const isWrongPick = phase === "answered" && isPicked && !isCorrectAnswer;
              return (
                <button
                  key={d.key}
                  onClick={() => handlePick(d.key)}
                  disabled={phase !== "playing"}
                  style={{
                    flex: 1, padding: "18px 8px", borderRadius: "10px",
                    border: `1px solid ${isCorrectAnswer ? "#1E8C4A" : isWrongPick ? "#C0392B" : "rgba(255,255,255,0.1)"}`,
                    background: isCorrectAnswer ? "rgba(30,140,74,0.15)" : isWrongPick ? "rgba(192,57,43,0.15)" : "rgba(255,255,255,0.02)",
                    color: isCorrectAnswer ? "#1E8C4A" : isWrongPick ? "#C0392B" : "var(--text)",
                    cursor: phase === "playing" ? "pointer" : "default",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                    opacity: phase === "waiting" ? 0.4 : 1, transition: "opacity 0.2s",
                  }}
                >
                  <span style={{ fontSize: "22px" }}>{d.icon}</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px" }}>{d.label}</span>
                </button>
              );
            })}
          </div>

          {phase === "answered_missed" && (
            <div style={{ textAlign: "center", marginTop: "12px", fontSize: "11px", color: "#C0392B" }}>
              ⏱️ Muy lento — la próxima, reacciona más rápido
            </div>
          )}
        </div>
      )}

      {phase === "summary" && (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>
            {hits >= 8 ? "🏆" : hits >= 5 ? "🎯" : "👂"}
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", color: "var(--gold)", marginBottom: "4px" }}>
            {hits}/{ROUNDS_PER_SESSION} aciertos
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "18px" }}>
            Mejor racha de esta sesión: {streak > 0 ? streak : "—"} · Récord personal: {bestStreak}
          </div>
          <button
            onClick={startSession}
            style={{
              padding: "11px 24px", borderRadius: "9px", border: "1px solid var(--border-gold)",
              background: "rgba(212,160,23,0.08)", color: "var(--gold)",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "13px", cursor: "pointer",
            }}
          >
            🔁 Entrenar de nuevo
          </button>
        </div>
      )}

      {/* Tips de audio real dentro del juego */}
      <div style={{
        marginTop: "26px", padding: "13px 16px", borderRadius: "9px",
        background: "rgba(212,160,23,0.05)", border: "1px solid rgba(212,160,23,0.15)",
        fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.7,
      }}>
        <strong style={{ color: "var(--gold-dim)" }}>💡 Aplícalo en Free Fire:</strong> activa el audio 3D en Configuración → Sonido, usa audífonos con cable o Bluetooth de baja latencia, y presta atención a pasos y disparos lejanos — tu oído entrenado aquí se traduce directo en detectar enemigos antes de verlos.
      </div>
    </div>
  );
}
