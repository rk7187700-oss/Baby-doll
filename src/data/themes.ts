import { ThemeVibe } from '../types';

export const THEME_VIBES: ThemeVibe[] = [
  {
    id: 'crimson',
    name: 'Crimson Passion',
    tagline: 'Hot, bold, romantic & passionate vibes',
    emoji: '🔥',
    moodMatch: 'Hot Chat, Romantic & Bold',
    previewGradient: 'from-rose-600 via-pink-600 to-rose-900',
    bgCanvas: 'bg-[#09070c]',
    sidebarBg: 'bg-[#110914]/80 border-rose-900/30',
    headerBg: 'bg-[#0e0711]/90 border-rose-900/40',
    chatBg: 'bg-[#0b060d]/60',
    accentColor: '#f43f5e',
    accentBorder: 'border-rose-500/40',
    accentBg: 'bg-rose-500',
    accentBgHover: 'hover:bg-rose-600',
    accentText: 'text-rose-400',
    userBubbleBg: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white',
    glowAura: 'rgba(244, 63, 94, 0.35)',
    ringClass: 'focus:ring-rose-500',
    badgeBorder: 'border-rose-500/30 text-rose-300',
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    tagline: 'Warm amber dusk, golden hour & cozy warmth',
    emoji: '🌅',
    moodMatch: 'Warm, Nostalgic & Cozy Feels',
    previewGradient: 'from-amber-500 via-orange-600 to-rose-700',
    bgCanvas: 'bg-[#0c0906]',
    sidebarBg: 'bg-[#160f08]/80 border-amber-900/30',
    headerBg: 'bg-[#120c06]/90 border-amber-900/40',
    chatBg: 'bg-[#0d0905]/60',
    accentColor: '#f97316',
    accentBorder: 'border-amber-500/40',
    accentBg: 'bg-gradient-to-r from-amber-500 to-orange-600',
    accentBgHover: 'hover:from-amber-600 hover:to-orange-700',
    accentText: 'text-amber-400',
    userBubbleBg: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    glowAura: 'rgba(249, 115, 22, 0.35)',
    ringClass: 'focus:ring-amber-500',
    badgeBorder: 'border-amber-500/30 text-amber-300',
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    tagline: 'Deep starry obsidian, celestial sapphire & calm',
    emoji: '🌙',
    moodMatch: 'Late-Night, Intimate & Deep Talks',
    previewGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    bgCanvas: 'bg-[#050811]',
    sidebarBg: 'bg-[#090f20]/80 border-blue-900/30',
    headerBg: 'bg-[#070b18]/90 border-blue-900/40',
    chatBg: 'bg-[#050813]/60',
    accentColor: '#3b82f6',
    accentBorder: 'border-blue-500/40',
    accentBg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    accentBgHover: 'hover:from-blue-700 hover:to-indigo-700',
    accentText: 'text-blue-400',
    userBubbleBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
    glowAura: 'rgba(59, 130, 246, 0.35)',
    ringClass: 'focus:ring-blue-500',
    badgeBorder: 'border-blue-500/30 text-blue-300',
  },
  {
    id: 'neon',
    name: 'Electric Neon',
    tagline: 'High-energy cyberpunk magenta, violet & cyan',
    emoji: '⚡',
    moodMatch: 'Energetic, High-Vibe & Playful',
    previewGradient: 'from-fuchsia-500 via-purple-600 to-cyan-500',
    bgCanvas: 'bg-[#0a0614]',
    sidebarBg: 'bg-[#130a24]/80 border-fuchsia-900/30',
    headerBg: 'bg-[#0e071c]/90 border-fuchsia-900/40',
    chatBg: 'bg-[#0c0617]/60',
    accentColor: '#d946ef',
    accentBorder: 'border-fuchsia-500/40',
    accentBg: 'bg-gradient-to-r from-fuchsia-600 to-purple-600',
    accentBgHover: 'hover:from-fuchsia-700 hover:to-purple-700',
    accentText: 'text-fuchsia-400',
    userBubbleBg: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 text-white',
    glowAura: 'rgba(217, 70, 239, 0.35)',
    ringClass: 'focus:ring-fuchsia-500',
    badgeBorder: 'border-fuchsia-500/30 text-fuchsia-300',
  },
  {
    id: 'emerald',
    name: 'Emerald Zen',
    tagline: 'Soothing jade, lush forest sanctuary & tranquility',
    emoji: '🌿',
    moodMatch: 'Peaceful, Relaxing & Stress Relief',
    previewGradient: 'from-emerald-500 via-teal-600 to-emerald-900',
    bgCanvas: 'bg-[#050c0a]',
    sidebarBg: 'bg-[#081813]/80 border-emerald-900/30',
    headerBg: 'bg-[#06130f]/90 border-emerald-900/40',
    chatBg: 'bg-[#050e0b]/60',
    accentColor: '#10b981',
    accentBorder: 'border-emerald-500/40',
    accentBg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    accentBgHover: 'hover:from-emerald-700 hover:to-teal-700',
    accentText: 'text-emerald-400',
    userBubbleBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
    glowAura: 'rgba(16, 185, 129, 0.35)',
    ringClass: 'focus:ring-emerald-500',
    badgeBorder: 'border-emerald-500/30 text-emerald-300',
  },
];

export const DEFAULT_THEME_ID = 'crimson';

export function getThemeById(id: string): ThemeVibe {
  return THEME_VIBES.find((t) => t.id === id) || THEME_VIBES[0];
}

export function getThemeForMood(moodKey: string): ThemeVibe {
  switch (moodKey) {
    case 'romantic':
      return getThemeById('crimson');
    case 'excited':
      return getThemeById('neon');
    case 'happy':
      return getThemeById('sunset');
    case 'tired':
    case 'stressed':
    case 'sad':
      return getThemeById('midnight');
    case 'chill':
    default:
      return getThemeById('emerald');
  }
}
