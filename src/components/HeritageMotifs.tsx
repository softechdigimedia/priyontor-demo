import React from 'react';

interface MotifProps {
  className?: string;
  color?: string;
  accentColor?: string;
}

/**
 * Lotus Motif inspired by the Priyontor heritage crest.
 */
export const LotusMotif: React.FC<MotifProps> = ({
  className = 'w-7 h-5',
  color = 'currentColor',
  accentColor = '#B5832C',
}) => (
  <svg
    viewBox="0 0 64 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Center petal */}
    <path
      d="M32 4C27.5 11.5 27.5 21 32 29C36.5 21 36.5 11.5 32 4Z"
      fill={color}
      fillOpacity="0.18"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Inner left & right petals */}
    <path
      d="M28 28.5C21 24 18 15 20.5 9C24.5 12.5 27 19.5 28 28.5Z"
      fill={color}
      fillOpacity="0.12"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M36 28.5C43 24 46 15 43.5 9C39.5 12.5 37 19.5 36 28.5Z"
      fill={color}
      fillOpacity="0.12"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Outer petals */}
    <path
      d="M25 29.5C15.5 28 10 21 10.5 14.5C16.5 16.5 21.5 22 25 29.5Z"
      stroke={accentColor}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M39 29.5C48.5 28 54 21 53.5 14.5C47.5 16.5 42.5 22 39 29.5Z"
      stroke={accentColor}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Stepped water base */}
    <path d="M12 33.5H52" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M22 37H42" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

/**
 * Benaras Ghat Motif featuring arched riverside domes, temple spires, and stepped ghats.
 */
export const BenarasGhatMotif: React.FC<MotifProps> = ({
  className = 'w-28 h-10',
  color = '#B5832C',
  accentColor = '#4A0D1B',
}) => (
  <svg
    viewBox="0 0 180 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Central Temple Shikhar & Arched Pavilion */}
    <path
      d="M90 4L96 14H84L90 4Z"
      fill={color}
      fillOpacity="0.35"
      stroke={color}
      strokeWidth="1.2"
    />
    <path
      d="M78 36V22C78 16.5 83.4 13 90 13C96.6 13 102 16.5 102 22V36"
      stroke={color}
      strokeWidth="1.3"
    />
    <path
      d="M84 36V25C84 21.5 86.7 19 90 19C93.3 19 96 21.5 96 25V36"
      stroke={accentColor}
      strokeWidth="1.1"
    />

    {/* Flanking Ghat Pavilions */}
    <path d="M56 36V24C56 20 60 17.5 64 17.5C68 17.5 72 20 72 24V36" stroke={color} strokeWidth="1.1" />
    <path d="M108 36V24C108 20 112 17.5 116 17.5C120 17.5 124 20 124 24V36" stroke={color} strokeWidth="1.1" />
    <path d="M64 11L68 17.5H60L64 11Z" stroke={color} strokeWidth="1" />
    <path d="M116 11L120 17.5H112L116 11Z" stroke={color} strokeWidth="1" />

    {/* Outer Ghat Turrets */}
    <path d="M36 36V27C36 24 39 22 42 22C45 22 48 24 48 27V36" stroke={color} strokeOpacity="0.7" strokeWidth="1" />
    <path d="M132 36V27C132 24 135 22 138 22C141 22 144 24 144 27V36" stroke={color} strokeOpacity="0.7" strokeWidth="1" />

    {/* Stepped Ghat Horizon & Ganga Wave Ripples */}
    <path d="M14 36H166" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    <path d="M24 41H156" stroke={accentColor} strokeWidth="1.1" strokeOpacity="0.6" strokeLinecap="round" />
    <path
      d="M32 47C42 45 50 49 60 47C70 45 78 49 90 47C102 45 110 49 120 47C130 45 138 49 148 47"
      stroke={color}
      strokeOpacity="0.65"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
  </svg>
);

export const MotifSectionDivider: React.FC<{
  theme?: 'light' | 'dark';
  showGhat?: boolean;
}> = ({ theme = 'light', showGhat = true }) => {
  const lineClass = theme === 'dark' ? 'bg-[#B5832C]/45' : 'bg-[#B5832C]/50';
  const lotusColor = theme === 'dark' ? '#E5C37A' : '#4A0D1B';
  const ghatColor = theme === 'dark' ? '#E5C37A' : '#B5832C';
  const ghatAccent = theme === 'dark' ? '#D87277' : '#4A0D1B';

  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden="true">
      <div className={`h-[1px] flex-1 max-w-[160px] ${lineClass}`} />
      {showGhat ? (
        <BenarasGhatMotif className="w-28 h-8 shrink-0" color={ghatColor} accentColor={ghatAccent} />
      ) : (
        <LotusMotif className="w-8 h-5 shrink-0" color={lotusColor} accentColor={ghatColor} />
      )}
      <div className={`h-[1px] flex-1 max-w-[160px] ${lineClass}`} />
    </div>
  );
};
