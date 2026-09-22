import React from 'react';
import { DpPreset } from '../data/dpPresets';

interface CompanionPortraitProps {
  preset: DpPreset;
  customImageUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isSpeaking?: boolean;
  isListening?: boolean;
  isThinking?: boolean;
  className?: string;
  showAccessories?: boolean;
}

export const CompanionPortrait: React.FC<CompanionPortraitProps> = ({
  preset,
  customImageUrl,
  size = 'md',
  isSpeaking = false,
  isListening = false,
  isThinking = false,
  className = '',
  showAccessories = true,
}) => {
  const { renderConfig, accentColor } = preset;
  const [skinHighlight, skinMid, skinShadow] = renderConfig.skinTone;
  const [hairHighlight, hairMid, hairShadow] = renderConfig.hairColor;
  const [bgStart, bgEnd] = renderConfig.backgroundGrad;

  // If a custom photo URL is provided and valid, render image tag with fallback
  const [imageError, setImageError] = React.useState(false);

  // Dimension classes
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36 sm:w-44 sm:h-44',
  };

  const containerSizeClass = sizeMap[size] || sizeMap.md;

  if (customImageUrl && !imageError) {
    return (
      <div className={`relative rounded-full overflow-hidden flex items-center justify-center ${containerSizeClass} ${className}`}>
        <img
          src={customImageUrl}
          alt={preset.name}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        {/* Soft overlay gradient for cinematic lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Generate unique gradient IDs based on preset ID to avoid SVG clashes
  const idPrefix = `dp-${preset.id}`;
  const skinGradId = `${idPrefix}-skin`;
  const hairGradId = `${idPrefix}-hair`;
  const bgGradId = `${idPrefix}-bg`;
  const glowFilterId = `${idPrefix}-glow`;

  const isWink = renderConfig.expression === 'playful_wink';
  const isAlluring = renderConfig.expression === 'alluring';

  return (
    <div className={`relative rounded-full overflow-hidden flex items-center justify-center select-none bg-slate-950 ${containerSizeClass} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Background gradient */}
          <linearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={bgStart} />
            <stop offset="100%" stopColor={bgEnd} />
          </linearGradient>

          {/* Skin gradient */}
          <linearGradient id={skinGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skinHighlight} />
            <stop offset="55%" stopColor={skinMid} />
            <stop offset="100%" stopColor={skinShadow} />
          </linearGradient>

          {/* Hair gradient */}
          <linearGradient id={hairGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hairHighlight} />
            <stop offset="50%" stopColor={hairMid} />
            <stop offset="100%" stopColor={hairShadow} />
          </linearGradient>

          {/* Glow filter */}
          <filter id={glowFilterId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Portrait Background */}
        <circle cx="100" cy="100" r="100" fill={`url(#${bgGradId})`} />

        {/* Back voluminous wavy hair */}
        <path
          d="M42 85 Q32 145 58 195 Q100 205 142 195 Q168 145 158 85 Q145 40 100 38 Q55 40 42 85 Z"
          fill={`url(#${hairGradId})`}
        />

        {/* Shoulders & Stylish Off-Shoulder / Neckline */}
        <path
          d="M44 196 Q100 168 156 196 L164 200 L36 200 Z"
          fill={renderConfig.topColor}
          stroke={renderConfig.topStroke}
          strokeWidth="1.5"
        />

        {/* Neck & Graceful Collarbone */}
        <path d="M83 126 L83 168 Q100 176 117 168 L117 126 Z" fill={`url(#${skinGradId})`} />

        {/* Subtle shadow under chin */}
        <ellipse cx="100" cy="138" rx="16" ry="6" fill="#000000" opacity="0.18" />

        {/* Neck accessories */}
        {showAccessories && renderConfig.accessories === 'bindi_choker' && (
          <g>
            <rect x="83" y="148" width="34" height="7" rx="3.5" fill="#0f172a" stroke={accentColor} strokeWidth="1" />
            <circle cx="100" cy="151.5" r="2.5" fill={accentColor} filter={`url(#${glowFilterId})`} />
          </g>
        )}

        {showAccessories && renderConfig.accessories === 'pearl_necklace' && (
          <g>
            <path d="M84 154 Q100 166 116 154" stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="3,3" fill="none" />
            <circle cx="100" cy="161" r="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
          </g>
        )}

        {showAccessories && renderConfig.accessories === 'silver_pendant' && (
          <g>
            <path d="M86 150 Q100 162 114 150" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
            <polygon points="100,158 103,164 97,164" fill={accentColor} filter={`url(#${glowFilterId})`} />
          </g>
        )}

        {/* Sculpted Face Contour */}
        <path
          d="M66 82 Q63 130 100 148 Q137 130 134 82 Q132 46 100 46 Q68 46 66 82 Z"
          fill={`url(#${skinGradId})`}
        />

        {/* Cheek Blush & Soft Glow */}
        <ellipse cx="76" cy="110" rx="11" ry="8" fill="#fda4af" opacity="0.45" />
        <ellipse cx="124" cy="110" rx="11" ry="8" fill="#fda4af" opacity="0.45" />

        {/* Ears & Earrings */}
        {showAccessories && renderConfig.accessories === 'gold_jhumka' ? (
          <g>
            <ellipse cx="64" cy="98" rx="4" ry="7" fill={skinMid} />
            <circle cx="63" cy="107" r="3" fill="#f59e0b" />
            <polygon points="63,110 67,117 59,117" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />

            <ellipse cx="136" cy="98" rx="4" ry="7" fill={skinMid} />
            <circle cx="137" cy="107" r="3" fill="#f59e0b" />
            <polygon points="137,110 141,117 133,117" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
          </g>
        ) : showAccessories && renderConfig.accessories === 'hoop_earrings' ? (
          <g>
            <ellipse cx="64" cy="98" rx="4" ry="7" fill={skinMid} />
            <circle cx="62" cy="106" r="6" stroke="#f59e0b" strokeWidth="1.8" fill="none" />

            <ellipse cx="136" cy="98" rx="4" ry="7" fill={skinMid} />
            <circle cx="138" cy="106" r="6" stroke="#f59e0b" strokeWidth="1.8" fill="none" />
          </g>
        ) : (
          <g>
            <ellipse cx="64" cy="98" rx="4" ry="7" fill={skinMid} />
            <circle cx="64" cy="104" r="2.2" fill={accentColor} filter={`url(#${glowFilterId})`} />
            <ellipse cx="136" cy="98" rx="4" ry="7" fill={skinMid} />
            <circle cx="136" cy="104" r="2.2" fill={accentColor} filter={`url(#${glowFilterId})`} />
          </g>
        )}

        {/* Front Hair Strands / Side Swept Waves */}
        <path
          d="M62 76 Q76 45 100 45 Q124 45 138 76 Q130 58 116 57 Q100 60 84 57 Q70 61 62 76 Z"
          fill={`url(#${hairGradId})`}
        />
        <path
          d="M63 74 Q84 86 102 77 Q78 68 63 74 Z"
          fill={hairMid}
          opacity="0.85"
        />

        {/* Forehead Bindi */}
        {showAccessories && (renderConfig.accessories === 'bindi_choker' || renderConfig.accessories === 'gold_jhumka') && (
          <circle cx="100" cy="80" r="2.4" fill="#dc2626" filter={`url(#${glowFilterId})`} />
        )}

        {/* Eyebrows */}
        <path
          d="M74 81 Q84 76 93 80"
          stroke="#271109"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={isWink ? 'M107 83 Q116 80 126 84' : 'M107 80 Q116 76 126 81'}
          stroke="#271109"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Eyes & Kajal */}
        {/* Left Eye */}
        <g>
          {/* Eye white */}
          <ellipse cx="83" cy="95" rx="8" ry="6" fill="#ffffff" />
          {/* Kajal outline */}
          <path
            d="M73 95 Q83 90 93 94 Q83 100 73 95"
            fill="none"
            stroke="#18181b"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Iris */}
          <circle cx="83.5" cy="94.5" r="4.2" fill={renderConfig.eyeColor} />
          {/* Pupil */}
          <circle cx="83.5" cy="94.5" r="2.2" fill="#000000" />
          {/* Light reflections / glint */}
          <circle cx="82" cy="93" r="1.3" fill="#ffffff" />
          <circle cx="85" cy="96" r="0.6" fill="#ffffff" opacity="0.8" />
          {/* Upper eyelash */}
          <path d="M72 94 Q83 88 93 93" stroke="#09090b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>

        {/* Right Eye */}
        {isWink ? (
          // Playful winking eye
          <g>
            <path
              d="M107 94 Q117 101 127 94"
              stroke="#09090b"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Winking eyelash ticks */}
            <line x1="126" y1="94" x2="130" y2="92" stroke="#09090b" strokeWidth="2" strokeLinecap="round" />
            <line x1="124" y1="96" x2="128" y2="96" stroke="#09090b" strokeWidth="2" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <ellipse cx="117" cy="95" rx="8" ry="6" fill="#ffffff" />
            <path
              d="M107 94 Q117 90 127 95 Q117 100 107 94"
              fill="none"
              stroke="#18181b"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="116.5" cy="94.5" r="4.2" fill={renderConfig.eyeColor} />
            <circle cx="116.5" cy="94.5" r="2.2" fill="#000000" />
            <circle cx="115" cy="93" r="1.3" fill="#ffffff" />
            <circle cx="118" cy="96" r="0.6" fill="#ffffff" opacity="0.8" />
            <path d="M107 93 Q117 88 128 94" stroke="#09090b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Cute Delicate Nose with highlight */}
        <path d="M98 103 Q100 108 102 108" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <ellipse cx="100" cy="107" rx="3.5" ry="1.2" fill="#fda4af" opacity="0.4" />

        {/* Luscious Lips & Smile */}
        {isSpeaking ? (
          // Animated mouth speaking
          <g>
            <ellipse cx="100" cy="123" rx="7.5" ry="4.5" fill={renderConfig.lipColor}>
              <animate attributeName="ry" values="2.5;6;3;7;2.5" dur="0.4s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="100" cy="123" rx="4.5" ry="2" fill="#450a0a" />
          </g>
        ) : isAlluring ? (
          // Sultry parted lips with glossy shine
          <g>
            {/* Upper lip */}
            <path
              d="M91 121 Q96 117 100 119 Q104 117 109 121 Q100 121 91 121 Z"
              fill={renderConfig.lipColor}
            />
            {/* Lower lip with gloss */}
            <path
              d="M91 121 Q100 128 109 121 Q100 126 91 121 Z"
              fill={renderConfig.lipColor}
            />
            <ellipse cx="100" cy="124" rx="4.5" ry="1.4" fill="#ffffff" opacity="0.55" />
          </g>
        ) : (
          // Sweet warm smile
          <g>
            <path
              d="M91 121 Q96 118 100 120 Q104 118 109 121 Q100 127 91 121 Z"
              fill={renderConfig.lipColor}
            />
            <ellipse cx="100" cy="123.5" rx="3.8" ry="1.2" fill="#ffffff" opacity="0.5" />
          </g>
        )}

        {/* Beauty Mark / Mole for Pooja */}
        {preset.companionId === 'pooja' && (
          <circle cx="123" cy="115" r="1.1" fill="#450a0a" opacity="0.85" />
        )}
      </svg>
    </div>
  );
};
