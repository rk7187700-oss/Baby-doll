import React from 'react';
import { Gauge, Play, RotateCcw, Volume2, Sparkles, Rabbit, Turtle } from 'lucide-react';
import { soundEngine, voiceSynthesizer } from '../utils/audio';

interface VoiceRateControlProps {
  voiceRate: number;
  onChangeRate: (rate: number) => void;
  companionName?: string;
  defaultRate?: number;
  compact?: boolean;
}

export function getVoiceSpeedDescriptor(rate: number): { label: string; emoji: string; color: string } {
  if (rate <= 0.75) {
    return { label: 'Sensual & Slow', emoji: '🌙', color: 'text-indigo-400' };
  } else if (rate <= 0.92) {
    return { label: 'Relaxed & Sweet', emoji: '☕', color: 'text-amber-400' };
  } else if (rate <= 1.05) {
    return { label: 'Natural Pace', emoji: '✨', color: 'text-emerald-400' };
  } else if (rate <= 1.25) {
    return { label: 'Brisk & Playful', emoji: '⚡', color: 'text-rose-400' };
  } else {
    return { label: 'Fast & Upbeat', emoji: '🚀', color: 'text-pink-400' };
  }
}

export const SPEED_PRESETS = [
  { rate: 0.75, label: '0.75x', tag: 'Slow' },
  { rate: 0.90, label: '0.90x', tag: 'Warm' },
  { rate: 1.00, label: '1.0x', tag: 'Normal' },
  { rate: 1.20, label: '1.20x', tag: 'Brisk' },
  { rate: 1.40, label: '1.40x', tag: 'Fast' },
];

export const VoiceRateControl: React.FC<VoiceRateControlProps> = ({
  voiceRate,
  onChangeRate,
  companionName = 'Pooja',
  defaultRate = 1.0,
  compact = false,
}) => {
  const descriptor = getVoiceSpeedDescriptor(voiceRate);
  const isDefault = Math.abs(voiceRate - defaultRate) < 0.02;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onChangeRate(val);
  };

  const handlePresetClick = (presetRate: number) => {
    soundEngine.playButtonClick();
    onChangeRate(presetRate);
  };

  const handleTestPlayback = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    soundEngine.playButtonClick();
    voiceSynthesizer.testHindiVoice(companionName, voiceRate);
  };

  const handleReset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    soundEngine.playButtonClick();
    onChangeRate(defaultRate);
  };

  // Percentage for background track highlight (from 0.6 to 1.5)
  const minRate = 0.6;
  const maxRate = 1.5;
  const progressPercent = Math.max(0, Math.min(100, ((voiceRate - minRate) / (maxRate - minRate)) * 100));

  return (
    <div className={`space-y-2.5 ${compact ? 'text-xs' : 'text-sm'}`}>
      {/* Header bar: Title & Current Speed Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
          <Gauge className="w-3.5 h-3.5 text-rose-400" />
          <span>Voice Playback Speed</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-medium flex items-center gap-1 ${descriptor.color}`}>
            <span>{descriptor.emoji}</span>
            <span>{descriptor.label}</span>
          </span>
          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
            {voiceRate.toFixed(2)}x
          </span>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="space-y-1">
        <div className="relative flex items-center">
          <input
            type="range"
            min={minRate}
            max={maxRate}
            step={0.05}
            value={voiceRate}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-rose-500 focus:outline-none transition-all"
            style={{
              background: `linear-gradient(to right, #f43f5e 0%, #f43f5e ${progressPercent}%, #1e293b ${progressPercent}%, #1e293b 100%)`,
            }}
            aria-label="Voice playback rate"
          />
        </div>

        {/* Speed min/max labels */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5 font-medium">
          <span className="flex items-center gap-1">
            <Turtle className="w-3 h-3 text-slate-500" />
            <span>0.60x (Slow)</span>
          </span>
          <span className="text-slate-500 font-mono">1.0x Normal</span>
          <span className="flex items-center gap-1">
            <span>1.50x (Fast)</span>
            <Rabbit className="w-3 h-3 text-slate-500" />
          </span>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center justify-between gap-1 pt-1">
        {SPEED_PRESETS.map((preset) => {
          const isSelected = Math.abs(voiceRate - preset.rate) < 0.03;
          return (
            <button
              key={preset.rate}
              onClick={() => handlePresetClick(preset.rate)}
              type="button"
              className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-medium border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-500/25 border-rose-500/60 text-white font-bold shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <div>{preset.label}</div>
              <div className="text-[9px] text-slate-500 leading-none">{preset.tag}</div>
            </button>
          );
        })}
      </div>

      {/* Action Footer: Test Voice & Reset */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/70">
        <button
          onClick={handleTestPlayback}
          type="button"
          className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold cursor-pointer transition-all active:scale-95"
          title="Play voice preview at this speed"
        >
          <Play className="w-3 h-3 fill-rose-300" />
          <span>Suno Speed Test ({voiceRate.toFixed(2)}x)</span>
        </button>

        {!isDefault && (
          <button
            onClick={handleReset}
            type="button"
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
            title={`Reset to default speed (${defaultRate.toFixed(2)}x)`}
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
