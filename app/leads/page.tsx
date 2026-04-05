'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string | null;
  action: string;
  score: number;
  painLevel: string;
  infrastructure: string;
  authority: string;
  industry: string;
  summary: string;
  suggestedSolution: string;
  psychProfile: string;
  salesStrategy: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads?key=${password}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
        setAuthenticated(true);
      } else {
        alert('Contraseña incorrecta');
      }
    } catch {
      alert('Error al cargar leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      const interval = setInterval(fetchLeads, 15000);
      return () => clearInterval(interval);
    }
  }, [authenticated, password]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#030308] flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <p className="text-xs font-mono text-blue-400/50 text-center mb-4">PROTEUS — LEADS</p>
          <h1 className="text-xl font-bold text-white text-center mb-6">Acceso al Dashboard</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchLeads();
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/40"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-sm text-white hover:bg-blue-500/30 transition-all"
            >
              {loading ? 'Cargando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030308] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-mono text-blue-400/50">PROTEUS — DASHBOARD</p>
            <h1 className="text-2xl font-bold text-white mt-1">Leads Capturados</h1>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold gradient-text">{leads.length}</div>
            <div className="text-xs text-white/30">total leads</div>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-sm">No hay leads aún. Cuando alguien interactúe con Proteus, aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...leads].reverse().map((lead) => (
              <div
                key={lead.id}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-blue-500/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Left: Contact info */}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-semibold text-white">{lead.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                          lead.score >= 8
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : lead.score >= 6
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-white/5 text-white/40 border border-white/10'
                        }`}
                      >
                        {lead.score}/10
                      </span>
                    </div>
                    <p className="text-sm text-white/50">{lead.email}</p>
                    {lead.phone && <p className="text-sm text-white/40">{lead.phone}</p>}
                    <p className="text-xs text-white/25 mt-1">
                      {new Date(lead.timestamp).toLocaleString('es-CO')} · {lead.action}
                    </p>
                  </div>

                  {/* Right: Profile */}
                  <div className="flex-1 min-w-[250px]">
                    <p className="text-sm text-white/60 mb-1">
                      <span className="text-white/30">Problema:</span> {lead.summary}
                    </p>
                    <p className="text-sm text-white/60 mb-1">
                      <span className="text-white/30">Solución:</span> {lead.suggestedSolution}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/30">
                        {lead.industry}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/30">
                        Dolor: {lead.painLevel}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/30">
                        {lead.psychProfile}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-400/60">
                        {lead.salesStrategy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-[10px] text-white/15 mt-8 font-mono">
          Auto-refresh cada 15s · Los leads se mantienen hasta el próximo deploy
        </p>
      </div>
    </div>
  );
}
