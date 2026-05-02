import { useEffect, useState } from 'react';

const STEPS = [
  { pct: 0,   txt: 'VERIFICANDO LICENCIA...' },
  { pct: 15,  txt: 'VERIFICANDO LICENCIA...' },
  { pct: 28,  txt: 'CARGANDO MÓDULOS...' },
  { pct: 42,  txt: 'CARGANDO MÓDULOS...' },
  { pct: 55,  txt: 'SINCRONIZANDO DATOS...' },
  { pct: 67,  txt: 'SINCRONIZANDO DATOS...' },
  { pct: 78,  txt: 'CONFIGURANDO PANEL...' },
  { pct: 88,  txt: 'CONFIGURANDO PANEL...' },
  { pct: 94,  txt: 'CASI LISTO...' },
  { pct: 100, txt: '¡BIENVENIDO!' },
];

export default function SplashScreen({ onComplete }) {
  const [pct, setPct] = useState(0);
  const [txt, setTxt] = useState(STEPS[0].txt);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= STEPS.length) {
        clearInterval(interval);
        setTimeout(() => onComplete(), 800);
        return;
      }
      setPct(STEPS[idx].pct);
      if (STEPS[idx].txt !== STEPS[idx - 1].txt) setTxt(STEPS[idx].txt);
    }, 480);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Estilo injetado para garantir compatibilidade máxima iOS Safari */}
      <style>{`
        #fh-splash {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          background: #07080c;
          display: -webkit-flex;
          display: flex;
          -webkit-flex-direction: column;
          flex-direction: column;
          -webkit-align-items: center;
          align-items: center;
          -webkit-justify-content: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
        }
        #fh-splash-grid {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(212,170,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,170,0,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        #fh-splash-glow {
          position: absolute;
          top: 50%; left: 50%;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          width: 280px; height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,170,0,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .fh-ring {
          position: absolute;
          top: 50%; left: 50%;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          pointer-events: none;
        }
        .fh-corner {
          position: absolute;
          width: 20px; height: 20px;
          border-color: rgba(212,170,0,0.3);
          border-style: solid;
        }
        #fh-logo-wrap {
          width: 100px; height: 100px;
          border-radius: 50%;
          background: #0c0e18;
          border: 1px solid rgba(212,170,0,0.2);
          display: -webkit-flex;
          display: flex;
          -webkit-align-items: center;
          align-items: center;
          -webkit-justify-content: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 24px;
          box-shadow: 0 0 40px rgba(212,170,0,0.1);
          position: relative;
          z-index: 2;
        }
        #fh-logo-img {
          width: 82px; height: 82px;
          object-fit: contain;
          display: block;
        }
        #fh-name {
          font-family: 'Barlow Condensed', 'Inter', -apple-system, sans-serif;
          font-size: 34px;
          font-weight: 700;
          letter-spacing: 10px;
          color: #e8ddb0;
          line-height: 1;
          margin-bottom: 6px;
          position: relative; z-index: 2;
          text-align: center;
        }
        #fh-sub {
          font-size: 9px;
          letter-spacing: 6px;
          color: #7a8aaa;
          margin-bottom: 48px;
          position: relative; z-index: 2;
          text-align: center;
        }
        #fh-bar-wrap {
          width: 200px;
          margin-bottom: 14px;
          position: relative; z-index: 2;
        }
        #fh-bar-labels {
          display: -webkit-flex;
          display: flex;
          -webkit-justify-content: space-between;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        #fh-bar-label {
          font-size: 9px;
          letter-spacing: 2px;
          color: #7a8aaa;
        }
        #fh-bar-pct {
          font-family: 'Barlow Condensed', 'Inter', -apple-system, sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #d4aa00;
        }
        #fh-bar-track {
          height: 3px;
          background: #0f1220;
          border-radius: 3px;
          overflow: hidden;
        }
        #fh-bar-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, #8a6a00, #d4aa00, #ffe066);
          -webkit-transition: width 0.4s ease;
          transition: width 0.4s ease;
        }
        #fh-status {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 3px;
          color: #6a7aaa;
          text-align: center;
          position: relative; z-index: 2;
        }
      `}</style>

      <div id="fh-splash">
        <div id="fh-splash-grid" />
        <div id="fh-splash-glow" />

        {/* Anéis */}
        {[140, 240, 360, 500].map((size, i) => (
          <div
            key={i}
            className="fh-ring"
            style={{
              width: size,
              height: size,
              border: `1px solid rgba(212,170,0,${0.08 - i * 0.015})`,
            }}
          />
        ))}

        {/* Cantos decorativos */}
        <div className="fh-corner" style={{ top: 20, left: 20, borderWidth: '2px 0 0 2px' }} />
        <div className="fh-corner" style={{ top: 20, right: 20, borderWidth: '2px 2px 0 0' }} />
        <div className="fh-corner" style={{ bottom: 20, left: 20, borderWidth: '0 0 2px 2px' }} />
        <div className="fh-corner" style={{ bottom: 20, right: 20, borderWidth: '0 2px 2px 0' }} />

        {/* Logo */}
        <div id="fh-logo-wrap">
          <img
            id="fh-logo-img"
            src="/logo.png"
            alt="FullHead"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Nome */}
        <div id="fh-name">FULLHEAD</div>
        <div id="fh-sub">PANEL · FREE FIRE</div>

        {/* Barra de progresso */}
        <div id="fh-bar-wrap">
          <div id="fh-bar-labels">
            <span id="fh-bar-label">INSTALANDO</span>
            <span id="fh-bar-pct">{pct}%</span>
          </div>
          <div id="fh-bar-track">
            <div id="fh-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Status */}
        <div id="fh-status">{txt}</div>
      </div>
    </>
  );
}
