import { motion } from "framer-motion";

export default function AnalysisSteps({ steps = [], active = 0, title }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-serif text-zinc-100 tracking-tight">{title}</h2>
      </div>
      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={i} className="relative">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className={`h-6 w-6 rounded-full border ${i <= active ? 'border-yellow-400' : 'border-white/20'} flex items-center justify-center`}> 
                  <div className={`h-2.5 w-2.5 rounded-full ${i <= active ? 'bg-yellow-400' : 'bg-white/20'}`} />
                </div>
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 28, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute left-1/2 -translate-x-1/2 top-6 w-px bg-gradient-to-b from-white/20 to-white/5"
                  />
                )}
              </div>
              <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
                <div className="text-zinc-100/90 font-medium">{s.label}</div>
                {s.desc && <div className="text-zinc-300/60 text-sm mt-1">{s.desc}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
