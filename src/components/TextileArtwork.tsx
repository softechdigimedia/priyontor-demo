import React from 'react';
import { TextileArtworkId } from '../types/archive';

interface TextileArtworkProps {
  artworkId: TextileArtworkId;
  alt: string;
  className?: string;
}

interface PaletteSpec {
  bg1: string;
  bg2: string;
  bg3: string;
  accent: string;
  accentSoft: string;
  motif: 'banarasi' | 'korvai' | 'patola' | 'jamdani' | 'sozni' | 'muga' | 'paithani' | 'ajrakh' | 'kalamkari' | 'naga' | 'pitloom' | 'indigo' | 'jewelry' | 'potli' | 'sherwani' | 'chanderi' | 'velvet';
}

const PALETTES: Record<TextileArtworkId, PaletteSpec> = {
  'empress-varanasi': { bg1: '#5C111E', bg2: '#3B0912', bg3: '#7C1A2B', accent: '#E2C07D', accentSoft: '#B98E44', motif: 'banarasi' },
  'empress-kadhwa-macro': { bg1: '#4B0E18', bg2: '#2E070D', bg3: '#6E1725', accent: '#EBD094', accentSoft: '#C69D4F', motif: 'banarasi' },
  'empress-reverse-weave': { bg1: '#233246', bg2: '#151E2B', bg3: '#354A63', accent: '#DFBE7E', accentSoft: '#9FB1C4', motif: 'ajrakh' },
  'empress-pit-loom': { bg1: '#2D211A', bg2: '#19120E', bg3: '#4B3629', accent: '#D8B372', accentSoft: '#966F42', motif: 'pitloom' },
  'shikargah-jangla': { bg1: '#492544', bg2: '#2B1428', bg3: '#683862', accent: '#E2C17A', accentSoft: '#B58E47', motif: 'banarasi' },
  'emerald-gopuram': { bg1: '#154734', bg2: '#0B2B1F', bg3: '#1F6349', accent: '#DFBA73', accentSoft: '#8C1F2B', motif: 'korvai' },
  'nari-kunjar-patola': { bg1: '#862226', bg2: '#4F1215', bg3: '#21344D', accent: '#F0DEC0', accentSoft: '#D7A54E', motif: 'patola' },
  'darbar-sozni': { bg1: '#7B5A3D', bg2: '#4C3623', bg3: '#9C7856', accent: '#F2E5CE', accentSoft: '#C79F62', motif: 'sozni' },
  'chanderi-angrakha': { bg1: '#D5A756', bg2: '#A97A2E', bg3: '#E7C582', accent: '#FFF7E6', accentSoft: '#7D551A', motif: 'chanderi' },
  'ivory-sozni-jacket': { bg1: '#EAE2D3', bg2: '#CFC2AD', bg3: '#F5F0E6', accent: '#8B683B', accentSoft: '#B7976A', motif: 'sozni' },
  'rajputi-poshak': { bg1: '#4C111D', bg2: '#2B080F', bg3: '#6E1929', accent: '#E8C57B', accentSoft: '#C28D38', motif: 'velvet' },
  'dhakai-jamdani': { bg1: '#EBE4D7', bg2: '#D7CCBA', bg3: '#F7F3EB', accent: '#FFFFFF', accentSoft: '#A38B6A', motif: 'jamdani' },
  'bandhgala-sherwani': { bg1: '#1B2436', bg2: '#0F1521', bg3: '#2B3852', accent: '#D8B779', accentSoft: '#7E8CA6', motif: 'sherwani' },
  'assam-muga': { bg1: '#C59A45', bg2: '#946E24', bg3: '#DFBB6F', accent: '#FFF3D4', accentSoft: '#6D241C', motif: 'muga' },
  'sambalpuri-bomkai': { bg1: '#7D3220', bg2: '#481A10', bg3: '#26201D', accent: '#EBD9BE', accentSoft: '#C88D48', motif: 'patola' },
  'sualkuchi-muga': { bg1: '#BD8E36', bg2: '#89621C', bg3: '#DBB465', accent: '#FFF4D8', accentSoft: '#5A1B16', motif: 'muga' },
  'banarasi-jangla': { bg1: '#691523', bg2: '#3E0A13', bg3: '#8B1E30', accent: '#E7C57E', accentSoft: '#B58940', motif: 'banarasi' },
  'lucknowi-mukaish': { bg1: '#ECE7DE', bg2: '#D3CBBF', bg3: '#F7F4EE', accent: '#B8B2A6', accentSoft: '#8A7B6A', motif: 'jamdani' },
  'rajputana-bandhej': { bg1: '#1D5446', bg2: '#0F332A', bg3: '#9E3A24', accent: '#F4E3C1', accentSoft: '#D7A54E', motif: 'patola' },
  'yeola-paithani': { bg1: '#5C225B', bg2: '#371137', bg3: '#7C327A', accent: '#E6C275', accentSoft: '#2E7A56', motif: 'paithani' },
  'dhamadka-ajrakh': { bg1: '#263850', bg2: '#15202F', bg3: '#752527', accent: '#EFE2CB', accentSoft: '#B8834B', motif: 'ajrakh' },
  'balaramapuram-kasavu': { bg1: '#EFE8D8', bg2: '#DDD2BC', bg3: '#FAF6EC', accent: '#C69D44', accentSoft: '#8E6A26', motif: 'korvai' },
  'srikalahasti-kalamkari': { bg1: '#D8CEBC', bg2: '#B8AA92', bg3: '#ECE4D5', accent: '#334863', accentSoft: '#7D3B26', motif: 'kalamkari' },
  'meitei-wangkhei': { bg1: '#EEE7DA', bg2: '#D8CEBC', bg3: '#FAF6EE', accent: '#9B3039', accentSoft: '#B69254', motif: 'jamdani' },
  'chakhesang-naga': { bg1: '#241F1E', bg2: '#13100F', bg3: '#3C3331', accent: '#A62B2B', accentSoft: '#ECE5D8', motif: 'naga' },
  'khasi-ryndia': { bg1: '#C5A05E', bg2: '#957338', bg3: '#DFC086', accent: '#FBF4E4', accentSoft: '#6E4720', motif: 'muga' },
  'mayur-emerald': { bg1: '#134433', bg2: '#09281D', bg3: '#1D5E47', accent: '#E3C37D', accentSoft: '#9F8645', motif: 'korvai' },
  'kashi-sonachuri': { bg1: '#C8A34D', bg2: '#927129', bg3: '#E3C67C', accent: '#FFF7DF', accentSoft: '#735316', motif: 'banarasi' },
  'shikargah-blue': { bg1: '#1B2D4A', bg2: '#0F1B2E', bg3: '#2A436C', accent: '#E2C07A', accentSoft: '#A58444', motif: 'banarasi' },
  'lilac-tanchoi': { bg1: '#B79AB4', bg2: '#896C86', bg3: '#D2BAD0', accent: '#FAF4F8', accentSoft: '#DFC7DC', motif: 'paithani' },
  'kundan-choker': { bg1: '#DFD2BC', bg2: '#C2B094', bg3: '#EFE6D5', accent: '#1D563F', accentSoft: '#C99E46', motif: 'jewelry' },
  'zardozi-potli': { bg1: '#E8DFD0', bg2: '#D1C4B0', bg3: '#F4EFE5', accent: '#53131F', accentSoft: '#DFBB74', motif: 'potli' },
  'silhouette-sarees': { bg1: '#184A43', bg2: '#0D2B27', bg3: '#266A60', accent: '#E5C37C', accentSoft: '#A87D3A', motif: 'korvai' },
  'silhouette-bridal': { bg1: '#4D121F', bg2: '#2A0810', bg3: '#6E1C2D', accent: '#E7C47D', accentSoft: '#B98C40', motif: 'velvet' },
  'silhouette-bandhgala': { bg1: '#232C3C', bg2: '#131924', bg3: '#364359', accent: '#DBC088', accentSoft: '#8C744A', motif: 'sherwani' },
  'silhouette-pashmina': { bg1: '#6D4B37', bg2: '#442D20', bg3: '#8D654E', accent: '#F0E1C6', accentSoft: '#C49A5E', motif: 'sozni' },
  'silhouette-kurtas': { bg1: '#E5DDD0', bg2: '#C9BCA8', bg3: '#F4EFE6', accent: '#9B763E', accentSoft: '#5E4B3B', motif: 'chanderi' },
  'lookbook-bengal': { bg1: '#E5DCD0', bg2: '#CBBFA9', bg3: '#F4EFE4', accent: '#FFFFFF', accentSoft: '#8C6C3F', motif: 'jamdani' },
  'lookbook-rajasthan': { bg1: '#A64D22', bg2: '#6D2D11', bg3: '#C86D36', accent: '#F5DFB0', accentSoft: '#3A1916', motif: 'patola' },
  'loom-pitloom': { bg1: '#2E221B', bg2: '#19120E', bg3: '#4A362B', accent: '#DCB874', accentSoft: '#8F6A3F', motif: 'pitloom' },
  'loom-indigo': { bg1: '#1F3552', bg2: '#111F33', bg3: '#325178', accent: '#DDE7F2', accentSoft: '#8BA6C4', motif: 'indigo' },
  'loom-kalamkari': { bg1: '#D2C2A6', bg2: '#A99678', bg3: '#E8DEC9', accent: '#33465D', accentSoft: '#7D3922', motif: 'kalamkari' },
};

