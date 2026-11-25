import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Copy,
  Headphones,
  Heart,
  Layers,
  Lock,
  MapPin,
  MessageCircle,
  Plane,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import {
  CORRIDOR_REGIONS,
  LOOKBOOKS,
  OCCASION_PILLARS,
  PRODUCTS,
  SAREE_MAP_HOTSPOTS,
  formatPrice,
} from '../data/archiveData';
import {
  ABOUT_PRIYONTOR,
  BRAND_INFO,
  DISCOUNT_PRIVILEGES,
  FOUNDER_STORY,
  PolicyEntry,
} from '../data/priyontorInfo';
import {
  AuthUser,
  CurrencyCode,
  PageRoute,
  Product,
  ProductCategoryId,
  SareeMapCategoryId,
  TextileArtworkId,
  WardrobeSegment,
} from '../types/archive';
import { ContactStoreSection } from '../components/ContactStoreSection';
import { BenarasGhatMotif, LotusMotif, MotifSectionDivider } from '../components/HeritageMotifs';
import { InteractiveSareeMap } from '../components/InteractiveSareeMap';
import { TestimonialsSection } from '../components/TestimonialsSection';
import {
  HeroDrapedSareeFigure,
  HeroStarSparkle,
  SilkSwirlSwatch,
} from '../components/HeroEditorialVisuals';
import { TextileArtwork } from '../components/TextileArtwork';

interface HomePageProps {
  currency: CurrencyCode;
  wishlistIds: string[];
  authUser?: AuthUser | null;
  authToken?: string | null;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  onFilterByCategory: (cat: 'all' | ProductCategoryId) => void;
  onFilterByWardrobe: (wardrobe: 'all' | WardrobeSegment) => void;
  onFilterByRegion: (region: string) => void;
  onSelectMapCategory: (mapCat: SareeMapCategoryId) => void;
  onApplyPromoCode: (code: string) => void;
  onOpenPolicyTab: (tab: PolicyEntry['id'] | 'size-chart') => void;
  onOpenContact: () => void;
  onInquirySubmitted?: (referenceNumber: string) => void;
}

const HERO_SLIDES: {
  kicker: string;
  body: string;
  origin: string;
  productId: string;
  silkMain: string;
  silkDeep: string;
  silkHighlight: string;
  zariGold: string;
}[] = [
  {
    kicker: 'LONDON MAHOTSAV 2026',
    body: "Celebrating India's diverse textile heritage — exquisite handloom sarees, designer drapes, and traditional attire for men and children.",
    origin: 'UTTAR PRADESH · BANARASI',
    productId: 'up-banarasi-silk',
    silkMain: '#98311D',
    silkDeep: '#5C160C',
    silkHighlight: '#C95A42',
    zariGold: '#E6C275',
  },
  {
    kicker: 'ROOTED IN KOLKATA',
    body: 'Fine Bengal Jamdani and hand-stitched Kantha honouring Priyontor’s birthplace in Kolkata, West Bengal.',
    origin: 'WEST BENGAL · JAMDANI',
    productId: 'wb-jamdani-kantha',
    silkMain: '#4A0D1B',
    silkDeep: '#2F0710',
    silkHighlight: '#7D2036',
    zariGold: '#E5C37A',
  },
  {
    kicker: 'DESIGNER SAREES',
    body: 'Wembley, London launchpad designs marrying traditional zari borders with graceful contemporary draping.',
    origin: 'DESIGNER EDITION',
    productId: 'designer-lotus-silk-saree',
    silkMain: '#7D1928',
    silkDeep: '#450A14',
    silkHighlight: '#AD3345',
    zariGold: '#E8C57B',
  },
  {
    kicker: 'BRAHMAPUTRA MUGA',
    body: 'Authentic golden Assam Muga cotton and crisp pit-handloom drapes woven for enduring grace.',
    origin: 'ASSAM · MUGA COTTON',
    productId: 'assam-muga-cotton-saree',
    silkMain: '#9C6D24',
    silkDeep: '#61410F',
    silkHighlight: '#CF9B45',
    zariGold: '#F4DCA2',
  },
];

const FRAMED_SHOP_CATEGORIES: {
  id: string;
  label: string;
  sub: string;
  artworkId: TextileArtworkId;
  category: ProductCategoryId;
}[] = [
  {
    id: 'cat-sarees',
    label: 'HERITAGE SAREES',
    sub: '12 States · ₹1,200–₹25,000',
    artworkId: 'empress-varanasi',
    category: 'sarees',
  },
  {
    id: 'cat-designer',
    label: 'DESIGNER SAREES',
    sub: 'For Women · Free Size',
    artworkId: 'banarasi-jangla',
    category: 'designer-sarees',
  },
  {
    id: 'cat-womens-sets',
    label: "CO-ORD & KURTA SETS",
    sub: 'Breathable · Sizes 38–44',
    artworkId: 'silhouette-kurtas',
    category: 'womens-sets',
  },
  {
    id: 'cat-mens-punjabi',
    label: "MENS' PUNJABI",
    sub: 'Cotton & Silk · ₹1,000–₹6,000',
    artworkId: 'bandhgala-sherwani',
    category: 'mens-punjabi',
  },
  {
    id: 'cat-kids',
    label: "KIDS' ETHNIC WEAR",
    sub: 'Boys ₹1,900 · Girls ₹2,000',
    artworkId: 'rajputi-poshak',
    category: 'kids-wear',
  },
];

