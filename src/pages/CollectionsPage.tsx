import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  LayoutGrid,
  Plane,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SquareStack,
  X,
} from 'lucide-react';
import { PRODUCTS, SAREE_MAP_HOTSPOTS, formatPrice } from '../data/archiveData';
import { CurrencyCode, FilterState, PageRoute, Product } from '../types/archive';
import { TextileArtwork } from '../components/TextileArtwork';

interface CollectionsPageProps {
  currency: CurrencyCode;
  filters: FilterState;
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: PageRoute) => void;
  onOpenConcierge: () => void;
}

const REGION_OPTIONS = [
  { label: 'Uttar Pradesh (Varanasi / Lucknow)', count: 138 },
  { label: 'West Bengal (Murshidabad / Shantipur)', count: 84 },
  { label: 'Tamil Nadu (Kanchipuram)', count: 72 },
  { label: 'Gujarat (Patan / Bhuj / Ahmedabad)', count: 48 },
  { label: 'Kashmir Valley (Srinagar)', count: 34 },
];

const WEAVE_OPTIONS = [
  { label: 'Kadwa & Kadhua Brocade', count: 89 },
  { label: 'Supplementary Weft Jamdani', count: 64 },
  { label: 'Double Ikat Patola', count: 19 },
  { label: 'Kanchipuram Korvai Interlock', count: 58 },
  { label: 'Hand-needle Sozni & Pashmina', count: 27 },
  { label: 'Royal Gota Patti & Zardosi', count: 63 },
];

const FIBER_OPTIONS = [
  { label: 'Katan Mulberry Silk', tag: 'KATAN', count: 142 },
  { label: 'Wild Golden Assam Muga', tag: 'MUGA', count: 18 },
  { label: 'Handspun Chanderi / Cotton', tag: 'COTTON', count: 52 },
  { label: 'Ladakh Pure Pashmina Wool', tag: 'PASHMINA', count: 31 },
  { label: 'Tussar & Ahimsa Silk', tag: 'TUSSAR', count: 29 },
];

