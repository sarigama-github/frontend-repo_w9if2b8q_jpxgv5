import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import HeroCards from "./components/HeroCards";
import CameraModal from "./components/CameraModal";
import AnalysisSteps from "./components/AnalysisSteps";

const backend = import.meta.env.VITE_BACKEND_URL || "";

function Section({ title, children, subdued }) {
  return (
    <section className={`${subdued ? 'bg-white/3' : ''} rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8`}> 
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-zinc-100/90 text-lg tracking-tight">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function App() {
  const [mode, setMode] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const openFlow = (m) => {
    setMode(m);
    setCameraOpen(true);
  };

  const analyze = async () => {
    if (!mode || !preview) return;
    setLoading(true);
    try {
      const res = await fetch(`${backend}/api/analyze/${mode === 'dish' ? 'dish' : 'ingredients'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, image_url: preview, filename: 'capture.jpg' })
      });
      const data = await res.json();
      setResult(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const analyzeProduct = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      const res = await fetch(`${backend}/api/scan-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'product', image_url: preview, filename: 'capture.jpg' })
      });
      const data = await res.json();
      setResult(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_30%)] pointer-events-none" />
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {!mode && (
          <div className="space-y-10">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl tracking-tight text-zinc-100 font-serif">Präzise Ernährung, minimalistisch gedacht</h1>
              <p className="text-zinc-400 mt-3">Wähle eine Analyse, alles weitere erledigen wir.</p>
            </div>
            <HeroCards onSelect={openFlow} />
          </div>
        )}

        {mode && (
          <div className="mt-6 space-y-6">
            <AnalysisSteps
              title={
                mode === 'dish' ? 'Gerichtsanalyse' : mode === 'ingredients' ? 'Zutatenanalyse' : 'Produktanalyse'
              }
              steps={[
                { label: 'Foto aufnehmen', desc: 'Vollbild-Kamera mit ruhigen Overlays' },
                { label: 'Erkennung', desc: 'Subtile, wissenschaftliche Visualisierung' },
                { label: 'Ergebnis', desc: 'Klar strukturierte, luxuriöse Darstellung' },
              ]}
              active={preview ? (result ? 2 : 1) : 0}
            />

            {!preview && (
              <Section title="Aufnahme">
                <div className="flex justify-center">
                  <button onClick={() => setCameraOpen(true)} className="px-5 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur text-white">Kamera öffnen</button>
                </div>
              </Section>
            )}

            {preview && !result && (
              <Section title="Vorschau">
                <div className="flex flex-col items-center gap-4">
                  <img src={preview} alt="Preview" className="w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl" />
                  {mode === 'product' ? (
                    <button onClick={analyzeProduct} className="px-5 py-3 rounded-full bg-white text-black">Analysieren</button>
                  ) : (
                    <button onClick={analyze} className="px-5 py-3 rounded-full bg-white text-black">Analysieren</button>
                  )}
                </div>
              </Section>
            )}

            {result && mode === 'dish' && (
              <Section title="Ergebnis: Gericht">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <img src={result.image_url} alt="Dish" className="w-full rounded-3xl shadow-2xl border border-white/10" />
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white text-black p-6">
                      <div className="text-sm text-zinc-600">Cuisine</div>
                      <div className="text-2xl font-semibold">{result.cuisine}</div>
                    </div>
                    <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-6">
                      <div className="text-sm text-zinc-400">Portion</div>
                      <div className="text-xl">{result.portion_size}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(result.nutrition).map(([k,v]) => (
                        <div key={k} className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
                          <div className="text-sm text-zinc-400">{k}</div>
                          <div className="text-xl text-zinc-100">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {result && mode === 'ingredients' && (
              <Section title="Erkannte Zutaten">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {result.ingredients.map((ing, idx) => (
                    <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-zinc-100/90">{ing.name}</div>
                      <div className="text-xs text-zinc-400">{Math.round(ing.confidence*100)}% sicher</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <h4 className="text-zinc-200 font-medium mb-3">Rezeptvorschläge</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.recipes.map((r, idx) => (
                      <div key={idx} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                        <img src={`${r.image}&auto=format&fit=crop&w=900&q=60`} alt={r.title} className="h-48 w-full object-cover" />
                        <div className="p-5 flex items-center justify-between">
                          <div>
                            <div className="text-zinc-100/90 text-lg">{r.title}</div>
                            <div className="text-zinc-400 text-sm">{r.time}</div>
                          </div>
                          <button className="px-4 py-2 rounded-full border border-white/20 text-white">Öffnen</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {result && mode === 'product' && (
              <Section title="Produktdetails">
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
                  <div>
                    <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                      <img src={result.image_url || 'https://images.unsplash.com/photo-1580913428761-1bd5235df79e?auto=format&fit=crop&w=1200&q=60'} alt={result.name} className="w-full h-80 object-cover" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="rounded-2xl bg-white text-black p-6">
                      <div className="text-sm text-zinc-600">{result.brand}</div>
                      <div className="text-2xl font-semibold">{result.name}</div>
                      <div className="text-xs text-zinc-600 mt-1">Barcode {result.barcode}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 overflow-hidden">
                      {result.nutrition_table.map((row, idx) => (
                        <div key={idx} className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10 last:border-b-0">
                          <div className="text-zinc-300">{row.label}</div>
                          <div className="text-zinc-100">{row.value}</div>
                        </div>
                      ))}
                    </div>
                    {result.warnings && result.warnings.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {result.warnings.map((w, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30 text-xs">{w.text}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Section>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        <CameraModal
          open={cameraOpen}
          onClose={() => setCameraOpen(false)}
          mode={mode}
          onCapture={(img) => setPreview(img)}
        />
      </AnimatePresence>
    </div>
  );
}
