export default function Header() {
  return (
    <header className="w-full flex items-center justify-center py-10">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/15 backdrop-blur-sm flex items-center justify-center">
          <div className="h-5 w-5 rounded-[6px] bg-gradient-to-br from-zinc-200 to-zinc-100" />
        </div>
        <span className="text-zinc-100/90 tracking-tight text-lg">Nutrivue</span>
      </div>
    </header>
  );
}
