import React from 'react';

interface SilkSwirlSwatchProps {
  baseColor: string;
  shadowColor: string;
  highlightColor: string;
  zariColor: string;
  label: string;
}

export const SilkSwirlSwatch: React.FC<SilkSwirlSwatchProps> = ({
  baseColor,
  shadowColor,
  highlightColor,
  zariColor,
  label,
}) => {
  const uid = React.useId().replace(/:/g, '');

  return (
    <div className="w-full h-full relative overflow-hidden" role="img" aria-label={label}>
      <svg viewBox="0 0 240 240" className="w-full h-full block" aria-hidden="true">
        <defs>
          <radialGradient id={`swirl-bg-${uid}`} cx="48%" cy="44%" r="65%">
            <stop offset="0%" stopColor={highlightColor} />
            <stop offset="45%" stopColor={baseColor} />
            <stop offset="100%" stopColor={shadowColor} />
          </radialGradient>
          <linearGradient id={`fold-a-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={highlightColor} stopOpacity="0.92" />
            <stop offset="50%" stopColor={baseColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={shadowColor} stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id={`fold-b-${uid}`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
            <stop offset="45%" stopColor={baseColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor="#1A0509" stopOpacity="0.48" />
          </linearGradient>
        </defs>

        <rect width="240" height="240" fill={`url(#swirl-bg-${uid})`} />

        {/* Organic swirling silk ripples */}
        <path
          d="M-20,60 C55,20 110,95 140,108 C170,122 225,85 260,30 L260,120 C215,155 160,150 120,126 C80,102 30,118 -20,175 Z"
          fill={`url(#fold-a-${uid})`}
        />
        <path
          d="M-20,125 C40,95 95,120 122,126 C158,134 205,180 260,130 L260,255 L-20,255 Z"
          fill={`url(#fold-b-${uid})`}
        />
        <path
          d="M118,118 C132,74 176,34 245,42 C188,68 158,108 128,124 C172,148 188,200 132,248 C154,195 148,148 118,118 Z"
          fill={highlightColor}
          opacity="0.34"
        />
        <path
          d="M122,120 C94,76 58,28 24,-10 C55,46 82,88 116,120 C68,136 28,162 -15,212 C34,174 80,148 122,120 Z"
          fill="#120407"
          opacity="0.28"
        />
        <path
          d="M120,120 C138,110 156,116 148,134 C138,150 108,148 102,130 C96,112 118,96 136,104"
          fill="none"
          stroke={highlightColor}
          strokeWidth="4"
          strokeOpacity="0.45"
          strokeLinecap="round"
        />

        {/* Subtle woven metallic zari hairline */}
        <path
          d="M-10,192 Q120,135 250,185"
          fill="none"
          stroke={zariColor}
          strokeWidth="1.2"
          strokeOpacity="0.4"
          strokeDasharray="3 4"
        />
      </svg>
    </div>
  );
};

interface HeroDrapedSareeFigureProps {
  silkMain: string;
  silkDeep: string;
  silkHighlight: string;
  zariGold: string;
  alt: string;
}

export const HeroDrapedSareeFigure: React.FC<HeroDrapedSareeFigureProps> = ({
  silkMain,
  silkDeep,
  silkHighlight,
  zariGold,
  alt,
}) => {
  const uid = React.useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 320 470"
      role="img"
      aria-label={alt}
      className="w-full h-full block drop-shadow-[0_18px_28px_rgba(36,18,20,0.28)]"
    >
      <defs>
        <linearGradient id={`saree-body-${uid}`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={silkHighlight} />
          <stop offset="45%" stopColor={silkMain} />
          <stop offset="100%" stopColor={silkDeep} />
        </linearGradient>
        <linearGradient id={`saree-pallu-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={silkMain} />
          <stop offset="55%" stopColor={silkDeep} />
          <stop offset="100%" stopColor="#26060D" />
        </linearGradient>
        <linearGradient id={`zari-trim-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9E6F20" />
          <stop offset="50%" stopColor={zariGold} />
          <stop offset="100%" stopColor="#F5DC9B" />
        </linearGradient>
        <linearGradient id={`skin-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8926E" />
          <stop offset="100%" stopColor="#A6704D" />
        </linearGradient>
      </defs>

      {/* Floor shadow */}
      <ellipse cx="165" cy="456" rx="88" ry="8" fill="#241214" opacity="0.2" />

      {/* Head & Classic Low Chignon */}
      <circle cx="152" cy="46" r="17" fill="#1F1211" />
      <ellipse cx="152" cy="48" rx="13.5" ry="17" fill={`url(#skin-${uid})`} />
      <path d="M138,44 C139,31 165,31 166,44 C160,38 144,38 138,44 Z" fill="#1B100F" />
      {/* Subtle features */}
      <circle cx="152" cy="43" r="1.1" fill="#4A0D1B" />
      <path d="M146,45 Q148.5,44 150.5,45.5 M153.5,45.5 Q155.5,44 158,45" stroke="#2D1914" strokeWidth="1" fill="none" />
      <path d="M149,56 Q152,58 155,56" stroke="#6E282A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Gold Jhumka Earrings */}
      <circle cx="137.5" cy="54" r="2.6" fill={zariGold} />
      <circle cx="166.5" cy="54" r="2.6" fill={zariGold} />

      {/* Neck & Collarbone */}
      <path d="M146,62 L158,62 L162,84 L142,84 Z" fill={`url(#skin-${uid})`} />
      <path d="M144,78 Q152,85 160,78" fill="none" stroke={zariGold} strokeWidth="1.6" />

      {/* Left Arm & Hand (resting naturally) */}
      <path d="M122,126 L109,185 L106,232 L114,234 L121,188 L131,132 Z" fill={`url(#skin-${uid})`} />
      {/* Gold bangles on wrist */}
      <line x1="106.5" y1="220" x2="114.5" y2="221" stroke={zariGold} strokeWidth="2.4" />
      <line x1="106" y1="224" x2="114" y2="225" stroke={zariGold} strokeWidth="1.6" />

      {/* Fitted Silk Blouse */}
      <path
        d="M123,86 L144,82 L152,98 L160,82 L182,88 L192,124 L179,129 L174,144 L130,144 L124,128 L112,124 Z"
        fill={silkMain}
        stroke={silkDeep}
        strokeWidth="0.8"
      />
      {/* Sleeve zari border */}
      <path d="M112,120 L124,124 L123,130 L111,126 Z" fill={`url(#zari-trim-${uid})`} />
      <path d="M180,125 L192,120 L193,126 L181,131 Z" fill={`url(#zari-trim-${uid})`} />

      {/* Bare waist subtle hint */}
      <path d="M131,144 L165,144 L162,162 L129,162 Z" fill={`url(#skin-${uid})`} opacity="0.92" />

      {/* Saree Lower Skirt & Vertical Front Pleats */}
      <path
        d="M125,160 L185,156 C206,230 220,330 218,452 L114,452 C110,340 116,235 125,160 Z"
        fill={`url(#saree-body-${uid})`}
      />
      {/* Vertical drape fold shading */}
      <path d="M136,162 L128,450" stroke={silkDeep} strokeWidth="2" opacity="0.45" />
      <path d="M148,162 L144,450" stroke={silkHighlight} strokeWidth="2.5" opacity="0.32" />
      <path d="M160,162 L159,450" stroke={silkDeep} strokeWidth="2.2" opacity="0.42" />
      <path d="M172,162 L175,450" stroke={silkHighlight} strokeWidth="2" opacity="0.28" />
      <path d="M184,162 L192,450" stroke={silkDeep} strokeWidth="2.5" opacity="0.38" />

      {/* Bottom Woven Zari Skirt Border */}
      <path d="M114,436 L218,436 L218,452 L114,452 Z" fill={silkDeep} />
      <path d="M114,436 L218,436 L218,440 L114,440 Z" fill={`url(#zari-trim-${uid})`} />
      <path d="M114,448 L218,448 L218,452 L114,452 Z" fill={`url(#zari-trim-${uid})`} />

      {/* Diagonal Flowing Pallu over Left/Right Shoulder & Trailing Hem */}
      <path
        d="M126,162 C145,134 166,105 168,84 L194,90 C216,185 245,320 288,456 L218,456 C198,350 185,236 164,175 Z"
        fill={`url(#saree-pallu-${uid})`}
      />
      {/* Gold Zari Pallu Diagonal Trim */}
      <path
        d="M126,162 C145,134 166,105 168,84"
        fill="none"
        stroke={`url(#zari-trim-${uid})`}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M194,90 C214,185 244,322 287,454"
        fill="none"
        stroke={`url(#zari-trim-${uid})`}
        strokeWidth="6"
      />
      {/* Rich Pallu End Border & Zari Buttis */}
      <path d="M210,414 L276,414 L288,456 L218,456 Z" fill="#2A070F" opacity="0.92" />
      <path d="M210,414 L276,414" stroke={`url(#zari-trim-${uid})`} strokeWidth="3.5" />
      <path d="M216,449 L286,449" stroke={`url(#zari-trim-${uid})`} strokeWidth="3" />
      {/* Subtle Silk Butti Dots across drape */}
      <g fill={zariGold} opacity="0.65">
        <circle cx="155" cy="220" r="1.6" />
        <circle cx="180" cy="245" r="1.6" />
        <circle cx="145" cy="285" r="1.6" />
        <circle cx="170" cy="315" r="1.6" />
        <circle cx="205" cy="290" r="1.6" />
        <circle cx="222" cy="340" r="1.6" />
        <circle cx="160" cy="375" r="1.6" />
        <circle cx="240" cy="388" r="1.6" />
      </g>
    </svg>
  );
};

export const HeroStarSparkle: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <path
      d="M16 1 C17.4 11.2 20.8 14.6 31 16 C20.8 17.4 17.4 20.8 16 31 C14.6 20.8 11.2 17.4 1 16 C11.2 14.6 14.6 11.2 16 1 Z"
      fill="#B5832C"
    />
  </svg>
);
