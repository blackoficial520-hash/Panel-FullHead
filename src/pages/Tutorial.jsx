import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// ─── Detecção de dispositivo ──────────────────────────────
function detectDevice() {
  const ua = navigator.userAgent || '';
  const isIOS     = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);
  const isSafari  = /Safari/.test(ua) && !/CriOS|Chrome|Chromium|EdgA|FxiOS/.test(ua);
  const isChrome  = /Chrome|Chromium|CriOS/.test(ua);
  return { isIOS, isAndroid, isSafari, isChrome };
}

// ─── Ícone de compartilhar do iOS (SVG idêntico ao do Safari) ─
function ShareIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" style={{ display:'inline-block', verticalAlign:'middle' }}>
      <path d="M9 1v12M5 4l4-4 4 4" stroke="#4a8fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 9v9a1 1 0 001 1h14a1 1 0 001-1V9" stroke="#4a8fff" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Ícone de três pontos do Chrome ───────────────────────
function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ display:'inline-block', verticalAlign:'middle' }}>
      <circle cx="9" cy="3"  r="1.5" fill="#22c97a"/>
      <circle cx="9" cy="9"  r="1.5" fill="#22c97a"/>
      <circle cx="9" cy="15" r="1.5" fill="#22c97a"/>
    </svg>
  );
}