export const TextileArtwork: React.FC<TextileArtworkProps> = ({ artworkId, alt, className = '' }) => {
  const spec = PALETTES[artworkId] ?? PALETTES['empress-varanasi'];
  const uid = React.useId().replace(/:/g, '');

  return (
    <div
      className={`relative overflow-hidden select-none bg-[#EAE2D3] ${className}`}
      role="img"
      aria-label={alt}
    >
      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={spec.bg1} />
            <stop offset="55%" stopColor={spec.bg2} />
            <stop offset="100%" stopColor={spec.bg3} />
          </linearGradient>

          <linearGradient id={`drape-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.28" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#000000" stopOpacity="0.22" />
            <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
          </linearGradient>

          <linearGradient id={`zari-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={spec.accent} stopOpacity="0.95" />
            <stop offset="50%" stopColor={spec.accentSoft} stopOpacity="0.85" />
            <stop offset="100%" stopColor={spec.accent} stopOpacity="0.95" />
          </linearGradient>

          <pattern id={`weave-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 0 3 L 6 3 M 3 0 L 3 6" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="0.6" />
          </pattern>

          <pattern id={`motif-${uid}`} width="48" height="48" patternUnits="userSpaceOnUse">
            {spec.motif === 'banarasi' && (
              <g fill="none" stroke={spec.accent} strokeWidth="0.9" strokeOpacity="0.52">
                <path d="M24 6 C30 14, 34 18, 24 28 C14 18, 18 14, 24 6 Z" />
                <circle cx="24" cy="18" r="2.2" fill={spec.accent} fillOpacity="0.55" />
                <path d="M0 24 Q12 18 24 24 T48 24" strokeOpacity="0.35" />
                <path d="M24 30 C28 36, 30 40, 24 46 C18 40, 20 36, 24 30 Z" />
              </g>
            )}
            {spec.motif === 'korvai' && (
              <g fill="none" stroke={spec.accent} strokeWidth="1" strokeOpacity="0.5">
                <polygon points="24,4 34,18 24,32 14,18" />
                <circle cx="24" cy="18" r="3" fill={spec.accent} fillOpacity="0.4" />
                <path d="M0 44 L12 36 L24 44 L36 36 L48 44" strokeWidth="1.2" />
              </g>
            )}
            {spec.motif === 'patola' && (
              <g fill="none" stroke={spec.accent} strokeWidth="1.1" strokeOpacity="0.55">
                <path d="M24 4 L30 10 L36 10 L36 16 L42 22 L36 28 L36 34 L30 34 L24 40 L18 34 L12 34 L12 28 L6 22 L12 16 L12 10 L18 10 Z" />
                <rect x="20" y="18" width="8" height="8" fill={spec.accentSoft} fillOpacity="0.45" />
              </g>
            )}
            {spec.motif === 'jamdani' && (
              <g fill="none" stroke={spec.accent} strokeWidth="1" strokeOpacity="0.65">
                <circle cx="24" cy="24" r="5" />
                <path d="M24 12 L24 17 M24 31 L24 36 M12 24 L17 24 M31 24 L36 24" />
                <circle cx="8" cy="8" r="2" fill={spec.accent} fillOpacity="0.45" />
                <circle cx="40" cy="40" r="2" fill={spec.accent} fillOpacity="0.45" />
              </g>
            )}
            {spec.motif === 'sozni' && (
              <g fill="none" stroke={spec.accent} strokeWidth="0.9" strokeOpacity="0.58">
                <path d="M16 34 C12 24, 18 12, 26 10 C32 9, 34 15, 29 20 C24 25, 24 32, 16 34 Z" />
                <path d="M22 24 Q26 18 28 14" />
                <circle cx="25" cy="17" r="1.5" fill={spec.accentSoft} />
              </g>
            )}
            {spec.motif === 'muga' && (
              <g fill="none" stroke={spec.accent} strokeWidth="1" strokeOpacity="0.55">
                <polygon points="24,8 34,24 24,40 14,24" />
                <polygon points="24,15 29,24 24,33 19,24" fill={spec.accentSoft} fillOpacity="0.35" />
              </g>
            )}
            {spec.motif === 'paithani' && (
              <g fill="none" stroke={spec.accent} strokeWidth="1" strokeOpacity="0.6">
                <circle cx="24" cy="24" r="11" />
                <circle cx="24" cy="24" r="4" fill={spec.accentSoft} fillOpacity="0.5" />
                <path d="M24 9 L26 13 L22 13 Z" fill={spec.accent} />
              </g>
            )}
            {spec.motif === 'ajrakh' && (
              <g fill="none" stroke={spec.accent} strokeWidth="1" strokeOpacity="0.55">
                <polygon points="24,4 29,18 44,24 29,30 24,44 19,30 4,24 19,18" />
                <circle cx="24" cy="24" r="3.5" fill={spec.accentSoft} fillOpacity="0.6" />
              </g>
            )}
            {spec.motif === 'kalamkari' && (
              <g fill="none" stroke={spec.accent} strokeWidth="1" strokeOpacity="0.55">
                <path d="M8 40 Q24 28 40 10" />
                <path d="M16 26 C12 18, 22 12, 26 20" />
                <path d="M30 22 C36 28, 30 38, 24 32" />
                <circle cx="24" cy="14" r="2.2" fill={spec.accentSoft} fillOpacity="0.5" />
              </g>
            )}
            {spec.motif === 'naga' && (
              <g fill="none" stroke={spec.accent} strokeWidth="1.4" strokeOpacity="0.65">
                <line x1="0" y1="12" x2="48" y2="12" />
                <line x1="0" y1="36" x2="48" y2="36" stroke={spec.accentSoft} />
                <polygon points="12,18 24,24 12,30" fill={spec.accent} fillOpacity="0.45" />
                <polygon points="36,18 24,24 36,30" fill={spec.accentSoft} fillOpacity="0.45" />
              </g>
            )}
            {(spec.motif === 'chanderi' || spec.motif === 'velvet' || spec.motif === 'sherwani') && (
              <g fill={spec.accent} fillOpacity="0.5">
                <circle cx="14" cy="14" r="2.2" />
                <circle cx="38" cy="38" r="2.2" />
                <polygon points="38,11 40,14 38,17 36,14" />
                <polygon points="14,35 16,38 14,41 12,38" />
              </g>
            )}
          </pattern>
        </defs>

        {/* Base Woven Silk Canvas */}
        <rect width="400" height="500" fill={`url(#bg-${uid})`} />
        <rect width="400" height="500" fill={`url(#weave-${uid})`} />

        {/* Specialized Scene Illustrations for Pit-Loom, Indigo Vats, Jewelry, Potli */}
        {spec.motif === 'pitloom' && (
          <g>
            {/* Vertical warp threads */}
            {Array.from({ length: 28 }).map((_, i) => (
              <line
                key={i}
                x1={25 + i * 13}
                y1={0}
                x2={35 + i * 12.2}
                y2={500}
                stroke={i % 3 === 0 ? spec.accent : spec.accentSoft}
                strokeOpacity={i % 3 === 0 ? 0.55 : 0.3}
                strokeWidth={i % 4 === 0 ? 1.4 : 0.8}
              />
            ))}
            {/* Loom heddle beams */}
            <rect x="0" y="135" width="400" height="16" fill="#231812" opacity="0.9" />
            <rect x="0" y="139" width="400" height="2" fill={spec.accent} opacity="0.4" />
            <rect x="0" y="340" width="400" height="22" fill="#1E140F" opacity="0.92" />
            {/* Woven cloth lower band */}
            <rect x="20" y="362" width="360" height="138" fill="#5D1320" opacity="0.88" />
            <rect x="20" y="362" width="360" height="138" fill={`url(#motif-${uid})`} opacity="0.7" />
            {/* Wooden boat shuttle */}
            <path d="M125 270 Q200 246 275 270 Q200 294 125 270 Z" fill="#8C5832" stroke={spec.accent} strokeWidth="1.5" />
            <ellipse cx="200" cy="270" rx="28" ry="6" fill={spec.accent} opacity="0.85" />
          </g>
        )}

        {spec.motif === 'indigo' && (
          <g>
            {/* Courtyard dye vats */}
            <ellipse cx="120" cy="360" rx="85" ry="42" fill="#0B1626" stroke="#8C7456" strokeWidth="5" />
            <ellipse cx="120" cy="356" rx="72" ry="32" fill="#183861" />
            <ellipse cx="285" cy="320" rx="75" ry="38" fill="#0B1626" stroke="#8C7456" strokeWidth="5" />
            <ellipse cx="285" cy="316" rx="64" ry="28" fill="#224C80" />
            {/* Hanging dyed silk lengths */}
            <path d="M40 0 L130 0 L125 260 Q85 280 45 260 Z" fill="#1F426E" stroke={spec.accent} strokeWidth="0.8" />
            <path d="M160 0 L250 0 L245 240 Q205 260 165 240 Z" fill="#2B598C" stroke={spec.accent} strokeWidth="0.8" />
            <path d="M280 0 L360 0 L355 215 Q320 230 285 215 Z" fill="#163254" stroke={spec.accent} strokeWidth="0.8" />
            <rect x="40" y="0" width="320" height="250" fill={`url(#motif-${uid})`} opacity="0.35" />
          </g>
        )}

        {spec.motif === 'jewelry' && (
          <g>
            <ellipse cx="200" cy="260" rx="145" ry="155" fill="none" stroke={spec.accentSoft} strokeWidth="1" opacity="0.4" />
            {/* Polki & Meenakari Choker collar */}
            <path d="M90 190 Q200 325 310 190" fill="none" stroke="#C99E46" strokeWidth="26" strokeLinecap="round" />
            <path d="M95 190 Q200 320 305 190" fill="none" stroke="#F8F3E8" strokeWidth="14" strokeDasharray="10 8" strokeLinecap="round" />
            {/* Emerald drops */}
            {[-90, -60, -30, 0, 30, 60, 90].map((dx, i) => {
              const cy = 278 - Math.abs(dx) * 0.45;
              return (
                <g key={i}>
                  <ellipse cx={200 + dx} cy={cy} rx="8" ry="13" fill="#16523A" stroke="#C99E46" strokeWidth="2" />
                  <circle cx={200 + dx} cy={cy - 18} r="4.5" fill="#7D1827" stroke="#DFC07A" strokeWidth="1.5" />
                </g>
              );
            })}
          </g>
        )}

        {spec.motif === 'potli' && (
          <g>
            {/* Pearl wrist strings */}
            <path d="M145 140 Q200 45 255 140" fill="none" stroke="#FAF6EE" strokeWidth="5" strokeDasharray="1 7" strokeLinecap="round" />
            {/* Silk velvet pouch body */}
            <path d="M135 165 L265 165 L290 345 Q200 405 110 345 Z" fill="#4C111E" stroke="#DFBB74" strokeWidth="2" />
            {/* Gathered neck */}
            <rect x="132" y="150" width="136" height="22" rx="4" fill="#320912" stroke="#DFBB74" strokeWidth="1.5" />
            {/* Zardozi arch motif */}
            <path d="M145 335 Q200 215 255 335" fill="none" stroke="#E8C882" strokeWidth="2.5" />
            <circle cx="200" cy="275" r="22" fill="none" stroke="#E8C882" strokeWidth="2" />
            <circle cx="200" cy="275" r="8" fill="#E8C882" opacity="0.85" />
          </g>
        )}

        {/* Standard Textile / Garment Drape Compositions */}
        {spec.motif !== 'pitloom' && spec.motif !== 'indigo' && spec.motif !== 'jewelry' && spec.motif !== 'potli' && (
          <g>
            {/* Patterned textile ground */}
            <rect width="400" height="500" fill={`url(#motif-${uid})`} />

            {/* Diagonal pleated drape folds */}
            <path d="M-20 80 Q140 160 420 40 L420 520 L-20 520 Z" fill={`url(#drape-${uid})`} opacity="0.6" />
            <path d="M0 190 Q190 250 400 165 L400 500 L0 500 Z" fill={spec.bg1} opacity="0.45" />
            <path d="M0 190 Q190 250 400 165 L400 500 L0 500 Z" fill={`url(#motif-${uid})`} opacity="0.85" />

            {/* Zari / Temple Pallu Border */}
            <g transform="translate(0, 350)">
              <rect x="0" y="0" width="400" height="150" fill={spec.bg2} opacity="0.92" />
              <rect x="0" y="0" width="400" height="8" fill={`url(#zari-${uid})`} />
              <rect x="0" y="14" width="400" height="3" fill={spec.accent} opacity="0.7" />
              <rect x="0" y="24" width="400" height="110" fill={`url(#motif-${uid})`} opacity="0.95" />
              <rect x="0" y="140" width="400" height="10" fill={`url(#zari-${uid})`} />
            </g>

            {/* Vertical Selvedge Zari Border */}
            <rect x="24" y="0" width="22" height="500" fill={spec.bg2} opacity="0.78" />
            <rect x="24" y="0" width="3" height="500" fill={`url(#zari-${uid})`} />
            <rect x="43" y="0" width="3" height="500" fill={`url(#zari-${uid})`} />

            {/* Soft silk sheen highlight */}
            <ellipse cx="220" cy="150" rx="180" ry="110" fill="#FFFFFF" opacity="0.06" />
          </g>
        )}
      </svg>
    </div>
  );
};
