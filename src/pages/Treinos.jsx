import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";

export default function Treinos() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Todos");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["Todos", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => category === "Todos" || i.category === category);
  }, [items, category]);

  useEffect(() => {
    async function fetchAll() {
      const snap = await getDocs(collection(db, "treinos"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(list);
      setLoading(false);
    }
    fetchAll();
  }, []);

  function copyTreino(t) {
    const text =
      `Entrenamiento: ${t.title}\nCategoría: ${t.category}\nDuración: ${t.duration}\nNivel: ${t.level}\n\n` +
      t.steps +
      (t.notes ? `\n\nNota: ${t.notes}` : "");
    navigator.clipboard.writeText(text);
    alert("✓ ¡Entrenamiento copiado!");
  }

  return (
    <div className="module-page">
      <div className="module-header">
        <button className="module-back-btn" onClick={() => navigate("/")} title="Volver">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <div className="module-title">Entrenamientos Diarios</div>
          <div className="module-subtitle">Rutinas para mejorar tu destreza</div>
        </div>
      </div>

      <div style={{ padding: "24px 24px 48px" }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="fh-select" style={{ maxWidth: "220px", marginBottom: "20px" }}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>

        {loading ? (
          <div className="loading-text">Cargando entrenamientos...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filtered.map((t) => (
              <div key={t.id} className="data-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--gold)", marginBottom: "4px", letterSpacing: "0.5px" }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {t.category} · {t.duration} · {t.level}
                    </div>
                  </div>
                  <button className="btn-copy" onClick={() => copyTreino(t)}>Copiar</button>
                </div>

                <pre className="code-block">{t.steps}</pre>

                {t.notes && (
                  <div style={{ marginTop: "10px", fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    Nota: {t.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
