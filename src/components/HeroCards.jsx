import { motion } from "framer-motion";
import { Camera, Utensils, ScanLine } from "lucide-react";

const Card = ({ icon: Icon, title, subtitle, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="group relative w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 text-left shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
  >
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
        <Icon className="h-6 w-6 text-white/80" />
      </div>
      <div>
        <h3 className="text-white/95 text-xl sm:text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="text-white/60 text-sm sm:text-base mt-1">{subtitle}</p>
      </div>
    </div>
  </motion.button>
);

export default function HeroCards({ onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <Card
        icon={Utensils}
        title="Fertiges Gericht analysieren"
        subtitle="Foto aufnehmen und Ernährung aufschlüsseln"
        onClick={() => onSelect("dish")}
      />
      <Card
        icon={Camera}
        title="Zutaten analysieren"
        subtitle="Lebensmittel erkennen und Rezepte erhalten"
        onClick={() => onSelect("ingredients")}
      />
      <Card
        icon={ScanLine}
        title="Produkt scannen"
        subtitle="Barcode scannen und Details einsehen"
        onClick={() => onSelect("product")}
      />
    </div>
  );
}
