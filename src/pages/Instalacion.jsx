import { useState } from "react";
import { useNavigate } from "react-router-dom";

const iphoneSteps = [
  {
    num: "01",
    title: "Abre Safari",
    desc: "El panel solo se puede instalar desde el navegador Safari. Si estás usando Chrome u otro navegador, cópialo y ábrelo en Safari.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    tip: "Asegúrate de estar usando la URL correcta del panel antes de continuar.",
  },
  {
    num: "02",
    title: "Toca el botón Compartir",
    desc: "En la barra inferior de Safari, busca el ícono de compartir — es el cuadrado con una flecha apuntando hacia arriba. Tócalo.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16 6 12 2 8 6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
    ),
    tip: "Si no ves la barra de navegación, desliza hacia arriba en la pantalla para que aparezca.",
  },
  {
    num: "03",
    title: "Selecciona \"Agregar a inicio\"",
    desc: "En el menú que aparece, desplázate hacia abajo y busca la opción \"Agregar a pantalla de inicio\". Tócala para continuar.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
    tip: "La opción puede estar en la segunda o tercera fila del menú de compartir.",
  },
  {
    num: "04",
    title: "Confirma el nombre",
    desc: "Aparecerá una pantalla de confirmación con el nombre \"Panel FullHead\". Puedes editarlo o dejarlo así. Toca \"Agregar\" en la esquina superior derecha.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    ),
    tip: "Si cambias el nombre, aún podrás acceder al panel normalmente.",
  },
  {
    num: "05",
    title: "¡Listo! Abre desde el inicio",
    desc: "El ícono del panel aparecerá en tu pantalla de inicio como una app. Ábrelo y tendrás acceso completo sin barras de navegador.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    tip: "El panel funciona como una app nativa: pantalla completa, sin barras del navegador.",
  },
];

const androidSteps = [
  {
    num: "01",
    title: "Abre Chrome",
    desc: "Usa Google Chrome para instalar el panel. Es el navegador recomendado en Android para mejor compatibilidad con la instalación.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="4"/>
        <line x1="21.17" y1="8" x2="12" y2="8"/>
        <line x1="3.95" y1="6.06" x2="8.54" y2="14"/>
        <line x1="10.88" y1="21.94" x2="15.46" y2="14"/>
      </svg>
    ),
    tip: "También puedes usar Samsung Internet o Edge — el proceso es muy similar.",
  },
  {
    num: "02",
    title: "Toca el menú ⋮",
    desc: "Busca los tres puntos verticales (⋮) en la esquina superior derecha del navegador. Tócalos para abrir el menú de opciones.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
      </svg>
    ),
    tip: "Si aparece una notificación automática \"Agregar a inicio\", puedes usarla directamente.",
  },
  {
    num: "03",
    title: "Selecciona \"Agregar a pantalla de inicio\"",
    desc: "En el menú desplegable, busca la opción \"Agregar a pantalla de inicio\" o \"Instalar app\". Tócala.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3"/>
      </svg>
    ),
    tip: "En versiones recientes de Chrome, también puede aparecer como \"Instalar Panel FullHead\".",
  },
  {
    num: "04",
    title: "Confirma la instalación",
    desc: "Aparecerá un diálogo de confirmación. Toca \"Agregar\" o \"Instalar\" para añadir el panel a tu pantalla de inicio.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    tip: "Puedes elegir si instalarlo como un acceso directo o como una app PWA completa.",
  },
  {
    num: "05",
    title: "¡Instalado! Accede como app",
    desc: "El ícono de Panel FullHead aparece en tu cajón de aplicaciones o pantalla de inicio. Ábrelo para una experiencia de pantalla completa.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    tip: "Las actualizaciones se aplican automáticamente cuando hay conexión a internet.",
  },
];

const faq = [
  {
    q: "¿El panel funciona sin internet?",
    a: "Algunas funciones básicas están disponibles sin conexión gracias al caché del navegador. Sin embargo, para cargar presets, HUDs y configuraciones necesitas conexión a internet.",
  },
  {
    q: "¿Mis datos se sincronizan entre dispositivos?",
    a: "Sí. Tu cuenta está vinculada a tu email. Inicia sesión desde cualquier dispositivo y tendrás acceso a todos tus ajustes sincronizados.",
  },
  {
    q: "¿Ocupa mucho espacio en el celular?",
    a: "No. Al ser una Progressive Web App (PWA), ocupa muy poco espacio comparado con una app nativa — menos de 5 MB en la mayoría de los casos.",
  },
  {
    q: "¿Puedo instalarlo en más de un dispositivo?",
    a: "Sí. Puedes instalar el panel en todos tus dispositivos. Solo necesitas iniciar sesión con la misma cuenta.",
  },
];

