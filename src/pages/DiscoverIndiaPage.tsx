import React, { useEffect, useRef, useState } from 'react';
import { Eye, Pause, Play, ShieldCheck, Volume2 } from 'lucide-react';
import { DISCOVER_PINS, PRODUCTS, formatPrice } from '../data/archiveData';
import { CurrencyCode, Product } from '../types/archive';
import { IndiaMapSvg } from '../components/IndiaMapSvg';
import { TextileArtwork } from '../components/TextileArtwork';

interface DiscoverIndiaPageProps {
  currency: CurrencyCode;
  onSelectProduct: (product: Product) => void;
  onQuickAcquire: (product: Product) => void;
  onOpenConcierge: () => void;
  onOpenQrDossier: () => void;
}

const REGION_SECTIONS: {
  id: string;
  badge: string;
  title: string;
  corridors: string;
  productIds: string[];
  cols?: 3 | 4;
}[] = [
  {
    id: 'region-east',
    badge: 'REGION I',
    title: 'East India: The Gauze of Bengal, Silk of Assam & Sacred Bandha',
    corridors: 'Bengal • Odisha • Assam Corridors',
    productIds: ['dhakai-jamdani-fine-muslin', 'sambalpuri-bomkai-silk', 'sualkuchi-golden-muga-mekhela'],
    cols: 3,
  },
  {
    id: 'region-north',
    badge: 'REGION II',
    title: 'North India: Mughal Brocades, Himalayan Cashmere & Desert Bandhej',
    corridors: 'Kashmir • Varanasi • Lucknow • Rajasthan',
    productIds: [
      'raktambari-banarasi-katan',
      'ivory-sozni-jacket',
      'lucknowi-mukaish-angrakha',
      'rajputi-velvet-gota-poshak',
    ],
    cols: 4,
  },
  {
    id: 'region-west',
    badge: 'REGION III',
    title: 'West India: The Mathematical Precision of Patola & Royal Paithani',
    corridors: 'Gujarat • Maharashtra • Goa',
    productIds: ['double-ikat-patola-geometric', 'yeola-paithani-mor-bangadi', 'dhamadka-ajrakh-chador'],
    cols: 3,
  },
  {
    id: 'region-south',
    badge: 'REGION IV',
    title: 'South India: Temple Spire Borders, Regal Kanjeevaram & Kasavu',
    corridors: 'Tamil Nadu • Kerala • Andhra Pradesh • Karnataka',
    productIds: ['emerald-kanchipuram-temple', 'balaramapuram-kasavu-mundu', 'srikalahasti-pen-kalamkari'],
    cols: 3,
  },
  {
    id: 'region-northeast',
    badge: 'REGION V',
    title: 'North-East India: Back-Strap Tribal Looms & Sovereign Silks',
    corridors: 'Manipur • Nagaland • Meghalaya',
    productIds: ['meitei-wangkhei-innaphi', 'chakhesang-naga-shawl', 'khasi-ryndia-jainsem'],
    cols: 3,
  },
];

