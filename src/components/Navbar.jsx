export default function Navbar() {
  return (
    <nav className="w-full h-16 glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b border-cyan-500/20 flex items-center px-6 relative z-10">
      <div className="flex items-center gap-3">
        <div className="navbar-spinner w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        <h1 className="text-xl font-bold tracking-widest text-glow-cyan text-white uppercase">
          Orbital Pipeline Simulator
        </h1>
      </div>
      

      {/* Animated underline */}
      <div className="absolute bottom-0 left-0 w-full gradient-line" />
    </nav>
  );
}
