'use client';

import { useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import ProteusChat from '@/components/ProteusChat';
import Portfolio from '@/components/Portfolio';
import MorphingTitle from '@/components/MorphingTitle';

export default function Home() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  return (
    <div className="noise min-h-screen relative">
      <ParticleBackground />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {!showPortfolio ? (
          <>
            {/* Logo / Brand */}
            {!chatStarted && (
              <div className="text-center mb-8 chat-message-enter">
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-blue-400 pulse-ring relative" />
                  <span className="text-xs tracking-[0.2em] uppercase text-white/30 font-mono">
                    PROTEUS IA
                  </span>
                </div>
                <MorphingTitle />
              </div>
            )}

            {/* Chat Interface */}
            <ProteusChat
              onChatStart={() => setChatStarted(true)}
              onShowPortfolio={() => setShowPortfolio(true)}
            />

            {/* Ver nuestros trabajos - only before chat starts */}
            {!chatStarted && (
              <button
                onClick={() => setShowPortfolio(true)}
                className="mt-8 text-sm text-white/30 hover:text-white/60 transition-colors duration-300 underline underline-offset-4 decoration-white/10 hover:decoration-white/30"
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