export default function Tutorial() {
  const navigate = useNavigate();
  const [os, setOs] = useState('android');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installState, setInstallState] = useState('idle'); // idle | installing | done

  // ── Detecta OS automaticamente ──────────────────────────
  useEffect(() => {
    const { isIOS } = detectDevice();
    setOs(isIOS ? 'ios' : 'android');
  }, []);

  // ── Captura o prompt de instalação do Android/Chrome ───
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Se já foi instalado
    window.addEventListener('appinstalled', () => {
      setInstallState('done');
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function handleInstallClick() {
    if (!deferredPrompt) return;
    setInstallState('installing');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((result) => {
      if (result.outcome === 'accepted') {
        setInstallState('done');
      } else {
        setInstallState('idle');
      }
      setDeferredPrompt(null);
    });
  }

  function handleComplete() {
    localStorage.setItem('fh_tutorial_done', 'true');
    navigate('/registro');
  }

  const { isIOS, isSafari } = detectDevice();
  const showInstallBtn = os === 'android' && deferredPrompt && installState !== 'done';
  const showInstalledMsg = installState === 'done';

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07080c; }
        .tut-tab { transition: background .2s, border-color .2s, color .2s; }
        .tut-tab:active { opacity: .7; }
        .tut-install-btn { transition: transform .15s, box-shadow .15s; }
        .tut-install-btn:active { transform: scale(.97); }
        @keyframes pulse-gold {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,170,0,0.0); }
          50%      { box-shadow: 0 0 0 8px rgba(212,170,0,0.15); }
        }
        .tut-install-pulse { animation: pulse-gold 2s ease-in-out infinite; }
        @keyframes bounce-down {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }
        .ios-arrow { animation: bounce-down 1.4s ease-in-out infinite; }
      `}</style>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={s.header}>
        <div style={s.headerGlow} />
        <div style={s.logoWrap}>
          <img src="/logo.png" alt="FullHead" style={s.logoImg}
            onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
        <div style={s.title}>
          INSTALA <span style={{ color: '#d4aa00' }}>FULLHEAD</span>
        </div>
        <div style={s.subtitle}>
          Agrega el panel a tu pantalla de inicio{'\n'}para la mejor experiencia de juego
        </div>

        {/* Tabs de OS */}
        <div style={s.osTabs}>
          <button className="tut-tab"
            style={{ ...s.osTab, ...(os === 'android' ? s.osTabActive : {}) }}
            onClick={() => setOs('android')}>
            📱 Android
          </button>
          <button className="tut-tab"
            style={{ ...s.osTab, ...(os === 'ios' ? s.osTabActive : {}) }}
            onClick={() => setOs('ios')}>
            🍎 iPhone
          </button>
        </div>
      </div>

      {/* ── Corpo ─────────────────────────────────────────── */}
      <div style={s.body}>

        {/* ── ANDROID ─────────────────────────────────────── */}
        {os === 'android' && (
          <>
            {/* Botão mágico de instalação (Chrome) */}
            {showInstallBtn && (
              <div style={s.installCard}>
                <div style={s.installCardGlow} />
                <div style={{ position:'relative', zIndex:1 }}>
                  <div style={s.installCardBadge}>✦ INSTALACIÓN DIRECTA</div>
                  <div style={s.installCardTitle}>Agregar a pantalla de inicio</div>
                  <div style={s.installCardDesc}>
                    Tu navegador soporta instalación directa. Toca el botón de abajo y confirma — sin necesidad de abrir menús.
                  </div>
                  <button
                    className="tut-install-btn tut-install-pulse"
                    style={s.installBtn}
                    onClick={handleInstallClick}
                  >
                    <span style={{ fontSize: 18 }}>📲</span>
                    INSTALAR FULLHEAD AGORA
                  </button>
                </div>
              </div>
            )}

            {/* Instalado com sucesso */}
            {showInstalledMsg && (
              <div style={{ ...s.installCard, borderColor: 'rgba(16,185,129,0.4)' }}>
                <div style={{ ...s.installCardGlow, background: 'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, transparent 70%)' }} />
                <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                  <div style={{ ...s.installCardTitle, color: '#22c97a' }}>¡Instalado con éxito!</div>
                  <div style={s.installCardDesc}>Ahora abre FullHead desde el ícono en tu pantalla de inicio para continuar.</div>
                </div>
              </div>
            )}

            {/* Passos manuais (fallback ou complemento) */}
            {!deferredPrompt && !showInstalledMsg && (
              <div style={s.manualNote}>
                <span style={{ color: '#d4aa00', marginRight: 6 }}>ℹ</span>
                Sigue los pasos abajo para instalar manualmente
              </div>
            )}
            {deferredPrompt && (
              <div style={{ ...s.manualNote, color: '#4a5578' }}>
                O sigue los pasos abajo si prefieres instalar manualmente
              </div>
            )}

            <StepCard num="01" color="gold"    tag="ABRIR MENÚ"
              icon={<MenuIcon />}
              title='Abre el menú del navegador'
              desc='En Chrome, toca los tres puntos ⋮ en la esquina superior derecha de tu pantalla.' />

            <StepCard num="02" color="blue"    tag="SIGUIENTE"
              icon="📲"
              title='"Agregar a pantalla de inicio"'
              desc='En el menú desplegable, busca y toca la opción "Agregar a pantalla de inicio".' />

            <StepCard num="03" color="green"   tag="CONFIRMAR"
              icon="✅"
              title='Confirma la instalación'
              desc='Aparecerá una ventana con el nombre "FullHead". Toca el botón "Agregar" para confirmar.' />

            <StepCard num="04" color="orange"  tag="IMPORTANTE"
              icon="🔔"
              title='Activa las notificaciones'
              desc='Al abrir el panel por primera vez, te pedirá permiso. Toca "Permitir" para recibir actualizaciones y nuevas sensibilidades.'
              badge="🔔 Recomendado" badgeColor="orange" />

            <StepCard num="05" color="violet"  tag="ÚLTIMO PASO"
              icon="🚀"
              title='Abre FullHead desde tu pantalla'
              desc='Ve a tu pantalla de inicio, busca el ícono de FullHead y ábrelo desde ahí para continuar.' />
          </>
        )}

        {/* ── iOS ─────────────────────────────────────────── */}
        {os === 'ios' && (
          <>
            {/* Aviso se não for Safari */}
            {!isSafari && isIOS && (
              <div style={s.warningCard}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#fb923c', marginBottom: 3, fontSize: 13 }}>
                    Necesitas usar Safari
                  </div>
                  <div style={{ fontSize: 11, color: '#8a7a6a', lineHeight: 1.5 }}>
                    Solo Safari permite agregar a la pantalla de inicio en iPhone. Abre esta página en Safari y sigue los pasos abajo.
                  </div>
                </div>
              </div>
            )}

            <StepCard num="01" color="gold"   tag="PRIMERO"
              icon="🧭"
              title='Abre en Safari'
              desc='Asegúrate de estar usando Safari. Solo Safari permite agregar a la pantalla de inicio en iPhone.'
              badge="🍎 iPhone · Safari" badgeColor="ios" />

            <StepCard num="02" color="blue"   tag="SIGUIENTE"
              icon={<ShareIcon />}
              title={<>Toca el botón compartir <ShareIcon /></>}
              desc='Toca los 3 puntos de la barra inferior “…” y luego haz clic en “Compartir”. □↑' />

            <StepCard num="03" color="green"  tag="SIGUIENTE"
              icon="📲"
              title='"En pantalla de inicio"'
              desc='Desliza el menú hacia abajo y toca "Agregar a pantalla de inicio".' />

            <StepCard num="04" color="orange" tag="IMPORTANTE"
              icon="🔔"
              title='Activa las notificaciones'
              desc='Al abrir el panel por primera vez, te pedirá permiso. Toca "Permitir" para recibir actualizaciones.'
              badge="🔔 Recomendado" badgeColor="orange" />

            <StepCard num="05" color="violet" tag="ÚLTIMO PASO"
              icon="🚀"
              title='Confirma y abre FullHead'
              desc='Toca "Agregar" en la esquina superior derecha. Luego abre el ícono de FullHead desde tu pantalla de inicio.' />

            {/* Indicador animado para o botão de compartilhar do Safari */}
            <div style={s.iosHint}>
              <div className="ios-arrow" style={s.iosHintArrow}>↓</div>
              <div style={s.iosHintText}>
                El botón <ShareIcon /> está en la barra inferior del Safari
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <div style={s.footer}>
      </div>
    </div>
  );
}

// ─── Componente de card de passo ──────────────────────────
const COLOR = {
  gold:   { border:'rgba(212,170,0,0.35)',  bg:'#0e1020', top:'#d4aa00',  num:'rgba(212,170,0,0.12)',  nb:'rgba(212,170,0,0.3)',  nc:'#d4aa00',  tag:'#d4aa00'  },
  blue:   { border:'rgba(59,130,246,0.35)', bg:'#0a0e1a', top:'#3b82f6',  num:'rgba(59,130,246,0.12)', nb:'rgba(59,130,246,0.3)', nc:'#4a8fff',  tag:'#4a8fff'  },
  green:  { border:'rgba(16,185,129,0.35)', bg:'#0a1210', top:'#10b981',  num:'rgba(16,185,129,0.12)', nb:'rgba(16,185,129,0.3)', nc:'#22c97a',  tag:'#22c97a'  },
  orange: { border:'rgba(251,146,60,0.35)', bg:'#100e18', top:'#fb923c',  num:'rgba(251,146,60,0.12)', nb:'rgba(251,146,60,0.3)', nc:'#fb923c',  tag:'#fb923c'  },
  violet: { border:'rgba(139,92,246,0.35)', bg:'#0e0a1a', top:'#8b5cf6',  num:'rgba(139,92,246,0.12)', nb:'rgba(139,92,246,0.3)', nc:'#a78bfa',  tag:'#a78bfa'  },
};
const BADGE = {
  orange: { bg:'rgba(251,146,60,0.08)',   color:'#fb923c', border:'rgba(251,146,60,0.2)'  },
  ios:    { bg:'rgba(59,130,246,0.08)',   color:'#4a8fff', border:'rgba(59,130,246,0.15)' },
  android:{ bg:'rgba(16,185,129,0.08)',   color:'#22c97a', border:'rgba(16,185,129,0.15)' },
};

function StepCard({ num, color, tag, icon, title, desc, badge, badgeColor }) {
  const c = COLOR[color];
  return (
    <div style={{ ...sc.card, borderColor: c.border, background: c.bg }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2,
        background:`linear-gradient(90deg, ${c.top}, transparent)`, borderRadius:'14px 14px 0 0' }} />

      <div style={{ ...sc.num, background:c.num, border:`1px solid ${c.nb}`, color:c.nc }}>
        {num}
      </div>

      <div style={sc.content}>
        <div style={{ ...sc.tag, color:c.tag }}>{tag}</div>
        <div style={sc.title}>{title}</div>
        <div style={sc.desc}>{desc}</div>
        {badge && badgeColor && (
          <div style={{ ...sc.badge, ...BADGE[badgeColor] }}>{badge}</div>
        )}
      </div>

      <div style={sc.icon}>
        {typeof icon === 'string' ? icon : icon}
      </div>
    </div>
  );
}

// ─── Estilos principais ───────────────────────────────────
const s = {
  root: {
    minHeight:'100vh', background:'#07080c',
    fontFamily:"'Inter', sans-serif",
    display:'flex', flexDirection:'column',
    maxWidth:480, margin:'0 auto',
  },
  header: {
    padding:'24px 20px 16px',
    display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
    borderBottom:'1px solid #10131c', background:'#09090f',
    position:'relative', overflow:'hidden',
  },
  headerGlow: {
    position:'absolute', top:-40, left:'50%', transform:'translateX(-50%)',
    width:200, height:100,
    background:'radial-gradient(ellipse, rgba(212,170,0,0.08) 0%, transparent 70%)',
    pointerEvents:'none',
  },
  logoWrap: {
    width:52, height:52, borderRadius:'50%',
    background:'#0c0e18', border:'1px solid #1c2232',
    display:'flex', alignItems:'center', justifyContent:'center',
    overflow:'hidden', marginBottom:12,
  },
  logoImg: { width:40, height:40, objectFit:'contain' },
  title: {
    fontFamily:"'Barlow Condensed', sans-serif",
    fontSize:22, fontWeight:700, letterSpacing:3,
    color:'#e8ddb0', marginBottom:5,
  },
  subtitle: {
    fontSize:12, color:'#5a6a90', lineHeight:1.6,
    marginBottom:14, whiteSpace:'pre-line',
  },
  osTabs: { display:'flex', gap:8 },
  osTab: {
    padding:'7px 18px', borderRadius:8,
    fontSize:12, fontWeight:600, cursor:'pointer',
    border:'1px solid #12151e', background:'#0c0e18',
    color:'#4a5578', fontFamily:"'Inter', sans-serif",
  },
  osTabActive: {
    background:'rgba(212,170,0,0.08)',
    borderColor:'rgba(212,170,0,0.25)', color:'#d4aa00',
  },
  body: { flex:1, padding:'14px 18px', display:'flex', flexDirection:'column', gap:10 },

  // Card de instalação direta Android
  installCard: {
    borderRadius:16, padding:18,
    border:'1.5px solid rgba(212,170,0,0.4)',
    background:'rgba(212,170,0,0.05)',
    position:'relative', overflow:'hidden',
    marginBottom:2,
  },
  installCardGlow: {
    position:'absolute', top:-20, left:'50%', transform:'translateX(-50%)',
    width:200, height:100,
    background:'radial-gradient(ellipse, rgba(212,170,0,0.15) 0%, transparent 70%)',
    pointerEvents:'none',
  },
  installCardBadge: {
    fontSize:9, fontWeight:700, letterSpacing:2,
    color:'#d4aa00', marginBottom:8, textTransform:'uppercase',
  },
  installCardTitle: {
    fontFamily:"'Barlow Condensed', sans-serif",
    fontSize:20, fontWeight:700, letterSpacing:1,
    color:'#e8ddb0', marginBottom:6,
  },
  installCardDesc: {
    fontSize:12, color:'#7a8aaa', lineHeight:1.6, marginBottom:14,
  },
  installBtn: {
    width:'100%', padding:'13px 0', borderRadius:12, border:'none',
    background:'#d4aa00', color:'#07080c',
    fontFamily:"'Barlow Condensed', sans-serif",
    fontSize:14, fontWeight:700, letterSpacing:3, cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
  },

  manualNote: {
    fontSize:11, color:'#6a7aaa', textAlign:'center',
    padding:'6px 0 2px',
  },

  // iOS hint
  iosHint: {
    display:'flex', flexDirection:'column', alignItems:'center',
    padding:'16px 0 4px', gap:6,
  },
  iosHintArrow: {
    fontSize:22, color:'#d4aa00', fontWeight:700, lineHeight:1,
  },
  iosHintText: {
    fontSize:11, color:'#5a6a90', textAlign:'center', lineHeight:1.6,
  },

  warningCard: {
    display:'flex', gap:12, alignItems:'flex-start',
    padding:14, borderRadius:12,
    background:'rgba(251,146,60,0.06)',
    border:'1px solid rgba(251,146,60,0.2)',
    marginBottom:2,
  },

  footer: { padding:'0 18px 32px' },
  mainBtn: {
    width:'100%', padding:14, borderRadius:12, border:'none',
    background:'#d4aa00', color:'#07080c',
    fontFamily:"'Barlow Condensed', sans-serif",
    fontSize:14, fontWeight:700, letterSpacing:3, cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
    marginBottom:10, boxShadow:'0 4px 24px rgba(212,170,0,0.2)',
  },
  footerNote: {
    textAlign:'center', fontSize:10,
    color:'#3a4560', letterSpacing:0.5,
  },
};

// ─── Estilos dos StepCards ────────────────────────────────
const sc = {
  card: {
    borderWidth:1, borderStyle:'solid', borderRadius:14, padding:13,
    display:'flex', gap:12, alignItems:'flex-start',
    position:'relative', overflow:'hidden',
  },
  num: {
    width:34, height:34, borderRadius:9, flexShrink:0,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontFamily:"'Barlow Condensed', sans-serif",
    fontSize:17, fontWeight:700, letterSpacing:1,
  },
  content: { flex:1, paddingRight:6 },
  tag: { fontSize:9, fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginBottom:3 },
  title: { fontSize:13, fontWeight:600, color:'#c0cce8', lineHeight:1.25, marginBottom:4 },
  desc: { fontSize:11, lineHeight:1.6, color:'#6a7a9a' },
  badge: {
    marginTop:7, display:'inline-flex', alignItems:'center',
    padding:'3px 8px', borderRadius:5,
    fontSize:9, fontWeight:700, letterSpacing:1,
  },
  icon: {
    fontSize:20, position:'absolute', right:12,
    top:'50%', transform:'translateY(-50%)', opacity:0.4,
  },
};
