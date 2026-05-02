import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import logoImg from "../assets/fullhead-logo.webp";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setErro("");
    setMsg("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg("¡Enlace enviado! Revisa tu correo electrónico.");
    } catch (err) {
      console.error(err);
      setErro("Error al enviar el correo. Verifica la dirección ingresada.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#080A10",
    border: "1px solid #1A1E2E",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "13px",
    color: "#A0B0D0",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07080C", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse at center top, rgba(212,170,0,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div className="animate-float-up" style={{ width: "100%", maxWidth: "360px", position: "relative", zIndex: 2 }}>
        <div style={{ background: "#0C0E18", border: "1px solid #1C2232", borderRadius: "20px", padding: "30px 26px", position: "relative" }}>
          <div style={{ position: "absolute", top: "-1px", left: "-1px", width: "14px", height: "14px", borderTop: "2px solid #D4AA00", borderLeft: "2px solid #D4AA00", borderTopLeftRadius: "3px", opacity: 0.5 }} />
          <div style={{ position: "absolute", top: "-1px", right: "-1px", width: "14px", height: "14px", borderTop: "2px solid #D4AA00", borderRight: "2px solid #D4AA00", borderTopRightRadius: "3px", opacity: 0.5 }} />
          <div style={{ position: "absolute", bottom: "-1px", left: "-1px", width: "14px", height: "14px", borderBottom: "2px solid #D4AA00", borderLeft: "2px solid #D4AA00", borderBottomLeftRadius: "3px", opacity: 0.5 }} />
          <div style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "14px", height: "14px", borderBottom: "2px solid #D4AA00", borderRight: "2px solid #D4AA00", borderBottomRightRadius: "3px", opacity: 0.5 }} />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "22px" }}>
            <div style={{ width: "74px", height: "74px", borderRadius: "50%", background: "#080A10", border: "1px solid #1C2232", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", overflow: "hidden" }}>
              <img src={logoImg} alt="FullHead" style={{ width: "62px", height: "62px", objectFit: "contain" }} />
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "5px", color: "#E8DDB0", lineHeight: 1, marginBottom: "4px" }}>
              RECUPERAR
            </div>
            <div style={{ fontSize: "9px", letterSpacing: "5px", color: "#4A5578", fontWeight: 500 }}>
              ACCESO · FULLHEAD
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "#12151E" }} />
            <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "3px", color: "#D4AA00", opacity: 0.6 }}>
              ENVIAR ENLACE
            </div>
            <div style={{ flex: 1, height: "1px", background: "#12151E" }} />
          </div>

          <p style={{ fontSize: "11px", color: "#4A5578", lineHeight: 1.5, textAlign: "center", marginBottom: "18px" }}>
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          {erro && (
            <div style={{ marginBottom: "14px", padding: "10px 14px", background: "rgba(229,83,83,0.08)", border: "1px solid rgba(229,83,83,0.25)", borderRadius: "8px", fontSize: "11px", color: "#E55353" }}>
              {erro}
            </div>
          )}

          {msg && (
            <div style={{ marginBottom: "14px", padding: "10px 14px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.20)", borderRadius: "8px", fontSize: "11px", color: "#22C97A" }}>
              {msg}
            </div>
          )}

          <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
            <div>
              <label style={{ fontSize: "9px", letterSpacing: "2px", color: "#6070A0", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = "rgba(212,170,0,0.4)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#1A1E2E"; }}
                autoComplete="email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "13px", marginTop: "4px", background: loading ? "#1C2030" : "#D4AA00", color: loading ? "#4A5578" : "#07080C", border: "none", borderRadius: "10px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "4px", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}
            >
              {loading ? "ENVIANDO..." : "› \u00a0 ENVIAR ENLACE"}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Link
              to="/login"
              style={{ fontSize: "12px", color: "#4A5578", textDecoration: "none", letterSpacing: "0.3px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#D4AA00"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#4A5578"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Volver al inicio de sesión
            </Link>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "9px", color: "#1E2235", letterSpacing: "2px", marginTop: "16px", textTransform: "uppercase" }}>
          © 2025 FULLHEAD · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
