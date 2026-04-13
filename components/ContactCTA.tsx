'use client';

import { useState } from 'react';

interface LeadProfile {
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

interface Props {
  leadProfile: LeadProfile;
  onShowPortfolio: () => void;
}

export default function ContactCTA({ leadProfile, onShowPortfolio }: Props) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!contactInfo.name || !contactInfo.email) return;
    if (selectedAction === 'call' && !contactInfo.phone) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactInfo,
          action: selectedAction,
          profile: leadProfile,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Server error');
      }

      setSubmitted(true);
    } catch {
      alert('Error al enviar. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="chat-message-enter text-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#1A1A2E] mb-2">Tu perfil ha sido creado</h3>
        <p className="text-[#1A1A2E]/60 text-sm mb-1">
          Nuestro equipo ya tiene tu diagnóstico completo.
        </p>
        <p className="text-[#1A1A2E]/60 text-sm mb-6">
          Te contactaremos muy pronto.
        </p>
        <p className="text-[#A8862F] text-xs font-mono">— PROTEUS</p>
      </div>
    );
  }

  if (selectedAction) {
    return (
      <div className="chat-message-enter space-y-4 max-w-md mx-auto">
        <p className="text-[#1A1A2E]/70 text-sm text-center mb-6">
          {selectedAction === 'call'
            ? 'Déjame tu número y te llamamos en breve.'
            : selectedAction === 'schedule'
            ? 'Déjanos tus datos para agendar la sesión.'
            : 'Te enviaremos el diagnóstico completo.'}
        </p>

        <input
          type="text"
          placeholder="Tu nombre"
          value={contactInfo.name}
          onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
          className="w-full bg-white/90 backdrop-blur border border-[#1A1A2E]/12 rounded-xl px-4 py-3 text-[#1A1A2E] text-sm placeholder-[#1A1A2E]/40 focus:outline-none focus:border-[#C5A55A]/65 focus:shadow-[0_4px_18px_rgba(197,165,90,0.18)] transition-all"
        />
        <input
          type="email"
          placeholder="Tu email"
          value={contactInfo.email}
          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
          className="w-full bg-white/90 backdrop-blur border border-[#1A1A2E]/12 rounded-xl px-4 py-3 text-[#1A1A2E] text-sm placeholder-[#1A1A2E]/40 focus:outline-none focus:border-[#C5A55A]/65 focus:shadow-[0_4px_18px_rgba(197,165,90,0.18)] transition-all"
        />
        {selectedAction === 'call' && (
          <input
            type="tel"
            placeholder="Tu teléfono"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            className="w-full bg-white/90 backdrop-blur border border-[#1A1A2E]/12 rounded-xl px-4 py-3 text-[#1A1A2E] text-sm placeholder-[#1A1A2E]/40 focus:outline-none focus:border-[#C5A55A]/65 focus:shadow-[0_4px_18px_rgba(197,165,90,0.18)] transition-all"
          />
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setSelectedAction(null)}
            className="flex-1 py-3 rounded-xl text-sm text-[#1A1A2E]/55 hover:text-[#1A1A2E] border border-[#1A1A2E]/10 hover:border-[#1A1A2E]/25 bg-white/60 hover:bg-white transition-all"
          >
            Volver
          </button>
          <button
            onClick={handleSubmit}
            disabled={!contactInfo.name || !contactInfo.email || (selectedAction === 'call' && !contactInfo.phone) || isSubmitting}
            className="flex-1 py-3 rounded-xl text-sm text-white bg-[#1A1A2E] hover:bg-[#0F3460] border border-[#A8862F]/40 hover:shadow-[0_8px_28px_rgba(197,165,90,0.35)] transition-all disabled:opacity-40"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-message-enter space-y-4 max-w-lg mx-auto">
      {/* Score Display */}
      <div className="text-center mb-6">
        <p className="text-xs text-[#A8862F] font-mono mb-3 tracking-[0.18em]">DIAGNÓSTICO COMPLETADO</p>
        <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur border border-[#1A1A2E]/[0.08] rounded-xl px-5 py-3 shadow-sm">
          <div className="text-2xl font-bold gradient-text">{leadProfile.score}/10</div>
          <div className="text-left">
            <div className="text-xs text-[#1A1A2E]/60">Potencial de transformación</div>
            <div className="w-32 h-1.5 bg-[#1A1A2E]/[0.08] rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full score-fill"
                style={{
                  width: `${leadProfile.score * 10}%`,
                  background: `linear-gradient(90deg, #A8862F, #C5A55A, #E8D9A8)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Proteus closing message */}
      <p className="text-center text-[#1A1A2E]/70 text-sm leading-relaxed mb-6">
        Ya tengo la forma inicial de tu solución. Para entregarte el mapa detallado y
        cómo lo implementaremos, demos el último paso:
      </p>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => setSelectedAction('call')}
          className="cta-btn w-full flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-[#1A1A2E]">Llámenme ahora</div>
            <div className="text-xs text-[#1A1A2E]/55">Recibe una llamada en minutos</div>
          </div>
        </button>

        <button
          onClick={() => setSelectedAction('schedule')}
          className="cta-btn w-full flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-[#0F3460]/8 border border-[#0F3460]/15 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#0F3460]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-[#1A1A2E]">Agendar sesión con un experto</div>
            <div className="text-xs text-[#1A1A2E]/55">Elige el día y hora que te convenga</div>
          </div>
        </button>

        <button
          onClick={() => setSelectedAction('email')}
          className="cta-btn w-full flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-[#C5A55A]/12 border border-[#C5A55A]/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#A8862F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-[#1A1A2E]">Recibir diagnóstico por correo</div>
            <div className="text-xs text-[#1A1A2E]/55">Te enviamos el análisis completo</div>
          </div>
        </button>
      </div>

      {/* Portfolio link */}
      <button
        onClick={onShowPortfolio}
        className="w-full text-center text-xs text-[#1A1A2E]/45 hover:text-[#A8862F] transition-colors mt-4 py-2"
      >
        O ver casos similares al tuyo
      </button>
    </div>
  );
}
