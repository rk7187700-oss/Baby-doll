import React, { useState, useEffect } from 'react';
import { Companion, CompanionMood, DailyMoodLogEntry, ThemeVibe, HindiScriptMode } from '../types';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Trash2,
  Heart,
  Smile,
  Moon,
  ChevronDown,
  Info,
  X,
  User,
  Radio,
  Play,
  Palette,
  Gauge,
  Camera,
  Flame,
} from 'lucide-react';
import { soundEngine, voiceSynthesizer, VoiceLanguageMode } from '../utils/audio';
import { VoiceRateControl } from './VoiceRateControl';
import { DpPreset, DP_PRESETS } from '../data/dpPresets';
import { CompanionPortrait } from './CompanionPortrait';

interface CompanionHeaderProps {
  currentCompanion: Companion;
  companions: Companion[];
  onSelectCompanion: (comp: Companion) => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  soundMuted: boolean;
  onToggleSoundMute: () => void;
  currentMood: CompanionMood;
  onChangeMood: (mood: CompanionMood) => void;
  onClearChat: () => void;
  activeDailyMood: DailyMoodLogEntry | null;
  onOpenMoodCheckIn: () => void;
  onOpenProfile: () => void;
  currentTheme: ThemeVibe;
  onOpenThemeSwitcher: () => void;
  voiceRate?: number;
  onChangeVoiceRate?: (rate: number) => void;
  activeDpPreset?: DpPreset;
  customDpUrl?: string | null;
  onOpenDpGallery?: () => void;
  hindiScriptMode?: HindiScriptMode;
  onChangeHindiScriptMode?: (mode: HindiScriptMode) => void;
}

