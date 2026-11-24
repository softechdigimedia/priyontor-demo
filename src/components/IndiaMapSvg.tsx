import React from 'react';

interface MapPin {
  id?: string;
  name: string;
  sub: string;
  x: number;
  y: number;
}

interface IndiaMapSvgProps {
  pins: MapPin[];
  routePoints?: [number, number][];
  activePinId?: string;
  onSelectPin?: (pin: MapPin) => void;
  variant?: 'corridor' | 'full-india';
}

export const IndiaMapSvg: React.FC<IndiaMapSvgProps> = ({
  pins,
  routePoints,
  activePinId,
  onSelectPin,
  variant = 'full-india',
}) => {
  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[360px] bg-[#FDF3DC] border border-[#DFCCA6] overflow-hidden select-none">
      {/* Subtle archival cartographic grid */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full block"
        role="img"
        aria-label="Sovereign Handloom Cartography Route Map"
      >
        <defs>
          <pattern id="carto-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E8D7B4" strokeWidth="0.28" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#carto-grid)" />

        {variant === 'full-india' ? (
          /* Stylized Sovereign Subcontinent Silhouette */
          <path
            d="M32,8 L41,10 L46,16 L43,23 L52,27 L60,33 L68,36 L77,35 L84,38 L88,43 L84,50 L77,50 L73,54 L66,57 L62,62 L57,71 L51,81 L46,92 L41,91 L37,80 L33,70 L30,61 L23,56 L17,52 L19,45 L26,41 L28,31 L27,21 L30,13 Z"
            fill="#F7E8C6"
            stroke="#B5832C"
            strokeWidth="0.65"
          />
        ) : (
          /* Regional Corridor Abstract Silhouette */
          <path
            d="M18,22 L42,16 L72,22 L84,48 L72,82 L32,86 L16,58 Z"
            fill="#F7E8C6"
            stroke="#B5832C"
            strokeWidth="0.6"
          />
        )}

        {/* Route lines */}
        {routePoints && routePoints.length > 1 && (
          <polyline
            points={routePoints.map((p) => `${p[0]},${p[1]}`).join(' ')}
            fill="none"
            stroke="#B5832C"
            strokeWidth="0.55"
            strokeDasharray="1.4 1.4"
          />
        )}

        {/* Default route connecting all pins on full-india */}
        {variant === 'full-india' && pins.length > 1 && (
          <path
            d={`M ${pins.map((p) => `${p.x} ${p.y}`).join(' L ')}`}
            fill="none"
            stroke="#DFCCA6"
            strokeWidth="0.45"
            strokeDasharray="1.2 1.2"
          />
        )}

        {/* Pins */}
        {pins.map((pin, idx) => {
          const isActive = activePinId ? pin.id === activePinId : idx === 0;
          return (
            <g
              key={pin.id ?? pin.name}
              transform={`translate(${pin.x}, ${pin.y})`}
              className={onSelectPin ? 'cursor-pointer' : ''}
              onClick={() => onSelectPin?.(pin)}
              role={onSelectPin ? 'button' : undefined}
              tabIndex={onSelectPin ? 0 : undefined}
              aria-label={onSelectPin ? `Select ${pin.name}: ${pin.sub}` : undefined}
              onKeyDown={(e) => {
                if (onSelectPin && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectPin(pin);
                }
              }}
            >
              {isActive && (
                <circle r="4.8" fill="#4A0D1B" fillOpacity="0.16" stroke="#B5832C" strokeWidth="0.4" />
              )}
              <circle
                r={isActive ? 2.1 : 1.5}
                fill={isActive ? '#4A0D1B' : '#B5832C'}
                stroke="#FDF3DC"
                strokeWidth="0.6"
              />
            </g>
          );
        })}
      </svg>

      {/* Accessible Interactive HTML Labels overlaid cleanly */}
      {pins.map((pin, idx) => {
        const isActive = activePinId ? pin.id === activePinId : idx === 0;
        const alignRight = pin.x > 64;
        return (
          <button
            key={pin.id ?? pin.name}
            type="button"
            onClick={() => onSelectPin?.(pin)}
            style={{
              left: `${pin.x}%`,
              top: `${pin.y}%`,
            }}
            className={`absolute -translate-y-1/2 ${
              alignRight ? '-translate-x-[106%] text-right' : 'translate-x-3 text-left'
            } px-2.5 py-1.5 border transition-colors text-[10px] leading-tight z-10 min-h-[32px] ${
              isActive
                ? 'bg-[#4A0D1B] text-[#FDF3DC] border-[#B5832C] shadow-sm'
                : 'bg-[#FFFFFF]/95 text-[#241214] border-[#DFCCA6] hover:border-[#4A0D1B]'
            }`}
          >
            <span className="block font-semibold tracking-[0.08em] uppercase whitespace-nowrap">
              {pin.name}
            </span>
            <span
              className={`block text-[9px] whitespace-nowrap ${
                isActive ? 'text-[#E5C37A]' : 'text-[#5E4346]'
              }`}
            >
              {pin.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
};
