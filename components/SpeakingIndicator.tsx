'use client';

export default function SpeakingIndicator() {
  return (
    <div className="flex items-center justify-center gap-2 mb-4 chat-message-enter">
      <div className="flex items-end gap-[3px] h-6">
        <div className="sound-bar" />
        <div className="sound-bar" />
        <div className="sound-bar" />
        <div className="sound-bar" />
        <div className="sound-bar" />
      </div>
      <span className="text-xs text-blue-400/50 font-mono ml-2">Proteus está hablando...</span>
    </div>
  );
}
