import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  Feather,
  Gem,
  Grid,
  Heart,
  Leaf,
  MessageCircle,
  Plane,
  RefreshCw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import { PRODUCTS, formatPrice } from '../data/archiveData';
import { BRAND_INFO, PolicyEntry } from '../data/priyontorInfo';
import { CurrencyCode, PageRoute, Product } from '../types/archive';
import { BenarasGhatMotif, LotusMotif } from '../components/HeritageMotifs';
import { TextileArtwork } from '../components/TextileArtwork';

interface ProductDetailPageProps {
  product: Product;
  currency: CurrencyCode;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onAddToBag: (opts: {
    product: Product;
    selectedSize: string;
    colorway: string;
    pleatArchitecture: 'traditional' | 'pre-pleated';
    fallPico: boolean;
    blouseTailoring: boolean;
  }) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: PageRoute) => void;
  onOpenPolicyTab: (tab: PolicyEntry['id'] | 'size-chart') => void;
  onOpenContact: () => void;
  onOpenMacroZoom: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  currency,
  wishlistIds,
  onToggleWishlist,
  onAddToBag,
  onSelectProduct,
  onNavigate,
  onOpenPolicyTab,
  onOpenContact,
  onOpenMacroZoom,
}) => {
  const galleryViews = product.galleryArtworks ?? [
    { label: 'FULL LOOK', artworkId: product.artworkId },
    { label: 'MOTIF DETAIL', artworkId: 'empress-kadhwa-macro' as const },
    { label: 'REVERSE WEAVE', artworkId: 'empress-reverse-weave' as const },
    { label: 'HANDLOOM CRAFT', artworkId: 'empress-pit-loom' as const },
  ];

  const isSaree = product.category === 'sarees' || product.category === 'designer-sarees';

  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes[0] ?? 'FREE SIZE');
  const [selectedColorway, setSelectedColorway] = useState(
    product.colorways[0]?.name ?? 'HERITAGE EDITION'
  );
  const [fallPico, setFallPico] = useState(isSaree);
  const [pleatArch, setPleatArch] = useState<'traditional' | 'pre-pleated'>('traditional');
  const [blouseTailoring, setBlouseTailoring] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const isSaved = wishlistIds.includes(product.id);
  const tailoringAddINR = isSaree && blouseTailoring ? 1200 : 0;
  const totalUnitPriceINR = product.priceINR + tailoringAddINR;

  const pairingProducts = PRODUCTS.filter(
    (p) => (isSaree ? p.category === 'blouses' : p.category === 'sarees') && p.id !== product.id
  ).slice(0, 2);

  const relatedTreasures = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAcquire = () => {
    onAddToBag({
      product,
      selectedSize,
      colorway: selectedColorway,
      pleatArchitecture: isSaree ? pleatArch : 'traditional',
      fallPico: isSaree ? fallPico : false,
      blouseTailoring: isSaree ? blouseTailoring : false,
    });
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleVerifyPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pincode.trim();
    if (cleaned.length < 4) {
      setPincodeResult('Please enter a valid PIN or international postal code.');
      return;
    }
    const isIndianPin = /^\d{6}$/.test(cleaned);
    setPincodeResult(
      isIndianPin
        ? `Confirmed for ${cleaned}: Dispatches from Kolkata in 2–3 days · Delivery in 4–7 business days.`
        : `Confirmed for ${cleaned.toUpperCase()}: Worldwide delivery available in 7–14 business days.`
    );
  };

  const featureMatrix = [
    { icon: Leaf, title: 'Authentic Fabric', sub: product.fiberTag + ' Selection' },
    { icon: Grid, title: 'Craft & Silhouette', sub: product.weaveType },
    { icon: Gem, title: 'Motif Identity', sub: 'Lotus & Benaras Ghat' },
    { icon: Feather, title: 'Size Availability', sub: product.secondaryBadge || selectedSize },
    { icon: Sparkles, title: 'Occasion Ready', sub: 'Festive & Everyday' },
    { icon: Award, title: 'Delivery Coverage', sub: BRAND_INFO.deliveryLocations },
  ];

  return (
    <div className="bg-[#FDF3DC]">
      {/* Breadcrumb Bar */}
      <div className="border-b border-[#DFCCA6] bg-[#FDF3DC]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2 text-[10px] tracking-[0.14em] uppercase">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#5E4346]">
            <button type="button" onClick={() => onNavigate('home')} className="hover:text-[#4A0D1B]">
              HOME
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onNavigate('collections')}
              className="hover:text-[#4A0D1B]"
            >
              COLLECTIONS
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-[#4A0D1B] font-semibold">{product.title}</span>
          </nav>

          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span className="text-[#4A0D1B] font-semibold">REF: {product.archiveRef}</span>
            <span className="text-[#B5832C]" aria-hidden="true">|</span>
            <span className="text-[#5E4346]">{product.categoryLabel.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Product Split View */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-2 flex sm:flex-col gap-2.5 order-2 sm:order-1 overflow-x-auto no-scrollbar">
                {galleryViews.map((view, idx) => {
                  const active = idx === activeGalleryIdx;
                  return (
                    <button
                      key={view.label}
                      type="button"
                      onClick={() => setActiveGalleryIdx(idx)}
                      aria-label={`View ${view.label}`}
                      aria-pressed={active}
                      className={`relative shrink-0 w-20 sm:w-full aspect-[3/4] border-2 overflow-hidden transition-all ${
                        active ? 'border-[#4A0D1B]' : 'border-[#DFCCA6] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <TextileArtwork
                        artworkId={view.artworkId}
                        alt={`${product.title} — ${view.label}`}
                        className="w-full h-full"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-[#2F0710]/85 text-[#FDF3DC] text-[8px] font-semibold tracking-[0.1em] uppercase py-1 text-center">
                        {view.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="sm:col-span-10 order-1 sm:order-2">
                <div className="relative aspect-[4/5] border-2 border-[#B5832C] bg-[#F7E8C6] overflow-hidden">
                  <TextileArtwork
                    artworkId={galleryViews[activeGalleryIdx].artworkId}
                    alt={`${product.title} — ${galleryViews[activeGalleryIdx].label}`}
                    className="w-full h-full"
                  />

                  <div className="absolute top-3.5 left-3.5 flex flex-col items-start gap-1.5">
                    <span className="bg-[#FDF3DC]/95 border border-[#DFCCA6] px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B]">
                      {product.originBadge}
                    </span>
                    <span className="bg-[#4A0D1B] px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] uppercase text-[#E5C37A]">
                      {product.batchLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenMacroZoom(product)}
                    className="absolute bottom-3.5 right-3.5 bg-[#2F0710]/90 hover:bg-[#4A0D1B] border border-[#B5832C] text-[#FDF3DC] px-3 py-2 text-[9px] font-semibold tracking-[0.14em] uppercase inline-flex items-center gap-1.5 transition-colors min-h-[36px]"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-[#E5C37A]" aria-hidden="true" />
                    <span>4K WEAVE ZOOM</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Specification & Bag Controls */}
          <aside className="lg:col-span-6 bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <LotusMotif className="w-5 h-4" color="#4A0D1B" accentColor="#B5832C" />
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
                  {product.categoryLabel.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#164A37]">
                {product.statusText}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#4A0D1B] leading-tight">
                {product.title}
              </h1>
              <p className="text-xs text-[#5E4346] leading-relaxed">{product.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[#F7E8C6]">
              <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#241214] tabular-nums">
                {formatPrice(product.priceINR, currency)}
              </span>
              {product.originalPriceINR && (
                <span className="text-sm text-[#5E4346] line-through tabular-nums">
                  {formatPrice(product.originalPriceINR, currency)}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-[#F7E8C6] border border-[#B5832C]/50 text-[#4A0D1B] text-[10px] font-semibold tracking-[0.12em] uppercase">
                USE {BRAND_INFO.welcomePromoCode} FOR 5% OFF 1ST ORDER
              </span>
            </div>

            {/* 6-Tile Spec Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {featureMatrix.map((feat) => (
                <div
                  key={feat.title}
                  className="flex items-center gap-2.5 p-2.5 bg-[#FDF3DC] border border-[#DFCCA6]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#B5832C] flex items-center justify-center text-[#4A0D1B] shrink-0">
                    <feat.icon className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-[#241214] truncate">{feat.title}</p>
                    <p className="text-[10px] text-[#5E4346] truncate">{feat.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* SIZE SELECTOR (PDF SIZES: Free Size / 38–44 / Boys 18–36 / Girls 1–10Y) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold tracking-[0.14em] uppercase text-[#5E4346]">
                  SELECT SIZE: <strong className="text-[#4A0D1B]">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => onOpenPolicyTab('size-chart')}
                  className="inline-flex items-center gap-1 font-semibold tracking-[0.12em] uppercase text-[#4A0D1B] hover:text-[#7D5718] underline underline-offset-2"
                >
                  <Ruler className="w-3 h-3" aria-hidden="true" />
                  <span>SIZE CHART</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((sz) => {
                  const active = sz === selectedSize;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      aria-pressed={active}
                      className={`px-3.5 py-2 text-xs font-semibold tracking-[0.1em] uppercase border transition-colors min-h-[38px] ${
                        active
                          ? 'bg-[#4A0D1B] text-[#FDF3DC] border-[#4A0D1B]'
                          : 'bg-[#FDF3DC]/60 text-[#241214] border-[#DFCCA6] hover:border-[#4A0D1B]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#5E4346]">{product.sizeNote}</p>
            </div>

            {/* AVAILABLE COLORWAYS */}
            <div className="space-y-2.5">
              <span className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346]">
                AVAILABLE COLOR: <strong className="text-[#4A0D1B]">{selectedColorway}</strong>
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {product.colorways.map((cw) => {
                  const active = cw.name === selectedColorway;
                  return (
                    <button
                      key={cw.name}
                      type="button"
                      onClick={() => setSelectedColorway(cw.name)}
                      aria-label={`Select color ${cw.name}`}
                      aria-pressed={active}
                      className={`flex items-center gap-2 px-2.5 py-1.5 border transition-all ${
                        active ? 'border-[#4A0D1B] bg-[#FDF3DC]' : 'border-[#DFCCA6] hover:border-[#B5832C]'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-[#DFCCA6]"
                        style={{ backgroundColor: cw.hex }}
                      />
                      <span className="text-[10px] font-medium text-[#241214]">{cw.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SAREE FINISHING OPTIONS */}
            {isSaree && (
              <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-4 space-y-3.5">
                <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.14em] uppercase">
                  <span className="text-[#4A0D1B]">SAREE FINISHING PREFERENCES</span>
                  <span className="text-[#7D5718]">KOLKATA STUDIO</span>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={fallPico}
                    onChange={(e) => setFallPico(e.target.checked)}
                    className="mt-0.5 accent-[#4A0D1B] w-4 h-4"
                  />
                  <div className="flex-1 flex justify-between gap-2">
                    <span className="font-medium text-[#241214]">
                      Complimentary Fall &amp; Pico Finishing
                    </span>
                    <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[#7D5718]">
                      COMPLIMENTARY
                    </span>
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPleatArch('traditional')}
                    aria-pressed={pleatArch === 'traditional'}
                    className={`py-2 px-3 text-[10px] font-semibold tracking-[0.1em] uppercase border min-h-[38px] ${
                      pleatArch === 'traditional'
                        ? 'bg-[#FFFFFF] border-[#4A0D1B] text-[#4A0D1B]'
                        : 'bg-transparent border-[#DFCCA6] text-[#5E4346]'
                    }`}
                  >
                    TRADITIONAL UNSTITCHED
                  </button>
                  <button
                    type="button"
                    onClick={() => setPleatArch('pre-pleated')}
                    aria-pressed={pleatArch === 'pre-pleated'}
                    className={`py-2 px-3 text-[10px] font-semibold tracking-[0.1em] uppercase border min-h-[38px] ${
                      pleatArch === 'pre-pleated'
                        ? 'bg-[#FFFFFF] border-[#4A0D1B] text-[#4A0D1B]'
                        : 'bg-transparent border-[#DFCCA6] text-[#5E4346]'
                    }`}
                  >
                    PRE-PLEATED (+3 DAYS)
                  </button>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs pt-2 border-t border-[#DFCCA6]">
                  <input
                    type="checkbox"
                    checked={blouseTailoring}
                    onChange={(e) => setBlouseTailoring(e.target.checked)}
                    className="mt-0.5 accent-[#4A0D1B] w-4 h-4"
                  />
                  <div className="flex-1 flex justify-between gap-2">
                    <span className="font-medium text-[#241214]">
                      Custom Blouse Stitching (Sizes 38–44)
                    </span>
                    <span className="font-semibold text-[#4A0D1B] tabular-nums">
                      +{formatPrice(1200, currency)}
                    </span>
                  </div>
                </label>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-2.5">
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={handleAcquire}
                  className="flex-1 bg-[#4A0D1B] hover:bg-[#390914] text-[#FDF3DC] py-3.5 px-5 text-[11px] font-semibold tracking-[0.16em] uppercase inline-flex items-center justify-center gap-2 transition-colors min-h-[48px]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E5C37A]" aria-hidden="true" />
                  <span>
                    {addedFeedback
                      ? 'ADDED TO BAG'
                      : `ADD TO BAG — ${formatPrice(totalUnitPriceINR, currency)}`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                  aria-pressed={isSaved}
                  className="w-12 min-h-[48px] border border-[#DFCCA6] hover:border-[#4A0D1B] flex items-center justify-center text-[#4A0D1B]"
                >
                  <Heart
                    className={`w-4 h-4 ${isSaved ? 'fill-[#D87277] text-[#D87277]' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={onOpenContact}
                className="w-full border border-[#DFCCA6] hover:border-[#4A0D1B] bg-[#FDF3DC] py-3 px-4 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] inline-flex items-center justify-center gap-2 transition-colors min-h-[42px]"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#164A37]" aria-hidden="true" />
                <span>WHATSAPP ENQUIRY ({BRAND_INFO.whatsappNumbers[0]})</span>
              </button>
            </div>

            {/* Delivery Check */}
            <form onSubmit={handleVerifyPincode} className="flex gap-2 pt-1">
              <label htmlFor="pdp-pincode" className="sr-only">
                Enter delivery PIN or postal code
              </label>
              <input
                id="pdp-pincode"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Check India / Worldwide postal code (e.g. 700161)"
                className="flex-1 bg-[#FDF3DC] border border-[#DFCCA6] px-3 py-2 text-xs text-[#241214] min-h-[40px]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#B5832C] hover:bg-[#9E7022] text-[#2F0710] text-[10px] font-bold tracking-[0.14em] uppercase min-h-[40px]"
              >
                CHECK
              </button>
            </form>
            {pincodeResult && (
              <p role="status" className="text-[11px] text-[#164A37] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{pincodeResult}</span>
              </p>
            )}
          </aside>
        </div>

        {/* PRODUCT SPECIFICATIONS & CARE ACCORDIONS */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F7E8C6] pb-3">
              <h2 className="font-serif text-2xl text-[#4A0D1B]">Product Specifications</h2>
              <BenarasGhatMotif className="w-20 h-6" color="#B5832C" accentColor="#4A0D1B" />
            </div>
            <dl className="space-y-3 text-xs">
              {[
                ['Category', product.categoryLabel],
                ['Fabric & Material', product.fiberComposition],
                ['Craft / Technique', product.weaveType],
                ['Available Sizes', product.availableSizes.join(', ')],
                ['Dimensions / Fit', product.sizeNote],
                ['Origin Region', product.loomOrigin],
                ['Stock Status', product.statusText],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between gap-4 py-1.5 border-b border-[#FDF3DC]">
                  <dt className="font-semibold text-[#5E4346]">{label}</dt>
                  <dd className="text-[#241214] text-right font-medium">{val}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-7 space-y-4">
            <h2 className="font-serif text-2xl text-[#4A0D1B] border-b border-[#F7E8C6] pb-3">
              Washing, Care &amp; Policies
            </h2>
            <div className="divide-y divide-[#F7E8C6]">
              {[
                {
                  title: 'Washing & Care Instructions',
                  body: product.careInstructions,
                },
                {
                  title: 'Shipping & Delivery Coverage',
                  body: `Dispatches from our Newtown, Kolkata store across ${BRAND_INFO.deliveryLocations}. Estimated delivery: 4–7 business days in India and 7–14 business days internationally.`,
                },
                {
                  title: 'Returns, Exchanges & Payments',
                  body: `Return or size-exchange requests may be raised within 7 days of delivery for unworn items with tags intact. Supported payments: ${BRAND_INFO.paymentMethodsNote}.`,
                },
              ].map((acc, idx) => {
                const isOpen = openAccordion === idx;
                return (
                  <div key={acc.title} className="py-3.5">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenAccordion(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 text-left font-serif text-lg text-[#241214] hover:text-[#4A0D1B]"
                    >
                      <span>{acc.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs leading-relaxed text-[#5E4346]">{acc.body}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onOpenPolicyTab('care')}
                className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] underline underline-offset-2"
              >
                FULL CARE GUIDE
              </button>
              <button
                type="button"
                onClick={() => onOpenPolicyTab('returns')}
                className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] underline underline-offset-2"
              >
                RETURN &amp; REFUND POLICY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Trust Bar */}
      <section className="bg-[#2F0710] text-[#FDF3DC] border-y-2 border-[#B5832C] py-6 dark-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 w-full">
            <div className="flex items-center gap-3">
              <Plane className="w-5 h-5 text-[#E5C37A] shrink-0" aria-hidden="true" />
              <div className="text-xs">
                <p className="font-semibold">India &amp; Worldwide</p>
                <p className="text-[#DFCCA6] text-[11px]">Dispatched from Kolkata</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#E5C37A] shrink-0" aria-hidden="true" />
              <div className="text-xs">
                <p className="font-semibold">UPI &amp; Card Only</p>
                <p className="text-[#DFCCA6] text-[11px]">GSTIN {BRAND_INFO.gstNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#E5C37A] shrink-0" aria-hidden="true" />
              <div className="text-xs">
                <p className="font-semibold">Easy Exchange</p>
                <p className="text-[#DFCCA6] text-[11px]">Within 7 days of delivery</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAcquire}
            className="w-full lg:w-auto px-8 py-3.5 rounded-full bg-[#FDF3DC] hover:bg-[#E5C37A] text-[#4A0D1B] text-xs font-bold tracking-[0.14em] uppercase inline-flex items-center justify-center gap-2.5 transition-colors shrink-0 min-h-[46px]"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>BUY NOW · {formatPrice(totalUnitPriceINR, currency)}</span>
          </button>
        </div>
      </section>

      {/* Pair With Priyontor Blouses / Sarees */}
      {pairingProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
                PAIR YOUR ENSEMBLE
              </p>
              <h2 className="font-serif text-3xl text-[#4A0D1B] mt-1">
                {isSaree ? 'Pair with Priyontor Blouses (Sizes 38–44)' : 'Explore Signature Sarees'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pairingProducts.map((acc) => (
              <div
                key={acc.id}
                className="bg-[#FFFFFF] border border-[#DFCCA6] p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-stretch"
              >
                <div className="sm:w-36 aspect-square shrink-0 border border-[#F7E8C6] overflow-hidden">
                  <TextileArtwork artworkId={acc.artworkId} alt={acc.title} className="w-full h-full" />
                </div>
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                      {acc.categoryLabel} · {acc.secondaryBadge}
                    </p>
                    <h3 className="font-serif text-xl text-[#241214] mt-0.5">{acc.title}</h3>
                    <p className="text-xs text-[#5E4346] mt-1">{acc.description}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <span className="text-base font-semibold text-[#4A0D1B] tabular-nums">
                      {formatPrice(acc.priceINR, currency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(acc)}
                      className="bg-[#4A0D1B] hover:bg-[#390914] text-[#FDF3DC] px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[38px]"
                    >
                      VIEW &amp; SELECT SIZE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Catalog Pieces */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
              MORE FROM PRIYONTOR
            </p>
            <h2 className="font-serif text-3xl text-[#4A0D1B] mt-1">Continue Exploring</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('collections')}
            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] hover:text-[#7D5718]"
          >
            <span>VIEW ALL COLLECTIONS</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedTreasures.map((item) => (
            <article
              key={item.id}
              className="bg-[#FFFFFF] border border-[#DFCCA6] flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F7E8C6]">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(item)}
                    className="w-full h-full block"
                    aria-label={`Inspect ${item.title}`}
                  >
                    <TextileArtwork
                      artworkId={item.artworkId}
                      alt={item.title}
                      className="w-full h-full group-hover:scale-[1.03] transition-transform duration-200"
                    />
                  </button>
                  <span className="absolute top-3 left-3 bg-[#FDF3DC]/95 border border-[#DFCCA6] px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] uppercase text-[#4A0D1B]">
                    {item.originBadge}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                    {item.categoryLabel}
                  </p>
                  <h3 className="font-serif text-lg text-[#241214]">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(item)}
                      className="text-left hover:text-[#4A0D1B]"
                    >
                      {item.title}
                    </button>
                  </h3>
                </div>
              </div>
              <div className="px-4 pb-4 pt-2 border-t border-[#F7E8C6] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#4A0D1B] tabular-nums">
                  {formatPrice(item.priceINR, currency)}
                </span>
                <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[#7D5718]">
                  {item.secondaryBadge}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
