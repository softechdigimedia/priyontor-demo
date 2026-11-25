import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Heart,
  LayoutGrid,
  Plane,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  SquareStack,
  X,
} from 'lucide-react';
import { PRODUCTS, SAREE_MAP_HOTSPOTS, formatPrice } from '../data/archiveData';
import { BRAND_INFO, PolicyEntry } from '../data/priyontorInfo';
import {
  CurrencyCode,
  FilterState,
  PageRoute,
  Product,
  ProductCategoryId,
  WardrobeSegment,
} from '../types/archive';
import { BenarasGhatMotif, LotusMotif } from '../components/HeritageMotifs';
import { TextileArtwork } from '../components/TextileArtwork';

interface CollectionsPageProps {
  currency: CurrencyCode;
  filters: FilterState;
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onNavigate: (page: PageRoute) => void;
  onOpenPolicyTab: (tab: PolicyEntry['id'] | 'size-chart') => void;
  onOpenContact: () => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  currency,
  filters,
  onFiltersChange,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
  onNavigate,
  onOpenPolicyTab,
  onOpenContact,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 2>(3);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    region: true,
    weave: true,
    fiber: true,
  });

  const regionOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of PRODUCTS) {
      counts.set(p.regionLabel, (counts.get(p.regionLabel) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
  }, []);

  const weaveOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of PRODUCTS) {
      counts.set(p.weaveType, (counts.get(p.weaveType) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
  }, []);

  const fiberOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of PRODUCTS) {
      counts.set(p.fiberTag, (counts.get(p.fiberTag) ?? 0) + 1);
    }
    const labels: Record<string, string> = {
      SILK: 'Pure Silk & Zari',
      COTTON: 'Handloom Breathable Cotton',
      TUSSAR: 'Bhagalpuri Ghicha Tussar',
      MUGA: 'Golden Assam Muga Cotton',
      KANI: 'Kashmiri Kani & Ari Blend',
      GEORGETTE: 'Georgette & Bandhej',
    };
    return Array.from(counts.entries()).map(([tag, count]) => ({
      tag,
      label: labels[tag] ?? tag,
      count,
    }));
  }, []);

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
      wardrobe: 'all',
      mapCategory: null,
      regions: [],
      weaves: [],
      fibers: [],
      giMarks: [],
      maxPriceINR: 25000,
      readiness: 'all',
      sortBy: 'curator',
      searchQuery: '',
    });
  };

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (filters.wardrobe !== 'all' && p.wardrobe !== filters.wardrobe) return false;
      if (filters.mapCategory && p.mapCategory !== filters.mapCategory) return false;
      if (filters.regions.length > 0 && !filters.regions.includes(p.regionLabel)) return false;
      if (filters.weaves.length > 0 && !filters.weaves.includes(p.weaveType)) return false;
      if (filters.fibers.length > 0 && !filters.fibers.includes(p.fiberTag)) return false;
      if (p.priceINR > filters.maxPriceINR) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const hay =
          `${p.title} ${p.subtitle} ${p.regionLabel} ${p.weaveType} ${p.categoryLabel} ${p.guildLabel}`.toLowerCase();
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
    }

    return list;
  }, [filters]);

  const activeMapSpot = useMemo(
    () =>
      filters.mapCategory
        ? SAREE_MAP_HOTSPOTS.find((h) => h.id === filters.mapCategory) ?? null
        : null,
    [filters.mapCategory]
  );

  const firstHalf = filteredProducts.slice(0, 6);
  const secondHalf = filteredProducts.slice(6);

  const activeChips: { label: string; onRemove: () => void }[] = [
    ...(filters.wardrobe !== 'all'
      ? [
          {
            label:
              filters.wardrobe === 'her'
                ? 'HER WARDROBE'
                : filters.wardrobe === 'his'
                  ? 'HIS WARDROBE'
                  : 'LITTLE WARDROBE',
            onRemove: () => onFiltersChange((p) => ({ ...p, wardrobe: 'all' })),
          },
        ]
      : []),
    ...(activeMapSpot
      ? [
          {
            label: `${activeMapSpot.state.toUpperCase()}: ${activeMapSpot.sareeName.toUpperCase()}`,
            onRemove: () => onFiltersChange((p) => ({ ...p, mapCategory: null })),
          },
        ]
      : []),
    ...filters.regions.map((r) => ({
      label: r.toUpperCase(),
      onRemove: () => toggleArrayFilter('regions', r),
    })),
    ...filters.weaves.map((w) => ({
      label: w.toUpperCase(),
      onRemove: () => toggleArrayFilter('weaves', w),
    })),
    ...filters.fibers.map((f) => ({
      label: f,
      onRemove: () => toggleArrayFilter('fibers', f),
    })),
  ];

  const categoryTabs: {
    id: 'all' | ProductCategoryId;
    label: string;
    count: number;
  }[] = [
    { id: 'all', label: 'ALL COLLECTIONS', count: PRODUCTS.length },
    {
      id: 'sarees',
      label: 'INDIAN HERITAGE SAREES',
      count: PRODUCTS.filter((p) => p.category === 'sarees').length,
    },
    {
      id: 'designer-sarees',
      label: 'DESIGNER SAREES',
      count: PRODUCTS.filter((p) => p.category === 'designer-sarees').length,
    },
    {
      id: 'womens-sets',
      label: "CO-ORD & KURTA SETS",
      count: PRODUCTS.filter((p) => p.category === 'womens-sets').length,
    },
    {
      id: 'blouses',
      label: 'BLOUSES',
      count: PRODUCTS.filter((p) => p.category === 'blouses').length,
    },
    {
      id: 'mens-punjabi',
      label: "MENS' PUNJABI",
      count: PRODUCTS.filter((p) => p.category === 'mens-punjabi').length,
    },
    {
      id: 'kids-wear',
      label: "KIDS' WEAR",
      count: PRODUCTS.filter((p) => p.category === 'kids-wear').length,
    },
  ];

  const renderSidebarContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#DFCCA6]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#4A0D1B]" aria-hidden="true" />
          <h2 className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#241214]">
            FILTER BY ATTRIBUTE
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

      {/* Wardrobe Target Audience Filter */}
      <div className="border-b border-[#DFCCA6] pb-4 space-y-2.5">
        <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#241214]">
          AUDIENCE / WARDROBE
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all' as const, label: 'ALL' },
            { id: 'her' as const, label: 'WOMEN (HER)' },
            { id: 'his' as const, label: 'MEN (HIS)' },
            { id: 'little' as const, label: 'KIDS (LITTLE)' },
          ].map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() =>
                onFiltersChange((prev) => ({
                  ...prev,
                  wardrobe: w.id as 'all' | WardrobeSegment,
                }))
              }
              className={`py-2 px-2 text-[10px] font-semibold tracking-[0.1em] uppercase border ${
                filters.wardrobe === w.id
                  ? 'bg-[#4A0D1B] text-[#FDF3DC] border-[#4A0D1B]'
                  : 'bg-[#FFFFFF] text-[#5E4346] border-[#DFCCA6] hover:border-[#4A0D1B]'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

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

      {/* State & Region Accordion */}
      <div className="border-b border-[#DFCCA6] pb-4">
        <button
          type="button"
          aria-expanded={openAccordions.region}
          onClick={() => toggleAccordion('region')}
          className="w-full flex items-center justify-between py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-[#241214]"
        >
          <span>STATE &amp; REGION</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${openAccordions.region ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {openAccordions.region && (
          <div className="mt-3 space-y-2">
            {regionOptions.map((opt) => {
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

      {/* Craft & Weave */}
      <div className="border-b border-[#DFCCA6] pb-4">
        <button
          type="button"
          aria-expanded={openAccordions.weave}
          onClick={() => toggleAccordion('weave')}
          className="w-full flex items-center justify-between py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-[#241214]"
        >
          <span>CRAFT &amp; SILHOUETTE</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${openAccordions.weave ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {openAccordions.weave && (
          <div className="mt-3 space-y-2">
            {weaveOptions.map((opt) => {
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

      {/* Fabric & Material */}
      <div className="border-b border-[#DFCCA6] pb-4">
        <button
          type="button"
          aria-expanded={openAccordions.fiber}
          onClick={() => toggleAccordion('fiber')}
          className="w-full flex items-center justify-between py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-[#241214]"
        >
          <span>FABRIC &amp; MATERIAL</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${openAccordions.fiber ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {openAccordions.fiber && (
          <div className="mt-3 space-y-2">
            {fiberOptions.map((opt) => {
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

      {/* Price Range Slider (₹800 - ₹25,000 PDF Pricing) */}
      <div className="border-b border-[#DFCCA6] pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="price-range-slider"
            className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#241214]"
          >
            PRICE RANGE ({currency})
          </label>
          <span className="text-[10px] font-mono text-[#7D5718] tabular-nums">
            Up to {formatPrice(filters.maxPriceINR, currency)}
          </span>
        </div>
        <input
          id="price-range-slider"
          type="range"
          min={1000}
          max={25000}
          step={500}
          value={filters.maxPriceINR}
          onChange={(e) =>
            onFiltersChange((prev) => ({ ...prev, maxPriceINR: Number(e.target.value) }))
          }
          className="w-full accent-[#4A0D1B] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#5E4346] tabular-nums">
          <span>{formatPrice(800, currency)}</span>
          <span>{formatPrice(25000, currency)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenPolicyTab('size-chart')}
        className="w-full bg-[#FFFFFF] border border-[#DFCCA6] hover:border-[#4A0D1B] p-4 text-left space-y-1.5 transition-colors"
      >
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B]">
          VIEW GARMENT SIZE CHART
        </p>
        <p className="text-[11px] text-[#5E4346]">
          Sarees (Free Size) · Sets &amp; Blouses (38–44) · Punjabi (38–44) · Kids (1–15Y)
        </p>
      </button>
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
              aria-label={isSaved ? `Remove ${product.title} from wishlist` : `Save ${product.title}`}
              aria-pressed={isSaved}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FDF3DC]/95 flex items-center justify-center text-[#241214] hover:text-[#4A0D1B]"
            >
              <Heart
                className={`w-4 h-4 ${isSaved ? 'fill-[#4A0D1B] text-[#4A0D1B]' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-2">
            <div className="flex items-start justify-between gap-2 text-[9px] font-semibold tracking-[0.12em] uppercase text-[#7D5718]">
              <span>{product.categoryLabel}</span>
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
            <p className="text-[10px] font-mono text-[#7D5718]">
              Sizes: {product.availableSizes.join(' · ')}
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-[#F7E8C6] flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-semibold text-[#241214] tabular-nums">
              {formatPrice(product.priceINR, currency)}
            </p>
            {product.originalPriceINR && (
              <p className="text-[11px] text-[#5E4346] line-through tabular-nums">
                {formatPrice(product.originalPriceINR, currency)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            className="px-3.5 py-2 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.12em] uppercase inline-flex items-center gap-1.5 min-h-[36px]"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#E5C37A]" aria-hidden="true" />
            <span>ADD TO BAG</span>
          </button>
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
            <button type="button" onClick={() => onNavigate('home')} className="hover:text-[#241214]">
              HOME
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-[#241214] font-semibold">SHOP COLLECTIONS</span>
          </nav>
          <span className="font-semibold text-[#7D5718]">
            {BRAND_INFO.debutMilestone.toUpperCase()} · USE CODE {BRAND_INFO.welcomePromoCode} (5% OFF 1ST ORDER)
          </span>
        </div>
      </div>

      {/* Collection Header */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-8 border-b border-[#DFCCA6]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <LotusMotif className="w-6 h-4" color="#4A0D1B" accentColor="#B5832C" />
              <p className="font-serif italic text-sm text-[#7D5718]">
                {BRAND_INFO.tagline}
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#241214] tracking-tight">
              PRIYONTOR COLLECTIONS
            </h1>
            <p className="text-xs sm:text-sm text-[#5E4346] max-w-2xl leading-relaxed">
              Explore Indian state-wise traditional sarees (₹1,200–₹25,000), Designer Sarees, Mens&apos; Ethnic Punjabi in cotton &amp; silk (₹1,000–₹6,000), Kids&apos; wear, Blouses (₹800–₹2,000), and Women&apos;s breathable Co-Ord &amp; Kurta Sets.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-3 gap-3 bg-[#F7E8C6] border border-[#DFCCA6] p-4 sm:p-5">
            <div>
              <p className="font-serif text-2xl sm:text-3xl text-[#241214] tabular-nums">12</p>
              <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mt-1">
                STATE SAREES
              </p>
            </div>
            <div className="border-l border-[#DFCCA6] pl-3">
              <p className="font-serif text-2xl sm:text-3xl text-[#241214] tabular-nums">5%</p>
              <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mt-1">
                1ST ORDER (PRIYO5)
              </p>
            </div>
            <div className="border-l border-[#DFCCA6] pl-3">
              <p className="font-serif text-2xl sm:text-3xl text-[#241214] tabular-nums">10%</p>
              <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mt-1">
                ON ₹20,000+ ORDERS
              </p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Product Categories"
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
                onClick={() => onFiltersChange((prev) => ({ ...prev, category: tab.id }))}
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

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside
            aria-label="Catalog Filters"
            className="hidden lg:block lg:col-span-3 bg-[#F7E8C6]/60 border border-[#DFCCA6] p-5 sticky top-24"
          >
            {renderSidebarContent()}
          </aside>

          <div className="lg:col-span-9 space-y-6">
            {activeMapSpot && (
              <div className="bg-[#FFFFFF] border-2 border-[#B5832C] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
                    STATE SAREE MAP SELECTION · {activeMapSpot.state.toUpperCase()}
                  </p>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#4A0D1B]">
                    {activeMapSpot.sareeName} ({filteredProducts.length}{' '}
                    {filteredProducts.length === 1 ? 'Product' : 'Products'})
                  </h2>
                  <p className="text-xs text-[#5E4346] max-w-2xl">{activeMapSpot.description}</p>
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
                  SHOWING <span className="tabular-nums">{filteredProducts.length}</span> OF{' '}
                  <span className="tabular-nums">{PRODUCTS.length}</span> PRODUCTS
                </p>
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
                  <option value="curator">FEATURED CURATION</option>
                  <option value="price-asc">PRICE: LOW TO HIGH</option>
                  <option value="price-desc">PRICE: HIGH TO LOW</option>
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

            {filteredProducts.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-12 text-center space-y-4">
                <p className="font-serif text-2xl text-[#241214]">
                  No Products Match Your Current Selection
                </p>
                <p className="text-xs text-[#5E4346] max-w-md mx-auto">
                  Clear one or more category, state, or price filters to view more Priyontor pieces.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-6 py-3 bg-[#4A0D1B] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.16em] uppercase"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    gridCols === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-2'
                  } gap-6`}
                >
                  {firstHalf.map(renderProductCard)}
                </div>

                {/* Mid-Grid Newtown Kolkata Store & Enquiry Banner */}
                <div className="bg-[#4A0D1B] text-[#FDF3DC] p-6 sm:p-9 relative overflow-hidden dark-surface border border-[#B5832C]">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                      <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#E5C37A]">
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>NEWTOWN, KOLKATA STORE · SPECIAL DISCOUNTS</span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#FDF3DC]">
                        Visit Priyontor at Astra Tower or Connect on WhatsApp
                      </h2>
                      <p className="text-xs sm:text-sm text-[#E5D8CE] leading-relaxed">
                        Enjoy <strong>10% Off on your 1st physical purchase</strong> at {BRAND_INFO.storeAddress}, <strong>10% Off on purchases of ₹20,000+</strong>, and <strong>5% Off your 1st online order (PRIYO5)</strong>.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={onOpenContact}
                        className="px-5 py-3 bg-[#FDF3DC] text-[#4A0D1B] hover:bg-[#F7E8C6] text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[44px]"
                      >
                        STORE &amp; WHATSAPP INFO
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenPolicyTab('care')}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-[#2F0710] border border-[#B5832C] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[44px]"
                      >
                        <span>WASHING &amp; CARE</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                {secondHalf.length > 0 && (
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${
                      gridCols === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-2'
                    } gap-6`}
                  >
                    {secondHalf.map(renderProductCard)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Trust Strip */}
      <section aria-label="Brand Policies" className="bg-[#FDF3DC] border-t border-[#DFCCA6] py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-start gap-3.5">
            <Plane className="w-5 h-5 text-[#4A0D1B] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#241214]">
                INDIA &amp; WORLDWIDE DELIVERY
              </h3>
              <p className="text-xs text-[#5E4346] mt-1 leading-relaxed">
                Dispatched from Newtown, Kolkata to addresses across India and worldwide.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-[#4A0D1B] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#241214]">
                UPI &amp; CARD PAYMENT ONLY
              </h3>
              <p className="text-xs text-[#5E4346] mt-1 leading-relaxed">
                Registered under GSTIN {BRAND_INFO.gstNumber} with transparent return &amp; refund policies.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-start md:justify-end">
            <BenarasGhatMotif className="w-32 h-9" color="#B5832C" accentColor="#4A0D1B" />
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter Collections"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          <div
            className="fixed inset-0 bg-[#241214]/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#FDF3DC] h-full overflow-y-auto p-5 shadow-xl z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-lg text-[#241214]">Filters</span>
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
                VIEW PRODUCTS ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
