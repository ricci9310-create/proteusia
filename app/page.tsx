'use client';

import { useState, useCallback } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import ProteusChat from '@/components/ProteusChat';
import Portfolio from '@/components/Portfolio';
import MorphingTitle from '@/components/MorphingTitle';

export default function Home() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  const handleReset = useCallback(() => {
    setChatStarted(false);
    setChatKey((k) => k + 1); // Forces ProteusChat to remount fresh
  }, []);

  return (
    <div className="noise min-h-screen relative">
      <ParticleBackground />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {!showPortfolio ? (
          <>
            {/* Reset button - visible during/after chat */}
            {chatStarted && (
              <button
                onClick={handleReset}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur border border-[#1A1A2E]/10 text-[#1A1A2E]/55 hover:text-[#1A1A2E] hover:border-[#C5A55A]/55 hover:bg-white transition-all text-xs shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Nueva consulta
              </button>
            )}

            {/* Logo / Brand */}
            {!chatStarted && (
              <div className="text-center mb-8 chat-message-enter">
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#A8862F] pulse-ring relative" />
                  <span className="text-xs tracking-[0.2em] uppercase text-[#1A1A2E]/55 font-mono">
                    PROTEUS IA
                  </span>
                </div>
                <MorphingTitle />
              </div>
            )}

            {/* Chat Interface */}
            <ProteusChat
              key={chatKey}
              onChatStart={() => setChatStarted(true)}
              onShowPortfolio={() => setShowPortfolio(true)}
            />

            {/* Ver nuestros trabajos - only before chat starts */}
            {!chatStarted && (
              <button
                onClick={() => setShowPortfolio(true)}
                className="mt-8 text-sm text-[#1A1A2E]/50 hover:text-[#A8862F] transition-colors duration-300 underline underline-offset-4 decoration-[#1A1A2E]/15 hover:decoration-[#C5A55A]/60"
              >
                Ver nuestros trabajos
              </button>
            )}
          </>
        ) : (
          <Portfolio onBack={() => setShowPortfolio(false)} />
        )}
      </main>
    </div>
  );
}
