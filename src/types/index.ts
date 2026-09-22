export type HindiScriptMode = 'auto' | 'hinglish' | 'devanagari';

export interface Companion {
  id: string;
  name: string;
  avatarMood: string;
  tagline: string;
  vibe: string;
  initialGreeting: string;
  avatarColor: string;
  avatarGlow: string;
  themeGradient: string;
  voicePitch: number;
  voiceRate: number;
  traits: string[];
  sampleStarters: string[];
  bio: string;
  favoriteTopics: string[];
  activeDpId?: string;
  customDpUrl?: string | null;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  avatar?: string;
  isVoiceSpoken?: boolean;
  hasReflectiveQuestion?: boolean;
}

export type CompanionMood = 'friendly' | 'caring' | 'playful' | 'deep';

export type MoodKey = 'happy' | 'excited' | 'chill' | 'tired' | 'stressed' | 'sad' | 'romantic';

export type VoiceLanguageMode = 'hi-IN' | 'en-IN' | 'en-US';

export interface DailyMoodLogEntry {
  id: string;
  timestamp: string; // ISO string
  dateFormatted: string; // e.g., "22 Sep 2026, 04:30 PM"
  moodKey: MoodKey;
  moodLabel: string;
  emoji: string;
  energyLevel: number; // 1 to 5
  note?: string;
  companionId: string;
  companionName: string;
  companionReaction: string;
}

export interface MoodOption {
  id: MoodKey;
  label: string;
  sublabel: string;
  emoji: string;
  color: string;
  bgClass: string;
  borderClass: string;
  initialHinglishReply: Record<string, string>;
}

export interface ChatSettings {
  autoSpeak: boolean;
  soundEffects: boolean;
  voicePitch: number;
  voiceRate: number;
  currentMood: CompanionMood;
}

export type ThemeVibeId = 'crimson' | 'sunset' | 'midnight' | 'neon' | 'emerald';

export interface ThemeVibe {
  id: ThemeVibeId;
  name: string;
  tagline: string;
  emoji: string;
  moodMatch: string;
  previewGradient: string;
  bgCanvas: string;
  sidebarBg: string;
  headerBg: string;
  chatBg: string;
  accentColor: string;
  accentBorder: string;
  accentBg: string;
  accentBgHover: string;
  accentText: string;
  userBubbleBg: string;
  glowAura: string;
  ringClass: string;
  badgeBorder: string;
}
