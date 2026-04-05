'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030308]">
      <div className="text-center">
        <p className="text-xs font-mono text-blue-400/50 mb-4">PROTEUS — ERROR</p>
        <h1 className="text-2xl font-bold text-white mb-2">Algo salió mal</h1>
        <p className="text-white/40 text-sm mb-6">Proteus necesita reorganizarse.</p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 hover:bg-blue-500/20 transition-all"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