const FIVE_FEATURED_IDS = [
  'up-banarasi-silk',
  'wb-jamdani-kantha',
  'designer-lotus-silk-saree',
  'mens-silk-punjabi',
  'womens-breathable-coord-set',
];

const ARCHWAY_SHOWCASE: {
  title: string;
  origin: string;
  artworkId: TextileArtworkId;
  productId: string;
}[] = [
  {
    title: 'Banarasi Brocade Silk',
    origin: 'UTTAR PRADESH',
    artworkId: 'empress-varanasi',
    productId: 'up-banarasi-silk',
  },
  {
    title: 'Jamdani & Kantha',
    origin: 'WEST BENGAL',
    artworkId: 'dhakai-jamdani',
    productId: 'wb-jamdani-kantha',
  },
  {
    title: 'Kani & Ari Work',
    origin: 'JAMMU & KASHMIR',
    artworkId: 'darbar-sozni',
    productId: 'jk-kani-ari',
  },
  {
    title: 'Bhagalpuri Ghicha Tussar',
    origin: 'BIHAR',
    artworkId: 'khasi-ryndia',
    productId: 'bihar-bhagalpuri-tussar',
  },
];

const CORRIDOR_DEFAULT_HOTSPOT: Record<string, SareeMapCategoryId> = {
  east: 'jamdani-kantha',
  north: 'banarasi',
  west: 'bandhej',
  south: 'pochampally',
  northeast: 'muga-cotton',
};