export default function Instalacion() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("iphone");
  const [openFaq, setOpenFaq] = useState(null);

  const steps = tab === "iphone" ? iphoneSteps : androidSteps;

  return (
    <div className="module-page" style={{ overflowY: "auto" }}>

      {/* Header */}
      <div className="module-header">
        <button className="module-back-btn" onClick={() => navigate("/")} title="Volver">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <div className="module-title">Instalación del Panel</div>
          <div className="module-subtitle">Guía paso a paso para iPhone y Android</div>
        </div>
      </div>

      <div style={{ padding: "28px 28px 60px", maxWidth: "860px", margin: "0 auto" }}>

        {/* Intro banner */}
        <div style={{
          background: "linear-gradient(135deg, #141206 0%, #0D0D0D 100%)",
          border: "1px solid var(--border-gold)",
          borderRadius: "10px",
          padding: "22px 24px",
          marginBottom: "28px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "1px",
            background: "linear-gradient(to right, transparent, var(--gold), transparent)",
          }} />
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "22px", letterSpacing: "3px",
            color: "var(--gold)", marginBottom: "8px",
          }}>
            ¿Qué es una PWA?
          </div>
          <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.7, maxWidth: "680px" }}>
            Panel FullHead es una <strong style={{ color: "var(--gold)" }}>Progressive Web App (PWA)</strong> — una aplicación web que funciona como una app nativa en tu celular. No necesitas descargarla desde la App Store ni Play Store. Solo instálala desde el navegador y listo: pantalla completa, sin barras del navegador, acceso directo desde el inicio.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px" }}>
            {[
              { icon: "⚡", text: "Sin descarga de tiendas" },
              { icon: "🔄", text: "Actualizaciones automáticas" },
              { icon: "📱", text: "iPhone y Android" },
              { icon: "💾", text: "Menos de 5 MB" },
            ].map((b) => (
              <div key={b.text} style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "rgba(212,160,23,0.08)",
                border: "1px solid var(--border-gold)",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "11px", color: "var(--text)",
                letterSpacing: "0.3px",
              }}>
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab selector */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          {[
            {
              id: "iphone",
              label: "iPhone / iOS",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3"/>
                </svg>
              ),
            },
            {
              id: "android",
              label: "Android",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3"/>
                  <line x1="9" y1="1" x2="9" y2="3"/>
                  <line x1="15" y1="1" x2="15" y2="3"/>
                </svg>
              ),
            },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: tab === t.id ? "var(--border-gold)" : "var(--border)",
                background: tab === t.id ? "rgba(212,160,23,0.1)" : "var(--surface2)",
                color: tab === t.id ? "var(--gold)" : "var(--text-muted)",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "14px", fontWeight: 700,
                letterSpacing: "1px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Platform note */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 16px",
          background: "rgba(26,111,168,0.08)",
          border: "1px solid rgba(26,111,168,0.3)",
          borderRadius: "8px",
          marginBottom: "24px",
          fontSize: "12px", color: "var(--text-muted)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A6FA8" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>
            {tab === "iphone"
              ? "Para iPhone usa siempre Safari. Otros navegadores en iOS no permiten instalar la app."
              : "Para Android se recomienda Google Chrome. También funciona con Samsung Internet o Microsoft Edge."}
          </span>
        </div>

        {/* Steps */}
        <div className="section-header-fh">
          <div className="section-label-fh">■&nbsp; Pasos de instalación — {tab === "iphone" ? "iPhone" : "Android"}</div>
          <div className="section-line-fh"/>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px" }}>
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="data-card"
              style={{
                padding: "20px 22px",
                animationDelay: `${idx * 0.07}s`,
              }}
            >
              <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
                {/* Step number */}
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "6px", flexShrink: 0,
                }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "28px", letterSpacing: "2px",
                    color: "var(--gold-dim)", lineHeight: 1,
                  }}>
                    {step.num}
                  </div>
                  {idx < steps.length - 1 && (
                    <div style={{ width: "1px", height: "24px", background: "var(--border)" }} />
                  )}
                </div>

                {/* Icon + content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{
                      width: "44px", height: "44px",
                      borderRadius: "8px",
                      background: "rgba(212,160,23,0.08)",
                      border: "1px solid var(--border-gold)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--gold)", flexShrink: 0,
                    }}>
                      {step.icon}
                    </div>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: "17px", fontWeight: 700,
                      color: "var(--text)", letterSpacing: "0.5px",
                    }}>
                      {step.title}
                    </div>
                  </div>

                  <p style={{
                    fontSize: "13px", color: "var(--text)",
                    lineHeight: 1.7, marginBottom: "10px",
                  }}>
                    {step.desc}
                  </p>

                  {step.tip && (
                    <div style={{
                      display: "flex", alignItems: "flex-start", gap: "8px",
                      padding: "8px 12px",
                      background: "rgba(212,160,23,0.04)",
                      border: "1px solid rgba(212,160,23,0.2)",
                      borderRadius: "6px",
                      fontSize: "11px", color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold-dim)" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <span><strong style={{ color: "var(--gold-dim)" }}>Consejo:</strong> {step.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success banner */}
        <div style={{
          background: "rgba(30,140,74,0.08)",
          border: "1px solid rgba(30,140,74,0.35)",
          borderRadius: "10px",
          padding: "18px 22px",
          marginBottom: "40px",
          display: "flex", gap: "14px", alignItems: "center",
        }}>
          <div style={{
            width: "40px", height: "40px",
            borderRadius: "50%",
            background: "rgba(30,140,74,0.15)",
            border: "1px solid rgba(30,140,74,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E8C4A" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", fontWeight: 700, color: "#1E8C4A", marginBottom: "4px" }}>
              ¡Ya tienes el panel instalado!
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Ahora puedes acceder a todos los módulos: sensibilidades, HUD, configuraciones, entrenamientos y más. Todo sincronizado en tu cuenta.
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="section-header-fh">
          <div className="section-label-fh">■&nbsp; Preguntas frecuentes</div>
          <div className="section-line-fh"/>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {faq.map((item, idx) => (
            <div
              key={idx}
              className="data-card"
              style={{
                padding: "0",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px", gap: "12px",
              }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "14px", fontWeight: 700,
                  color: "var(--text)", letterSpacing: "0.3px",
                }}>
                  {item.q}
                </div>
                <div style={{
                  color: "var(--gold-dim)",
                  transition: "transform 0.2s",
                  transform: openFaq === idx ? "rotate(45deg)" : "rotate(0deg)",
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
              </div>
              {openFaq === idx && (
                <div style={{
                  padding: "0 18px 14px",
                  fontSize: "13px", color: "var(--text-muted)",
                  lineHeight: 1.7,
                  borderTop: "1px solid var(--border)",
                  paddingTop: "12px",
                }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
