import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Headphones,
  Heart,
  Lock,
  Plane,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
} from 'lucide-react';
import {
  CORRIDOR_REGIONS,
  LOOKBOOKS,
  PRODUCTS,
  SAREE_MAP_HOTSPOTS,
  formatPrice,
} from '../data/archiveData';
import {
  CurrencyCode,
  PageRoute,
  Product,
  SareeMapCategoryId,
  TextileArtworkId,
} from '../types/archive';
import { InteractiveSareeMap } from '../components/InteractiveSareeMap';
import { TextileArtwork } from '../components/TextileArtwork';

interface HomePageProps {
  currency: CurrencyCode;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  onFilterByCategory: (cat: 'all' | 'sarees' | 'lehengas' | 'kurtas' | 'anarkalis') => void;
  onFilterByRegion: (region: string) => void;
  onSelectMapCategory: (mapCat: SareeMapCategoryId) => void;
  onOpenRoyalties: () => void;
  onOpenConcierge: () => void;
}

const HERO_SLIDES: {
  kicker: string;
  headline: string;
  accentWord: string;
  body: string;
  artworkId: TextileArtworkId;
  productId: string;
}[] = [
  {
    kicker: 'WHERE HERITAGE MEETS HEART',
    headline: 'Timeless Sarees for',
    accentWord: 'Every Story.',
    body: 'From sunken Banarasi pit-looms to royal Kanchipuram temple borders, discover handcrafted heirlooms woven with pure silk and antique gold zari.',
    artworkId: 'empress-varanasi',
    productId: 'empress-varanasi',
  },
  {
    kicker: 'THE SOVEREIGN KADHWA ARCHIVE',
    headline: 'A Product of Tradition,',
    accentWord: 'Made for You.',
    body: 'Every weave preserves an unbroken dynastic memory—authenticated with Geographical Indication seals and 100% direct masterweaver royalties.',
    artworkId: 'emerald-gopuram',
    productId: 'emerald-kanchipuram-temple',
  },
  {
    kicker: 'BOTANICAL & GOLD ALCHEMY',
    headline: 'Six Meters of',
    accentWord: 'Living Poetry.',
    body: 'Pre-dyed Patan double ikats, gossamer Bengal Jamdanis, and golden Assam Muga silks curated for bridal trousseaus and collectors.',
    artworkId: 'nari-kunjar-patola',
    productId: 'nari-kunjar-double-ikat',
  },
];

const ARCHWAY_SHOWCASE: {
  title: string;
  origin: string;
  artworkId: TextileArtworkId;
  productId: string;
}[] = [
  {
    title: 'Banarasi Raktambari',
    origin: 'VARANASI',
    artworkId: 'empress-varanasi',
    productId: 'empress-varanasi',
  },
  {
    title: 'Gopuram Korvai Silk',
    origin: 'KANCHIPURAM',
    artworkId: 'emerald-gopuram',
    productId: 'emerald-kanchipuram-temple',
  },
  {
    title: 'Nari Kunjar Patola',
    origin: 'PATAN GUJARAT',
    artworkId: 'nari-kunjar-patola',
    productId: 'double-ikat-patola-geometric',
  },
  {
    title: 'Kadhwa Royal Jangla',
    origin: 'MADANPURA',
    artworkId: 'shikargah-jangla',
    productId: 'shikargah-royal-jangla',
  },
];

const CIRCULAR_CATEGORIES: {
  label: string;
  sub: string;
  artworkId: TextileArtworkId;
  category: 'all' | 'sarees' | 'lehengas' | 'kurtas' | 'anarkalis';
}[] = [
  { label: 'Silk Sarees', sub: 'Elegant & Rich', artworkId: 'empress-varanasi', category: 'sarees' },
  { label: 'Cotton & Muslin', sub: 'Comfort & Class', artworkId: 'dhakai-jamdani', category: 'sarees' },
  { label: 'Georgette & Organza', sub: 'Light & Graceful', artworkId: 'chanderi-angrakha', category: 'kurtas' },
  { label: 'Kanjeevaram', sub: 'Royal Tradition', artworkId: 'emerald-gopuram', category: 'sarees' },
  { label: 'Bridal Couture', sub: 'For Grand Moments', artworkId: 'rajputi-poshak', category: 'lehengas' },
  { label: 'Handloom Shawls', sub: 'Pure & Authentic', artworkId: 'darbar-sozni', category: 'anarkalis' },
];

