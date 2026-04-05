'use client';

import { useState, useRef, useEffect } from 'react';
import SpeakingIndicator from './SpeakingIndicator';
import ContactCTA from './ContactCTA';

interface Message {
  role: 'proteus' | 'user';
  content: string;
}

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
  onChatStart: () => void;
  onShowPortfolio: () => void;
}

export default function ProteusChat({ onChatStart, onShowPortfolio }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [leadProfile, setLeadProfile] = useState<LeadProfile | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 1.25;
    utterance.pitch = 1.0;

    // Try to find a natural Spanish voice
    const voices = synthRef.current.getVoices();
    const spanishVoice = voices.find(
      (v) => v.lang.startsWith('es') && (v.name.includes('Google') || v.name.includes('Microsoft'))
    ) || voices.find((v) => v.lang.startsWith('es'));
    if (spanishVoice) utterance.voice = spanishVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    if (messages.length === 0) {
      onChatStart();
    }

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/proteus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          questionCount,
        }),
      });

      const data = await response.json();

      if (data.message) {
        setMessages([...newMessages, { role: 'proteus', content: data.message }]);
        speak(data.message);
        setQuestionCount(data.questionCount || questionCount + 1);
      }

      if (data.leadProfile) {
        setLeadProfile(data.leadProfile);
      }

      if (data.showCTA) {
        setTimeout(() => setShowCTA(true), 2000);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: 'proteus', content: 'Disculpa, hubo un error de conexión. ¿Puedes intentarlo de nuevo?' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="mb-6 max-h-[50vh] overflow-y-auto px-2 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message-enter flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-500/20 text-white/90 rounded-br-md border border-blue-500/20'
                    : 'bg-white/[0.04] text-white/80 rounded-bl-md border border-white/[0.06]'
                }`}
              >
                {msg.role === 'proteus' && (
                  <span className="text-xs text-blue-400/60 font-mono block mb-1">PROTEUS</span>
                )}
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start chat-message-enter">
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-bl-md px-5 py-3">
                <span className="text-xs text-blue-400/60 font-mono block mb-2">PROTEUS</span>
                <div className="flex gap-1.5 items-center h-5">
                  <div className="typing-dot w-2 h-2 rounded-full bg-blue-400/60" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-blue-400/60" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-blue-400/60" />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      )}

      {/* Speaking Indicator */}
      {isSpeaking && <SpeakingIndicator />}

      {/* CTA Section */}
      {showCTA && leadProfile && (
        <ContactCTA
          leadProfile={leadProfile}
          onShowPortfolio={onShowPortfolio}
        />
      )}

      {/* Input */}
      {!showCTA && (
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              messages.length === 0
                ? '¿Cuál es el mayor cuello de botella de tu negocio?'
                : 'Escribe tu respuesta...'
            }
            className={`w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 pr-14 text-white placeholder-white/25 text-sm focus:outline-none transition-all duration-500 ${
              messages.length === 0 ? 'input-breathing' : 'focus:border-blue-500/40 focus:shadow-[0_0_30px_rgba(79,143,255,0.15)]'
            }`}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-blue-500/20"
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}
