/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { COMPANIONS } from './data/companions';
import { Companion, ChatMessage, CompanionMood, DailyMoodLogEntry, ThemeVibe, HindiScriptMode } from './types';
import { isNegativeMood, getReflectiveQuestion } from './data/moods';
import { THEME_VIBES, getThemeById } from './data/themes';
import { DP_PRESETS, DpPreset } from './data/dpPresets';
import { CompanionHeader } from './components/CompanionHeader';
import { CompanionAvatar } from './components/CompanionAvatar';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { MoodCheckInModal } from './components/MoodCheckInModal';
import { CompanionProfileModal } from './components/CompanionProfileModal';
import { ThemeSwitcherModal } from './components/ThemeSwitcherModal';
import { DpGalleryModal } from './components/DpGalleryModal';
import { soundEngine, voiceSynthesizer } from './utils/audio';
import { Heart, Sparkles, Smile, User, Calendar, PlusCircle, Palette, Camera } from 'lucide-react';

const STORAGE_KEY_PREFIX = 'aria_chat_messages_v1_';
const DAILY_MOOD_KEY = 'daily_mood';
const SESSION_CHECKIN_KEY = 'aria_session_mood_checked_in_v1';
const THEME_STORAGE_KEY = 'pooja_ui_theme';

export default function App() {
  const [selectedCompanion, setSelectedCompanion] = useState<Companion>(() => {
    try {
      const storedId = localStorage.getItem('selected_companion_id');
      const found = COMPANIONS.find((c) => c.id === storedId);
      return found || COMPANIONS[0];
    } catch {
      return COMPANIONS[0];
    }
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [currentMood, setCurrentMood] = useState<CompanionMood>('friendly');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Theme & Vibe State
  const [currentTheme, setCurrentTheme] = useState<ThemeVibe>(() => {
    try {
      const storedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedThemeId) {
        return getThemeById(storedThemeId);
      }
    } catch {}
    return THEME_VIBES[0];
  });
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);

  const handleSelectTheme = (theme: ThemeVibe) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme.id);
    } catch {}
  };

  // Daily Mood & Profile State
  const [dailyMoodLogs, setDailyMoodLogs] = useState<DailyMoodLogEntry[]>([]);
  const [activeDailyMood, setActiveDailyMood] = useState<DailyMoodLogEntry | null>(null);
  const [showMoodCheckInModal, setShowMoodCheckInModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Hot DP Avatars & Custom Picture State
  const [activeDpPreset, setActiveDpPreset] = useState<DpPreset>(() => {
    try {
      const storedDpId = localStorage.getItem(`pooja_active_dp_${selectedCompanion.id}`);
      const list = DP_PRESETS[selectedCompanion.id] || DP_PRESETS.pooja;
      const found = list.find((d) => d.id === storedDpId);
      return found || list[0];
    } catch {
      return DP_PRESETS.pooja[0];
    }
  });

  const [customDpUrl, setCustomDpUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(`pooja_custom_dp_${selectedCompanion.id}`) || null;
    } catch {
      return null;
    }
  });

  const [showDpGalleryModal, setShowDpGalleryModal] = useState<boolean>(false);

  // Hindi Script Output Mode: 'auto' | 'hinglish' | 'devanagari'
  const [hindiScriptMode, setHindiScriptMode] = useState<HindiScriptMode>(() => {
    try {
      return (localStorage.getItem('pooja_hindi_script_mode') as HindiScriptMode) || 'auto';
    } catch {
      return 'auto';
    }
  });

  const handleChangeHindiScriptMode = (mode: HindiScriptMode) => {
    setHindiScriptMode(mode);
    try {
      localStorage.setItem('pooja_hindi_script_mode', mode);
    } catch {}
  };

  const handleSelectDpPreset = (preset: DpPreset) => {
    setActiveDpPreset(preset);
    setCustomDpUrl(null);
    try {
      localStorage.setItem(`pooja_active_dp_${selectedCompanion.id}`, preset.id);
      localStorage.removeItem(`pooja_custom_dp_${selectedCompanion.id}`);
    } catch {}
  };

  const handleSetCustomDpUrl = (url: string | null) => {
    setCustomDpUrl(url);
    try {
      if (url) {
        localStorage.setItem(`pooja_custom_dp_${selectedCompanion.id}`, url);
      } else {
        localStorage.removeItem(`pooja_custom_dp_${selectedCompanion.id}`);
      }
    } catch {}
  };

  // Synchronize companion active DP on companion switch
  useEffect(() => {
    try {
      const storedDpId = localStorage.getItem(`pooja_active_dp_${selectedCompanion.id}`);
      const list = DP_PRESETS[selectedCompanion.id] || DP_PRESETS.pooja;
      const found = list.find((d) => d.id === storedDpId);
      setActiveDpPreset(found || list[0]);

      const storedCustom = localStorage.getItem(`pooja_custom_dp_${selectedCompanion.id}`);
      setCustomDpUrl(storedCustom || null);
    } catch {
      setActiveDpPreset(DP_PRESETS.pooja[0]);
      setCustomDpUrl(null);
    }
  }, [selectedCompanion.id]);

  // Dynamic voice playback rate state
  const [voiceRate, setVoiceRate] = useState<number>(() => {
    return voiceSynthesizer.getVoiceRate();
  });

  const handleVoiceRateChange = (newRate: number) => {
    const clamped = Math.max(0.6, Math.min(1.5, Math.round(newRate * 100) / 100));
    setVoiceRate(clamped);
    voiceSynthesizer.setVoiceRate(clamped);
  };

  // Subscribe to speech synthesis state
  useEffect(() => {
    voiceSynthesizer.subscribe((speaking) => {
      setIsSpeaking(speaking);
      if (!speaking) {
        setSpeakingMsgId(null);
      }
    });
  }, []);

  // Load daily_mood history log from localStorage
  useEffect(() => {
    try {
      const storedMoods = localStorage.getItem(DAILY_MOOD_KEY);
      if (storedMoods) {
        const parsed: DailyMoodLogEntry[] = JSON.parse(storedMoods);
        setDailyMoodLogs(parsed);
        if (parsed.length > 0) {
          setActiveDailyMood(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load daily mood history:', e);
    }
  }, []);

  // Check if session check-in should pop up at start
  useEffect(() => {
    try {
      const sessionChecked = sessionStorage.getItem(SESSION_CHECKIN_KEY);
      if (!sessionChecked) {
        // Prompt user at start of session after a brief pleasant entrance delay
        const timer = setTimeout(() => {
          setShowMoodCheckInModal(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  // Load chat messages from localStorage on companion change
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${selectedCompanion.id}`);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        // Initial welcome message from companion
        const initialMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: selectedCompanion.initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([initialMsg]);
      }
    } catch {
      setMessages([]);
    }
  }, [selectedCompanion.id]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${selectedCompanion.id}`,
          JSON.stringify(messages)
        );
      } catch {}
    }
  }, [messages, selectedCompanion.id]);

  // Save new daily mood entry
  const handleSaveMood = (entry: DailyMoodLogEntry, sendGreetingToChat: boolean) => {
    const updated = [entry, ...dailyMoodLogs];
    setDailyMoodLogs(updated);
    setActiveDailyMood(entry);

    try {
      localStorage.setItem(DAILY_MOOD_KEY, JSON.stringify(updated));
      sessionStorage.setItem(SESSION_CHECKIN_KEY, 'true');
    } catch (e) {
      console.warn('Failed to save daily_mood log:', e);
    }

    if (sendGreetingToChat) {
      const isNegative = isNegativeMood(entry.moodKey, entry.moodLabel);
      let replyText = entry.companionReaction;
      if (isNegative && !replyText.includes('?')) {
        replyText = `${replyText} ${getReflectiveQuestion(entry.moodKey)}`;
      }

      // Add user check-in badge message
      const userMsg: ChatMessage = {
        id: `user-mood-${Date.now()}`,
        sender: 'user',
        text: `[Daily Mood Check-in: ${entry.emoji} ${entry.moodLabel}${entry.note ? ` - "${entry.note}"` : ''}]`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Companion's comforting reply
      const botMsg: ChatMessage = {
        id: `bot-mood-${Date.now() + 1}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasReflectiveQuestion: isNegative,
      };

      setMessages((prev) => [...prev, userMsg, botMsg]);
      soundEngine.playMessageReceived();

      if (autoSpeak) {
        setSpeakingMsgId(botMsg.id);
        voiceSynthesizer.speak(replyText, {
          pitch: selectedCompanion.voicePitch,
          rate: voiceRate,
          onEnd: () => setSpeakingMsgId(null),
        });
      }
    }
  };

  // Delete a specific mood entry
  const handleDeleteMoodEntry = (id: string) => {
    const updated = dailyMoodLogs.filter((item) => item.id !== id);
    setDailyMoodLogs(updated);
    try {
      localStorage.setItem(DAILY_MOOD_KEY, JSON.stringify(updated));
    } catch {}

    if (activeDailyMood?.id === id) {
      setActiveDailyMood(updated[0] || null);
    }
  };

  // Clear all mood logs
  const handleClearAllMoodLogs = () => {
    setDailyMoodLogs([]);
    setActiveDailyMood(null);
    try {
      localStorage.removeItem(DAILY_MOOD_KEY);
    } catch {}
  };

  // Handle sending regular chat message
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    const isCurrentMoodNegative = isNegativeMood(activeDailyMood?.moodKey, activeDailyMood?.moodLabel);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: selectedCompanion.id,
          userMessage: text,
          messages: updatedMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          currentMood,
          dailyMood: activeDailyMood
            ? {
                moodKey: activeDailyMood.moodKey,
                moodLabel: activeDailyMood.moodLabel,
                emoji: activeDailyMood.emoji,
                note: activeDailyMood.note,
              }
            : undefined,
          scriptMode: hindiScriptMode,
        }),
      });

      const data = await res.json();
      setIsTyping(false);

      if (data && data.reply) {
        let finalReply = data.reply;
        // Ensure reflective question if mood is negative
        if (isCurrentMoodNegative && !finalReply.includes('?')) {
          finalReply = `${finalReply} ${getReflectiveQuestion(activeDailyMood?.moodKey)}`;
        }

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: finalReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hasReflectiveQuestion: data.hasReflectiveQuestion || isCurrentMoodNegative,
        };

        setMessages((prev) => [...prev, botMsg]);
        soundEngine.playMessageReceived();

        // Speak response if autoSpeak is enabled
        if (autoSpeak) {
          setSpeakingMsgId(botMsg.id);
          voiceSynthesizer.speak(finalReply, {
            pitch: selectedCompanion.voicePitch,
            rate: voiceRate,
            onEnd: () => setSpeakingMsgId(null),
          });
        }
      }
    } catch (err) {
      console.error('Failed to get companion reply:', err);
      setIsTyping(false);
      const reflectiveQ = isCurrentMoodNegative ? getReflectiveQuestion(activeDailyMood?.moodKey) : '';
      const fallbackText = isCurrentMoodNegative
        ? `Arey, network mein thoda hiccup aaya... Par main yahin hoon tumhare sath. ${reflectiveQ}`
        : 'Arey, network mein thoda hiccup aaya lagta hai! Ek baar phir se bolo na please? 😊';

      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasReflectiveQuestion: isCurrentMoodNegative,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  // Speak single message manually
  const handleSpeakMessage = (msg: ChatMessage) => {
    if (speakingMsgId === msg.id && isSpeaking) {
      voiceSynthesizer.stop();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msg.id);
      voiceSynthesizer.speak(msg.text, {
        pitch: selectedCompanion.voicePitch,
        rate: voiceRate,
        onEnd: () => setSpeakingMsgId(null),
      });
    }
  };

  // Clear chat
  const handleClearChat = () => {
    voiceSynthesizer.stop();
    setSpeakingMsgId(null);
    const initialMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: selectedCompanion.initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialMsg]);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${selectedCompanion.id}`);
  };

  // Avatar click: opens companion profile and mood history modal
  const handleAvatarClick = () => {
    soundEngine.playButtonClick();
    setShowProfileModal(true);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bgCanvas} text-slate-100 flex flex-col font-sans transition-colors duration-300`}>
      {/* Top Navigation & Controls */}
      <CompanionHeader
        currentCompanion={selectedCompanion}
        companions={COMPANIONS}
        onSelectCompanion={(comp) => {
          voiceSynthesizer.stop();
          setSelectedCompanion(comp);
          try {
            localStorage.setItem('selected_companion_id', comp.id);
          } catch {}
        }}
        autoSpeak={autoSpeak}
        onToggleAutoSpeak={() => {
          if (autoSpeak) {
            voiceSynthesizer.stop();
          }
          setAutoSpeak(!autoSpeak);
        }}
        soundMuted={soundMuted}
        onToggleSoundMute={() => {
          const next = !soundMuted;
          setSoundMuted(next);
          soundEngine.setMuted(next);
        }}
        currentMood={currentMood}
        onChangeMood={setCurrentMood}
        onClearChat={handleClearChat}
        activeDailyMood={activeDailyMood}
        onOpenMoodCheckIn={() => setShowMoodCheckInModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        currentTheme={currentTheme}
        onOpenThemeSwitcher={() => setShowThemeModal(true)}
        voiceRate={voiceRate}
        onChangeVoiceRate={handleVoiceRateChange}
        activeDpPreset={activeDpPreset}
        customDpUrl={customDpUrl}
        onOpenDpGallery={() => setShowDpGalleryModal(true)}
        hindiScriptMode={hindiScriptMode}
        onChangeHindiScriptMode={handleChangeHindiScriptMode}
      />

      {/* Main Workspace Layout: Desktop split, Mobile stacked */}
      <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Companion Avatar & Persona Card */}
        <aside className={`w-full md:w-80 lg:w-96 ${currentTheme.sidebarBg} border-b md:border-b-0 md:border-r flex flex-col items-center justify-between p-4 shrink-0 overflow-y-auto transition-colors duration-300`}>
          <div className="w-full flex flex-col items-center">
            {/* Expressive Animated Avatar */}
            <CompanionAvatar
              companion={selectedCompanion}
              isSpeaking={isSpeaking}
              isThinking={isTyping}
              isListening={isListening}
              activeDpPreset={activeDpPreset}
              customDpUrl={customDpUrl}
              onAvatarClick={handleAvatarClick}
              onOpenDpGallery={() => setShowDpGalleryModal(true)}
            />

            {/* Daily Mood Check-In Widget Card in Sidebar */}
            <div className="w-full mt-3 bg-slate-950/70 border border-slate-800 rounded-xl p-3 shadow-inner">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5" />
                  <span>Daily Mood Log</span>
                </span>
                <button
                  onClick={() => setShowMoodCheckInModal(true)}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-3 h-3 text-rose-400" />
                  <span>Check-in</span>
                </button>
              </div>

              {activeDailyMood ? (
                <div className="flex items-center justify-between bg-slate-900/80 rounded-lg p-2 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{activeDailyMood.emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">
                        {activeDailyMood.moodLabel}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {activeDailyMood.dateFormatted}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    View Log ({dailyMoodLogs.length})
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowMoodCheckInModal(true)}
                  className="w-full py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium text-center transition-colors cursor-pointer"
                >
                  How are you feeling today? Check in 😊
                </button>
              )}
            </div>

            {/* Companion Profile Quick Link Card */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full mt-2 flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white">
                  Companion Profile & History
                </span>
              </div>
              <span className="text-[10px] text-slate-500 group-hover:text-rose-300">
                Open →
              </span>
            </button>

            {/* Persona Traits */}
            <div className="w-full mt-3 flex flex-wrap items-center justify-center gap-1.5 px-1">
              {selectedCompanion.traits.map((trait, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/60"
                >
                  {trait}
                </span>
              ))}
            </div>

            {/* Language style callout */}
            <div className="w-full mt-3 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-rose-300 mb-0.5 text-[11px]">
                <Heart className="w-3 h-3" />
                <span>Natural Roman Hinglish</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Short, warm replies with follow-up questions and emotional mood awareness.
              </p>
            </div>
          </div>

          {/* Prompt quick suggestions */}
          <div className="hidden lg:block w-full mt-3">
            <div className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>Quick Starters</span>
            </div>
            <div className="space-y-1">
              {selectedCompanion.sampleStarters.slice(0, 3).map((st, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(st)}
                  className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/40 hover:text-rose-200 border border-slate-700/50 hover:border-rose-500/40 text-slate-300 transition-all cursor-pointer truncate"
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side: Chat Conversation Area */}
        <section className={`flex-1 flex flex-col h-[65vh] md:h-[calc(100vh-61px)] ${currentTheme.chatBg} transition-colors duration-300`}>
          <MessageList
            messages={messages}
            companion={selectedCompanion}
            isTyping={isTyping}
            onSendStarter={handleSendMessage}
            speakingMsgId={speakingMsgId}
            onSpeakMessage={handleSpeakMessage}
            currentTheme={currentTheme}
            activeDpPreset={activeDpPreset}
            customDpUrl={customDpUrl}
          />

          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
            onListeningChange={setIsListening}
            companionName={selectedCompanion.name}
            currentTheme={currentTheme}
          />
        </section>
      </main>

      {/* Mood Check-In Modal at Start of Session / On-Demand */}
      <MoodCheckInModal
        isOpen={showMoodCheckInModal}
        onClose={() => {
          try {
            sessionStorage.setItem(SESSION_CHECKIN_KEY, 'true');
          } catch {}
          setShowMoodCheckInModal(false);
        }}
        companion={selectedCompanion}
        onSaveMood={handleSaveMood}
        currentActiveMood={activeDailyMood?.moodKey}
        onSyncMoodTheme={handleSelectTheme}
      />

      {/* Companion Profile & Daily Mood History Modal */}
      <CompanionProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        companion={selectedCompanion}
        dailyMoodLogs={dailyMoodLogs}
        onDeleteMoodEntry={handleDeleteMoodEntry}
        onClearAllMoodLogs={handleClearAllMoodLogs}
        onOpenCheckInModal={() => {
          setShowProfileModal(false);
          setShowMoodCheckInModal(true);
        }}
        totalMessagesCount={messages.length}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        voiceRate={voiceRate}
        onChangeVoiceRate={handleVoiceRateChange}
        activeDpPreset={activeDpPreset}
        customDpUrl={customDpUrl}
        onOpenDpGallery={() => {
          setShowProfileModal(false);
          setShowDpGalleryModal(true);
        }}
      />

      {/* Theme Switcher Modal */}
      <ThemeSwitcherModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Hot DP Gallery & Custom Picture Modal */}
      <DpGalleryModal
        isOpen={showDpGalleryModal}
        onClose={() => setShowDpGalleryModal(false)}
        companion={selectedCompanion}
        activeDpPreset={activeDpPreset}
        customDpUrl={customDpUrl}
        onSelectPreset={handleSelectDpPreset}
        onSetCustomDpUrl={handleSetCustomDpUrl}
      />
    </div>
  );
}