export const HomePage: React.FC<HomePageProps> = ({
  currency,
  wishlistIds,
  authUser = null,
  authToken = null,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
  onNavigate,
  onFilterByCategory,
  onFilterByWardrobe,
  onFilterByRegion,
  onSelectMapCategory,
  onApplyPromoCode,
  onOpenPolicyTab,
  onOpenContact,
  onInquirySubmitted,
}) => {
  const [heroIdx, setHeroIdx] = useState(0);
  const [activeCorridorId, setActiveCorridorId] = useState<
    'east' | 'north' | 'west' | 'south' | 'northeast'
  >('east');
  const [previewHotspotId, setPreviewHotspotId] = useState<SareeMapCategoryId>('jamdani-kantha');
  const [fiberFilter, setFiberFilter] = useState<'ALL' | 'SILK' | 'COTTON' | 'TUSSAR' | 'MUGA'>(
    'ALL'
  );
  const [copiedCode, setCopiedCode] = useState(false);

  const activeSlide = HERO_SLIDES[heroIdx];
  const activeCorridor =
    CORRIDOR_REGIONS.find((c) => c.id === activeCorridorId) ?? CORRIDOR_REGIONS[0];
  const activeHotspot =
    SAREE_MAP_HOTSPOTS.find((h) => h.id === previewHotspotId) ?? SAREE_MAP_HOTSPOTS[7];

  const mapProductCounts = React.useMemo(() => {
    const counts = {} as Record<SareeMapCategoryId, number>;
    for (const spot of SAREE_MAP_HOTSPOTS) {
      counts[spot.id] = PRODUCTS.filter((p) => p.mapCategory === spot.id).length;
    }
    return counts;
  }, []);

  const activeMapProducts = React.useMemo(
    () => PRODUCTS.filter((p) => p.mapCategory === activeHotspot.id),
    [activeHotspot.id]
  );

  const handleSelectCorridorTab = (
    corridorId: 'east' | 'north' | 'west' | 'south' | 'northeast'
  ) => {
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

  const curatedCatalogSelection =
    fiberFilter === 'ALL'
      ? PRODUCTS.filter((p) => p.featuredOnHome)
      : PRODUCTS.filter((p) => p.fiberTag === fiberFilter).slice(0, 8);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(BRAND_INFO.welcomePromoCode).catch(() => {});
    }
    onApplyPromoCode(BRAND_INFO.welcomePromoCode);
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div id="top" className="bg-[#FDF3DC]">
      {/* 1. EDITORIAL TYPOGRAPHIC HERO BANNER */}
      <section
        aria-labelledby="hero-heading"
        className="relative bg-[#FDF3DC] text-[#241214] overflow-hidden"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5">
            <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#4A0D1B]">
              <LotusMotif className="w-6 h-4 shrink-0" color="#4A0D1B" accentColor="#B5832C" />
              <span>{BRAND_INFO.debutMilestone.toUpperCase()}</span>
              <span className="h-[1px] w-8 bg-[#DFCCA6]" aria-hidden="true" />
              <span className="text-[#7D5718] font-mono text-[10px]">
                0{heroIdx + 1} / 0{HERO_SLIDES.length}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346]">
              <span>WEMBLEY, LONDON LAUNCHPAD</span>
              <span aria-hidden="true">·</span>
              <span>ROOTED IN KOLKATA</span>
            </div>
          </div>

          <h1
            id="hero-heading"
            className="font-serif font-bold uppercase tracking-[-0.025em] leading-[0.9] text-[#241214] select-none relative z-10 text-[clamp(2.85rem,9vw,8.25rem)]"
          >
            <span className="block">
              <span className="relative inline-block">
                T
                <HeroStarSparkle className="w-[0.26em] h-[0.26em] absolute left-[0.04em] top-[0.42em] pointer-events-none" />
              </span>
              RADITI
              <span className="relative inline-flex items-center justify-center">
                O
                <HeroStarSparkle className="w-[0.34em] h-[0.34em] absolute pointer-events-none" />
              </span>
              N,
            </span>
            <span className="block text-[#4A0D1B] mt-1">REDEFINED</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-6 items-end pt-6 sm:pt-8">
            <div className="md:col-span-5 space-y-6 pb-8 lg:pb-12">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                {BRAND_INFO.tagline}
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[#5E4346] max-w-md">
                {activeSlide.body}
              </p>

              {/* PDF Grounded Highlights */}
              <div className="flex items-start gap-8 sm:gap-12 pt-1">
                <div>
                  <p className="font-sans font-bold text-3xl sm:text-4xl text-[#241214] tabular-nums leading-none">
                    12
                  </p>
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#5E4346] mt-2">
                    STATE SAREES
                  </p>
                </div>
                <div>
                  <p className="font-sans font-bold text-3xl sm:text-4xl text-[#241214] tabular-nums leading-none">
                    6
                  </p>
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#5E4346] mt-2">
                    GARMENT CATEGORIES
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('collections')}
                  className="inline-flex items-center gap-2.5 bg-[#4A0D1B] hover:bg-[#390914] text-[#FDF3DC] px-6 py-3.5 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[44px]"
                >
                  <span>SHOP COLLECTIONS</span>
                  <ArrowRight className="w-4 h-4 text-[#E5C37A]" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('discover')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 border border-[#B5832C] text-[#4A0D1B] hover:bg-[#F7E8C6] text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[44px]"
                >
                  <span>STATE SAREES MAP</span>
                </button>
              </div>
            </div>

            {/* Center Interactive Silk Swirl Best-Seller Card */}
            <div className="md:col-span-3 flex flex-col items-center md:items-start lg:items-center md:pb-8 lg:pb-12">
              <div className="w-52 sm:w-56 aspect-square bg-[#FFFFFF] border border-[#DFCCA6] p-2 rounded-2xl shadow-md relative">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <button
                    type="button"
                    onClick={() => {
                      const found =
                        PRODUCTS.find((p) => p.id === activeSlide.productId) ?? PRODUCTS[0];
                      onSelectProduct(found);
                    }}
                    aria-label={`Inspect ${(PRODUCTS.find((p) => p.id === activeSlide.productId) ?? PRODUCTS[0]).title}`}
                    className="w-full h-full block cursor-pointer"
                  >
                    <SilkSwirlSwatch
                      baseColor={activeSlide.silkMain}
                      shadowColor={activeSlide.silkDeep}
                      highlightColor={activeSlide.silkHighlight}
                      zariColor={activeSlide.zariGold}
                      label={`${activeSlide.origin} weave`}
                    />
                  </button>

                  <div className="absolute inset-x-[-14%] bottom-6 bg-[#FDF3DC]/95 border-y border-[#DFCCA6] -rotate-6 py-1 px-4 flex items-center justify-between shadow-sm">
                    <button
                      type="button"
                      aria-label="Previous featured saree"
                      onClick={() =>
                        setHeroIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                      }
                      className="w-7 h-7 flex items-center justify-center text-[#4A0D1B] hover:text-[#7D5718]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const found =
                          PRODUCTS.find((p) => p.id === activeSlide.productId) ?? PRODUCTS[0];
                        onSelectProduct(found);
                      }}
                      className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#241214] hover:text-[#4A0D1B] whitespace-nowrap"
                    >
                      {activeSlide.kicker}
                    </button>
                    <button
                      type="button"
                      aria-label="Next featured saree"
                      onClick={() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length)}
                      className="w-7 h-7 flex items-center justify-center text-[#4A0D1B] hover:text-[#7D5718]"
                    >
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const found =
                    PRODUCTS.find((p) => p.id === activeSlide.productId) ?? PRODUCTS[0];
                  onSelectProduct(found);
                }}
                className="mt-2.5 text-center group"
              >
                <span className="block text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                  {activeSlide.origin} · VIEW PRODUCT
                </span>
                <span className="block font-serif text-xs text-[#241214] group-hover:text-[#4A0D1B]">
                  {(PRODUCTS.find((p) => p.id === activeSlide.productId) ?? PRODUCTS[0]).title}
                </span>
              </button>
            </div>

            {/* Right Layered Gold Backdrop & Draped Figure */}
            <div className="md:col-span-4 relative flex justify-center md:justify-end items-end pt-28 sm:pt-32 md:pt-0">
              <div className="relative w-64 sm:w-72 lg:w-[320px] h-56 sm:h-64 lg:h-72 bg-[#DFB86C] border border-[#B5832C]/50 rounded-t-2xl flex items-end justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const found =
                      PRODUCTS.find((p) => p.id === activeSlide.productId) ?? PRODUCTS[0];
                    onSelectProduct(found);
                  }}
                  aria-label={`View ${(PRODUCTS.find((p) => p.id === activeSlide.productId) ?? PRODUCTS[0]).title}`}
                  className="relative -mt-28 sm:-mt-32 lg:-mt-40 w-[235px] sm:w-[265px] lg:w-[295px] h-[335px] sm:h-[375px] lg:h-[420px] block cursor-pointer group"
                >
                  <div className="w-full h-full transition-transform duration-200 group-hover:scale-[1.02]">
                    <HeroDrapedSareeFigure
                      silkMain={activeSlide.silkMain}
                      silkDeep={activeSlide.silkDeep}
                      silkHighlight={activeSlide.silkHighlight}
                      zariGold={activeSlide.zariGold}
                      alt={`PRIYONTOR — ${(PRODUCTS.find((p) => p.id === activeSlide.productId) ?? PRODUCTS[0]).title}`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Burnished Gold Marquee Ribbon */}
        <div
          aria-label="Brand Highlights"
          className="bg-[#D4A44B] text-[#241214] border-y border-[#B5832C] py-3 overflow-hidden relative z-20"
        >
          <div className="animate-priyontor-marquee whitespace-nowrap text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase">
            <div className="flex items-center gap-8 pr-8 shrink-0">
              <span>PRIYONTOR</span>
              <span aria-hidden="true">★</span>
              <span>LONDON MAHOTSAV 2026 DEBUT</span>
              <span aria-hidden="true">★</span>
              <span>12 INDIAN STATE TRADITIONAL SAREES</span>
              <span aria-hidden="true">★</span>
              <span>INDIA &amp; WORLDWIDE DELIVERY</span>
              <span aria-hidden="true">★</span>
              <span>PRIYONTOR</span>
              <span aria-hidden="true">★</span>
              <span>ROOTED IN KOLKATA · WEMBLEY LAUNCHPAD</span>
              <span aria-hidden="true">★</span>
            </div>
            <div aria-hidden="true" className="flex items-center gap-8 pr-8 shrink-0">
              <span>PRIYONTOR</span>
              <span>★</span>
              <span>LONDON MAHOTSAV 2026 DEBUT</span>
              <span>★</span>
              <span>12 INDIAN STATE TRADITIONAL SAREES</span>
              <span>★</span>
              <span>INDIA &amp; WORLDWIDE DELIVERY</span>
              <span>★</span>
              <span>PRIYONTOR</span>
              <span>★</span>
              <span>ROOTED IN KOLKATA · WEMBLEY LAUNCHPAD</span>
              <span>★</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROYAL TRI-ARCH CAMPAIGN BANNER ("Grace in Every Drape") */}
      <section
        aria-labelledby="grace-drape-heading"
        className="bg-[#2F0710] text-[#FDF3DC] border-b-2 border-[#B5832C] relative overflow-hidden dark-surface"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-4 pb-8 lg:pb-12">
              <div className="rounded-t-[180px] border border-[#B5832C]/65 bg-gradient-to-b from-[#4A0D1B]/90 to-[#2F0710] px-7 sm:px-9 pt-14 pb-9 space-y-4">
                <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#E5C37A]">
                  INDIAN HERITAGE FASHION
                </p>
                <h2
                  id="grace-drape-heading"
                  className="font-serif text-4xl sm:text-5xl text-[#FDF3DC] leading-[1.04]"
                >
                  Grace in
                  <span className="block italic text-[#E5C37A] font-normal mt-1">Every Drape</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#E9DAC0] leading-relaxed max-w-xs">
                  From exquisite handloom sarees and designer drapes to thoughtfully curated traditional attire for men and children.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('collections')}
                    className="inline-flex items-center gap-2.5 px-5 py-3 border border-[#E5C37A] hover:bg-[#B5832C] hover:text-[#2F0710] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[42px]"
                  >
                    <span>EXPLORE COLLECTION</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <button
                type="button"
                onClick={() => onSelectProduct(PRODUCTS[0])}
                aria-label={`Inspect ${PRODUCTS[0].title}`}
                className="group w-full max-w-[340px] aspect-[3/4] rounded-t-[999px] p-1.5 border-2 border-[#E5C37A] bg-[#4A0D1B] shadow-2xl overflow-hidden block"
              >
                <div className="w-full h-full rounded-t-[999px] overflow-hidden relative border border-[#B5832C]/60">
                  <TextileArtwork
                    artworkId="empress-varanasi"
                    alt={PRODUCTS[0].title}
                    className="w-full h-full group-hover:scale-[1.03] transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2F0710]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-5 inset-x-5 text-center">
                    <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#E5C37A]">
                      UTTAR PRADESH · FREE SIZE
                    </p>
                    <p className="font-serif text-xl text-[#FDF3DC] mt-0.5">
                      {PRODUCTS[0].title}
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="lg:col-span-4 pb-8 lg:pb-12">
              <div className="rounded-t-[180px] border border-[#B5832C]/65 bg-gradient-to-b from-[#4A0D1B]/90 to-[#2F0710] px-7 sm:px-9 pt-14 pb-9 text-center flex flex-col items-center justify-center space-y-4">
                <LotusMotif className="w-9 h-6" color="#E5C37A" accentColor="#D87277" />
                <div className="space-y-1">
                  <p className="font-serif text-2xl sm:text-3xl tracking-[0.06em] uppercase text-[#FDF3DC]">
                    TRADITION
                  </p>
                  <p className="text-xs tracking-[0.24em] uppercase text-[#E5C37A]">MEETS</p>
                  <p className="font-serif text-2xl sm:text-3xl tracking-[0.06em] uppercase text-[#FDF3DC]">
                    MODERNITY
                  </p>
                </div>
                <p className="text-xs text-[#E9DAC0] max-w-xs leading-relaxed">
                  Honouring the beauty of Indian craftsmanship while embracing the sensibilities of modern living.
                </p>
                <BenarasGhatMotif className="w-32 h-8" color="#E5C37A" accentColor="#D87277" />
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('collections')}
                    className="inline-flex items-center gap-2.5 px-6 py-3 border border-[#E5C37A] bg-[#4A0D1B] hover:bg-[#E5C37A] hover:text-[#2F0710] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[42px]"
                  >
                    <span>SHOP NOW</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY (PDF Categories + Her / His / Little Wardrobe Strip) & FEATURED SELECTION */}
      <section className="bg-[#FDF3DC] py-12 sm:py-14 border-b border-[#DFCCA6]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* 5-Column Category Cards + Wardrobe Row */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] flex-1 bg-[#B5832C]/50" aria-hidden="true" />
              <div className="flex items-center gap-2.5">
                <LotusMotif className="w-6 h-4" color="#4A0D1B" accentColor="#B5832C" />
                <h2 className="font-serif text-lg sm:text-xl tracking-[0.2em] uppercase text-[#4A0D1B] whitespace-nowrap">
                  SHOP BY CATEGORY
                </h2>
              </div>
              <div className="h-[1px] flex-1 bg-[#B5832C]/50" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {FRAMED_SHOP_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onFilterByCategory(cat.category)}
                  className="group relative aspect-[3/4] overflow-hidden border border-[#B5832C]/70 bg-[#2F0710] text-left"
                >
                  <TextileArtwork
                    artworkId={cat.artworkId}
                    alt={cat.label}
                    className="w-full h-full group-hover:scale-[1.04] transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2F0710]/95 via-[#2F0710]/25 to-transparent" />
                  <div className="absolute inset-2 border border-[#E5C37A]/35 pointer-events-none" />
                  <div className="absolute bottom-3.5 inset-x-4 space-y-1">
                    <span className="block font-serif text-sm sm:text-base tracking-[0.1em] uppercase text-[#FDF3DC]">
                      {cat.label}
                    </span>
                    <span className="block text-[10px] text-[#E5C37A]">{cat.sub}</span>
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#FDF3DC] pt-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 text-[#E5C37A]" aria-hidden="true" />
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* PDF Page 3 Wardrobe Strip: HER WARDROBE · HIS WARDROBE · LITTLE WARDROBE (+ Blouses link) */}
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  label: 'HER WARDROBE',
                  sub: 'Sarees, Designer Sarees & Co-Ord Sets',
                  action: () => onFilterByWardrobe('her'),
                },
                {
                  label: 'HIS WARDROBE',
                  sub: "Mens' Ethnic Punjabi (Cotton & Silk)",
                  action: () => onFilterByWardrobe('his'),
                },
                {
                  label: 'LITTLE WARDROBE',
                  sub: "Boys' Punjabi & Girls' Lehenga Dupatta",
                  action: () => onFilterByWardrobe('little'),
                },
                {
                  label: 'BLOUSES FOR WOMEN',
                  sub: 'Tailored Silk & Cotton (₹800–₹2,000)',
                  action: () => onFilterByCategory('blouses'),
                },
              ].map((w) => (
                <button
                  key={w.label}
                  type="button"
                  onClick={w.action}
                  className="bg-[#FFFFFF] border border-[#DFCCA6] hover:border-[#4A0D1B] p-4 text-left transition-colors group"
                >
                  <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#4A0D1B] flex items-center justify-between">
                    <span>{w.label}</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 text-[#B5832C] group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </p>
                  <p className="text-[11px] text-[#5E4346] mt-1">{w.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 5-Column Featured Products */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] flex-1 bg-[#B5832C]/50" aria-hidden="true" />
              <h2 className="font-serif text-lg sm:text-xl tracking-[0.2em] uppercase text-[#4A0D1B] whitespace-nowrap">
                CURATED SIGNATURES
              </h2>
              <div className="h-[1px] flex-1 bg-[#B5832C]/50" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {FIVE_FEATURED_IDS.map((id) => {
                const product = PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
                const isSaved = wishlistIds.includes(product.id);
                return (
                  <article
                    key={product.id}
                    className="bg-[#FFFFFF] border border-[#DFCCA6] hover:border-[#B5832C] p-3 flex flex-col justify-between transition-colors group"
                  >
                    <div>
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#F7E8C6]">
                        <button
                          type="button"
                          onClick={() => onSelectProduct(product)}
                          aria-label={`Inspect ${product.title}`}
                          className="w-full h-full block"
                        >
                          <TextileArtwork
                            artworkId={product.artworkId}
                            alt={product.title}
                            className="w-full h-full group-hover:scale-[1.03] transition-transform duration-200"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleWishlist(product.id)}
                          aria-label={isSaved ? `Remove ${product.title}` : `Save ${product.title}`}
                          aria-pressed={isSaved}
                          className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-[#FDF3DC]/95 border border-[#DFCCA6] flex items-center justify-center text-[#4A0D1B]"
                        >
                          <Heart
                            className={`w-4 h-4 ${isSaved ? 'fill-[#D87277] text-[#D87277]' : ''}`}
                            aria-hidden="true"
                          />
                        </button>
                        <span className="absolute bottom-2 right-2 bg-[#4A0D1B]/90 text-[#FDF3DC] px-2 py-0.5 text-[8px] font-semibold tracking-[0.12em] uppercase">
                          {product.secondaryBadge}
                        </span>
                      </div>

                      <div className="pt-3 pb-2 space-y-1">
                        <p className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[#7D5718]">
                          {product.categoryLabel}
                        </p>
                        <h3 className="font-serif text-sm sm:text-base text-[#241214] leading-snug line-clamp-1">
                          <button
                            type="button"
                            onClick={() => onSelectProduct(product)}
                            className="text-left hover:text-[#4A0D1B]"
                          >
                            {product.title}
                          </button>
                        </h3>
                        <p className="text-sm font-semibold text-[#4A0D1B] tabular-nums">
                          {formatPrice(product.priceINR, currency)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onQuickAdd(product)}
                      className="w-full py-2.5 border border-[#4A0D1B] bg-[#FFFFFF] hover:bg-[#4A0D1B] text-[#4A0D1B] hover:text-[#FDF3DC] text-[10px] font-semibold tracking-[0.14em] uppercase inline-flex items-center justify-center gap-2 transition-colors min-h-[40px]"
                    >
                      <span>ADD TO BAG</span>
                      <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>

            <div className="pt-8 text-center">
              <button
                type="button"
                onClick={() => onNavigate('collections')}
                className="inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#4A0D1B] hover:text-[#7D5718] border-b border-[#B5832C] pb-1 transition-colors"
              >
                <span>VIEW ALL COLLECTIONS ({PRODUCTS.length} ITEMS)</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ROYAL ARCHWAY SHOWCASE BAND (Benaras Ghat & State Weaves) */}
      <section
        aria-labelledby="archway-heading"
        className="bg-[#4A0D1B] text-[#FDF3DC] py-10 sm:py-12 border-b-2 border-[#B5832C] dark-surface"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#E5C37A]">
                STATE-WISE INDIAN TRADITIONS
              </p>
              <h2 id="archway-heading" className="font-serif text-2xl sm:text-3xl text-[#FDF3DC] mt-0.5">
                Signature Sarees Across India
              </h2>
            </div>
            <BenarasGhatMotif className="w-28 h-8 shrink-0" color="#E5C37A" accentColor="#D87277" />
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
                  className="group flex flex-col items-center text-center"
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

      {/* 5. INTERACTIVE FIBER FILTER & COLLECTION GRID */}
      <section
        aria-labelledby="loved-heading"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718] mb-1">
              SAREES · SETS · PUNJABI · KIDS
            </p>
            <h2 id="loved-heading" className="font-serif text-3xl sm:text-4xl text-[#4A0D1B]">
              Crafted Heritage &amp; Everyday Grace
            </h2>
            <p className="text-xs text-[#5E4346] mt-1">
              Browse across pure silk, natural cotton, golden Assam Muga, and organic Ghicha Tussar.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(['ALL', 'SILK', 'COTTON', 'TUSSAR', 'MUGA'] as const).map((fiber) => (
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
          {curatedCatalogSelection.slice(0, 8).map((product) => {
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
                    <span className="absolute top-3 left-3 bg-[#FDF3DC]/95 px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] uppercase text-[#4A0D1B]">
                      {product.originBadge}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={isSaved ? `Remove ${product.title}` : `Save ${product.title}`}
                      aria-pressed={isSaved}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FDF3DC]/95 flex items-center justify-center text-[#4A0D1B]"
                    >
                      <Heart
                        className={`w-4 h-4 ${isSaved ? 'fill-[#D87277] text-[#D87277]' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <p className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[#7D5718]">
                      {product.secondaryBadge} · {product.weaveType}
                    </p>
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
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <button
                    type="button"
                    onClick={() => onQuickAdd(product)}
                    className="w-full py-2.5 bg-[#4A0D1B] hover:bg-[#390914] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.14em] uppercase inline-flex items-center justify-center gap-2 transition-colors min-h-[40px]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#E5C37A]" aria-hidden="true" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 6. PROMOTIONAL OFFERS & DISCOUNT PRIVILEGES (EXACT PDF DISCOUNTS) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-[#4A0D1B] text-[#FDF3DC] border-2 border-[#B5832C] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch dark-surface">
          <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.22em] uppercase text-[#E5C37A]">
              <LotusMotif className="w-5 h-3.5" color="#E5C37A" accentColor="#D87277" />
              <span>EXCLUSIVE PRIYONTOR PRIVILEGES</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FDF3DC] leading-tight">
              Welcome Discount 5% Off on 1st Order
            </h2>
            <p className="text-xs sm:text-sm text-[#E9DAC0] leading-relaxed">
              Apply code <strong>PRIYO5</strong> for 5% off your first online order on all products, plus <strong>10% off orders of ₹20,000+</strong> and <strong>10% off your 1st physical purchase</strong> at our Newtown, Kolkata store.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#E5C37A] bg-[#2F0710] hover:bg-[#B5832C] hover:text-[#2F0710] text-xs font-mono tracking-wider transition-colors min-h-[42px]"
              >
                <span>Use Code: {BRAND_INFO.welcomePromoCode}</span>
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
              {copiedCode && (
                <span role="status" className="text-xs text-[#E5C37A] font-medium">
                  PRIYO5 applied &amp; copied
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#2F0710] p-6 sm:p-8 flex flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-[#B5832C]/40">
            {DISCOUNT_PRIVILEGES.map((priv) => (
              <div key={priv.code} className="bg-[#4A0D1B]/70 border border-[#B5832C]/45 p-3.5">
                <div className="flex items-center justify-between gap-2 text-[9px] font-semibold tracking-[0.14em] uppercase text-[#E5C37A]">
                  <span>{priv.badge}</span>
                  <span className="font-mono">{priv.code}</span>
                </div>
                <p className="font-serif text-base text-[#FDF3DC] mt-0.5">{priv.title}</p>
                <p className="text-[11px] text-[#E9DAC0] mt-0.5">{priv.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CURATED COLLECTIONS & LOOKBOOKS */}
      <section id="curated-lookbooks" aria-labelledby="lookbooks-heading" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718] mb-1">
              LONDON TO KOLKATA
            </p>
            <h2 id="lookbooks-heading" className="font-serif text-3xl sm:text-4xl text-[#4A0D1B]">
              Collections &amp; Brand Milestones
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('collections')}
            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] hover:text-[#7D5718]"
          >
            <span>BROWSE FULL CATALOG</span>
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

      {/* 8. INTERACTIVE 12-STATE SAREE MAP OF INDIA */}
      <section aria-labelledby="cartography-heading" className="bg-[#F7E8C6]/70 border-y border-[#DFCCA6] py-14 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="flex justify-center mb-2">
              <LotusMotif className="w-8 h-5" color="#4A0D1B" accentColor="#B5832C" />
            </div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718] mb-1.5">
              INDIAN STATE-WISE TRADITIONAL SAREES
            </p>
            <h2 id="cartography-heading" className="font-serif text-3xl sm:text-4xl text-[#4A0D1B]">
              12 Regional Saree Traditions Across India
            </h2>
            <p className="text-xs sm:text-sm text-[#5E4346] mt-2">
              Select any state or weave on the interactive map to explore its heritage saree and jump directly to that category on our Shop Collections page.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Indian Regions"
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
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#4A0D1B] text-[#FDF3DC]">
                      {activeHotspot.state.toUpperCase()}
                    </span>
                    <span className="text-[#7D5718]">{activeHotspot.corridorLabel}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#5E4346]">
                    {activeMapProducts.length} AVAILABLE · FREE SIZE
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#241214]">
                    {activeHotspot.state}: {activeHotspot.sareeName}
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
                      WEAVE &amp; TECHNIQUE
                    </p>
                    <p className="text-xs font-semibold text-[#241214] mt-1">
                      {activeHotspot.loomMechanism}
                    </p>
                  </div>
                </div>

                {activeMapProducts.length > 0 && (
                  <div className="pt-2 space-y-2.5">
                    <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                      FEATURED IN {activeHotspot.state.toUpperCase()}
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
                      SHOP {activeHotspot.sareeName.toUpperCase()}
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

      {/* 9. ABOUT PRIYONTOR & FOUNDER STORY (EXACT PDF NARRATIVE) */}
      <section
        id="about-heritage"
        aria-labelledby="about-heading"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-10"
      >
        <MotifSectionDivider theme="light" showGhat />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* About Priyontor */}
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-9 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
                {ABOUT_PRIYONTOR.heading}
              </p>
              <LotusMotif className="w-7 h-5" color="#4A0D1B" accentColor="#B5832C" />
            </div>
            <h2 id="about-heading" className="font-serif text-2xl sm:text-3xl text-[#4A0D1B]">
              {ABOUT_PRIYONTOR.leadTagline}
            </h2>
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-[#5E4346]">
              {ABOUT_PRIYONTOR.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={
                    i === ABOUT_PRIYONTOR.paragraphs.length - 1
                      ? 'font-serif italic text-base text-[#4A0D1B] pt-1 font-medium'
                      : ''
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Founder Story: The Woman Behind Priyontor */}
          <div className="lg:col-span-6 bg-[#4A0D1B] text-[#FDF3DC] border-2 border-[#B5832C] p-6 sm:p-9 space-y-4 flex flex-col justify-between dark-surface">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#E5C37A]">
                  {FOUNDER_STORY.kicker}
                </p>
                <BenarasGhatMotif className="w-24 h-7" color="#E5C37A" accentColor="#D87277" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FDF3DC]">
                {FOUNDER_STORY.title}
              </h2>
              <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-[#E9DAC0]">
                {FOUNDER_STORY.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-[#B5832C]/40 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs">
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#E5C37A]">
                  KOLKATA STORE &amp; WHATSAPP
                </p>
                <p className="text-[#FDF3DC] mt-0.5">Astra Tower, Newtown, Kolkata – 700161</p>
              </div>
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B5832C] hover:bg-[#D4A44B] text-[#2F0710] text-[10px] font-bold tracking-[0.14em] uppercase min-h-[40px]"
              >
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>STORE &amp; CONTACT INFO</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PATRON TESTIMONIALS */}
      <TestimonialsSection />

      {/* 11. CONTACT FORM & NEWTOWN STORE DETAILS */}
      <ContactStoreSection
        id="contact-store"
        authUser={authUser}
        authToken={authToken}
        onInquirySubmitted={(receipt) => onInquirySubmitted?.(receipt.referenceNumber)}
      />

      {/* 12. WARDROBES & TRUST BAR */}
      <section
        aria-labelledby="crafted-occasion-heading"
        className="bg-[#2F0710] text-[#FDF3DC] border-t-2 border-[#B5832C] dark-surface"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-3">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#E5C37A]">
                WOMEN · MEN · KIDS
              </p>
              <h2
                id="crafted-occasion-heading"
                className="font-serif text-3xl sm:text-4xl text-[#FDF3DC] leading-[1.08]"
              >
                Curated for Her, His &amp; Little Wardrobes
              </h2>
              <p className="text-xs sm:text-sm text-[#E9DAC0] leading-relaxed">
                Explore Sarees, Designer Sarees, Women&apos;s Co-Ord &amp; Kurta Sets, Blouses, Mens&apos; Ethnic Punjabi, and Kids&apos; Ethnic Wear.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenPolicyTab('size-chart')}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-[#E5C37A] hover:bg-[#E5C37A] hover:text-[#2F0710] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[42px]"
                >
                  <span>VIEW SIZE CHART &amp; CARE</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {OCCASION_PILLARS.map((pillar) => (
                <div
                  key={pillar.tag}
                  className="bg-[#4A0D1B]/80 border border-[#B5832C]/60 p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#E5C37A]">
                      {pillar.tag}
                    </p>
                    <h3 className="font-serif text-xl text-[#FDF3DC]">{pillar.title}</h3>
                    <p className="text-xs text-[#E9DAC0] leading-relaxed">{pillar.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onFilterByCategory(pillar.category)}
                    className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#E5C37A] hover:text-[#FDF3DC]"
                  >
                    <span>{pillar.cta}</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Guarantee Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-[#B5832C]/35">
            {[
              {
                icon: Plane,
                title: 'INDIA & WORLDWIDE',
                sub: 'Nationwide & international delivery',
                action: () => onOpenPolicyTab('shipping'),
              },
              {
                icon: Lock,
                title: 'UPI & CARD ONLY',
                sub: 'Secure digital payment support',
                action: () => onOpenPolicyTab('terms'),
              },
              {
                icon: RefreshCw,
                title: '7-DAY RETURN & EXCHANGE',
                sub: 'Transparent refund & cancellation policies',
                action: () => onOpenPolicyTab('returns'),
              },
              {
                icon: MessageCircle,
                title: 'WHATSAPP & SUPPORT',
                sub: `${BRAND_INFO.whatsappNumbers[0]} / ${BRAND_INFO.supportNumbers[0]}`,
                action: () => onOpenContact(),
              },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.action}
                className="flex items-center gap-3.5 text-left p-3 bg-[#4A0D1B]/50 hover:bg-[#4A0D1B] border border-[#B5832C]/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-full border border-[#B5832C] bg-[#2F0710] flex items-center justify-center text-[#E5C37A] shrink-0">
                  <item.icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#FDF3DC]">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[#E9DAC0]">{item.sub}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom 3-Column Trust Bar */}
          <div className="pt-6 border-t border-[#B5832C]/35 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: 'LONDON MAHOTSAV 2026',
                sub: 'International cultural debut',
              },
              {
                icon: ShieldCheck,
                title: `GSTIN ${BRAND_INFO.gstNumber}`,
                sub: 'Registered Newtown, Kolkata brand',
              },
              {
                icon: Headphones,
                title: 'DEDICATED SUPPORT',
                sub: BRAND_INFO.supportNumbers.join(' / '),
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-center justify-start sm:justify-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-full border border-[#B5832C] bg-[#4A0D1B] flex items-center justify-center text-[#E5C37A] shrink-0">
                  <pillar.icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#FDF3DC]">
                    {pillar.title}
                  </p>
                  <p className="text-[11px] text-[#E9DAC0]">{pillar.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
