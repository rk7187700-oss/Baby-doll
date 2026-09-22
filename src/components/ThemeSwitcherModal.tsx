import React from 'react';
import { X, Check, Palette, Sparkles } from 'lucide-react';
import { ThemeVibe, ThemeVibeId } from '../types';
import { THEME_VIBES } from '../data/themes';
import { soundEngine } from '../utils/audio';

interface ThemeSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeVibe;
  onSelectTheme: (theme: ThemeVibe) => void;
}

export const ThemeSwitcherModal: React.FC<ThemeSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-rose-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <span>UI Theme & Vibe Switcher</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                  5 Palettes
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Match the chat interface colors to your mood and aesthetic
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Theme Cards */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEME_VIBES.map((theme) => {
              const isSelected = currentTheme.id === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    soundEngine.playButtonClick();
                    onSelectTheme(theme);
                  }}
                  className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? `${theme.accentBorder} bg-slate-800/90 shadow-lg ring-1 ${theme.ringClass}`
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar with Emoji & Checkmark */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{theme.emoji}</span>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{theme.name}</span>
                            {isSelected && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-medium">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{theme.moodMatch}</div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? `${theme.accentBg} text-white shadow-sm`
                            : 'border border-slate-700 text-transparent group-hover:border-slate-500'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {theme.tagline}
                    </p>
                  </div>

                  {/* Visual Palette Preview Strip */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
                      Palette Swatch
                    </div>
                    <div className="h-4 rounded-lg overflow-hidden flex shadow-inner border border-slate-700/50">
                      <div className={`w-1/3 bg-gradient-to-r ${theme.previewGradient}`} />
                      <div
                        className="w-1/3"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                      <div className="w-1/3 bg-slate-950" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Instant Preview: </span>
              Selecting any theme updates the chat backgrounds, buttons, user speech bubbles, and glowing aura in real-time. Your preference is automatically saved!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Active Vibe: <strong className="text-white">{currentTheme.name}</strong> ({currentTheme.emoji})
          </span>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
