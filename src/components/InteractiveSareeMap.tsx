import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { SAREE_MAP_HOTSPOTS } from '../data/archiveData';
import { SareeMapCategoryId, SareeMapHotspot } from '../types/archive';

interface InteractiveSareeMapProps {
  activeHotspotId: SareeMapCategoryId;
  activeCorridorId?: 'east' | 'north' | 'west' | 'south' | 'northeast';
  onPreviewHotspot: (id: SareeMapCategoryId) => void;
  onSelectSareeCategory: (id: SareeMapCategoryId) => void;
  productCounts: Record<SareeMapCategoryId, number>;
}

const SAREE_MAP_IMAGE_SRC =
  '/assets/aistudio/From_Banarasi_grandeur_to_Kanjivaram_elegance___India_s_sarees_are_a_celebration_of_culture__craftsmanship___timeless_beauty_______Every_weave_carries_a_legacy_passed_through_generations__reflecting_the_artistry_abbd3b6b.jfif';

export const InteractiveSareeMap: React.FC<InteractiveSareeMapProps> = ({
  activeHotspotId,
  activeCorridorId,
  onPreviewHotspot,
  onSelectSareeCategory,
  productCounts,
}) => {
  const activeHotspot: SareeMapHotspot =
    SAREE_MAP_HOTSPOTS.find((h) => h.id === activeHotspotId) ?? SAREE_MAP_HOTSPOTS[6];

  return (
    <div className="space-y-3">
      {/* Interactive Saree Map Canvas */}
      <div className="relative w-full aspect-square bg-[#F7F1E4] border border-[#DFCCA6] overflow-hidden select-none">
        <img
          src={SAREE_MAP_IMAGE_SRC}
          alt="Interactive Saree Map of India showing 12 regional weaving traditions from Kashmir Pashmina to Tamil Nadu Kanjivaram"
          className="w-full h-full object-contain block"
        />

        {/* Subtle Top-Left Cartographic Instruction Badge */}
        <div className="pointer-events-none absolute bottom-2.5 right-2.5 bg-[#FDF3DC]/95 border border-[#DFCCA6] px-2.5 py-1 text-[9px] font-semibold tracking-[0.12em] uppercase text-[#4A0D1B] shadow-xs">
          CLICK ANY SAREE TO SHOP COLLECTION
        </div>

        {/* 12 Clickable Saree Vignette & Label Hotspots */}
        {SAREE_MAP_HOTSPOTS.map((hotspot) => {
          const isActive = hotspot.id === activeHotspotId;
          const inCorridor = activeCorridorId ? hotspot.corridorId === activeCorridorId : false;
          const count = productCounts[hotspot.id] ?? 0;

          return (
            <React.Fragment key={hotspot.id}>
              {/* Folded Saree + Region Text Hotspot */}
              <button
                type="button"
                onMouseEnter={() => onPreviewHotspot(hotspot.id)}
                onFocus={() => onPreviewHotspot(hotspot.id)}
                onClick={() => onSelectSareeCategory(hotspot.id)}
                aria-label={`${hotspot.sareeName} sarees from ${hotspot.state} (${count} heirlooms) — click to shop collection`}
                style={{
                  left: hotspot.hotspotBox.left,
                  top: hotspot.hotspotBox.top,
                  width: hotspot.hotspotBox.width,
                  height: hotspot.hotspotBox.height,
                }}
                className={`group absolute rounded-xs transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4A0D1B] focus-visible:outline-offset-2 ${
                  isActive
                    ? 'border-2 border-[#4A0D1B] bg-[#4A0D1B]/10 shadow-sm'
                    : inCorridor
                      ? 'border border-[#B5832C]/80 bg-[#B5832C]/5 hover:border-2 hover:border-[#4A0D1B] hover:bg-[#4A0D1B]/10'
                      : 'border border-transparent hover:border-2 hover:border-[#4A0D1B] hover:bg-[#4A0D1B]/10'
                }`}
              >
                <span
                  className={`pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 text-[8px] font-bold tracking-[0.1em] uppercase transition-opacity shadow-xs ${
                    isActive
                      ? 'opacity-100 bg-[#4A0D1B] text-[#FDF3DC]'
                      : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 bg-[#2F0710] text-[#FDF3DC]'
                  }`}
                >
                  {hotspot.sareeName} ({count}) →
                </span>
              </button>

              {/* State Map Pin Hotspot */}
              <button
                type="button"
                onMouseEnter={() => onPreviewHotspot(hotspot.id)}
                onFocus={() => onPreviewHotspot(hotspot.id)}
                onClick={() => onSelectSareeCategory(hotspot.id)}
                aria-label={`Select ${hotspot.state} — ${hotspot.sareeName} collection`}
                style={{
                  left: hotspot.pinPos.left,
                  top: hotspot.pinPos.top,
                }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center cursor-pointer focus-visible:outline-none"
              >
                <span
                  className={`rounded-full transition-all flex items-center justify-center ${
                    isActive
                      ? 'w-5 h-5 bg-[#4A0D1B] ring-4 ring-[#B5832C]/45 border border-[#FDF3DC]'
                      : inCorridor
                        ? 'w-3.5 h-3.5 bg-[#B5832C] ring-2 ring-[#FDF3DC] hover:w-4.5 hover:h-4.5 hover:bg-[#4A0D1B]'
                        : 'w-3 h-3 bg-[#2F0710]/80 border border-[#FDF3DC] hover:w-4.5 hover:h-4.5 hover:bg-[#4A0D1B]'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FDF3DC]" />}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Accessible Quick-Select Saree Directory (Mobile & Keyboard Friendly) */}
      <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3 space-y-2">
        <div className="flex items-center justify-between gap-2 text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#4A0D1B]" aria-hidden="true" />
            <span>ACTIVE: {activeHotspot.state.toUpperCase()} · {activeHotspot.sareeName.toUpperCase()}</span>
          </span>
          <button
            type="button"
            onClick={() => onSelectSareeCategory(activeHotspot.id)}
            className="inline-flex items-center gap-1 text-[#4A0D1B] hover:text-[#7D5718] underline underline-offset-2"
          >
            <span>SHOP ({productCounts[activeHotspot.id] ?? 0})</span>
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5" role="list" aria-label="Regional Saree Categories">
          {SAREE_MAP_HOTSPOTS.map((hotspot) => {
            const isActive = hotspot.id === activeHotspotId;
            return (
              <button
                key={hotspot.id}
                type="button"
                onMouseEnter={() => onPreviewHotspot(hotspot.id)}
                onFocus={() => onPreviewHotspot(hotspot.id)}
                onClick={() => onSelectSareeCategory(hotspot.id)}
                className={`px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase border transition-colors min-h-[28px] ${
                  isActive
                    ? 'bg-[#4A0D1B] text-[#FDF3DC] border-[#4A0D1B]'
                    : 'bg-[#FFFFFF] text-[#5E4346] border-[#DFCCA6] hover:border-[#4A0D1B] hover:text-[#4A0D1B]'
                }`}
              >
                {hotspot.sareeName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
