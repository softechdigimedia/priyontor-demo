import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Eye, Pause, Play, Volume2 } from 'lucide-react';
import { DISCOVER_PINS, PRODUCTS, SAREE_MAP_HOTSPOTS, formatPrice } from '../data/archiveData';
import { BRAND_INFO, PolicyEntry } from '../data/priyontorInfo';
import { CurrencyCode, Product, SareeMapCategoryId } from '../types/archive';
import { BenarasGhatMotif, LotusMotif } from '../components/HeritageMotifs';
import { IndiaMapSvg } from '../components/IndiaMapSvg';
import { TextileArtwork } from '../components/TextileArtwork';

interface DiscoverIndiaPageProps {
  currency: CurrencyCode;
  onSelectProduct: (product: Product) => void;
  onQuickAcquire: (product: Product) => void;
  onSelectMapCategory: (mapCat: SareeMapCategoryId) => void;
  onOpenPolicyTab: (tab: PolicyEntry['id'] | 'size-chart') => void;
  onOpenContact: () => void;
}

const REGION_SECTIONS: {
  id: string;
  badge: string;
  title: string;
  corridors: string;
  productIds: string[];
  cols?: 2 | 3 | 4;
}[] = [
  {
    id: 'region-east',
    badge: 'EAST INDIA',
    title: 'West Bengal (Jamdani & Kantha) & Bihar (Bhagalpuri Ghicha Tussar)',
    corridors: 'Kolkata · West Bengal · Bihar',
    productIds: ['wb-jamdani-kantha', 'bihar-bhagalpuri-tussar'],
    cols: 2,
  },
  {
    id: 'region-north',
    badge: 'NORTH & CENTRAL INDIA',
    title: 'Uttar Pradesh, Lucknow, Jammu & Kashmir & Madhya Pradesh',
    corridors: 'Banarasi · Chikankari · Kani & Ari · Chanderi & Maheshwari',
    productIds: [
      'up-banarasi-silk',
      'lucknow-chikankari-saree',
      'jk-kani-ari',
      'mp-chanderi-maheshwari',
    ],
    cols: 4,
  },
  {
    id: 'region-west',
    badge: 'WEST INDIA',
    title: 'Gujarat (Ajrakh) & Rajasthan (Bandhej)',
    corridors: 'Kutch · Jaipur · Jodhpur',
    productIds: ['gujarat-ajrakh-saree', 'rajasthan-bandhej-saree'],
    cols: 2,
  },
  {
    id: 'region-south',
    badge: 'SOUTH INDIA',
    title: 'Telangana (Pochampally Ikat) & Andhra Pradesh (Mangalgiri)',
    corridors: 'Pochampally · Mangalagiri',
    productIds: ['telangana-pochampally-ikat', 'ap-mangalgiri-saree'],
    cols: 2,
  },
  {
    id: 'region-northeast',
    badge: 'NORTH-EAST INDIA',
    title: 'Assam (Muga Cotton) & Manipur (Moirang Phee)',
    corridors: 'Sualkuchi · Moirang',
    productIds: ['assam-muga-cotton-saree', 'manipur-moirang-phee'],
    cols: 2,
  },
];

const PIN_TO_MAP_CATEGORY: Record<string, SareeMapCategoryId> = {
  varanasi: 'banarasi',
  kolkata: 'jamdani-kantha',
  srinagar: 'kani-ari',
  assam: 'muga-cotton',
  pochampally: 'pochampally',
};

