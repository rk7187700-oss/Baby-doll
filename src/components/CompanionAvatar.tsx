import React, { useState } from 'react';
import { Companion } from '../types';
import { Sparkles, Heart, Volume2, Mic, Camera, Flame } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { DpPreset, DP_PRESETS } from '../data/dpPresets';
import { CompanionPortrait } from './CompanionPortrait';

interface CompanionAvatarProps {
  companion: Companion;
  isSpeaking: boolean;
  isThinking: boolean;
  isListening: boolean;
  activeDpPreset?: DpPreset;
  customDpUrl?: string | null;
  onAvatarClick?: () => void;
  onOpenDpGallery?: () => void;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  companion,
  isSpeaking,
  isThinking,
  isListening,
  activeDpPreset,
  customDpUrl,
  onAvatarClick,
  onOpenDpGallery,
}) => {
  const [heartAnim, setHeartAnim] = useState(false);

  // Fallback preset if not passed
  const currentPreset: DpPreset =
    activeDpPreset ||
    DP_PRESETS[companion.id]?.[0] ||
    DP_PRESETS.pooja[0];

  const handleClick = () => {
    soundEngine.playButtonClick();
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 900);
    onAvatarClick?.();
  };

  const handleOpenDp = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playButtonClick();
    if (onOpenDpGallery) {
      onOpenDpGallery();
    } else {
      onAvatarClick?.();
    }
  };

  const accentColor = currentPreset.accentColor || companion.avatarColor || '#f43f5e';

  return (
    <div className="relative flex flex-col items-center justify-center p-3 select-none">
      {/* Background Soft Aura Glow */}
      <div
        className="absolute w-52 h-52 rounded-full blur-3xl opacity-45 pointer-events-none transition-all duration-700"
        style={{
          backgroundColor: accentColor,
          transform: isSpeaking ? 'scale(1.25)' : isThinking ? 'scale(1.1)' : 'scale(1)',
        }}
      />

      {/* Floating Heart Reaction on Click */}
      {heartAnim && (
        <div className="absolute top-2 z-30 animate-bounce text-rose-400 pointer-events-none">
          <Heart className="w-7 h-7 fill-rose-500 drop-shadow-[0_0_10px_#f43f5e]" />
        </div>
      )}

      {/* Avatar Container with Rings */}
      <div
        onClick={handleClick}
        className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center cursor-pointer group transition-transform active:scale-95"
      >
        {/* Outer glowing pulsing border */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
            isSpeaking
              ? 'border-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.7)] animate-pulse'
              : isListening
              ? 'border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.7)] animate-pulse'
              : isThinking
              ? 'border-purple-400 shadow-[0_0_24px_rgba(168,85,247,0.7)]'
              : 'border-slate-700/60 group-hover:border-rose-400/60 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]'
          }`}
        />

        {/* Ambient Ring */}
        <div
          className={`absolute -inset-2 rounded-full border border-dashed border-rose-500/30 pointer-events-none ${
            isSpeaking
              ? 'animate-[spin_10s_linear_infinite] border-rose-400/60'
              : isThinking
              ? 'animate-[spin_6s_linear_infinite] border-purple-400/60'
              : ''
          }`}
        />

        {/* PORTRAIT DISPLAY PICTURE */}
        <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 p-1 flex items-center justify-center shadow-2xl">
          <CompanionPortrait
            preset={currentPreset}
            customImageUrl={customDpUrl}
            size="xl"
            isSpeaking={isSpeaking}
            isListening={isListening}
            isThinking={isThinking}
            className="w-full h-full"
          />
        </div>

        {/* Status Indicator Icon (Mic listening / Audio speaking / Online) */}
        <div className="absolute bottom-1 right-1 p-1.5 rounded-full bg-slate-900 border border-slate-700 shadow-md">
          {isSpeaking ? (
            <Volume2 className="w-4 h-4 text-rose-400 animate-bounce" />
          ) : isListening ? (
            <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
          ) : isThinking ? (
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
          ) : (
            <span className="block w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          )}
        </div>

        {/* Quick "Change DP" camera hover pill */}
        <button
          onClick={handleOpenDp}
          type="button"
          title="Change DP / Choose Hot Style"
          className="absolute -top-1 right-2 p-1.5 rounded-full bg-slate-900/90 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 shadow-lg cursor-pointer transition-all duration-200 transform group-hover:scale-110 active:scale-95"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Name, Tagline & Style Pill */}
      <div className="mt-2 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <h2 className="font-bold text-lg text-slate-100 tracking-wide">{companion.name}</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" />
            <span>{customDpUrl ? 'Custom DP' : currentPreset.styleTag}</span>
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-0.5 max-w-[240px] truncate">
          {isSpeaking
            ? 'Bol rahi hoon... 🎙️'
            : isListening
            ? 'Sun rahi hoon... 👂'
            : isThinking
            ? 'Soch rahi hoon... ✨'
            : companion.tagline}
        </p>

        {/* Quick button to open DP Gallery */}
        <button
          onClick={handleOpenDp}
          type="button"
          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>Change DP ({DP_PRESETS[companion.id]?.length || 4} Hot Looks)</span>
        </button>
      </div>

      {/* Live Audio Visualizer Wavebars when speaking */}
      <div className="flex items-center justify-center gap-1 mt-2 h-4">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${
              isSpeaking
                ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                : isListening
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                : 'bg-slate-700/60'
            }`}
            style={{
              height: isSpeaking
                ? `${Math.max(4, Math.sin(i * 0.9 + Date.now() / 250) * 14 + 6)}px`
                : isListening
                ? `${Math.max(4, (i % 3 + 1) * 4)}px`
                : '3px',
            }}
          />
        ))}
      </div>
    </div>
  );
};