const CORRIDOR_DEFAULT_HOTSPOT: Record<string, SareeMapCategoryId> = {
  east: 'baluchari',
  north: 'banarasi',
  west: 'patola',
  south: 'kanjivaram',
  northeast: 'assam',
};

export const HomePage: React.FC<HomePageProps> = ({
  currency,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
  onNavigate,
  onFilterByCategory,
  onFilterByRegion,
  onSelectMapCategory,
  onOpenRoyalties,
  onOpenConcierge,
}) => {
  const [heroIdx, setHeroIdx] = useState(0);
  const [activeCorridorId, setActiveCorridorId] = useState<'east' | 'north' | 'west' | 'south' | 'northeast'>('east');
  const [previewHotspotId, setPreviewHotspotId] = useState<SareeMapCategoryId>('baluchari');
  const [fiberFilter, setFiberFilter] = useState<'ALL' | 'KATAN' | 'TUSSAR' | 'MULBERRY'>('ALL');
  const [copiedCode, setCopiedCode] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'error' | 'enrolled'>('idle');

  const activeSlide = HERO_SLIDES[heroIdx];
  const activeCorridor =
    CORRIDOR_REGIONS.find((c) => c.id === activeCorridorId) ?? CORRIDOR_REGIONS[0];
  const activeHotspot =
    SAREE_MAP_HOTSPOTS.find((h) => h.id === previewHotspotId) ?? SAREE_MAP_HOTSPOTS[6];

  const mapProductCounts = React.useMemo(() => {
    const counts = {} as Record<SareeMapCategoryId, number>;
    for (const spot of SAREE_MAP_HOTSPOTS) {
      counts[spot.id] = PRODUCTS.filter(
        (p) => p.category !== 'accessories' && p.mapCategory === spot.id
      ).length;
    }
    return counts;
  }, []);

  const activeMapProducts = React.useMemo(
    () =>
      PRODUCTS.filter(
        (p) => p.category !== 'accessories' && p.mapCategory === activeHotspot.id
      ),
    [activeHotspot.id]
  );

  const handleSelectCorridorTab = (corridorId: 'east' | 'north' | 'west' | 'south' | 'northeast') => {
    setActiveCorridorId(corridorId);
    setPreviewHotspotId(CORRIDOR_DEFAULT_HOTSPOT[corridorId] ?? 'banarasi');
  };

  const handlePreviewHotspot = (hotspotId: SareeMapCategoryId) => {
    setPreviewHotspotId(hotspotId);
    const matched = SAREE_MAP_HOTSPOTS.find((h) => h.id === hotspotId);
    if (matched) {
      setActiveCorridorId(matched.corridorId);
    }
  };

  const featuredProducts = PRODUCTS.filter((p) => p.featuredOnHome);
  const filteredMasterpieces =
    fiberFilter === 'ALL'
      ? featuredProducts
      : featuredProducts.filter((p) => p.fiberTag === fiberFilter);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('PRIYONTOR10').catch(() => {});
    }
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      return;
    }
    setNewsletterStatus('enrolled');
    setNewsletterEmail('');
  };

  return (
    <div id="top" className="bg-[#FDF3DC]">
      {/* 1. ATMOSPHERIC HERO BANNER (Inspired by SareeAura + Logo Palette) */}
      <section
        aria-labelledby="hero-heading"
        className="relative bg-[#2F0710] text-[#FDF3DC] overflow-hidden border-b-2 border-[#B5832C] dark-surface"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-5 z-10">
            <div className="inline-flex items-center gap-2.5 text-[#E5C37A]">
              <span className="h-[1px] w-7 bg-[#B5832C]" aria-hidden="true" />
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase">
                {activeSlide.kicker}
              </p>
            </div>

            <h1
              id="hero-heading"
              className="font-serif text-4xl sm:text-5xl xl:text-[56px] leading-[1.08] text-[#FDF3DC] [text-wrap:balance]"
            >
              {activeSlide.headline}{' '}
              <span className="italic font-normal text-[#E5C37A]">{activeSlide.accentWord}</span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-[#E9DAC0] max-w-lg">
              {activeSlide.body}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('collections')}
                className="inline-flex items-center gap-2.5 bg-[#B5832C] hover:bg-[#D4A44B] text-[#2F0710] px-6 py-3.5 text-[11px] font-bold tracking-[0.16em] uppercase transition-colors min-h-[44px]"
              >
                <span>SHOP COLLECTIONS</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('discover')}
                className="inline-flex items-center gap-2 px-5 py-3.5 border border-[#B5832C]/70 text-[#FDF3DC] hover:bg-[#4A0D1B] text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[44px]"
              >
                <span>DISCOVER INDIA</span>
              </button>
            </div>

            {/* Slide Indicators 01 02 03 */}
            <div className="pt-4 flex items-center gap-4">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.kicker}
                  type="button"
                  onClick={() => setHeroIdx(idx)}
                  aria-label={`Show hero slide ${idx + 1}`}
                  aria-current={idx === heroIdx ? 'true' : undefined}
                  className={`text-[11px] font-mono tracking-widest pb-1 border-b-2 transition-colors ${
                    idx === heroIdx
                      ? 'text-[#E5C37A] border-[#E5C37A]'
                      : 'text-[#E9DAC0]/50 border-transparent hover:text-[#E9DAC0]'
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Right Framed Hero Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[16/11] sm:aspect-[16/10] border border-[#B5832C]/60 overflow-hidden shadow-2xl">
              <TextileArtwork
                artworkId={activeSlide.artworkId}
                alt={`${activeSlide.headline} ${activeSlide.accentWord}`}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2F0710]/55 via-transparent to-transparent" />

              {/* Bottom Overlay Caption + Slide Arrows */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const found = PRODUCTS.find((p) => p.id === activeSlide.productId) ?? PRODUCTS[0];
                    onSelectProduct(found);
                  }}
                  className="bg-[#FDF3DC]/95 hover:bg-[#FFFFFF] text-[#241214] px-3.5 py-2 border border-[#B5832C] text-left transition-colors"
                >
                  <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
                    FEATURED HEIRLOOM · INSPECT
                  </p>
                  <p className="font-serif text-sm text-[#4A0D1B]">
                    {(PRODUCTS.find((p) => p.id === activeSlide.productId) ?? PRODUCTS[0]).title}
                  </p>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={() =>
                      setHeroIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                    }
                    className="w-9 h-9 rounded-full bg-[#2F0710]/85 border border-[#B5832C] text-[#FDF3DC] hover:bg-[#B5832C] hover:text-[#2F0710] flex items-center justify-center transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length)}
                    className="w-9 h-9 rounded-full bg-[#2F0710]/85 border border-[#B5832C] text-[#FDF3DC] hover:bg-[#B5832C] hover:text-[#2F0710] flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MUGHAL ARCHWAY SHOWCASE BAND (Inspired by Maha Gauri) */}
      <section
        aria-labelledby="archway-heading"
        className="bg-[#4A0D1B] text-[#FDF3DC] py-10 sm:py-12 border-b-2 border-[#B5832C] dark-surface"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#E5C37A]">
                ROYAL ARCHIVE GALLERY
              </p>
              <h2 id="archway-heading" className="font-serif text-2xl sm:text-3xl text-[#FDF3DC] mt-0.5">
                Signature Silhouettes of Bharat
              </h2>
            </div>
            <p className="text-xs text-[#E9DAC0]">
              Select any archival alcove to inspect provenance &amp; handloom details.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {ARCHWAY_SHOWCASE.map((item) => {
              const targetProduct =
                PRODUCTS.find((p) => p.id === item.productId) ?? PRODUCTS[0];
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => onSelectProduct(targetProduct)}
                  className="group flex flex-col items-center text-center focus-visible:outline-offset-4"
                >
                  <div className="w-full aspect-[3/4] rounded-t-[999px] overflow-hidden border-2 border-[#B5832C]/75 group-hover:border-[#E5C37A] bg-[#2F0710] relative transition-all shadow-lg">
                    <TextileArtwork
                      artworkId={item.artworkId}
                      alt={item.title}
                      className="w-full h-full group-hover:scale-[1.04] transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2F0710]/85 via-transparent to-transparent" />
                    <div className="absolute bottom-3 inset-x-3">
                      <span className="block text-[9px] font-semibold tracking-[0.16em] uppercase text-[#E5C37A]">
                        {item.origin}
                      </span>
                      <span className="block font-serif text-base sm:text-lg text-[#FDF3DC] mt-0.5">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY: CIRCULAR MEDALLIONS (Inspired by SareeAura) */}
      <section
        aria-labelledby="categories-heading"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-3 space-y-2.5">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
              SHOP BY CATEGORY
            </p>
            <h2 id="categories-heading" className="font-serif text-3xl text-[#4A0D1B] leading-tight">
              Explore Our Collections
            </h2>
            <p className="text-xs text-[#5E4346] leading-relaxed">
              Discover handcrafted sarees and royal ensembles curated for every sacred occasion and
              drape preference.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('collections')}
              className="inline-flex items-center gap-2 pt-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] hover:text-[#7D5718] transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="lg:col-span-9 grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-5">
            {CIRCULAR_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => onFilterByCategory(cat.category)}
                className="group flex flex-col items-center text-center space-y-2.5"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 border-2 border-[#DFCCA6] group-hover:border-[#B5832C] bg-[#FFFFFF] transition-colors shadow-sm">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <TextileArtwork
                      artworkId={cat.artworkId}
                      alt={cat.label}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-[#241214] group-hover:text-[#4A0D1B]">
                    {cat.label}
                  </span>
                  <span className="block text-[10px] text-[#5E4346]">{cat.sub}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. TWO-COLUMN FEATURED COLLECTION BANNERS */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-[16/9] overflow-hidden border border-[#DFCCA6] bg-[#2F0710] group">
            <TextileArtwork
              artworkId="dhakai-jamdani"
              alt="Traditional Handloom Sarees"
              className="w-full h-full group-hover:scale-[1.02] transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2F0710]/85 via-[#2F0710]/55 to-transparent" />
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-center items-start space-y-2.5 max-w-sm">
              <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#E5C37A]">
                FEATURED COLLECTION
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FDF3DC] leading-tight">
                Traditional Handloom Sarees
              </h3>
              <p className="text-xs text-[#E9DAC0]">Pure weaves. Timeless beauty.</p>
              <button
                type="button"
                onClick={() => onFilterByCategory('sarees')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 bg-[#4A0D1B] hover:bg-[#B5832C] hover:text-[#2F0710] border border-[#B5832C] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors"
              >
                <span>Shop Handloom</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative aspect-[16/9] overflow-hidden border border-[#DFCCA6] bg-[#4A0D1B] group">
            <TextileArtwork
              artworkId="empress-kadhwa-macro"
              alt="Banarasi Kadhwa Sarees"
              className="w-full h-full group-hover:scale-[1.02] transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A0D1B]/90 via-[#4A0D1B]/60 to-transparent" />
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-center items-start space-y-2.5 max-w-sm">
              <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#D87277]">
                TRENDING NOW
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FDF3DC] leading-tight">
                Banarasi Kadhwa Sarees
              </h3>
              <p className="text-xs text-[#E9DAC0]">Rich heritage. Modern elegance.</p>
              <button
                type="button"
                onClick={() => onFilterByRegion('Uttar Pradesh (Varanasi / Lucknow)')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 bg-[#FDF3DC] hover:bg-[#E5C37A] text-[#4A0D1B] text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors"
              >
                <span>Shop Banarasi</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS — LOVED BY MANY (Inspired by SareeAura + Logo Palette) */}
      <section
        aria-labelledby="loved-heading"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-[#DFCCA6]"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718] mb-1">
              BEST SELLERS · THE SOVEREIGN VAULT
            </p>
            <h2 id="loved-heading" className="font-serif text-3xl sm:text-4xl text-[#4A0D1B]">
              Loved by Many
            </h2>
            <p className="text-xs text-[#5E4346] mt-1">
              Our most cherished heirloom sarees, handpicked directly from masterweaver guilds.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(['ALL', 'KATAN', 'TUSSAR', 'MULBERRY'] as const).map((fiber) => (
              <button
                key={fiber}
                type="button"
                onClick={() => setFiberFilter(fiber)}
                className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase border transition-colors min-h-[34px] ${
                  fiberFilter === fiber
                    ? 'bg-[#4A0D1B] text-[#FDF3DC] border-[#4A0D1B]'
                    : 'bg-[#FFFFFF] text-[#5E4346] border-[#DFCCA6] hover:border-[#4A0D1B]'
                }`}
              >
                {fiber}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMasterpieces.map((product) => {
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
                      className="w-full h-full block"
                      aria-label={`Inspect ${product.title}`}
                    >
                      <TextileArtwork
                        artworkId={product.artworkId}
                        alt={product.title}
                        className="w-full h-full group-hover:scale-[1.03] transition-transform duration-200"
                      />
                    </button>
                    <span className="absolute top-3 left-3 bg-[#FDF3DC]/95 border border-[#DFCCA6] px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.12em] uppercase text-[#4A0D1B]">
                      {product.originBadge}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={isSaved ? `Remove ${product.title}` : `Save ${product.title}`}
                      aria-pressed={isSaved}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FDF3DC]/95 border border-[#DFCCA6] flex items-center justify-center text-[#4A0D1B]"
                    >
                      <Heart
                        className={`w-4 h-4 ${isSaved ? 'fill-[#D87277] text-[#D87277]' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-serif text-lg text-[#241214] leading-snug">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="text-left hover:text-[#4A0D1B] transition-colors"
                      >
                        {product.title}
                      </button>
                    </h3>
                    <p className="text-sm font-semibold text-[#4A0D1B] tabular-nums">
                      {formatPrice(product.priceINR, currency)}
                    </p>
                    <div className="flex items-center gap-1 text-[#B5832C]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" aria-hidden="true" />
                      ))}
                      <span className="text-[11px] text-[#5E4346] ml-1 tabular-nums">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <button
                    type="button"
                    onClick={() => onQuickAdd(product)}
                    className="w-full py-2.5 bg-[#4A0D1B] hover:bg-[#390914] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.14em] uppercase inline-flex items-center justify-center gap-2 transition-colors min-h-[40px]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#E5C37A]" aria-hidden="true" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 6. SPECIAL OFFER BANNER (Inspired by SareeAura) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-[#4A0D1B] text-[#FDF3DC] border-2 border-[#B5832C] overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch dark-surface">
          <div className="md:col-span-7 p-7 sm:p-10 flex flex-col justify-center space-y-4">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#D87277]">
              PATRON WELCOME PRIVILEGE
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FDF3DC] leading-tight">
              Get 10% Off on your first heirloom order
            </h2>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#E5C37A] bg-[#2F0710] hover:bg-[#B5832C] hover:text-[#2F0710] text-xs font-mono tracking-wider transition-colors min-h-[42px]"
              >
                <span>Use Code: PRIYONTOR10</span>
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
              {copiedCode && (
                <span role="status" className="text-xs text-[#E5C37A] font-medium">
                  Code copied to clipboard
                </span>
              )}
            </div>
          </div>
          <div className="md:col-span-5 min-h-[200px] relative">
            <TextileArtwork
              artworkId="banarasi-jangla"
              alt="Rich crimson and gold Banarasi silk folds"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A0D1B] via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* 7. CURATED LOOKBOOKS */}
      <section id="curated-lookbooks" aria-labelledby="lookbooks-heading" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718] mb-1">
              EDITORIAL ANTHOLOGIES
            </p>
            <h2 id="lookbooks-heading" className="font-serif text-3xl sm:text-4xl text-[#4A0D1B]">
              Curated Lookbooks
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('collections')}
            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] hover:text-[#7D5718]"
          >
            <span>VIEW ALL VOLUMES</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {LOOKBOOKS.map((book) => (
            <article
              key={book.id}
              className="bg-[#FFFFFF] border border-[#DFCCA6] flex flex-col overflow-hidden group"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <TextileArtwork
                  artworkId={book.artworkId}
                  alt={book.title}
                  className="w-full h-full group-hover:scale-[1.02] transition-transform duration-200"
                />
                <span className="absolute top-4 left-4 bg-[#FDF3DC]/95 border border-[#DFCCA6] px-3 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B]">
                  {book.volume}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl text-[#241214]">{book.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#5E4346]">
                    {book.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#F7E8C6]">
                  <button
                    type="button"
                    onClick={() => onFilterByRegion(book.regionFilter)}
                    className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] hover:text-[#7D5718]"
                  >
                    <span>{book.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span className="font-serif italic text-xs text-[#5E4346]">{book.editionNote}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 8. THE SOVEREIGN CARTOGRAPHY EXPLORER */}
      <section aria-labelledby="cartography-heading" className="bg-[#F7E8C6]/70 border-y border-[#DFCCA6] py-14 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718] mb-1.5">
              THE SOVEREIGN CARTOGRAPHY
            </p>
            <h2 id="cartography-heading" className="font-serif text-3xl sm:text-4xl text-[#4A0D1B]">
              One Nation. Many Traditions. Endless Stories.
            </h2>
            <p className="text-xs sm:text-sm text-[#5E4346] mt-2">
              Hover or select any regional saree on the map of India to inspect its craft lineage and open its dedicated shop collection.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Indian Craft Corridors"
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {CORRIDOR_REGIONS.map((region) => {
              const isSelected = region.id === activeCorridorId;
              return (
                <button
                  key={region.id}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelectCorridorTab(region.id)}
                  className={`px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase border transition-colors min-h-[38px] ${
                    isSelected
                      ? 'bg-[#4A0D1B] text-[#FDF3DC] border-[#4A0D1B]'
                      : 'bg-[#FFFFFF] text-[#5E4346] border-[#DFCCA6] hover:border-[#4A0D1B]'
                  }`}
                >
                  {region.tabLabel}
                </button>
              );
            })}
          </div>

          <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#5E4346] mb-2">
                <span className="font-sans font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                  INTERACTIVE SAREE MAP OF INDIA
                </span>
                <span>{activeHotspot.coordinates}</span>
              </div>
              <InteractiveSareeMap
                activeHotspotId={activeHotspot.id}
                activeCorridorId={activeCorridorId}
                onPreviewHotspot={handlePreviewHotspot}
                onSelectSareeCategory={onSelectMapCategory}
                productCounts={mapProductCounts}
              />
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              {/* Selected Map Saree Details */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#4A0D1B] text-[#FDF3DC]">
                      {activeHotspot.state.toUpperCase()}
                    </span>
                    <span className="text-[#7D5718]">{activeHotspot.corridorLabel}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#5E4346]">
                    {activeMapProducts.length}{' '}
                    {activeMapProducts.length === 1 ? 'HEIRLOOM' : 'HEIRLOOMS'} AVAILABLE
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#241214]">
                    {activeHotspot.sareeName} Weaves of {activeHotspot.state}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5E4346] mt-2">
                    {activeHotspot.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3">
                    <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                      PRIMARY FIBER
                    </p>
                    <p className="text-xs font-semibold text-[#241214] mt-1">
                      {activeHotspot.primaryFiber}
                    </p>
                  </div>
                  <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-3">
                    <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                      LOOM MECHANISM
                    </p>
                    <p className="text-xs font-semibold text-[#241214] mt-1">
                      {activeHotspot.loomMechanism}
                    </p>
                  </div>
                </div>

                {/* Live Regional Heirlooms Preview */}
                {activeMapProducts.length > 0 && (
                  <div className="pt-2 space-y-2.5">
                    <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                      FEATURED FROM THIS REGION ({activeMapProducts.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeMapProducts.slice(0, 2).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onSelectProduct(item)}
                          className="flex items-center gap-3 p-2.5 bg-[#FDF3DC]/65 hover:bg-[#FDF3DC] border border-[#DFCCA6] hover:border-[#4A0D1B] text-left transition-colors group"
                        >
                          <div className="w-12 h-14 shrink-0 overflow-hidden bg-[#F7E8C6] border border-[#DFCCA6]">
                            <TextileArtwork
                              artworkId={item.artworkId}
                              alt={item.title}
                              className="w-full h-full group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif text-sm text-[#241214] truncate group-hover:text-[#4A0D1B]">
                              {item.title}
                            </p>
                            <p className="text-[11px] font-semibold text-[#4A0D1B] tabular-nums mt-0.5">
                              {formatPrice(item.priceINR, currency)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectMapCategory(activeHotspot.id)}
                    className="inline-flex items-center gap-2.5 bg-[#4A0D1B] hover:bg-[#390914] text-[#FDF3DC] px-5 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[44px]"
                  >
                    <span>
                      SHOP {activeHotspot.sareeName.toUpperCase()} COLLECTION ({activeMapProducts.length})
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E5C37A]" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('discover', `region-${activeCorridor.id}`)}
                    className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] hover:text-[#7D5718] border-b border-[#4A0D1B] pb-1"
                  >
                    <span>{activeCorridor.ctaLabel}</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Corridor Overview Footnote */}
              <div className="bg-[#FDF3DC]/70 border border-[#DFCCA6] p-4 space-y-1.5">
                <div className="flex items-center justify-between text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                  <span>{activeCorridor.corridorGuideNumber} · {activeCorridor.title}</span>
                  <span className="font-serif italic normal-case text-[#5E4346]">
                    {activeCorridor.established}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#5E4346]">
                  {activeCorridor.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ABOUT US + 3 GOLD STAR PILLARS + NEWSLETTER CARD (Inspired by Maha Gauri) */}
      <section
        id="about-heritage"
        aria-labelledby="about-heading"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Portrait */}
          <div className="lg:col-span-3">
            <div className="h-full min-h-[260px] border-2 border-[#B5832C] p-1.5 bg-[#FFFFFF]">
              <TextileArtwork
                artworkId="silhouette-bridal"
                alt="Priyontor Royal Bridal Drape"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Center Heritage Story & 3 Gold Star Pillars */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-8">
            <div className="space-y-3">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
                ABOUT PRIYONTOR
              </p>
              <h2 id="about-heading" className="font-serif text-3xl text-[#4A0D1B]">
                Where Heritage Meets Heart
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#5E4346]">
                Every Priyontor textile is woven in direct partnership with hereditary craft guilds
                across Bharat. We eliminate middlemen so 72% of proceeds flow straight to the
                masterweaver&apos;s loom, preserving generational artistry for discerning patrons.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#F7E8C6] text-center">
              <button
                type="button"
                onClick={() => onNavigate('discover')}
                className="p-2 hover:bg-[#FDF3DC] transition-colors space-y-1"
              >
                <Star className="w-4 h-4 mx-auto fill-[#B5832C] text-[#B5832C]" aria-hidden="true" />
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#4A0D1B]">
                  100% HANDLOOM
                </p>
                <p className="text-[10px] text-[#5E4346]">Zero powerlooms</p>
              </button>
              <button
                type="button"
                onClick={onOpenRoyalties}
                className="p-2 hover:bg-[#FDF3DC] transition-colors space-y-1"
              >
                <Star className="w-4 h-4 mx-auto fill-[#B5832C] text-[#B5832C]" aria-hidden="true" />
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#4A0D1B]">
                  DIRECT ROYALTIES
                </p>
                <p className="text-[10px] text-[#5E4346]">Verified ledger</p>
              </button>
              <button
                type="button"
                onClick={onOpenConcierge}
                className="p-2 hover:bg-[#FDF3DC] transition-colors space-y-1"
              >
                <Star className="w-4 h-4 mx-auto fill-[#B5832C] text-[#B5832C]" aria-hidden="true" />
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#4A0D1B]">
                  ATELIER BESPOKE
                </p>
                <p className="text-[10px] text-[#5E4346]">Private curation</p>
              </button>
            </div>
          </div>

          {/* Right Framed Private Dispatch Box */}
          <div className="lg:col-span-4 bg-[#FFFFFF] border-2 border-[#B5832C] p-6 sm:p-8 flex flex-col justify-center space-y-4 text-center">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
              PRIVATE DISPATCH
            </p>
            <h3 className="font-serif text-2xl text-[#4A0D1B]">
              Be Part of Our Unfolding Story
            </h3>
            <p className="text-xs text-[#5E4346] leading-relaxed">
              Receive invitations to private loom unveilings and seasonal archival drops.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3 pt-1">
              <label htmlFor="home-dispatch-email" className="sr-only">
                Confidential email address
              </label>
              <input
                id="home-dispatch-email"
                type="email"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  setNewsletterStatus('idle');
                }}
                placeholder="Enter your confidential email"
                className="w-full bg-[#FDF3DC] border border-[#DFCCA6] px-4 py-2.5 text-xs text-[#241214] rounded-full text-center min-h-[42px]"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#B5832C] to-[#D4A44B] hover:from-[#9E7022] hover:to-[#B5832C] text-[#2F0710] text-[11px] font-bold tracking-[0.16em] uppercase transition-colors min-h-[42px]"
              >
                ENROLL MY ARCHIVE
              </button>
            </form>
            {newsletterStatus === 'error' && (
              <p role="alert" className="text-xs text-[#4A0D1B]">
                Please provide a valid email address.
              </p>
            )}
            {newsletterStatus === 'enrolled' && (
              <p role="status" className="inline-flex items-center justify-center gap-1.5 text-xs text-[#164A37] font-medium">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Enrolled in the Patron Registry.</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 10. 4-COLUMN SERVICE TRUST STRIP (Inspired by SareeAura) */}
      <section aria-label="Priyontor Service Guarantees" className="bg-[#FFFFFF] border-t border-[#DFCCA6] py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Plane, title: 'Free Insured Shipping', sub: 'Worldwide on heirloom orders' },
            { icon: Lock, title: 'Secure Payments', sub: '100% protected vault checkout' },
            { icon: RefreshCw, title: 'Easy Returns', sub: '7-day heritage exchange' },
            { icon: Headphones, title: 'Dedicated Support', sub: 'Personal textile curators' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FDF3DC] border border-[#DFCCA6] flex items-center justify-center text-[#4A0D1B] shrink-0">
                <item.icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#241214]">{item.title}</p>
                <p className="text-[11px] text-[#5E4346]">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