export const CompanionHeader: React.FC<CompanionHeaderProps> = ({
  currentCompanion,
  companions,
  onSelectCompanion,
  autoSpeak,
  onToggleAutoSpeak,
  soundMuted,
  onToggleSoundMute,
  currentMood,
  onChangeMood,
  onClearChat,
  activeDailyMood,
  onOpenMoodCheckIn,
  onOpenProfile,
  currentTheme,
  onOpenThemeSwitcher,
  voiceRate = 1.0,
  onChangeVoiceRate,
  activeDpPreset,
  customDpUrl,
  onOpenDpGallery,
  hindiScriptMode = 'auto',
  onChangeHindiScriptMode,
}) => {
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [voiceLang, setVoiceLang] = useState<VoiceLanguageMode>(voiceSynthesizer.getVoiceLanguage());

  const currentPreset: DpPreset =
    activeDpPreset || DP_PRESETS[currentCompanion.id]?.[0] || DP_PRESETS.pooja[0];

  const handleVoiceChange = (mode: VoiceLanguageMode) => {
    soundEngine.playButtonClick();
    voiceSynthesizer.setVoiceLanguage(mode);
    setVoiceLang(mode);
    voiceSynthesizer.testHindiVoice(currentCompanion.name, voiceRate, hindiScriptMode === 'devanagari' ? 'devanagari' : 'hinglish');
  };

  const handleTestVoice = (e: React.MouseEvent, script: 'hinglish' | 'devanagari' = 'hinglish') => {
    e.stopPropagation();
    soundEngine.playButtonClick();
    voiceSynthesizer.testHindiVoice(currentCompanion.name, voiceRate, script);
  };

  const moodOptions: { id: CompanionMood; label: string; icon: any }[] = [
    { id: 'friendly', label: 'Sweet & Caring', icon: Heart },
    { id: 'playful', label: 'Playful & Witty', icon: Smile },
    { id: 'deep', label: 'Deep Late Night', icon: Moon },
  ];

  return (
    <header className={`w-full ${currentTheme.headerBg} backdrop-blur-md sticky top-0 z-30 px-3 py-2.5 sm:px-6 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Companion Selector, Hot DPs & Status */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setShowPersonaDropdown(!showPersonaDropdown);
              }}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all cursor-pointer shadow-sm text-left"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-rose-500/50 shadow-md bg-slate-900">
                <CompanionPortrait
                  preset={currentPreset}
                  customImageUrl={customDpUrl}
                  size="xs"
                  showAccessories={false}
                  className="w-full h-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-white">{currentCompanion.name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-400">{currentCompanion.vibe}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showPersonaDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                  Choose Companion
                </div>
                {companions.map((comp) => {
                  const compPreset = DP_PRESETS[comp.id]?.[0] || DP_PRESETS.pooja[0];
                  return (
                    <button
                      key={comp.id}
                      onClick={() => {
                        soundEngine.playButtonClick();
                        onSelectCompanion(comp);
                        setShowPersonaDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all cursor-pointer ${
                        comp.id === currentCompanion.id
                          ? 'bg-rose-500/15 border border-rose-500/30 text-white'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1 ring-rose-500/40 bg-slate-900">
                        <CompanionPortrait preset={compPreset} size="xs" showAccessories={false} className="w-full h-full" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold">{comp.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{comp.tagline}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick "Hot DPs" Button */}
          {onOpenDpGallery && (
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onOpenDpGallery();
              }}
              title="Change Companion DP (Hot Styles & Custom Upload)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30 border border-rose-500/40 text-rose-300 text-xs font-semibold cursor-pointer transition-all shadow-sm group active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Hot DPs</span>
            </button>
          )}
        </div>

        {/* Daily Mood Check-In Quick Pill */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenMoodCheckIn();
            }}
            title="Check-in or update your mood today"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-rose-500/40 text-xs font-medium text-slate-200 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {activeDailyMood ? (
              <>
                <span className="text-base">{activeDailyMood.emoji}</span>
                <span className="hidden sm:inline font-semibold text-rose-300">
                  {activeDailyMood.moodLabel}
                </span>
                <span className="text-[10px] text-slate-400 hidden md:inline">• Change</span>
              </>
            ) : (
              <>
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Daily Mood:</span>
                <span className="text-rose-400 font-semibold">+ Check in</span>
              </>
            )}
          </button>

          {/* Profile & Mood History Log Button */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenProfile();
            }}
            title="Open Companion Profile & Daily Mood History"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Profile & Log</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Hindi Voice Selector, Playback Speed Slider & Preview Button */}
          <div className="relative">
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setShowVoiceMenu(!showVoiceMenu);
              }}
              title={`Voice & Speed Settings (Current speed: ${voiceRate.toFixed(2)}x)`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shadow-sm ${
                voiceLang === 'hi-IN'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}
            >
              <span className="text-sm">🇮🇳</span>
              <span className="hidden sm:inline font-semibold">
                {voiceLang === 'hi-IN' ? 'Hindi' : voiceLang === 'en-IN' ? 'Indian' : 'English'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-rose-300 font-mono font-bold border border-rose-500/30">
                {voiceRate.toFixed(2)}x
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showVoiceMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Voice Dropdown Menu with Rate Slider & Accent Selection */}
            {showVoiceMenu && (
              <div className="absolute top-full right-0 mt-2 w-80 sm:w-88 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3.5">
                {/* Header of Dropdown */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🎙️</span>
                    <div>
                      <div className="text-xs font-bold text-white">Voice & Speed Controls</div>
                      <div className="text-[10px] text-slate-400">Pooja speech synthesis engine</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowVoiceMenu(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Voice Playback Speed Slider */}
                <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
                  <VoiceRateControl
                    voiceRate={voiceRate}
                    onChangeRate={(rate) => {
                      if (onChangeVoiceRate) {
                        onChangeVoiceRate(rate);
                      }
                    }}
                    companionName={currentCompanion.name}
                    defaultRate={currentCompanion.voiceRate}
                    compact={true}
                  />
                </div>

                {/* Voice Language & Accent Selection */}
                <div>
                  <div className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider mb-1.5 px-0.5">
                    Voice Accent / Mode
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => handleVoiceChange('hi-IN')}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs cursor-pointer transition-colors ${
                        voiceLang === 'hi-IN'
                          ? 'bg-rose-500/20 border border-rose-500/40 text-white font-semibold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">🇮🇳</span>
                        <div>
                          <div>Hindi Voice (hi-IN)</div>
                          <div className="text-[10px] text-slate-400">Authentic Hindi & Hinglish pronunciation</div>
                        </div>
                      </div>
                      {voiceLang === 'hi-IN' && <span className="text-rose-400 font-bold text-xs">✓</span>}
                    </button>

                    <button
                      onClick={() => handleVoiceChange('en-IN')}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs cursor-pointer transition-colors ${
                        voiceLang === 'en-IN'
                          ? 'bg-rose-500/20 border border-rose-500/40 text-white font-semibold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">🇮🇳</span>
                        <div>
                          <div>Indian English (en-IN)</div>
                          <div className="text-[10px] text-slate-400">Natural Indian English accent</div>
                        </div>
                      </div>
                      {voiceLang === 'en-IN' && <span className="text-rose-400 font-bold text-xs">✓</span>}
                    </button>

                    <button
                      onClick={() => handleVoiceChange('en-US')}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs cursor-pointer transition-colors ${
                        voiceLang === 'en-US'
                          ? 'bg-rose-500/20 border border-rose-500/40 text-white font-semibold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">🌐</span>
                        <div>
                          <div>Global English (en-US)</div>
                          <div className="text-[10px] text-slate-400">Standard English tone</div>
                        </div>
                      </div>
                      {voiceLang === 'en-US' && <span className="text-rose-400 font-bold text-xs">✓</span>}
                    </button>
                  </div>
                </div>

                {/* Hindi Chat Script / Text Mode Selection */}
                {onChangeHindiScriptMode && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider mb-1.5 px-0.5 flex items-center justify-between">
                      <span>Hindi Chat Script</span>
                      <span className="text-[10px] text-slate-400 lowercase font-normal">output language</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => {
                          soundEngine.playButtonClick();
                          onChangeHindiScriptMode('auto');
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          hindiScriptMode === 'auto'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Auto (Smart)
                      </button>
                      <button
                        onClick={() => {
                          soundEngine.playButtonClick();
                          onChangeHindiScriptMode('hinglish');
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          hindiScriptMode === 'hinglish'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Hinglish
                      </button>
                      <button
                        onClick={() => {
                          soundEngine.playButtonClick();
                          onChangeHindiScriptMode('devanagari');
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          hindiScriptMode === 'devanagari'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        हिन्दी
                      </button>
                    </div>
                  </div>
                )}

                {/* Dual Test Voice Buttons */}
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={(e) => handleTestVoice(e, 'hinglish')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 text-rose-400 fill-rose-400" />
                    <span>Test Hinglish</span>
                  </button>
                  <button
                    onClick={(e) => handleTestVoice(e, 'devanagari')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 text-rose-400 fill-rose-400" />
                    <span>Test हिन्दी</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Vibe Switcher Button */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenThemeSwitcher();
            }}
            title={`Active Vibe: ${currentTheme.name} (${currentTheme.emoji}). Click to switch theme palette`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shadow-sm ${currentTheme.accentBorder} bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white`}
          >
            <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.accentColor }} />
            <span className="hidden md:inline font-semibold">{currentTheme.name}</span>
            <span className="text-sm">{currentTheme.emoji}</span>
          </button>

          {/* Voice Auto-Speak Toggle */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onToggleAutoSpeak();
            }}
            title={autoSpeak ? 'Voice speech enabled' : 'Voice speech muted'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              autoSpeak
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Info Modal Trigger */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              setShowInfoModal(true);
            }}
            title={`About ${currentCompanion.name} & Personality`}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Clear Chat */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              if (window.confirm('Chat history clear karni hai?')) {
                onClearChat();
              }
            }}
            title="Chat clear karein"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-700/50 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-lg text-white">About {currentCompanion.name}</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              {currentCompanion.name === 'Pooja'
                ? 'Pooja ek charming, sweet, bold aur playfully affectionate AI female companion hai specially designed for hot, fun, romantic and caring conversations with boys! Natural Roman Hinglish mein baat karti hai aur authentic Hindi voice bolti hai.'
                : `${currentCompanion.name} ek engaging AI companion hai jo natural Roman Hinglish mein baat karti hai — bilkul ek close friend ki tarah!`}
            </p>
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 space-y-1.5 mb-4">
              <div className="font-semibold text-rose-300">Features & Tone:</div>
              <div>• 🇮🇳 Authentic Hindi Voice synthesis with speech playback</div>
              <div>• 🔥 Hot, flirty, sweet and playful banters specially for boys</div>
              <div>• 💬 Natural Roman Hinglish expressions ("Hey handsome! 😉", "Arey jaan...")</div>
              <div>• 💖 Daily Mood Check-In with caring reflection & emotional warmth</div>
              <div>• 🎙️ Speech-to-text mic input support (Hinglish/Hindi)</div>
            </div>
            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm transition-all cursor-pointer"
            >
              Samajh gaya! Baatein shuru karein 😉
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
