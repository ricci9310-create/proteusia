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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = async (text: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      setIsSpeaking(true);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        setIsSpeaking(false);
        return;
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('audio')) {
        setIsSpeaking(false);
        return;
      }

      const audioBlob = await response.blob();
      if (audioBlob.size < 100) {
        setIsSpeaking(false);
        return;
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play().catch(() => setIsSpeaking(false));
    } catch {
      setIsSpeaking(false);
    }
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
        setShowCTA(true);
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
                className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur ${
                  msg.role === 'user'
                    ? 'bg-[#C5A55A]/15 text-[#1A1A2E] rounded-br-md border border-[#C5A55A]/45'
                    : 'bg-white/85 text-[#1A1A2E]/85 rounded-bl-md border border-[#1A1A2E]/[0.08]'
                }`}
              >
                {msg.role === 'proteus' && (
                  <span className="text-xs text-[#A8862F] font-mono block mb-1">PROTEUS</span>
                )}
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start chat-message-enter">
              <div className="bg-white/85 backdrop-blur border border-[#1A1A2E]/[0.08] rounded-2xl rounded-bl-md px-5 py-3 shadow-sm">
                <span className="text-xs text-[#A8862F] font-mono block mb-2">PROTEUS</span>
                <div className="flex gap-1.5 items-center h-5">
                  <div className="typing-dot w-2 h-2 rounded-full bg-[#A8862F]" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-[#A8862F]" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-[#A8862F]" />
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
        <form onSubmit={handleSubmit} className={`relative ${isLoading ? 'input-thinking' : ''}`}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              messages.length === 0
                ? '¿En qué quieres que nos transformemos para tu negocio?'
                : 'Escribe tu respuesta...'
            }
            className={`w-full bg-white/90 backdrop-blur border border-[#1A1A2E]/12 rounded-2xl px-6 py-5 pr-14 text-[#1A1A2E] placeholder-[#1A1A2E]/40 text-sm text-center focus:outline-none transition-all duration-500 ${
              messages.length === 0 && !isLoading ? 'input-breathing' : ''
            } ${!isLoading ? 'focus:border-[#C5A55A]/65 focus:shadow-[0_8px_36px_rgba(197,165,90,0.22)]' : 'border-transparent'}`}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#C5A55A]/20 hover:bg-[#C5A55A]/35 flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-[#C5A55A]/20 z-10"
          >
            <svg className="w-4 h-4 text-[#A8862F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}
