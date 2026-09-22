import React, { useState } from 'react';
import { Companion, DailyMoodLogEntry, MoodKey, ThemeVibe } from '../types';
import { MOOD_OPTIONS } from '../data/moods';
import { THEME_VIBES } from '../data/themes';
import {
  X,
  Heart,
  Calendar,
  Zap,
  Trash2,
  Sparkles,
  Smile,
  Volume2,
  MessageCircle,
  Clock,
  PlusCircle,
  Flame,
  Check,
  Palette,
  Gauge,
  Camera,
} from 'lucide-react';
import { soundEngine, voiceSynthesizer } from '../utils/audio';
import { VoiceRateControl } from './VoiceRateControl';
import { DpPreset, DP_PRESETS } from '../data/dpPresets';
import { CompanionPortrait } from './CompanionPortrait';

interface CompanionProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: Companion;
  dailyMoodLogs: DailyMoodLogEntry[];
  onDeleteMoodEntry: (id: string) => void;
  onClearAllMoodLogs: () => void;
  onOpenCheckInModal: () => void;
  totalMessagesCount: number;
  currentTheme?: ThemeVibe;
  onSelectTheme?: (theme: ThemeVibe) => void;
  voiceRate?: number;
  onChangeVoiceRate?: (rate: number) => void;
  activeDpPreset?: DpPreset;
  customDpUrl?: string | null;
  onOpenDpGallery?: () => void;
}