const GI_OPTIONS = [
  { label: 'GI Registered Lineage', count: 210 },
  { label: 'Silk Mark India Authorized', count: 340 },
  { label: 'Craftmark Certified Fair-Wage', count: 186 },
  { label: 'National Handloom Registry', count: 482 },
];

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  currency,
  filters,
  onFiltersChange,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onNavigate,
  onOpenConcierge,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 2>(3);
  const [visibleLimit, setVisibleLimit] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    region: true,
    weave: true,
    fiber: true,
    gi: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleArrayFilter = (
    field: 'regions' | 'weaves' | 'fibers' | 'giMarks',
    value: string
  ) => {
    onFiltersChange((prev) => {
      const list = prev[field];
      const exists = list.includes(value);
      return {
        ...prev,
        [field]: exists ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  };

  const resetAllFilters = () => {
    onFiltersChange({
      category: 'all',
      mapCategory: null,
      regions: [],
      weaves: [],
      fibers: [],
      giMarks: [],
      maxPriceINR: 600000,
      readiness: 'all',
      sortBy: 'curator',
      searchQuery: '',
    });
    setVisibleLimit(9);
    setCurrentPage(1);
  };

  const catalogProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category !== 'accessories');
  }, []);

  const filteredProducts = useMemo(() => {
    let list = catalogProducts.filter((p) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (filters.mapCategory && p.mapCategory !== filters.mapCategory) return false;
      if (filters.regions.length > 0 && !filters.regions.includes(p.regionLabel)) return false;
      if (filters.weaves.length > 0 && !filters.weaves.includes(p.weaveType)) return false;
      if (filters.fibers.length > 0 && !filters.fibers.includes(p.fiberTag)) return false;
      if (
        filters.giMarks.length > 0 &&
        !filters.giMarks.some((m) => p.giMarks.includes(m))
      ) {
        return false;
      }
      if (p.priceINR > filters.maxPriceINR) return false;
      if (filters.readiness !== 'all' && p.readiness !== filters.readiness) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const hay = `${p.title} ${p.subtitle} ${p.regionLabel} ${p.weaveType} ${p.guildLabel}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (filters.sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.priceINR - b.priceINR);
    } else if (filters.sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.priceINR - a.priceINR);
    } else if (filters.sortBy === 'hours') {
      list = [...list].sort((a, b) => b.craftHours - a.craftHours);
    } else {
      list = [...list].sort((a, b) => b.heritageRating - a.heritageRating);
    }

    return list;
  }, [catalogProducts, filters]);

  const activeMapSpot = useMemo(
    () =>
      filters.mapCategory
        ? SAREE_MAP_HOTSPOTS.find((h) => h.id === filters.mapCategory) ?? null
        : null,
    [filters.mapCategory]
  );

  const displayedProducts = filteredProducts.slice(0, visibleLimit);
  const firstHalf = displayedProducts.slice(0, 6);
  const secondHalf = displayedProducts.slice(6);

  const activeChips: { label: string; onRemove: () => void }[] = [
    ...(activeMapSpot
      ? [
          {
            label: `MAP: ${activeMapSpot.sareeName.toUpperCase()} (${activeMapSpot.state.toUpperCase()})`,
            onRemove: () => onFiltersChange((p) => ({ ...p, mapCategory: null })),
          },
        ]
      : []),
    ...filters.regions.map((r) => ({
      label: r.split('(')[0].trim().toUpperCase(),
      onRemove: () => toggleArrayFilter('regions', r),
    })),
    ...filters.weaves.map((w) => ({
      label: w.toUpperCase(),
      onRemove: () => toggleArrayFilter('weaves', w),
    })),
    ...filters.fibers.map((f) => ({
      label: `${f} SILK`,
      onRemove: () => toggleArrayFilter('fibers', f),
    })),
    ...filters.giMarks.map((g) => ({
      label: g.toUpperCase(),
      onRemove: () => toggleArrayFilter('giMarks', g),
    })),
  ];

  if (filters.readiness !== 'all') {
    activeChips.push({
      label: `LOOM: ${filters.readiness.toUpperCase()}`,
      onRemove: () => onFiltersChange((p) => ({ ...p, readiness: 'all' })),
    });
  }

  const categoryTabs: {
    id: FilterState['category'];
    label: string;
    count: number;
  }[] = [
    { id: 'all', label: 'ALL ARCHIVES', count: 482 },
    { id: 'sarees', label: 'SAREES & REGAL DRAPES', count: 214 },
    { id: 'lehengas', label: 'LEHENGAS & SKIRT ENSEMBLES', count: 88 },
    { id: 'kurtas', label: 'KURTAS & CO-ORD SETS', count: 46 },
    { id: 'anarkalis', label: 'ANARKALIS & PESHWAS', count: 32 },
  ];

  const renderSidebarContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#DFCCA6]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#4A0D1B]" aria-hidden="true" />
          <h2 className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#241214]">
            CURATORIAL FILTERS
          </h2>
        </div>
        <button
          type="button"
          onClick={resetAllFilters}
          className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#7D5718] hover:text-[#4A0D1B] underline underline-offset-2"
        >
          RESET ({activeChips.length})
        </button>
      </div>

      {/* Active Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={chip.onRemove}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFFFFF] border border-[#DFCCA6] text-[9px] font-semibold tracking-[0.1em] uppercase text-[#241214] hover:border-[#4A0D1B]"
            >
              <span>{chip.label}</span>
              <X className="w-3 h-3 text-[#5E4346]" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {/* Region Accordion */}
      <div className="border-b border-[#DFCCA6] pb-4">
        <button
          type="button"
          aria-expanded={openAccordions.region}
          onClick={() => toggleAccordion('region')}
          className="w-full flex items-center justify-between py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-[#241214]"
        >
          <span>STATE &amp; REGIONAL GUILDS</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${openAccordions.region ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {openAccordions.region && (
          <div className="mt-3 space-y-2">
            {REGION_OPTIONS.map((opt) => {
              const checked = filters.regions.includes(opt.label);
              return (
                <label
                  key={opt.label}
                  className="flex items-center justify-between gap-2 text-xs text-[#5E4346] cursor-pointer hover:text-[#241214] py-0.5"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayFilter('regions', opt.label)}
                      className="accent-[#4A0D1B] w-3.5 h-3.5 rounded-none"
                    />
                    <span className={checked ? 'text-[#241214] font-medium' : ''}>
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[10px] text-[#7A6D65] tabular-nums">{opt.count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Technique & Weave */}
      <div className="border-b border-[#DFCCA6] pb-4">
        <button
          type="button"
          aria-expanded={openAccordions.weave}
          onClick={() => toggleAccordion('weave')}
          className="w-full flex items-center justify-between py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-[#241214]"
        >
          <span>TECHNIQUE &amp; WEAVE</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${openAccordions.weave ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {openAccordions.weave && (
          <div className="mt-3 space-y-2">
            {WEAVE_OPTIONS.map((opt) => {
              const checked = filters.weaves.includes(opt.label);
              return (
                <label
                  key={opt.label}
                  className="flex items-center justify-between gap-2 text-xs text-[#5E4346] cursor-pointer hover:text-[#241214] py-0.5"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayFilter('weaves', opt.label)}
                      className="accent-[#4A0D1B] w-3.5 h-3.5"
                    />
                    <span className={checked ? 'text-[#241214] font-medium' : ''}>
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[10px] text-[#7A6D65] tabular-nums">{opt.count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Fiber Origin */}
      <div className="border-b border-[#DFCCA6] pb-4">
        <button
          type="button"
          aria-expanded={openAccordions.fiber}
          onClick={() => toggleAccordion('fiber')}
          className="w-full flex items-center justify-between py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-[#241214]"
        >
          <span>FABRIC &amp; FIBER ORIGIN</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${openAccordions.fiber ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {openAccordions.fiber && (
          <div className="mt-3 space-y-2">
            {FIBER_OPTIONS.map((opt) => {
              const checked = filters.fibers.includes(opt.tag);
              return (
                <label
                  key={opt.tag}
                  className="flex items-center justify-between gap-2 text-xs text-[#5E4346] cursor-pointer hover:text-[#241214] py-0.5"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayFilter('fibers', opt.tag)}
                      className="accent-[#4A0D1B] w-3.5 h-3.5"
                    />
                    <span className={checked ? 'text-[#241214] font-medium' : ''}>
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[10px] text-[#7A6D65] tabular-nums">{opt.count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Government & GI Marks */}
      <div className="border-b border-[#DFCCA6] pb-4">
        <button
          type="button"
          aria-expanded={openAccordions.gi}
          onClick={() => toggleAccordion('gi')}
          className="w-full flex items-center justify-between py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-[#241214]"
        >
          <span>GOVERNMENT &amp; GI MARKS</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${openAccordions.gi ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {openAccordions.gi && (
          <div className="mt-3 space-y-2">
            {GI_OPTIONS.map((opt) => {
              const checked = filters.giMarks.includes(opt.label);
              return (
                <label
                  key={opt.label}
                  className="flex items-center justify-between gap-2 text-xs text-[#5E4346] cursor-pointer hover:text-[#241214] py-0.5"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayFilter('giMarks', opt.label)}
                      className="accent-[#4A0D1B] w-3.5 h-3.5"
                    />
                    <span className={checked ? 'text-[#241214] font-medium' : ''}>
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[10px] text-[#7A6D65] tabular-nums">{opt.count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Value Range Slider */}
      <div className="border-b border-[#DFCCA6] pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="price-range-slider"
            className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#241214]"
          >
            VALUE RANGE ({currency})
          </label>
          <span className="text-[10px] font-mono text-[#7D5718] tabular-nums">
            Up to {formatPrice(filters.maxPriceINR, currency)}
          </span>
        </div>
        <input
          id="price-range-slider"
          type="range"
          min={20000}
          max={600000}
          step={5000}
          value={filters.maxPriceINR}
          onChange={(e) =>
            onFiltersChange((prev) => ({ ...prev, maxPriceINR: Number(e.target.value) }))
          }
          className="w-full accent-[#4A0D1B] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#5E4346] tabular-nums">
          <span>{formatPrice(15000, currency)}</span>
          <span>{formatPrice(600000, currency)}+</span>
        </div>
      </div>

      {/* Loom Status & Readiness */}
      <div className="border-b border-[#DFCCA6] pb-4 space-y-2.5">
        <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#241214]">
          LOOM STATUS &amp; READINESS
        </p>
        {[
          { id: 'all', label: 'All Archive Allocations' },
          { id: 'ready', label: 'Ready in Vault (Dispatches 48 hrs)' },
          { id: 'active', label: 'On Active Master Loom (2–3 Weeks)' },
          { id: 'bespoke', label: 'Bespoke Bridal Commission (6–12 Weeks)' },
        ].map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-2.5 text-xs text-[#5E4346] cursor-pointer hover:text-[#241214]"
          >
            <input
              type="radio"
              name="loom-readiness"
              checked={filters.readiness === opt.id}
              onChange={() =>
                onFiltersChange((prev) => ({
                  ...prev,
                  readiness: opt.id as FilterState['readiness'],
                }))
              }
              className="accent-[#4A0D1B]"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Sovereign Lineage Guarantee */}
      <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-4 space-y-2">
        <div className="flex items-center gap-2 text-[#4A0D1B]">
          <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase">
            SOVEREIGN LINEAGE GUARANTEE
          </p>
        </div>
        <p className="text-[11px] leading-relaxed text-[#5E4346]">
          Every piece includes a verifiable physical provenance docket and GI authenticity cert.
        </p>
      </div>
    </div>
  );

  const renderProductCard = (product: Product) => {
    const isSaved = wishlistIds.includes(product.id);
    return (
      <article
        key={product.id}
        className="bg-[#FFFFFF] border border-[#DFCCA6] flex flex-col justify-between group hover:shadow-md transition-shadow"
      >
        <div>
          <div className="relative aspect-[3/4] overflow-hidden bg-[#F7E8C6]">
            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="w-full h-full block text-left"
              aria-label={`Inspect ${product.title}`}
            >
              <TextileArtwork
                artworkId={product.artworkId}
                alt={product.title}
                className="w-full h-full group-hover:scale-[1.03] transition-transform duration-200"
              />
            </button>

            <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
              <span className="bg-[#FDF3DC]/95 px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] uppercase text-[#241214]">
                {product.originBadge}
              </span>
              {product.secondaryBadge && (
                <span className="bg-[#4A0D1B] px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] uppercase text-[#FDF3DC]">
                  {product.secondaryBadge}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label={isSaved ? `Remove ${product.title} from saved` : `Save ${product.title}`}
              aria-pressed={isSaved}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FDF3DC]/95 flex items-center justify-center text-[#241214] hover:text-[#4A0D1B] transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${isSaved ? 'fill-[#4A0D1B] text-[#4A0D1B]' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-2">
            <div className="flex items-start justify-between gap-2 text-[9px] font-semibold tracking-[0.12em] uppercase text-[#7D5718]">
              <span>{product.guildLabel}</span>
              <span className="text-[#5E4346] text-right">{product.certificationText}</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl text-[#241214] leading-snug">
              <button
                type="button"
                onClick={() => onSelectProduct(product)}
                className="text-left hover:text-[#4A0D1B] transition-colors"
              >
                {product.title}
              </button>
            </h3>
            <p className="text-xs text-[#5E4346] line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-[#F7E8C6] flex items-end justify-between gap-2">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
              ATELIER VALUE
            </p>
            <p className="text-base font-semibold text-[#241214] tabular-nums mt-0.5">
              {formatPrice(product.priceINR, currency)}
            </p>
          </div>
          <div className="text-right space-y-1.5">
            <p className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[#5E4346]">
              {product.statusText}
            </p>
            <div className="flex items-center justify-end gap-1.5">
              {product.colorways.slice(0, 3).map((cw) => (
                <span
                  key={cw.name}
                  title={cw.name}
                  style={{ backgroundColor: cw.hex }}
                  className="w-3 h-3 rounded-full border border-[#DFCCA6]"
                />
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="bg-[#FDF3DC]">
      {/* Breadcrumb Bar */}
      <div className="border-b border-[#DFCCA6] bg-[#FDF3DC]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2 text-[10px] tracking-[0.14em] uppercase">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#5E4346]">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#241214]"
            >
              HOME
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-[#5E4346]">COLLECTIONS</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#241214] font-semibold">HANDLOOM &amp; COUTURE ARCHIVE</span>
          </nav>
          <span className="font-semibold text-[#7D5718]">
            ● CERTIFIED LINEAGE INDEX — FALL/WINTER 2025
          </span>
        </div>
      </div>

      {/* Archive Hero Header */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-8 border-b border-[#DFCCA6]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <p className="font-serif italic text-sm text-[#7D5718]">
              Curated Repositories of Bharat
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#241214] tracking-tight">
              THE HANDLOOM &amp; COUTURE ARCHIVE
            </h1>
            <p className="text-xs sm:text-sm text-[#5E4346] max-w-2xl leading-relaxed">
              482 Handcrafted Heirlooms — Preserving generational lineages of Indian masterweavers
              across royal guilds, rare jacquards, and sacred motifs authenticated via direct
              artisan patronage.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-3 gap-3 bg-[#F7E8C6] border border-[#DFCCA6] p-4 sm:p-5">
            <div>
              <p className="font-serif text-2xl sm:text-3xl text-[#241214] tabular-nums">18</p>
              <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mt-1">
                STATES REPRESENTED
              </p>
            </div>
            <div className="border-l border-[#DFCCA6] pl-3">
              <p className="font-serif text-2xl sm:text-3xl text-[#241214] tabular-nums">100%</p>
              <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mt-1">
                TRACEABLE PROVENANCE
              </p>
            </div>
            <div className="border-l border-[#DFCCA6] pl-3">
              <p className="font-serif text-2xl sm:text-3xl text-[#241214] tabular-nums">₹0</p>
              <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mt-1">
                INTERMEDIARY MARKUP
              </p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Archive Silhouette Categories"
          className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        >
          {categoryTabs.map((tab) => {
            const active = filters.category === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() =>
                  onFiltersChange((prev) => ({ ...prev, category: tab.id }))
                }
                className={`px-4 py-2.5 text-[10px] font-semibold tracking-[0.12em] uppercase whitespace-nowrap border transition-colors min-h-[40px] ${
                  active
                    ? 'bg-[#4A0D1B] text-[#FDF3DC] border-[#4A0D1B]'
                    : 'bg-[#FFFFFF] text-[#241214] border-[#DFCCA6] hover:border-[#4A0D1B]'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content: Sidebar + Product Grid */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Curatorial Filters Sidebar */}
          <aside
            aria-label="Curatorial Filters"
            className="hidden lg:block lg:col-span-3 bg-[#F7E8C6]/60 border border-[#DFCCA6] p-5 sticky top-24"
          >
            {renderSidebarContent()}
          </aside>

          {/* Right Product Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Active India Saree Map Category Banner */}
            {activeMapSpot && (
              <div className="bg-[#FFFFFF] border-2 border-[#B5832C] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
                    SAREE MAP SELECTION · {activeMapSpot.state.toUpperCase()}
                  </p>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#4A0D1B]">
                    {activeMapSpot.sareeName} Collection ({filteredProducts.length}{' '}
                    {filteredProducts.length === 1 ? 'Heirloom' : 'Heirlooms'})
                  </h2>
                  <p className="text-xs text-[#5E4346] max-w-2xl">
                    {activeMapSpot.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onFiltersChange((p) => ({ ...p, mapCategory: null }))}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FDF3DC] border border-[#DFCCA6] hover:border-[#4A0D1B] text-[10px] font-semibold tracking-[0.12em] uppercase text-[#4A0D1B]"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>CLEAR MAP FILTER</span>
                </button>
              </div>
            )}

            {/* Toolbar */}
            <div className="bg-[#FFFFFF] border border-[#DFCCA6] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3 py-2 bg-[#4A0D1B] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[40px]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>FILTERS ({activeChips.length})</span>
                </button>
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#241214]">
                  SHOWING <span className="tabular-nums">{displayedProducts.length}</span> OF{' '}
                  <span className="tabular-nums">
                    {activeChips.length > 0 || filters.category !== 'all'
                      ? filteredProducts.length
                      : 482}
                  </span>{' '}
                  HEIRLOOMS
                </p>
                <span className="hidden sm:inline font-serif italic text-xs text-[#5E4346]">
                  · Hand-selected master weaver batches
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="sort-select" className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#5E4346]">
                  SORT BY:
                </label>
                <select
                  id="sort-select"
                  value={filters.sortBy}
                  onChange={(e) =>
                    onFiltersChange((prev) => ({
                      ...prev,
                      sortBy: e.target.value as FilterState['sortBy'],
                    }))
                  }
                  className="bg-[#FDF3DC] border border-[#DFCCA6] px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-[#241214] min-h-[36px]"
                >
                  <option value="curator">CURATOR&apos;S CHOICE (HERITAGE RATING)</option>
                  <option value="price-desc">ATELIER VALUE: HIGH TO LOW</option>
                  <option value="price-asc">ATELIER VALUE: LOW TO HIGH</option>
                  <option value="hours">LOOM HOURS: HIGHEST FIRST</option>
                </select>

                <div className="hidden md:flex items-center border border-[#DFCCA6]">
                  <button
                    type="button"
                    onClick={() => setGridCols(2)}
                    aria-label="Two column grid view"
                    aria-pressed={gridCols === 2}
                    className={`p-2 ${gridCols === 2 ? 'bg-[#241214] text-[#FDF3DC]' : 'bg-[#FFFFFF] text-[#5E4346]'}`}
                  >
                    <SquareStack className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridCols(3)}
                    aria-label="Three column grid view"
                    aria-pressed={gridCols === 3}
                    className={`p-2 ${gridCols === 3 ? 'bg-[#241214] text-[#FDF3DC]' : 'bg-[#FFFFFF] text-[#5E4346]'}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-12 text-center space-y-4">
                <p className="font-serif text-2xl text-[#241214]">
                  No Archive Pieces Match Your Current Selection
                </p>
                <p className="text-xs text-[#5E4346] max-w-md mx-auto">
                  Try clearing one or more regional guild, fiber, or loom status filters to explore
                  more masterweaver heirlooms.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-6 py-3 bg-[#4A0D1B] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.16em] uppercase"
                >
                  RESET ALL ARCHIVE FILTERS
                </button>
              </div>
            ) : (
              <>
                {/* First 6 Cards */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    gridCols === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-2'
                  } gap-6`}
                >
                  {firstHalf.map(renderProductCard)}
                </div>

                {/* Mid-Grid Private Bridal & Trousseau Concierge Banner */}
                <div className="bg-[#4A0D1B] text-[#FDF3DC] p-6 sm:p-9 relative overflow-hidden dark-surface">
                  <div className="relative z-10 max-w-2xl space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#E5C37A]">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>PRIVILEGED CLIENT SERVICE</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FDF3DC]">
                      The Private Bridal &amp; Trousseau Concierge
                    </h2>
                    <p className="text-xs sm:text-sm text-[#E5D8CE] leading-relaxed">
                      Consult our Master Textile Curators in New Delhi or book an immersive 4K
                      video walkthrough with micro-lens fabric inspections. We customize motifs,
                      thread tensions, and gold purity for generational heirlooms.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        onClick={onOpenConcierge}
                        className="px-5 py-3 bg-[#FDF3DC] text-[#4A0D1B] hover:bg-[#F7E8C6] text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[44px]"
                      >
                        BOOK VIDEO WALKTHROUGH
                      </button>
                      <button
                        type="button"
                        onClick={onOpenConcierge}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-[#2F0710] border border-[#7A3341] text-[#FDF3DC] hover:bg-[#23060B] text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[44px]"
                      >
                        <span>DELHI ATELIER APPOINTMENT</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second Half Cards */}
                {secondHalf.length > 0 && (
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${
                      gridCols === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-2'
                    } gap-6`}
                  >
                    {secondHalf.map(renderProductCard)}
                  </div>
                )}

                {/* Pagination & Reveal More */}
                <div className="pt-8 pb-4 flex flex-col items-center space-y-5">
                  <div className="w-56 text-center space-y-2">
                    <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#5E4346]">
                      ARCHIVE REVEALED: {displayedProducts.length} OF {filteredProducts.length} WEAVES
                    </p>
                    <div className="h-[2px] w-full bg-[#DFCCA6]">
                      <div
                        className="h-full bg-[#4A0D1B] transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((displayedProducts.length / Math.max(1, filteredProducts.length)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {visibleLimit < filteredProducts.length && (
                    <button
                      type="button"
                      onClick={() => setVisibleLimit((v) => v + 6)}
                      className="px-7 py-3 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[44px]"
                    >
                      REVEAL MORE RARE WEAVES
                    </button>
                  )}

                  <nav aria-label="Archive Pagination" className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      aria-label="Previous page"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="w-8 h-8 flex items-center justify-center border border-[#DFCCA6] bg-[#FFFFFF] text-[#5E4346] hover:border-[#241214]"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCurrentPage(num)}
                        aria-current={currentPage === num ? 'page' : undefined}
                        className={`w-8 h-8 text-xs font-medium tabular-nums border ${
                          currentPage === num
                            ? 'bg-[#241214] text-[#FDF3DC] border-[#241214]'
                            : 'bg-[#FFFFFF] text-[#5E4346] border-[#DFCCA6] hover:border-[#241214]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <span className="px-1.5 text-xs text-[#5E4346]">...</span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(54)}
                      className="w-8 h-8 text-xs font-medium tabular-nums border bg-[#FFFFFF] text-[#5E4346] border-[#DFCCA6] hover:border-[#241214]"
                    >
                      54
                    </button>
                    <button
                      type="button"
                      aria-label="Next page"
                      onClick={() => setCurrentPage((p) => Math.min(54, p + 1))}
                      className="w-8 h-8 flex items-center justify-center border border-[#DFCCA6] bg-[#FFFFFF] text-[#5E4346] hover:border-[#241214]"
                    >
                      <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Bottom 3-Pillar Trust Strip */}
      <section aria-label="Archive Standards" className="bg-[#FDF3DC] border-t border-[#DFCCA6] py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-[#4A0D1B] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#241214]">
                GI &amp; SILK MARK CERTIFIED
              </h3>
              <p className="text-xs text-[#5E4346] mt-1 leading-relaxed">
                Every thread is scientifically authenticated. Genuine zari test seals and GI
                geographical registration certificates accompany each bespoke acquisition.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <Sparkles className="w-5 h-5 text-[#4A0D1B] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#241214]">
                DIRECT ROYALTIES LEDGER
              </h3>
              <p className="text-xs text-[#5E4346] mt-1 leading-relaxed">
                Zero trader markups. 72% of product proceeds flow directly to the designated
                weaver&apos;s account, ensuring economic sovereignty for generational crafts.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <Plane className="w-5 h-5 text-[#4A0D1B] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#241214]">
                VAULTED GLOBAL AIR TRANSIT
              </h3>
              <p className="text-xs text-[#5E4346] mt-1 leading-relaxed">
                Packed in hand-carved cedarwood preservation cases with acid-free tissue wrapping,
                shipped via insured international courier to 140+ countries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Curatorial Filter Drawer */}
      {mobileFiltersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Curatorial Filters"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          <div
            className="fixed inset-0 bg-[#241214]/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#FDF3DC] h-full overflow-y-auto p-5 shadow-xl z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-lg text-[#241214]">Curatorial Filters</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#241214]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSidebarContent()}
            <div className="pt-6 sticky bottom-0 bg-[#FDF3DC] pb-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-[#4A0D1B] text-[#FDF3DC] text-[11px] font-semibold tracking-[0.14em] uppercase"
              >
                APPLY FILTERS ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
