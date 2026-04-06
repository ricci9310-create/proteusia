'use client';

import { useState, useEffect, useMemo } from 'react';

type Status = 'LEAD' | 'CONTACTED' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'WON' | 'LOST';

interface Lead {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string | null;
  action: string;
  status: Status;
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

type StatusFilter = 'ALL' | Status;
type ScoreFilter = 'ALL' | 'HOT' | 'WARM' | 'COLD';
type SortMode = 'recent' | 'score';

const STATUS_CYCLE: Record<Status, Status> = {
  LEAD: 'CONTACTED',
  CONTACTED: 'WON',
  PROPOSAL_SENT: 'WON',
  NEGOTIATION: 'WON',
  WON: 'LOST',
  LOST: 'LEAD',
};

const STATUS_STYLE: Record<Status, string> = {
  LEAD: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  CONTACTED: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  PROPOSAL_SENT: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  NEGOTIATION: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  WON: 'bg-green-500/15 text-green-300 border-green-500/30',
  LOST: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const STATUS_LABEL: Record<Status, string> = {
  LEAD: 'Nuevo',
  CONTACTED: 'Contactado',
  PROPOSAL_SENT: 'Propuesta',
  NEGOTIATION: 'Negociando',
  WON: 'Ganado',
  LOST: 'Perdido',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('ALL');
  const [sortMode, setSortMode] = useState<SortMode>('recent');

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

  const cycleStatus = async (lead: Lead) => {
    const next = STATUS_CYCLE[lead.status];
    // optimistic update
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: next } : l)));
    try {
      const res = await fetch(`/api/leads/${lead.id}?key=${password}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error('PATCH failed');
    } catch {
      // rollback
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: lead.status } : l)));
      alert('No se pudo actualizar el status');
    }
  };

  const kpis = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter((l) => l.score >= 8).length;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = leads.filter((l) => new Date(l.timestamp).getTime() >= oneWeekAgo).length;
    const withPhone = leads.filter((l) => !!l.phone).length;
    const phonePct = total === 0 ? 0 : Math.round((withPhone / total) * 100);
    return { total, hot, thisWeek, phonePct };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let out = leads;
    if (statusFilter !== 'ALL') out = out.filter((l) => l.status === statusFilter);
    if (scoreFilter === 'HOT') out = out.filter((l) => l.score >= 8);
    if (scoreFilter === 'WARM') out = out.filter((l) => l.score >= 6 && l.score < 8);
    if (scoreFilter === 'COLD') out = out.filter((l) => l.score < 6);
    if (sortMode === 'recent') {
      out = [...out].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      out = [...out].sort((a, b) => b.score - a.score);
    }
    return out;
  }, [leads, statusFilter, scoreFilter, sortMode]);

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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <p className="text-xs font-mono text-blue-400/50">PROTEUS — DASHBOARD</p>
            <h1 className="text-2xl font-bold text-white mt-1">Leads Capturados</h1>
          </div>
          <button
            onClick={fetchLeads}
            className="text-xs font-mono px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
          >
            Refrescar
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Total" value={kpis.total} />
          <KpiCard label="Hot leads (≥8)" value={kpis.hot} accent="green" />
          <KpiCard label="Esta semana" value={kpis.thisWeek} accent="blue" />
          <KpiCard label="% con teléfono" value={`${kpis.phonePct}%`} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <FilterGroup
            label="Status"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as StatusFilter)}
            options={[
              { value: 'ALL', label: 'Todos' },
              { value: 'LEAD', label: 'Nuevo' },
              { value: 'CONTACTED', label: 'Contactado' },
              { value: 'WON', label: 'Ganado' },
              { value: 'LOST', label: 'Perdido' },
            ]}
          />
          <FilterGroup
            label="Score"
            value={scoreFilter}
            onChange={(v) => setScoreFilter(v as ScoreFilter)}
            options={[
              { value: 'ALL', label: 'Todos' },
              { value: 'HOT', label: 'Hot ≥8' },
              { value: 'WARM', label: 'Warm 6-7' },
              { value: 'COLD', label: 'Cold ≤5' },
            ]}
          />
          <FilterGroup
            label="Orden"
            value={sortMode}
            onChange={(v) => setSortMode(v as SortMode)}
            options={[
              { value: 'recent', label: 'Recientes' },
              { value: 'score', label: 'Score' },
            ]}
          />
        </div>

        {filteredLeads.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-sm">
              {leads.length === 0
                ? 'No hay leads aún. Cuando alguien interactúe con Proteus, aparecerán aquí.'
                : 'Ningún lead coincide con los filtros actuales.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-blue-500/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Left: Contact info */}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
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
                      <button
                        onClick={() => cycleStatus(lead)}
                        title="Click para avanzar el status"
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono border transition-all hover:scale-105 ${STATUS_STYLE[lead.status]}`}
                      >
                        {STATUS_LABEL[lead.status]}
                      </button>
                    </div>
                    <p className="text-sm text-white/50">{lead.email}</p>
                    {lead.phone && <p className="text-sm text-white/40">{lead.phone}</p>}
                    <p className="text-xs text-white/25 mt-1">
                      {new Date(lead.timestamp).toLocaleString('es-CO')} · {lead.action}
                    </p>

                    {/* Quick actions */}
                    <div className="flex gap-2 mt-3">
                      {lead.phone && (
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                            `Hola ${lead.name}, soy Daniel de Proteus. Vi tu mensaje sobre ${lead.summary || 'tu proyecto'}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all"
                        >
                          WhatsApp
                        </a>
                      )}
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}?subject=${encodeURIComponent('Proteus — Sobre tu consulta')}&body=${encodeURIComponent(`Hola ${lead.name},\n\n`)}`}
                          className="text-[10px] px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all"
                        >
                          Email
                        </a>
                      )}
                    </div>
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
                      {lead.industry && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/30">
                          {lead.industry}
                        </span>
                      )}
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
          Auto-refresh cada 15s · Persistido en Intel Hub Neon
        </p>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: 'green' | 'blue';
}) {
  const accentClass =
    accent === 'green' ? 'text-green-400' : accent === 'blue' ? 'text-blue-400' : 'text-white';
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
      <div className={`text-2xl font-bold ${accentClass}`}>{value}</div>
      <div className="text-[10px] text-white/40 mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-white/30 font-mono uppercase mr-1">{label}:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`text-[10px] px-2 py-1 rounded border transition-all ${
            value === opt.value
              ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
              : 'bg-white/[0.02] border-white/10 text-white/40 hover:text-white/70'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