export const CompanionProfileModal: React.FC<CompanionProfileModalProps> = ({
  isOpen,
  onClose,
  companion,
  dailyMoodLogs,
  onDeleteMoodEntry,
  onClearAllMoodLogs,
  onOpenCheckInModal,
  totalMessagesCount,
  currentTheme,
  onSelectTheme,
  voiceRate = 1.0,
  onChangeVoiceRate,
  activeDpPreset,
  customDpUrl,
  onOpenDpGallery,
}) => {
  const [activeTab, setActiveTab] = useState<'daily_mood' | 'profile' | 'voice' | 'themes'>('daily_mood');
  const [filterMood, setFilterMood] = useState<string>('all');

  const currentPreset: DpPreset =
    activeDpPreset || DP_PRESETS[companion.id]?.[0] || DP_PRESETS.pooja[0];

  if (!isOpen) return null;

  // Filter logs if user picked a specific mood filter
  const filteredLogs =
    filterMood === 'all'
      ? dailyMoodLogs
      : dailyMoodLogs.filter((entry) => entry.moodKey === filterMood);

  // Compute analytics
  const totalEntries = dailyMoodLogs.length;
  const moodCounts = dailyMoodLogs.reduce((acc, curr) => {
    acc[curr.moodKey] = (acc[curr.moodKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMoodKey = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topMoodOption = MOOD_OPTIONS.find((m) => m.id === topMoodKey);

  const avgEnergy = totalEntries
    ? (dailyMoodLogs.reduce((sum, e) => sum + (e.energyLevel || 3), 0) / totalEntries).toFixed(1)
    : '0';

  const latestEntry = dailyMoodLogs[0];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header with Companion Banner */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 border-b border-slate-800">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar Portrait with DP change trigger */}
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => {
                soundEngine.playButtonClick();
                onOpenDpGallery?.();
              }}
              title="Click to view or change DP"
            >
              <div className="w-18 h-18 rounded-full overflow-hidden shadow-2xl ring-2 ring-rose-500/60 ring-offset-2 ring-offset-slate-950 bg-slate-950">
                <CompanionPortrait
                  preset={currentPreset}
                  customImageUrl={customDpUrl}
                  size="md"
                  className="w-full h-full"
                />
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md border border-rose-400/50 cursor-pointer transition-transform group-hover:scale-110"
                title="Change DP"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">{companion.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                  {companion.vibe}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Hinglish Female AI
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-md">{companion.tagline}</p>

              {/* Quick Companion Stats */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>
                    Bond: <strong className="text-slate-200">Close Companion</strong>
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>
                    Messages: <strong className="text-slate-200">{totalMessagesCount}</strong>
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Mood Logs: <strong className="text-slate-200">{totalEntries}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setActiveTab('daily_mood');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'daily_mood'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Daily Mood History</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/40">
                {totalEntries}
              </span>
            </button>

            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setActiveTab('profile');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Bio & Traits</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setActiveTab('voice');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'voice'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Voice & Speed</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setActiveTab('themes');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'themes'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme Vibes</span>
            </button>
          </div>
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'daily_mood' && (
            <div>
              {/* Top Banner: Today's Status & Action button */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 shadow-sm">
                <div>
                  <div className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider mb-0.5">
                    Today's Mood Status
                  </div>
                  {latestEntry ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{latestEntry.emoji}</span>
                      <span className="text-sm font-bold text-white">
                        {latestEntry.moodLabel}
                      </span>
                      <span className="text-xs text-slate-400">
                        • {latestEntry.dateFormatted}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      No mood logged yet today. Check in to let {companion.name} know how you feel!
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    soundEngine.playButtonClick();
                    onOpenCheckInModal();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Log New Mood</span>
                </button>
              </div>

              {/* Mood Analytics Cards */}
              {totalEntries > 0 && (
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      Total Logs
                    </div>
                    <div className="text-lg font-bold text-white mt-0.5">{totalEntries}</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      Most Frequent
                    </div>
                    <div className="text-xs font-bold text-rose-300 mt-1 truncate">
                      {topMoodOption ? `${topMoodOption.emoji} ${topMoodOption.label}` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      Avg Energy
                    </div>
                    <div className="text-lg font-bold text-amber-300 mt-0.5 flex items-center justify-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{avgEnergy}/5</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Pills */}
              {totalEntries > 0 && (
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Chronological History</span>
                  </div>

                  {totalEntries > 0 && (
                    <button
                      onClick={() => {
                        soundEngine.playButtonClick();
                        if (window.confirm('Kya aap saari daily mood history clear karna chahte hain?')) {
                          onClearAllMoodLogs();
                        }
                      }}
                      className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear History</span>
                    </button>
                  )}
                </div>
              )}

              {/* Mood History List */}
              {dailyMoodLogs.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl">
                  <Smile className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-slate-300">
                    No Daily Moods Logged Yet
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                    Selecting your mood helps {companion.name} adapt her tone and remember your feelings throughout the session.
                  </p>
                  <button
                    onClick={() => {
                      soundEngine.playButtonClick();
                      onOpenCheckInModal();
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Check In Your Mood Now</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredLogs.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col gap-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl p-1 bg-slate-900 rounded-lg">{entry.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">
                                {entry.moodLabel}
                              </span>
                              <div className="flex items-center gap-0.5 text-amber-400 text-[10px]">
                                {[...Array(entry.energyLevel || 3)].map((_, i) => (
                                  <Zap key={i} className="w-2.5 h-2.5 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {entry.dateFormatted} • Logged with {entry.companionName || companion.name}
                            </span>
                          </div>
                        </div>

                        {/* Delete entry */}
                        <button
                          onClick={() => {
                            soundEngine.playButtonClick();
                            onDeleteMoodEntry(entry.id);
                          }}
                          title="Delete entry"
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 rounded transition-opacity cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* User's note if present */}
                      {entry.note && (
                        <div className="text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
                          <span className="text-slate-500 mr-1.5 font-medium">Your Note:</span>
                          "{entry.note}"
                        </div>
                      )}

                      {/* Companion's response */}
                      {entry.companionReaction && (
                        <div className="text-[11px] text-rose-300/90 italic pl-2 border-l-2 border-rose-500/40">
                          <strong>{entry.companionName || companion.name}:</strong> "{entry.companionReaction}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Bio Card */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Persona Story</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{companion.bio}</p>
              </div>

              {/* Personality Traits */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Personality Highlights
                </h4>
                <div className="flex flex-wrap gap-2">
                  {companion.traits.map((tr, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium"
                    >
                      {tr}
                    </span>
                  ))}
                </div>
              </div>

              {/* Favorite Topics */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Favorite Discussion Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {companion.favoriteTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/80"
                    >
                      💬 {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Voice Test & Language Settings Card */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-rose-400" />
                      <span>Hindi Voice Engine (🇮🇳)</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Active: {voiceSynthesizer.getActiveVoiceName()} • Mode: {voiceSynthesizer.getVoiceLanguage()}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.playButtonClick();
                      voiceSynthesizer.testHindiVoice(companion.name);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Suno Hindi Voice 🇮🇳</span>
                  </button>
                </div>

                {/* Voice Language Mode Selection */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      soundEngine.playButtonClick();
                      voiceSynthesizer.setVoiceLanguage('hi-IN');
                      voiceSynthesizer.testHindiVoice(companion.name);
                    }}
                    className={`p-2 rounded-lg text-left border text-xs cursor-pointer transition-all ${
                      voiceSynthesizer.getVoiceLanguage() === 'hi-IN'
                        ? 'bg-rose-500/20 border-rose-500/50 text-white font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm">🇮🇳 Hindi</div>
                    <div className="text-[10px] text-slate-400">hi-IN Voice</div>
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playButtonClick();
                      voiceSynthesizer.setVoiceLanguage('en-IN');
                      voiceSynthesizer.testHindiVoice(companion.name);
                    }}
                    className={`p-2 rounded-lg text-left border text-xs cursor-pointer transition-all ${
                      voiceSynthesizer.getVoiceLanguage() === 'en-IN'
                        ? 'bg-rose-500/20 border-rose-500/50 text-white font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm">🇮🇳 Indian</div>
                    <div className="text-[10px] text-slate-400">en-IN Accent</div>
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playButtonClick();
                      voiceSynthesizer.setVoiceLanguage('en-US');
                      voiceSynthesizer.testHindiVoice(companion.name);
                    }}
                    className={`p-2 rounded-lg text-left border text-xs cursor-pointer transition-all ${
                      voiceSynthesizer.getVoiceLanguage() === 'en-US'
                        ? 'bg-rose-500/20 border-rose-500/50 text-white font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm">🌐 Global</div>
                    <div className="text-[10px] text-slate-400">en-US English</div>
                  </button>
                </div>

                {/* Voice Playback Speed Slider Control */}
                <div className="pt-3 border-t border-slate-800/80">
                  <VoiceRateControl
                    voiceRate={voiceRate}
                    onChangeRate={(rate) => {
                      if (onChangeVoiceRate) {
                        onChangeVoiceRate(rate);
                      }
                    }}
                    companionName={companion.name}
                    defaultRate={companion.voiceRate}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-4">
              {/* Voice Speed Slider Card */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-rose-400" />
                      <span>Speech Synthesis Speed ({voiceRate.toFixed(2)}x)</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Dynamically tune how fast or relaxed {companion.name} speaks her messages
                    </div>
                  </div>
                </div>

                <VoiceRateControl
                  voiceRate={voiceRate}
                  onChangeRate={(rate) => {
                    if (onChangeVoiceRate) {
                      onChangeVoiceRate(rate);
                    }
                  }}
                  companionName={companion.name}
                  defaultRate={companion.voiceRate}
                />
              </div>

              {/* Accent & Language Selection Card */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-rose-400" />
                      <span>Voice Accent & Pronunciation</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Current: {voiceSynthesizer.getActiveVoiceName()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      soundEngine.playButtonClick();
                      voiceSynthesizer.setVoiceLanguage('hi-IN');
                      voiceSynthesizer.testHindiVoice(companion.name, voiceRate);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      voiceSynthesizer.getVoiceLanguage() === 'hi-IN'
                        ? 'bg-rose-500/20 border-rose-500/60 ring-1 ring-rose-500/40 text-white'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">🇮🇳</span>
                      {voiceSynthesizer.getVoiceLanguage() === 'hi-IN' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white">Active</span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white">Hindi (hi-IN)</div>
                    <div className="text-[11px] text-slate-400">Sweet Roman Hinglish & Hindi voice</div>
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playButtonClick();
                      voiceSynthesizer.setVoiceLanguage('en-IN');
                      voiceSynthesizer.testHindiVoice(companion.name, voiceRate);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      voiceSynthesizer.getVoiceLanguage() === 'en-IN'
                        ? 'bg-rose-500/20 border-rose-500/60 ring-1 ring-rose-500/40 text-white'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">🇮🇳</span>
                      {voiceSynthesizer.getVoiceLanguage() === 'en-IN' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white">Active</span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white">Indian English (en-IN)</div>
                    <div className="text-[11px] text-slate-400">Warm and familiar Indian accent</div>
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playButtonClick();
                      voiceSynthesizer.setVoiceLanguage('en-US');
                      voiceSynthesizer.testHindiVoice(companion.name, voiceRate);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      voiceSynthesizer.getVoiceLanguage() === 'en-US'
                        ? 'bg-rose-500/20 border-rose-500/60 ring-1 ring-rose-500/40 text-white'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">🌐</span>
                      {voiceSynthesizer.getVoiceLanguage() === 'en-US' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white">Active</span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white">Global English (en-US)</div>
                    <div className="text-[11px] text-slate-400">Standard crisp English cadence</div>
                  </button>
                </div>
              </div>

              {/* Audio synthesis information box */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-400 leading-relaxed">
                💡 <strong>Voice Tip:</strong> The speech rate directly applies to automated audio replies and manual message readouts. You can also quickly toggle or test speech speed directly from the header's top bar!
              </div>
            </div>
          )}

          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-rose-400" />
                    <span>Chat UI Palette & Vibe</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Switch between vibes: Sunset, Midnight, Neon, Crimson & Emerald
                  </div>
                </div>
                {currentTheme && (
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-white font-medium border border-slate-700">
                    {currentTheme.emoji} {currentTheme.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEME_VIBES.map((theme) => {
                  const isSelected = currentTheme?.id === theme.id;

                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        soundEngine.playButtonClick();
                        if (onSelectTheme) {
                          onSelectTheme(theme);
                        }
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? `${theme.accentBorder} bg-slate-800/90 shadow-md ring-1 ${theme.ringClass}`
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{theme.emoji}</span>
                            <div>
                              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                <span>{theme.name}</span>
                                {isSelected && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white">
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
                                : 'border border-slate-700 text-transparent'
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {theme.tagline}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="h-3 rounded-lg overflow-hidden flex shadow-inner border border-slate-700/50">
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{companion.name} Companion Neural Interface</span>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
