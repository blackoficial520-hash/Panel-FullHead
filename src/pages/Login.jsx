import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/fullhead-logo.webp";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErro("Credenciales inválidas o error al iniciar sesión.");
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

  const labelStyle = {
    fontSize: "9px",
    letterSpacing: "2px",
    color: "#6070A0",
    textTransform: "uppercase",
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07080C", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      {/* Glow superior */}
      <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse at center top, rgba(212,170,0,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
      {/* Grid sutil */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", height: "1px", top: "28%", left: 0, right: 0, background: "#D4AA00", opacity: 0.04 }} />
        <div style={{ position: "absolute", height: "1px", top: "72%", left: 0, right: 0, background: "#D4AA00", opacity: 0.04 }} />
        <div style={{ position: "absolute", width: "1px", left: "18%", top: 0, bottom: 0, background: "#D4AA00", opacity: 0.04 }} />
        <div style={{ position: "absolute", width: "1px", left: "82%", top: 0, bottom: 0, background: "#D4AA00", opacity: 0.04 }} />
      </div>

      <div className="animate-float-up" style={{ width: "100%", maxWidth: "360px", position: "relative", zIndex: 2 }}>
        {/* Cartão */}
        <div style={{ background: "#0C0E18", border: "1px solid #1C2232", borderRadius: "20px", padding: "30px 26px", position: "relative" }}>
          {/* Cantos dourados */}
          <div style={{ position: "absolute", top: "-1px", left: "-1px", width: "14px", height: "14px", borderTop: "2px solid #D4AA00", borderLeft: "2px solid #D4AA00", borderTopLeftRadius: "3px", opacity: 0.5 }} />
          <div style={{ position: "absolute", top: "-1px", right: "-1px", width: "14px", height: "14px", borderTop: "2px solid #D4AA00", borderRight: "2px solid #D4AA00", borderTopRightRadius: "3px", opacity: 0.5 }} />
          <div style={{ position: "absolute", bottom: "-1px", left: "-1px", width: "14px", height: "14px", borderBottom: "2px solid #D4AA00", borderLeft: "2px solid #D4AA00", borderBottomLeftRadius: "3px", opacity: 0.5 }} />
          <div style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "14px", height: "14px", borderBottom: "2px solid #D4AA00", borderRight: "2px solid #D4AA00", borderBottomRightRadius: "3px", opacity: 0.5 }} />

          {/* Logo área */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "22px" }}>
            <div style={{ width: "74px", height: "74px", borderRadius: "50%", background: "#080A10", border: "1px solid #1C2232", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", overflow: "hidden" }}>
              <img src={logoImg} alt="FullHead" style={{ width: "62px", height: "62px", objectFit: "contain" }} />
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "24px", fontWeight: 700, letterSpacing: "6px", color: "#E8DDB0", lineHeight: 1, marginBottom: "4px" }}>
              FULLHEAD
            </div>
            <div style={{ fontSize: "9px", letterSpacing: "5px", color: "#4A5578", fontWeight: 500 }}>
              CALIBRACIÓN · FREE FIRE
            </div>
          </div>

          {/* Divisor */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ flex: 1, height: "1px", background: "#12151E" }} />
            <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "3px", color: "#D4AA00", opacity: 0.6 }}>
              ACCEDE A TU CUENTA
            </div>
            <div style={{ flex: 1, height: "1px", background: "#12151E" }} />
          </div>

          {erro && (
            <div className="animate-slide-in" style={{ marginBottom: "14px", padding: "10px 14px", background: "rgba(229,83,83,0.08)", border: "1px solid rgba(229,83,83,0.25)", borderRadius: "8px", fontSize: "11px", color: "#E55353" }}>
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
            <div>
              <label style={labelStyle}>Correo electrónico</label>
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

            <div>
              <label style={labelStyle}>Contraseña</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  style={{ ...inputStyle, paddingRight: "40px" }}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(212,170,0,0.4)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#1A1E2E"; }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#3A4570", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
                >
                  {showPassword ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "13px", marginTop: "6px", marginBottom: "10px", background: loading ? "#1C2030" : "#D4AA00", color: loading ? "#4A5578" : "#07080C", border: "none", borderRadius: "10px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "4px", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  INGRESANDO...
                </>
              ) : (
                <>› &nbsp; INGRESAR</>
              )}
            </button>
          </form>

          {/* Links inferiores */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <Link
              to="/esqueci-senha"
              style={{ fontSize: "12px", color: "#4A5578", textDecoration: "none", letterSpacing: "0.3px" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#D4AA00"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#4A5578"}
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
              <div style={{ flex: 1, height: "1px", background: "#0F1120" }} />
              <span style={{ fontSize: "10px", color: "#2A3050", letterSpacing: "1px" }}>O</span>
              <div style={{ flex: 1, height: "1px", background: "#0F1120" }} />
            </div>
            <Link
              to="/registro"
              style={{ fontSize: "12px", color: "#4A5578", textDecoration: "none", letterSpacing: "0.3px" }}
            >
              ¿No tienes cuenta? <span style={{ color: "#D4AA00", opacity: 0.85, marginLeft: "3px" }}>Regístrate</span>
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
