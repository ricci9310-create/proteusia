import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030308]">
      <div className="text-center">
        <p className="text-xs font-mono text-blue-400/50 mb-4">PROTEUS — 404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Esta forma no existe</h1>
        <p className="text-white/40 text-sm mb-6">Proteus no encontró lo que buscas.</p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 hover:bg-blue-500/20 transition-all inline-block"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