export const DiscoverIndiaPage: React.FC<DiscoverIndiaPageProps> = ({
  currency,
  onSelectProduct,
  onQuickAcquire,
  onOpenConcierge,
  onOpenQrDossier,
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
        // Alternate wooden shuttle clack & reed beat
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
      {/* Hero & 4 KPI Metrics */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-7 bg-[#7D5718]" aria-hidden="true" />
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
              CARTOGRAPHY OF LIVING HANDLOOMS
            </p>
            <span className="h-[1px] w-7 bg-[#7D5718]" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#241214] leading-tight [text-wrap:balance]">
            One Nation. Many Traditions. Endless Stories.
          </h1>
          <p className="text-xs sm:text-sm text-[#5E4346] leading-relaxed max-w-xl">
            Every region has a voice. Every garment carries an unbroken legacy. Journey through
            India&apos;s sovereign craft corridors.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 border-y border-[#DFCCA6] py-5">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
              ACTIVE MASTER GUILDS
            </p>
            <p className="font-serif text-xl sm:text-2xl text-[#241214] mt-1 tabular-nums">
              118 Guilds
            </p>
            <p className="text-[10px] text-[#5E4346]">Across 23 Sovereign States</p>
          </div>
          <div className="border-l border-[#DFCCA6] pl-4">
            <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
              GEOGRAPHICAL INDICATIONS
            </p>
            <p className="font-serif text-xl sm:text-2xl text-[#241214] mt-1 tabular-nums">
              42 Registered
            </p>
            <p className="text-[10px] text-[#5E4346]">100% Sovereign Traceability</p>
          </div>
          <div className="lg:border-l border-[#DFCCA6] lg:pl-4">
            <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
              ARTISAN HANDLOOMS
            </p>
            <p className="font-serif text-xl sm:text-2xl text-[#241214] mt-1 tabular-nums">
              3,420 Active
            </p>
            <p className="text-[10px] text-[#5E4346]">Zero Motorized Interventions</p>
          </div>
          <div className="border-l border-[#DFCCA6] pl-4">
            <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
              HERITAGE LONGEVITY
            </p>
            <p className="font-serif text-xl sm:text-2xl text-[#241214] mt-1 tabular-nums">
              120+ Years
            </p>
            <p className="text-[10px] text-[#5E4346]">Generational Continuity</p>
          </div>
        </div>
      </section>

      {/* Regional Anchor Filter Tabs */}
      <div className="sticky top-12 z-30 bg-[#FDF3DC]/95 backdrop-blur-sm border-b border-[#DFCCA6]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'ALL REGIONS' },
            { id: 'region-east', label: 'EAST INDIA (BENGAL, ODISHA, ASSAM)' },
            { id: 'region-north', label: 'NORTH INDIA (KASHMIR, UP, RAJASTHAN, PUNJAB)' },
            { id: 'region-west', label: 'WEST INDIA (GUJARAT, MAHARASHTRA, GOA)' },
            { id: 'region-south', label: 'SOUTH INDIA (TAMIL NADU, KERALA, ANDHRA)' },
            { id: 'region-northeast', label: 'NORTH-EAST (MANIPUR, NAGALAND, MEGHALAYA)' },
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

      {/* Interactive Sovereign Weave Topography & Live Guild Telemetry */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Map */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#DFCCA6] p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
              <div>
                <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                  IMPERIAL ROUTE MAP &amp; LOOM GUILDS
                </p>
                <h2 className="font-serif text-2xl text-[#241214] mt-0.5">
                  Sovereign Weave Topography
                </h2>
              </div>
              <div className="text-right">
                <p className="text-[9px] tracking-[0.14em] uppercase text-[#5E4346]">
                  CARTOGRAPHIC GRID
                </p>
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
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4A0D1B]" aria-hidden="true" />
                  ROYAL COURT WEAVES
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B5832C]" aria-hidden="true" />
                  HEREDITARY HANDLOOMS
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#241214]" aria-hidden="true" />
                  TRIBAL BACK-STRAP LOOMS
                </span>
              </div>
              <span>CLICK ANY NODE TO INSPECT LIVE GUILD TELEMETRY</span>
            </div>
          </div>

          {/* Right Live Guild Telemetry */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#DFCCA6] p-5 sm:p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="bg-[#4A0D1B] text-[#FDF3DC] px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] uppercase">
                  LIVE GUILD TELEMETRY
                </span>
                <span className="text-[10px] font-mono text-[#4A0D1B] font-medium">
                  ● {selectedPin.guildCode}
                </span>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#241214] leading-snug">
                  {selectedPin.guildTitle}
                </h2>
                <p className="text-xs text-[#5E4346] mt-1">
                  Weave Ledger: Real-time artisan guild telemetry &amp; verified lineage.
                </p>
              </div>

              {/* 4 Metric Boxes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3">
                  <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                    DURATION ON LOOM
                  </p>
                  <p className="font-serif text-xl text-[#241214] mt-0.5 tabular-nums">
                    {selectedPin.hours}
                  </p>
                  <p className="text-[10px] text-[#5E4346]">2 Artisans Synchronized Day</p>
                </div>
                <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3">
                  <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                    WARP &amp; WEFT DENSITY
                  </p>
                  <p className="font-serif text-xl text-[#241214] mt-0.5 tabular-nums">
                    {selectedPin.ends}
                  </p>
                  <p className="text-[10px] text-[#5E4346]">Pure Mulberry Silk Filaments</p>
                </div>
                <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3">
                  <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                    ZARI / FIBER PURITY
                  </p>
                  <p className="font-serif text-xl text-[#241214] mt-0.5 tabular-nums">
                    {selectedPin.silverPurity}
                  </p>
                  <p className="text-[10px] text-[#5E4346]">Electroplated 24K Gold Standard</p>
                </div>
                <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3">
                  <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                    GI REGISTRY TOKEN
                  </p>
                  <p className="font-serif text-xl text-[#241214] mt-0.5 font-mono">
                    {selectedPin.giCode}
                  </p>
                  <p className="text-[10px] text-[#5E4346]">Registered Craft of Bharat</p>
                </div>
              </div>

              {/* Guild Workshop Visual */}
              <div className="relative aspect-[16/9] overflow-hidden border border-[#DFCCA6]">
                <TextileArtwork
                  artworkId="empress-pit-loom"
                  alt={`Workshop pit-loom at ${selectedPin.guildTitle}`}
                  className="w-full h-full"
                />
                <span className="absolute bottom-2.5 left-2.5 bg-[#241214]/90 text-[#FDF3DC] px-2.5 py-1 text-[9px] font-semibold tracking-[0.12em] uppercase">
                  ● {selectedPin.loomLabel}
                </span>
              </div>

              {/* Listen to the Loom Audio Cadence */}
              <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="inline-flex items-center gap-1.5 font-semibold tracking-[0.14em] uppercase text-[#241214]">
                    <Volume2 className="w-3.5 h-3.5 text-[#4A0D1B]" aria-hidden="true" />
                    <span>LISTEN TO THE LOOM</span>
                  </span>
                  <span className="text-[#5E4346]">Rhythm of Pit-Loom &amp; Shuttle In-Craft</span>
                </div>

                {/* Waveform Bars */}
                <div className="flex items-center gap-1 h-7" aria-hidden="true">
                  {[35, 65, 90, 45, 80, 100, 55, 75, 40, 85, 60, 95, 50, 70, 35, 80, 60, 45, 75, 40].map(
                    (h, idx) => (
                      <span
                        key={idx}
                        style={{ height: `${isPlayingLoom ? ((h + idx * 13) % 75) + 25 : h}%` }}
                        className={`flex-1 transition-all duration-150 ${
                          isPlayingLoom ? 'bg-[#4A0D1B]' : 'bg-[#8A7B72]'
                        }`}
                      />
                    )
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={toggleLoomAudio}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#4A0D1B] text-[#FDF3DC] text-[9px] font-semibold tracking-[0.14em] uppercase hover:bg-[#2F0710] transition-colors min-h-[34px]"
                  >
                    {isPlayingLoom ? (
                      <>
                        <Pause className="w-3 h-3" aria-hidden="true" />
                        <span>PAUSE LOOM CADENCE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" aria-hidden="true" />
                        <span>PLAY ACOUSTIC CADENCE</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] font-mono text-[#5E4346]">
                    {selectedPin.cadenceBpm} BPM · Hand-Thrown
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => onSelectProduct(PRODUCTS[0])}
                className="bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] py-3 px-4 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[44px]"
              >
                ACQUIRE GUILD ALLOTMENT
              </button>
              <button
                type="button"
                onClick={onOpenQrDossier}
                className="bg-[#FFFFFF] border border-[#241214] text-[#241214] hover:bg-[#F7E8C6] py-3 px-4 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[44px]"
              >
                VERIFY DOSSIER
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sovereign Regional Collectanea */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-[#DFCCA6]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718] mb-1">
              ARCHIVAL INVENTORY
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#241214]">
              Sovereign Regional Collectanea
            </h2>
          </div>
          <p className="text-xs text-[#5E4346] max-w-md">
            Each creation is documented with its mechanical loom apparatus, thread gauge, GI
            registration seal, and sovereign artisan royalties allotment.
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
                    section.cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
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
                            {product.certificationText}
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
                              <dt className="text-[#5E4346]">Loom Mechanism</dt>
                              <dd className="font-medium text-[#241214] text-right">
                                {product.loomMechanism}
                              </dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-[#5E4346]">Fiber Composition</dt>
                              <dd className="font-medium text-[#241214] text-right">
                                {product.fiberComposition}
                              </dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-[#5E4346]">Weaving Duration</dt>
                              <dd className="font-medium text-[#241214] text-right tabular-nums">
                                {product.weavingDuration}
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
                            ACQUIRE
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectProduct(product)}
                            aria-label={`Inspect ${product.title} details`}
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

      {/* Commission a Personal Heirloom Dark Maroon Band */}
      <section className="bg-[#4A0D1B] text-[#FDF3DC] py-16 sm:py-20 mt-8 dark-surface">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#2F0710] border border-[#6E2634] text-[9px] font-semibold tracking-[0.18em] uppercase text-[#E5C37A]">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              BESPOKE SOVEREIGN CONCIERGE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FDF3DC] leading-tight [text-wrap:balance]">
              Commission a Personal Heirloom Directly with a Master Weaver
            </h2>
            <p className="text-xs sm:text-sm text-[#E5D8CE] leading-relaxed">
              Select your loom corridor, dictate your family heraldry motifs, and join our textile
              historians on a private high-definition video walkthrough live from the master
              artisan&apos;s loom in Varanasi, Patan, or Kanchipuram.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {[
              {
                step: '1',
                title: 'Curator Consultation',
                desc: 'Private 45-minute video colloquium with PRIYONTOR historians to select lineage, density, zari alloy, and custom family motifs.',
              },
              {
                step: '2',
                title: 'Heraldry & Naqsha Design',
                desc: 'Master naqshabands weave your crest into traditional graph paper (talim) to craft bespoke loom punch cards or nakshas.',
              },
              {
                step: '3',
                title: 'Living Dedication Patch',
                desc: 'A bespoke gold-thread crest hand-stitched into the inner drape, recording the patron name, weaver seal, and archival date of creation.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-[#2F0710] border border-[#6E2634] p-6 space-y-3"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 bg-[#E5C37A] text-[#241214] text-xs font-bold tabular-nums">
                  {item.step}
                </span>
                <h3 className="font-serif text-xl text-[#FDF3DC]">{item.title}</h3>
                <p className="text-xs leading-relaxed text-[#E5D8CE]">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onOpenConcierge}
              className="px-6 py-3.5 bg-[#FDF3DC] text-[#4A0D1B] hover:bg-[#F7E8C6] text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[44px]"
            >
              SCHEDULE PRIVATE ATELIER CONSULTATION
            </button>
            <button
              type="button"
              onClick={onOpenQrDossier}
              className="px-6 py-3.5 bg-transparent border border-[#FDF3DC]/60 text-[#FDF3DC] hover:bg-[#2F0710] text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[44px]"
            >
              VIEW COMMISSION ARCHIVE DOSSIER
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
