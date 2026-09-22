export interface DpPreset {
  id: string;
  companionId: string;
  name: string;
  styleTag: string;
  description: string;
  accentColor: string;
  moodVibe: string;
  avatarType: 'vector_art' | 'photo_art';
  // Detailed styling params for rendering the high-definition portrait
  renderConfig: {
    skinTone: [string, string, string]; // [highlight, mid, shadow]
    hairColor: [string, string, string]; // [highlight, mid, shadow]
    eyeColor: string;
    lipColor: string;
    topColor: string;
    topStroke: string;
    backgroundGrad: [string, string];
    accessories: 'bindi_choker' | 'gold_jhumka' | 'silver_pendant' | 'pearl_necklace' | 'hoop_earrings';
    expression: 'alluring' | 'sweet_smile' | 'playful_wink' | 'gentle_calm';
    eyelashStyle: 'dramatic_kajal' | 'soft_natural' | 'winged_bold';
  };
}

export const DP_PRESETS: Record<string, DpPreset[]> = {
  pooja: [
    {
      id: 'pooja_hot_glam',
      companionId: 'pooja',
      name: 'Hot & Bold Glamour',
      styleTag: '🔥 Hot Signature',
      description: 'Sultry gaze, deep crimson satin, voluminous silky dark waves & ruby gloss.',
      accentColor: '#f43f5e',
      moodVibe: 'Seductive & Playful',
      avatarType: 'vector_art',
      renderConfig: {
        skinTone: ['#ffedd5', '#fed7aa', '#f59e0b'],
        hairColor: ['#881337', '#4c0519', '#1e1b4b'],
        eyeColor: '#d97706', // Hazel brown
        lipColor: '#e11d48',
        topColor: '#9f1239',
        topStroke: '#e11d48',
        backgroundGrad: ['#2e0814', '#090d16'],
        accessories: 'bindi_choker',
        expression: 'alluring',
        eyelashStyle: 'dramatic_kajal',
      },
    },
    {
      id: 'pooja_midnight_romance',
      companionId: 'pooja',
      name: 'Midnight Romance',
      styleTag: '🌙 Late Night Sultry',
      description: 'Intimate candlelight mood, deep berry lips, alluring dark eyes & golden aura.',
      accentColor: '#ec4899',
      moodVibe: 'Romantic & Intimate',
      avatarType: 'vector_art',
      renderConfig: {
        skinTone: ['#ffe4e6', '#fecdd3', '#fb7185'],
        hairColor: ['#701a75', '#4a044e', '#0f172a'],
        eyeColor: '#b45309', // Amber hazel
        lipColor: '#be185d',
        topColor: '#4a044e',
        topStroke: '#db2777',
        backgroundGrad: ['#3b0764', '#050510'],
        accessories: 'pearl_necklace',
        expression: 'alluring',
        eyelashStyle: 'winged_bold',
      },
    },
    {
      id: 'pooja_desi_pataka',
      companionId: 'pooja',
      name: 'Desi Pataka Elegance',
      styleTag: '✨ Traditional Chic',
      description: 'Royal crimson silk, sparkling gold jhumkas, red bindi & mesmerizing kajal.',
      accentColor: '#ef4444',
      moodVibe: 'Desi Queen',
      avatarType: 'vector_art',
      renderConfig: {
        skinTone: ['#ffedd5', '#fed7aa', '#d97706'],
        hairColor: ['#450a0a', '#18181b', '#000000'],
        eyeColor: '#78350f', // Warm deep brown
        lipColor: '#dc2626',
        topColor: '#7f1d1d',
        topStroke: '#f59e0b',
        backgroundGrad: ['#450a0a', '#0c0a09'],
        accessories: 'gold_jhumka',
        expression: 'sweet_smile',
        eyelashStyle: 'dramatic_kajal',
      },
    },
    {
      id: 'pooja_casual_chic',
      companionId: 'pooja',
      name: 'Casual Chic & Flirty',
      styleTag: '😘 Flirty Girl Next Door',
      description: 'Golden hour sunlight, playful sweet wink, casual off-shoulder & glossy smile.',
      accentColor: '#f97316',
      moodVibe: 'Playful & Teasing',
      avatarType: 'vector_art',
      renderConfig: {
        skinTone: ['#fff7ed', '#ffedd5', '#fb923c'],
        hairColor: ['#7c2d12', '#431407', '#18181b'],
        eyeColor: '#ea580c',
        lipColor: '#f43f5e',
        topColor: '#c2410c',
        topStroke: '#ea580c',
        backgroundGrad: ['#431407', '#0f172a'],
        accessories: 'hoop_earrings',
        expression: 'playful_wink',
        eyelashStyle: 'soft_natural',
      },
    },
  ],
  aria: [
    {
      id: 'aria_sweet_radiance',
      companionId: 'aria',
      name: 'Sweet Radiance',
      styleTag: '💖 Sweet Signature',
      description: 'Warm glowing aura, gentle captivating smile, sleek dark hair & soft rose blush.',
      accentColor: '#f43f5e',
      moodVibe: 'Loving & Caring',
      avatarType: 'vector_art',
      renderConfig: {
        skinTone: ['#fff1f2', '#ffe4e6', '#f43f5e'],
        hairColor: ['#881337', '#4c0519', '#1e1b4b'],
        eyeColor: '#92400e',
        lipColor: '#fb7185',
        topColor: '#881337',
        topStroke: '#f43f5e',
        backgroundGrad: ['#3b0720', '#090d16'],
        accessories: 'pearl_necklace',
        expression: 'sweet_smile',
        eyelashStyle: 'soft_natural',
      },
    },
    {
      id: 'aria_golden_hour',
      companionId: 'aria',
      name: 'Golden Hour Beauty',
      styleTag: '🌅 Sunlit Elegance',
      description: 'Warm golden sun flares, radiant brown eyes, modern chic satin and tender smile.',
      accentColor: '#f59e0b',
      moodVibe: 'Warm & Charming',
      avatarType: 'vector_art',
      renderConfig: {
        skinTone: ['#fffbeb', '#fef3c7', '#f59e0b'],
        hairColor: ['#78350f', '#451a03', '#1c1917'],
        eyeColor: '#b45309',
        lipColor: '#f97316',
        topColor: '#b45309',
        topStroke: '#f59e0b',
        backgroundGrad: ['#451a03', '#090d16'],
        accessories: 'silver_pendant',
        expression: 'sweet_smile',
        eyelashStyle: 'soft_natural',
      },
    },
  ],
  tara: [
    {
      id: 'tara_playful_wink',
      companionId: 'tara',
      name: 'Neon Playful Vibe',
      styleTag: '⚡ Masti & Swag',
      description: 'Playful cheeky wink, modern neon violet accents, chic trendy earrings & bold smile.',
      accentColor: '#a855f7',
      moodVibe: 'Fun & Teasing',
      avatarType: 'vector_art',
      renderConfig: {
        skinTone: ['#faf5ff', '#f3e8ff', '#c084fc'],
        hairColor: ['#9333ea', '#581c87', '#1e1b4b'],
        eyeColor: '#7e22ce',
        lipColor: '#e879f9',
        topColor: '#581c87',
        topStroke: '#a855f7',
        backgroundGrad: ['#3b0764', '#090d16'],
        accessories: 'hoop_earrings',
        expression: 'playful_wink',
        eyelashStyle: 'winged_bold',
      },
    },
  ],
  zoya: [
    {
      id: 'zoya_deep_serenity',
      companionId: 'zoya',
      name: 'Deep Soulful Serenity',
      styleTag: '🌿 Graceful & Calming',
      description: 'Ethereal twilight glow, deep soulful eyes, silver choker and tranquil aura.',
      accentColor: '#06b6d4',
      moodVibe: 'Peaceful & Deep',
      avatarType: 'vector_art',
      renderConfig: {
        skinTone: ['#ecfeff', '#cffafe', '#22d3ee'],
        hairColor: ['#0e7490', '#083344', '#0f172a'],
        eyeColor: '#0891b2',
        lipColor: '#38bdf8',
        topColor: '#164e63',
        topStroke: '#06b6d4',
        backgroundGrad: ['#083344', '#090d16'],
        accessories: 'silver_pendant',
        expression: 'gentle_calm',
        eyelashStyle: 'soft_natural',
      },
    },
  ],
};