export const DiscoverIndiaPage: React.FC<DiscoverIndiaPageProps> = ({
  currency,
  onSelectProduct,
  onQuickAcquire,
  onSelectMapCategory,
  onOpenPolicyTab,
  onOpenContact,
}) => {
  const [selectedPinId, setSelectedPinId] = useState<string>('varanasi');
  const [activeRegionTab, setActiveRegionTab] = useState<string>('all');
  const [isPlayingLoom, setIsPlayingLoom] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const selectedPin =
    DISCOVER_PINS.find((p) => p.id === selectedPinId) ?? DISCOVER_PINS[0];

  const stopLoomAudio = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlayingLoom(false);
  };

  useEffect(() => {
    return () => {
      stopLoomAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleLoomAudio = () => {
    if (isPlayingLoom) {
      stopLoomAudio();
      return;
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const playShuttleBeat = (step: number) => {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = step % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(step % 2 === 0 ? 185 : 112, now);
        osc.frequency.exponentialRampToValueAtTime(48, now + 0.08);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      };

      let beat = 0;
      playShuttleBeat(beat);
      const intervalMs = Math.round((60 / selectedPin.cadenceBpm) * 1000);
      timerRef.current = window.setInterval(() => {
        beat += 1;
        playShuttleBeat(beat);
      }, intervalMs);
      setIsPlayingLoom(true);
    } catch {
      setIsPlayingLoom(true);
    }
  };

  const scrollToRegion = (regionKey: string) => {
    setActiveRegionTab(regionKey);
    if (regionKey === 'all') return;
    const el = document.getElementById(regionKey);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const visibleRegions =
    activeRegionTab === 'all'
      ? REGION_SECTIONS
      : REGION_SECTIONS.filter((r) => r.id === activeRegionTab);

  return (
    <div className="bg-[#FDF3DC]">
      {/* Hero & PDF Summary Metrics */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-3">
            <LotusMotif className="w-7 h-5" color="#4A0D1B" accentColor="#B5832C" />
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
              INDIAN STATE-WISE TRADITIONAL SAREES
            </p>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#241214] leading-tight">
            12 Regional Saree Traditions Across India
          </h1>
          <p className="text-xs sm:text-sm text-[#5E4346] leading-relaxed max-w-2xl">
            Every weave carries a story, every motif holds a memory, and every tradition deserves to be celebrated. Explore state-wise Indian weaves from Priyontor.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 border-y border-[#DFCCA6] py-5">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
              STATE TRADITIONS
            </p>
            <p className="font-serif text-xl sm:text-2xl text-[#241214] mt-1 tabular-nums">
              {SAREE_MAP_HOTSPOTS.length} Traditions
            </p>
            <p className="text-[10px] text-[#5E4346]">All Free Size Sarees</p>
          </div>
          <div className="border-l border-[#DFCCA6] pl-4">
            <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
              SAREE PRICE RANGE
            </p>
            <p className="font-serif text-xl sm:text-2xl text-[#241214] mt-1 tabular-nums">
              ₹1,200 – ₹25,000
            </p>
            <p className="text-[10px] text-[#5E4346]">Heritage &amp; Designer Sarees</p>
          </div>
          <div className="lg:border-l border-[#DFCCA6] lg:pl-4">
            <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
              INTERNATIONAL DEBUT
            </p>
            <p className="font-serif text-xl sm:text-2xl text-[#241214] mt-1">
              {BRAND_INFO.debutMilestone}
            </p>
            <p className="text-[10px] text-[#5E4346]">{BRAND_INFO.launchpad}</p>
          </div>
          <div className="border-l border-[#DFCCA6] pl-4">
            <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
              DELIVERY COVERAGE
            </p>
            <p className="font-serif text-xl sm:text-2xl text-[#241214] mt-1">
              {BRAND_INFO.deliveryLocations}
            </p>
            <p className="text-[10px] text-[#5E4346]">Rooted in {BRAND_INFO.birthplace}</p>
          </div>
        </div>
      </section>

      {/* Regional Anchor Tabs */}
      <div className="sticky top-12 z-30 bg-[#FDF3DC]/95 backdrop-blur-sm border-b border-[#DFCCA6]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'ALL 12 STATE WEAVES' },
            { id: 'region-east', label: 'EAST (WEST BENGAL & BIHAR)' },
            { id: 'region-north', label: 'NORTH & CENTRAL (UP, LUCKNOW, KASHMIR, MP)' },
            { id: 'region-west', label: 'WEST (GUJARAT & RAJASTHAN)' },
            { id: 'region-south', label: 'SOUTH (TELANGANA & ANDHRA)' },
            { id: 'region-northeast', label: 'NORTH-EAST (ASSAM & MANIPUR)' },
          ].map((tab) => {
            const active = activeRegionTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToRegion(tab.id)}
                className={`px-3.5 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase whitespace-nowrap border transition-colors min-h-[36px] ${
                  active
                    ? 'bg-[#4A0D1B] text-[#FDF3DC] border-[#4A0D1B]'
                    : 'bg-[#FFFFFF] text-[#5E4346] border-[#DFCCA6] hover:border-[#4A0D1B]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive India Map & Weave Spotlight */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#DFCCA6] p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
              <div>
                <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                  PRIYONTOR WEAVE TOPOGRAPHY
                </p>
                <h2 className="font-serif text-2xl text-[#241214] mt-0.5">
                  Regional Handloom Hubs
                </h2>
              </div>
              <div className="text-right">
                <p className="text-[9px] tracking-[0.14em] uppercase text-[#5E4346]">COORDINATES</p>
                <p className="font-mono text-xs text-[#241214] tabular-nums">
                  {selectedPin.coordinates}
                </p>
              </div>
            </div>

            <div className="flex-1 min-h-[360px] sm:min-h-[430px]">
              <IndiaMapSvg
                pins={DISCOVER_PINS.map((p) => ({
                  id: p.id,
                  name: p.name,
                  sub: p.craft,
                  x: p.x,
                  y: p.y,
                }))}
                activePinId={selectedPinId}
                onSelectPin={(pin) => {
                  if (pin.id) {
                    setSelectedPinId(pin.id);
                    if (isPlayingLoom) stopLoomAudio();
                  }
                }}
                variant="full-india"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-[#F7E8C6] flex flex-wrap items-center justify-between gap-3 text-[9px] font-semibold tracking-[0.14em] uppercase text-[#5E4346]">
              <span>SELECT A PIN TO EXPLORE REGIONAL WEAVES</span>
              <BenarasGhatMotif className="w-24 h-6" color="#B5832C" accentColor="#4A0D1B" />
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#DFCCA6] p-5 sm:p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="bg-[#4A0D1B] text-[#FDF3DC] px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] uppercase">
                  REGIONAL SPOTLIGHT
                </span>
                <span className="text-[10px] font-mono text-[#4A0D1B] font-medium">
                  {selectedPin.guildCode}
                </span>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#241214] leading-snug">
                  {selectedPin.guildTitle}
                </h2>
                <p className="text-xs text-[#5E4346] mt-1">{selectedPin.loomLabel}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3">
                  <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                    SIZE SPEC
                  </p>
                  <p className="font-serif text-lg text-[#241214] mt-0.5">{selectedPin.hours}</p>
                </div>
                <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3">
                  <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                    DIMENSIONS
                  </p>
                  <p className="font-serif text-lg text-[#241214] mt-0.5">{selectedPin.ends}</p>
                </div>
                <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3">
                  <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                    SIGNATURE CRAFT
                  </p>
                  <p className="font-serif text-lg text-[#241214] mt-0.5">
                    {selectedPin.silverPurity}
                  </p>
                </div>
                <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3">
                  <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                    LINEAGE
                  </p>
                  <p className="font-serif text-lg text-[#241214] mt-0.5">{selectedPin.giCode}</p>
                </div>
              </div>

              <div className="relative aspect-[16/9] overflow-hidden border border-[#DFCCA6]">
                <TextileArtwork
                  artworkId="empress-pit-loom"
                  alt={`Handloom craft — ${selectedPin.guildTitle}`}
                  className="w-full h-full"
                />
              </div>

              <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="inline-flex items-center gap-1.5 font-semibold tracking-[0.14em] uppercase text-[#241214]">
                    <Volume2 className="w-3.5 h-3.5 text-[#4A0D1B]" aria-hidden="true" />
                    <span>LOOM RHYTHM PREVIEW</span>
                  </span>
                  <span className="text-[#5E4346] font-mono">{selectedPin.cadenceBpm} BPM</span>
                </div>
                <button
                  type="button"
                  onClick={toggleLoomAudio}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#4A0D1B] text-[#FDF3DC] text-[9px] font-semibold tracking-[0.14em] uppercase hover:bg-[#2F0710] transition-colors min-h-[34px]"
                >
                  {isPlayingLoom ? (
                    <>
                      <Pause className="w-3 h-3" aria-hidden="true" />
                      <span>PAUSE RHYTHM</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" aria-hidden="true" />
                      <span>LISTEN TO HANDLOOM CADENCE</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  onSelectMapCategory(PIN_TO_MAP_CATEGORY[selectedPin.id] ?? 'banarasi')
                }
                className="bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] py-3 px-4 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[44px]"
              >
                SHOP THIS REGION
              </button>
              <button
                type="button"
                onClick={() => onOpenPolicyTab('size-chart')}
                className="bg-[#FFFFFF] border border-[#241214] text-[#241214] hover:bg-[#F7E8C6] py-3 px-4 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[44px]"
              >
                SIZE CHART &amp; CARE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* All 12 State-Wise Sarees by Region */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-[#DFCCA6]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718] mb-1">
              ALL 12 INDIAN STATE WEAVES
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#241214]">
              State-Wise Traditional Sarees
            </h2>
          </div>
          <p className="text-xs text-[#5E4346] max-w-md">
            Saree Price Range: ₹1,200 – ₹25,000 · All sarees come in Free Size with matching unstitched blouse fabric.
          </p>
        </div>

        <div className="space-y-14">
          {visibleRegions.map((section) => {
            const sectionProducts = section.productIds
              .map((id) => PRODUCTS.find((p) => p.id === id))
              .filter((p): p is Product => Boolean(p));

            return (
              <div key={section.id} id={section.id} className="scroll-mt-32 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#DFCCA6]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 bg-[#F7E8C6] border border-[#DFCCA6] text-[9px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B]">
                      {section.badge}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#241214]">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#5E4346]">
                    {section.corridors}
                  </p>
                </div>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    section.cols === 4
                      ? 'lg:grid-cols-4'
                      : section.cols === 2
                        ? 'lg:grid-cols-2'
                        : 'lg:grid-cols-3'
                  } gap-6`}
                >
                  {sectionProducts.map((product) => (
                    <article
                      key={product.id}
                      className="bg-[#FFFFFF] border border-[#DFCCA6] flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative aspect-[4/5] overflow-hidden bg-[#F7E8C6]">
                          <button
                            type="button"
                            onClick={() => onSelectProduct(product)}
                            className="w-full h-full block"
                            aria-label={`Inspect ${product.title}`}
                          >
                            <TextileArtwork
                              artworkId={product.artworkId}
                              alt={product.title}
                              className="w-full h-full group-hover:scale-[1.02] transition-transform duration-200"
                            />
                          </button>
                          <span className="absolute top-3 left-3 bg-[#FDF3DC]/95 px-2.5 py-1 text-[9px] font-semibold tracking-[0.12em] uppercase text-[#241214]">
                            {product.originBadge}
                          </span>
                          <span className="absolute bottom-3 right-3 bg-[#241214]/85 text-[#FDF3DC] px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] uppercase">
                            {product.secondaryBadge}
                          </span>
                        </div>

                        <div className="p-5 space-y-3">
                          <div>
                            <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
                              {product.guildLabel}
                            </p>
                            <h4 className="font-serif text-lg sm:text-xl text-[#241214] mt-1">
                              <button
                                type="button"
                                onClick={() => onSelectProduct(product)}
                                className="text-left hover:text-[#4A0D1B] transition-colors"
                              >
                                {product.title}
                              </button>
                            </h4>
                            <p className="text-xs text-[#5E4346] mt-1 leading-relaxed line-clamp-2">
                              {product.description}
                            </p>
                          </div>

                          <dl className="pt-3 border-t border-[#F7E8C6] space-y-1.5 text-[11px]">
                            <div className="flex justify-between gap-2">
                              <dt className="text-[#5E4346]">Loom / Craft</dt>
                              <dd className="font-medium text-[#241214] text-right">
                                {product.loomMechanism}
                              </dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-[#5E4346]">Material</dt>
                              <dd className="font-medium text-[#241214] text-right">
                                {product.fiberComposition}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      <div className="px-5 pb-4 pt-3 border-t border-[#F7E8C6] flex items-center justify-between gap-2">
                        <span className="text-base font-semibold text-[#241214] tabular-nums">
                          {formatPrice(product.priceINR, currency)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onQuickAcquire(product)}
                            className="bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[36px]"
                          >
                            ADD TO BAG
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectProduct(product)}
                            aria-label={`View ${product.title}`}
                            className="w-9 h-9 border border-[#DFCCA6] flex items-center justify-center text-[#5E4346] hover:border-[#4A0D1B] hover:text-[#4A0D1B]"
                          >
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Store & WhatsApp Band */}
      <section className="bg-[#4A0D1B] text-[#FDF3DC] py-14 mt-8 dark-surface border-t-2 border-[#B5832C]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="flex justify-center">
            <BenarasGhatMotif className="w-36 h-10" color="#E5C37A" accentColor="#D87277" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FDF3DC]">
            Visit Our Newtown, Kolkata Store or Message Us on WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-[#E9DAC0] max-w-2xl mx-auto leading-relaxed">
            Receive 10% off your first physical purchase at {BRAND_INFO.storeAddress}, or message {BRAND_INFO.whatsappNumbers.join(' / ')} for styling and sizing guidance across all 12 state sarees.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FDF3DC] text-[#4A0D1B] hover:bg-[#F7E8C6] text-[10px] font-semibold tracking-[0.16em] uppercase min-h-[44px]"
            >
              <span>CONTACT &amp; STORE DETAILS</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicyTab('care')}
              className="px-6 py-3.5 border border-[#FDF3DC]/60 text-[#FDF3DC] hover:bg-[#2F0710] text-[10px] font-semibold tracking-[0.16em] uppercase min-h-[44px]"
            >
              WASHING &amp; CARE GUIDE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
