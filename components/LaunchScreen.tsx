import React from 'react';
import { Link } from 'react-router-dom';

const LaunchScreen: React.FC = () => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden h-screen w-screen selection:bg-primary selection:text-white relative flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0579c7]/10 via-transparent to-transparent"></div>
        <div className="scanline"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#213a4a]/50 bg-background-dark/80 backdrop-blur-md px-6 py-4 lg:px-10 z-50">
          <div className="flex items-center gap-3 text-white">
            <div className="size-8 flex items-center justify-center rounded bg-primary/20 text-primary border border-primary/30">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
            <div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-tight">IEEE Synapse</h2>
              <p className="text-[10px] text-gray-400 font-mono leading-none tracking-widest uppercase opacity-70">v.2026.1.0-RC</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 bg-[#15232d] p-1 rounded-lg border border-[#213a4a]">
            <a className="text-gray-300 hover:text-white hover:bg-[#213a4a] px-4 py-1.5 rounded text-sm font-medium transition-colors" href="#">Home</a>
            <a className="text-gray-300 hover:text-white hover:bg-[#213a4a] px-4 py-1.5 rounded text-sm font-medium transition-colors" href="#">Tracks</a>
            <a className="text-gray-300 hover:text-white hover:bg-[#213a4a] px-4 py-1.5 rounded text-sm font-medium transition-colors" href="#">Rules</a>
            <a className="text-gray-300 hover:text-white hover:bg-[#213a4a] px-4 py-1.5 rounded text-sm font-medium transition-colors" href="#">Sponsors</a>
          </nav>
          <div className="flex items-center gap-4">
            <a className="hidden sm:block text-gray-400 hover:text-white text-sm font-medium transition-colors" href="#">Login</a>
            <Link to="/ide" className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-primary/90 transition-all text-white text-sm font-bold shadow-[0_0_15px_rgba(5,121,199,0.5)] hover:shadow-[0_0_25px_rgba(5,121,199,0.7)] border border-primary/50">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span className="truncate">Launch Editor</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 relative">
          {/* Floating Code Fragments */}
          <div className="absolute top-20 left-10 opacity-10 hidden lg:block font-mono text-xs text-primary select-none pointer-events-none">
            <p>function initSynapse() {'{'}</p>
            <p>&nbsp;&nbsp;const core = new NeuralNet();</p>
            <p>&nbsp;&nbsp;core.connect();</p>
            <p>{'}'}</p>
          </div>
          <div className="absolute bottom-40 right-10 opacity-10 hidden lg:block font-mono text-xs text-primary select-none pointer-events-none text-right">
            <p>// Optimizing pathways...</p>
            <p>if (ready) return true;</p>
            <p>await loadModules(['algo', 'dev']);</p>
          </div>

          <div className="layout-content-container flex flex-col items-center max-w-[960px] w-full z-20">
            <div className="flex flex-col gap-6 items-center justify-center p-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-mono text-primary tracking-wide uppercase">Registrations Open</span>
              </div>
              <div className="flex flex-col gap-1 text-center relative">
                <h1 className="glitch-text text-white text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter" data-text="SYNAPSE">
                  SYNAPSE
                </h1>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/50"></span>
                  <span className="text-primary text-2xl md:text-4xl font-bold tracking-[0.2em] opacity-90">2026</span>
                  <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/50"></span>
                </div>
              </div>
              <h2 className="text-gray-400 font-mono text-sm md:text-base lg:text-lg max-w-xl mt-4">
                <span className="text-primary mr-2">&gt;</span>IEEE’s Flagship Coding Week<span className="animate-pulse">_</span>
              </h2>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
                <Link to="/ide" className="group relative flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-primary hover:bg-[#046cb3] text-white transition-all duration-300 shadow-[0_0_20px_rgba(5,121,199,0.4)] hover:shadow-[0_0_40px_rgba(5,121,199,0.6)] border border-primary/50">
                  <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] hover:animate-[shimmer_2s_linear_infinite]"></div>
                  <style>{`
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                  `}</style>
                  <span className="relative text-lg font-bold tracking-wide mr-2">INITIALIZE IDE</span>
                  <span className="material-symbols-outlined relative group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-14 px-6 border border-[#213a4a] bg-[#15232d]/50 hover:bg-[#213a4a] text-gray-300 hover:text-white font-medium transition-colors backdrop-blur-sm">
                  <span className="text-sm tracking-wide">VIEW TRACKS</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-[#213a4a] bg-[#0f1b23] py-2 px-4 z-50">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs font-mono text-[#5b7a8c] gap-2">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px] sm:text-[14px]">dns</span>
                SERVER: US-EAST-1
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px] sm:text-[14px] text-emerald-500">wifi</span>
                ONLINE
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px] sm:text-[14px]">speed</span>
                LATENCY: 24ms
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="opacity-50">© IEEE 2026</span>
              <span className="hidden sm:inline-block w-[1px] h-3 bg-[#213a4a]"></span>
              <span className="hidden sm:inline-block">OCT 12-14, 2026</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LaunchScreen;