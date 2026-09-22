import React, { useRef, useEffect } from 'react';
import { ChatMessage, Companion, ThemeVibe } from '../types';
import { Volume2, Copy, Check, Sparkles, Heart } from 'lucide-react';
import { soundEngine, voiceSynthesizer } from '../utils/audio';
import { DpPreset, DP_PRESETS } from '../data/dpPresets';
import { CompanionPortrait } from './CompanionPortrait';

interface MessageListProps {
  messages: ChatMessage[];
  companion: Companion;
  isTyping: boolean;
  onSendStarter: (starterText: string) => void;
  speakingMsgId: string | null;
  onSpeakMessage: (msg: ChatMessage) => void;
  currentTheme?: ThemeVibe;
  activeDpPreset?: DpPreset;
  customDpUrl?: string | null;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  companion,
  isTyping,
  onSendStarter,
  speakingMsgId,
  onSpeakMessage,
  currentTheme,
  activeDpPreset,
  customDpUrl,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const currentPreset: DpPreset =
    activeDpPreset || DP_PRESETS[companion.id]?.[0] || DP_PRESETS.pooja[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopy = (id: string, text: string) => {
    soundEngine.playButtonClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
      {/* Welcome / Empty State */}
      {messages.length === 0 && (
        <div className="text-center py-6 px-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {companion.name} is here for you! ✨
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            {companion.tagline}. Natural Hinglish mein baat karein, chahe din ki baatein hon ya koi funny kissa!
          </p>

          <div className="text-xs font-semibold text-slate-300 mb-2">Try saying:</div>
          <div className="flex flex-col gap-2">
            {companion.sampleStarters.map((starter, idx) => (
              <button
                key={idx}
                onClick={() => onSendStarter(starter)}
                className="w-full text-left px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-200 text-xs transition-all cursor-pointer shadow-sm active:scale-98"
              >
                "{starter}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((msg) => {
        const isUser = msg.sender === 'user';
        const isSpeaking = speakingMsgId === msg.id;

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
          >
            <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%]`}>
              {!isUser && (
                <div
                  className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 mb-1 shadow-md ring-1 ring-rose-500/40 bg-slate-900"
                  title={companion.name}
                >
                  <CompanionPortrait
                    preset={currentPreset}
                    customImageUrl={customDpUrl}
                    size="xs"
                    showAccessories={false}
                    className="w-full h-full"
                  />
                </div>
              )}

              <div
                className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all shadow-md ${
                  isUser
                    ? `${currentTheme ? currentTheme.userBubbleBg : 'bg-rose-500 text-white'} rounded-br-xs`
                    : 'bg-slate-800/95 text-slate-100 rounded-bl-xs border border-slate-700/80'
                }`}
              >
                {/* Message Text with preserved lines */}
                <div className="whitespace-pre-wrap select-text">{msg.text}</div>

                {/* Supportive reflective badge when companion asks a reflective question for negative moods */}
                {!isUser && msg.hasReflectiveQuestion && (
                  <div className="mt-2 pt-1.5 border-t border-rose-500/20 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-rose-300 font-medium">
                    <Heart className="w-3 h-3 fill-rose-400 text-rose-400 animate-pulse shrink-0" />
                    <span>Supportive Reflection</span>
                  </div>
                )}

                {/* Footer bar inside message: timestamp & action buttons */}
                <div
                  className={`flex items-center justify-end gap-2 mt-1.5 text-[10px] ${
                    isUser ? 'text-rose-100/80' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <div className="flex items-center gap-1 ml-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Audio Play button */}
                      <button
                        onClick={() => onSpeakMessage(msg)}
                        title={isSpeaking ? 'Awaaz roko' : 'Hindi Voice mein suniye (🇮🇳)'}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          isSpeaking ? 'text-rose-400 bg-rose-500/20' : 'hover:text-slate-200'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Copy message */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Copy text"
                        className="p-1 rounded-md hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-end gap-2 max-w-[80%]">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1"
            style={{ backgroundColor: companion.avatarColor }}
          >
            {companion.name[0]}
          </div>
          <div className="px-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 rounded-bl-xs flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
