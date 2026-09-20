import { useState } from "react";
import { useNavigate } from "react-router-dom";

const guideSteps = [
  {
    num: "01",
    title: "Sensibilidad por Celular",
    desc: "Es el corazón del sistema. Busca tu marca y modelo en el buscador, o filtra por marca en el menú desplegable. Cada tarjeta muestra los valores calibrados (General, Red Dot, Mira 2x, Mira 4x, AWM y Mirada Libre) según el DPI real de tu pantalla.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="7"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    tip: "Toca \"COPIAR SENSI\" en la tarjeta de tu celular, abre Free Fire → Configuración → Sensibilidad y pega cada valor en su casilla correspondiente.",
  },
  {
    num: "02",
    title: "HUD Pro",
    desc: "Aquí encuentras el tamaño y la posición ideal de cada botón (disparo, mira, agachar, saltar, pared gloo) para tu modelo exacto. Usa el filtro \"2 Dedos\" o \"3 Dedos\" según cómo juegas.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="6" width="20" height="12" rx="3"/>
        <circle cx="8" cy="12" r="1.6" fill="currentColor" stroke="none"/>
        <circle cx="16" cy="10" r="1.2" fill="currentColor" stroke="none"/>
        <circle cx="18" cy="14" r="1.2" fill="currentColor" stroke="none"/>
      </svg>
    ),
    tip: "Si tu celular aguanta \"3 Dedos\", pruébalo en modo entrenamiento primero — libera el pulgar derecho para disparar y mirar al mismo tiempo.",
  },
  {
    num: "03",
    title: "Configuraciones Pro",
    desc: "Ajustes de gráficos, FPS, sombra y filtros optimizados para tu hardware — más el tamaño ideal de los botones de disparo y mira en porcentaje de pantalla. Todo calibrado para que tu celular no trabe en partidas largas.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
        <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
        <circle cx="4" cy="12" r="2"/><circle cx="12" cy="10" r="2"/><circle cx="20" cy="14" r="2"/>
      </svg>
    ),
    tip: "Toca \"COPIAR CONFIG\" y aplica cada ajuste en Free Fire → Configuración → Gráficos, en el mismo orden que aparece en la tarjeta.",
  },
  {
    num: "04",
    title: "Entrenamientos Diarios",
    desc: "Rutinas cortas organizadas por categoría — Headshot, Arrastre, Capa, Crouch-Shot, AWM, Rush, Memoria Muscular y más — para mejorar tu puntería y reflejos con la práctica diaria, no solo con la configuración.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="13" r="8"/>
        <polyline points="12 9 12 13 15 15"/>
        <line x1="9" y1="2" x2="15" y2="2"/>
      </svg>
    ),
    tip: "10 a 15 minutos por día en modo entrenamiento rinden más que una hora sin rutina. Elige una categoría a la vez.",
  },
  {
    num: "05",
    title: "Perfiles Geral y Pro",
    desc: "Cada celular tiene un perfil \"Geral\" (equilibrado, para el día a día) y algunos también un perfil \"Pro\" (más cerrado, para quien ya domina la sensibilidad base). El badge de color (60Hz BASE, 90Hz MED, 120Hz PRO, 144Hz ELITE) te muestra la gama de tu pantalla de un vistazo.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21v-1a8 8 0 0 1 16 0v1"/>
      </svg>
    ),
    tip: "Activa \"🔥 Solo Populares\" en la Sensibilidad para ver primero los modelos más usados por la comunidad LATAM.",
  },
  {
    num: "06",
    title: "Calibrador en Vivo",
    desc: "La novedad del sistema: elige un aparato base, mueve los sliders de sensibilidad a tu gusto, prueba el efecto en la vista previa y guarda tu propio perfil personalizado — queda guardado en tu cuenta para siempre.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>
      </svg>
    ),
    tip: "Guarda varios perfiles con nombres claros (ej: \"Rankeada\", \"AWM Sniper\") y cámbialos según el modo que estés jugando.",
  },
  {
    num: "07",
    title: "Firma PRO",
    desc: "Crea tu firma estilo pro-player con más de 80 combinaciones — símbolos gamer, armas ASCII, emoticonos, fuentes especiales y tags de clan. Escribe tu nombre una vez y explora todas las categorías.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2H2v10l9.29 9.29a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42L12 2Z"/><path d="M7 7h.01"/>
      </svg>
    ),
    tip: "Usa el botón de compartir para mandar tu firma directo por WhatsApp — buena forma de presumir tu nuevo nick.",
  },
];

