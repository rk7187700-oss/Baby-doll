import React, { useState } from 'react';
import { Companion, MoodKey, DailyMoodLogEntry, ThemeVibe } from '../types';
import { MOOD_OPTIONS } from '../data/moods';
import { getThemeForMood } from '../data/themes';
import { Sparkles, Heart, Zap, X, MessageSquareQuote, Check, Palette } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MoodCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: Companion;
  onSaveMood: (entry: DailyMoodLogEntry, sendGreetingToChat: boolean) => void;
  currentActiveMood?: MoodKey | null;
  onSyncMoodTheme?: (theme: ThemeVibe) => void;
}

export const MoodCheckInModal: React.FC<MoodCheckInModalProps> = ({
  isOpen,
  onClose,
  companion,
  onSaveMood,
  currentActiveMood,
  onSyncMoodTheme,
}) => {
  const [selectedMoodKey, setSelectedMoodKey] = useState<MoodKey>(currentActiveMood || 'happy');
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [note, setNote] = useState<string>('');
  const [sendToChat, setSendToChat] = useState<boolean>(true);
  const [syncTheme, setSyncTheme] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentOption = MOOD_OPTIONS.find((m) => m.id === selectedMoodKey) || MOOD_OPTIONS[0];
  const suggestedTheme = getThemeForMood(selectedMoodKey);
  const companionReaction =
    currentOption.initialHinglishReply[companion.id] ||
    currentOption.initialHinglishReply.aria ||
    'Achaa! Main samajh gayi 😊';

  const handleSelectMood = (key: MoodKey) => {
    soundEngine.playButtonClick();
    setSelectedMoodKey(key);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    soundEngine.playMessageSent();

    if (syncTheme && onSyncMoodTheme) {
      onSyncMoodTheme(suggestedTheme);
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const entry: DailyMoodLogEntry = {
      id: `mood-${Date.now()}`,
      timestamp: now.toISOString(),
      dateFormatted,
      moodKey: selectedMoodKey,
      moodLabel: currentOption.label,
      emoji: currentOption.emoji,
      energyLevel,
      note: note.trim() || undefined,
      companionId: companion.id,
      companionName: companion.name,
      companionReaction,
    };

    onSaveMood(entry, sendToChat);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close check-in"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0"
            style={{ backgroundColor: companion.avatarColor }}
          >
            {companion.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Daily Mood Check-in
              </h3>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Session Start
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {companion.name} wants to know: <span className="text-slate-200 italic">"Aaj kaisa feel ho raha hai?"</span>
            </p>
          </div>
        </div>

        {/* Mood Selection Tiles */}
        <div className="my-4">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Your Current Mood:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = selectedMoodKey === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => handleSelectMood(mood.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-500/20 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{mood.emoji}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-100">{mood.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{mood.sublabel}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy Level (1 to 5) */}
        <div className="mb-4 bg-slate-950/60 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Energy Meter:</span>
            </span>
            <span className="text-xs font-bold text-amber-300">
              {energyLevel === 1 && 'Low (1/5) 🥱'}
              {energyLevel === 2 && 'Mild (2/5) 🛋️'}
              {energyLevel === 3 && 'Balanced (3/5) ✨'}
              {energyLevel === 4 && 'Good (4/5) ⚡'}
              {energyLevel === 5 && 'Full Power! (5/5) 🚀'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  soundEngine.playKeyTick();
                  setEnergyLevel(lvl);
                }}
                className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                  lvl <= energyLevel ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Energy ${lvl}/5`}
              />
            ))}
          </div>
        </div>

        {/* Optional Note */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Short Note (Optional):
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Kaam bohot tha / Mast weekend chal raha hai..."
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-rose-500/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Companion Live Reaction Preview */}
        <div className="mb-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/70 text-xs text-slate-300 flex items-start gap-2.5">
          <MessageSquareQuote className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-semibold text-rose-300 mb-0.5">
              {companion.name}'s Reaction:
            </div>
            <p className="italic text-slate-200 leading-relaxed">"{companionReaction}"</p>
          </div>
        </div>

        {/* Checkbox Options: Post to chat & Auto-match theme */}
        <div className="space-y-2 mb-4 px-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={sendToChat}
              onChange={(e) => setSendToChat(e.target.checked)}
              className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
            />
            <span>Start chat with this mood acknowledgment</span>
          </label>

          <label className="flex items-center justify-between cursor-pointer text-xs text-slate-300 select-none">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={syncTheme}
                onChange={(e) => setSyncTheme(e.target.checked)}
                className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-rose-400" />
                <span>Auto-match chat UI vibe:</span>
              </span>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-white border border-slate-700 flex items-center gap-1">
              <span>{suggestedTheme.emoji}</span>
              <span>{suggestedTheme.name}</span>
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Skip Check-in
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save & Start Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