const faq = [
  {
    q: "¿No encuentro mi modelo exacto?",
    a: "Seguimos agregando aparelhos cada semana según lo que la comunidad reporta. Mientras tanto, busca el modelo más cercano de tu misma marca y gama (mismo Hz y tamaño de pantalla) — el resultado será muy similar.",
  },
  {
    q: "¿Cuál es la diferencia entre perfil \"Geral\" y \"Pro\"?",
    a: "\"Geral\" es el punto de partida recomendado para la mayoría de los jugadores. \"Pro\" reduce un poco más la sensibilidad general para quien ya tiene consistencia y busca máxima precisión — pruébalo solo después de unos días usando el perfil Geral.",
  },
  {
    q: "¿Cómo aplico los valores en el juego?",
    a: "Copia los valores con el botón correspondiente (COPIAR SENSI, COPIAR CONFIG), abre Free Fire y pégalos manualmente en Configuración → Sensibilidad o → Gráficos, según el módulo. El juego no permite importar configuraciones automáticamente.",
  },
  {
    q: "¿Mis datos se sincronizan entre dispositivos?",
    a: "Sí. Tu cuenta está vinculada a tu email. Inicia sesión desde cualquier dispositivo y tendrás acceso a los mismos módulos y ajustes.",
  },
  {
    q: "¿Qué es el Calibrador en Vivo?",
    a: "Es tu propio laboratorio de sensibilidad: partes de un aparato base, ajustas cada valor con sliders en tiempo real, pruebas el efecto en una vista previa y guardas el resultado como un perfil personalizado vinculado a tu cuenta. Puedes crear cuantos perfiles quieras.",
  },
  {
    q: "¿El panel funciona sin internet?",
    a: "Necesitas conexión para cargar los presets, HUDs, configuraciones y entrenamientos la primera vez. Una vez cargados en la sesión, la navegación entre pantallas es instantánea.",
  },
];

export default function Instalacion() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

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
          <div className="module-title">Cómo Usar el Panel</div>
          <div className="module-subtitle">Guía rápida de todos los módulos de FullHead</div>
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
            Bienvenido a tu Sistema de Calibración
          </div>
          <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.7, maxWidth: "680px" }}>
            FullHead no es un hack ni un mod — es una <strong style={{ color: "var(--gold)" }}>base de datos de calibración</strong> construida a partir de las características reales de cada celular (densidad de pantalla, tasa de actualización y hardware). Cuatro módulos, un mismo objetivo: que encuentres tu configuración exacta en segundos y la apliques tú mismo, directo en el juego.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px" }}>
            {[
              { icon: "🎯", text: "Sensibilidad por celular" },
              { icon: "🎮", text: "HUD por modelo" },
              { icon: "⚙️", text: "Gráficos optimizados" },
              { icon: "🏆", text: "Entrenamientos diarios" },
              { icon: "🎚️", text: "Calibrador personalizado" },
              { icon: "✍️", text: "Firma PRO" },
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

        {/* Steps */}
        <div className="section-header-fh">
          <div className="section-label-fh">■&nbsp; Los 7 módulos del panel</div>
          <div className="section-line-fh"/>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px" }}>
          {guideSteps.map((step, idx) => (
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
                  {idx < guideSteps.length - 1 && (
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
              ¡Ya conoces todo el sistema!
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Empieza por Sensibilidad y HUD — son los dos módulos que más rápido notarás en tu partida. Ajusta de a poco: 2 a 3 puntos por vez, nunca todo de golpe.
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
