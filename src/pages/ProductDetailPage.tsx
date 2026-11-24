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
  Plane,
  QrCode,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Video,
  ZoomIn,
} from 'lucide-react';
import { PRODUCTS, formatPrice } from '../data/archiveData';
import { CurrencyCode, PageRoute, Product } from '../types/archive';
import { TextileArtwork } from '../components/TextileArtwork';

interface ProductDetailPageProps {
  product: Product;
  currency: CurrencyCode;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onAddToBag: (opts: {
    product: Product;
    colorway: string;
    pleatArchitecture: 'traditional' | 'pre-pleated';
    fallPico: boolean;
    blouseTailoring: boolean;
  }) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: PageRoute) => void;
  onOpenConcierge: () => void;
  onOpenQrDossier: () => void;
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
  onOpenConcierge,
  onOpenQrDossier,
  onOpenMacroZoom,
}) => {
  const galleryViews = product.galleryArtworks ?? [
    { label: 'FULL LOOK', artworkId: product.artworkId },
    { label: 'KADHWA MOTIFS', artworkId: 'empress-kadhwa-macro' as const },
    { label: 'REVERSE WEAVE', artworkId: 'empress-reverse-weave' as const },
    { label: 'PIT-LOOM', artworkId: 'empress-pit-loom' as const },
  ];

  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [selectedColorway, setSelectedColorway] = useState(
    product.colorways[0]?.name ?? 'ROYAL ARCHIVE'
  );
  const [fallPico, setFallPico] = useState(true);
  const [pleatArch, setPleatArch] = useState<'traditional' | 'pre-pleated'>('traditional');
  const [blouseTailoring, setBlouseTailoring] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const isSaved = wishlistIds.includes(product.id);
  const tailoringAddINR = blouseTailoring ? 4500 : 0;
  const totalUnitPriceINR = product.priceINR + tailoringAddINR;

  const pairingProducts = PRODUCTS.filter((p) => p.category === 'accessories');
  const relatedTreasures = PRODUCTS.filter(
    (p) => p.varanasiTreasure && p.id !== product.id
  ).slice(0, 4);

  const handleAcquire = () => {
    onAddToBag({
      product,
      colorway: selectedColorway,
      pleatArchitecture: pleatArch,
      fallPico,
      blouseTailoring,
    });
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleVerifyPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pincode.trim();
    if (cleaned.length < 4) {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code or international postal code.');
      return;
    }
    const extraDays =
      pleatArch === 'pre-pleated' ? '6–8 business days (incl. bespoke pleating)' : '3–5 business days';
    setPincodeResult(
      `Confirmed for ${cleaned.toUpperCase()}: Insured air courier dispatch in ${extraDays}.`
    );
  };

  const featureMatrix = [
    { icon: Leaf, title: 'Pure Handloom', sub: product.fiberTag + ' Heritage Fiber' },
    { icon: Grid, title: 'Intricate Weave', sub: product.weaveType },
    { icon: Gem, title: 'Rich Zari Border', sub: 'Tested Silver & Gold' },
    { icon: Feather, title: 'Graceful Drape', sub: 'Zero-Float Comfort' },
    { icon: Sparkles, title: 'Festive & Bridal', sub: 'Ceremonial Heirloom' },
    { icon: Award, title: 'GI Certified', sub: product.giNumber },
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
            <span className="text-[#4A0D1B] font-semibold">ARCHIVE REF: {product.archiveRef}</span>
            <span className="text-[#B5832C]" aria-hidden="true">|</span>
            <span className="text-[#5E4346]">{product.batchLabel}</span>
          </div>
        </div>
      </div>

      {/* TOP EDITORIAL SPLIT (Inspired by Georgette Saree Set layout + Logo Palette) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT: Gallery Stage */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Thumbnails */}
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

              {/* Main Frame */}
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
                    <span>4K THREAD MACRO</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Spec & Purchase Module */}
          <aside className="lg:col-span-6 bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="h-[1px] w-6 bg-[#B5832C]" aria-hidden="true" />
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
                  TRADITIONAL ELEGANCE
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#241214]">
                <Star className="w-3.5 h-3.5 fill-[#B5832C] text-[#B5832C]" aria-hidden="true" />
                <span className="font-semibold tabular-nums">{product.heritageRating}</span>
                <span className="text-[#5E4346]">({product.reviewCount} Reviews)</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#4A0D1B] leading-tight">
                {product.title}
              </h1>
              <p className="text-xs text-[#5E4346] tracking-wide">
                {product.weaveType} &nbsp;|&nbsp; Rich Zari Border &nbsp;|&nbsp; Effortless Royal Drape
              </p>
            </div>

            {/* Price & Archival Badge */}
            <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[#F7E8C6]">
              <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#241214] tabular-nums">
                {formatPrice(product.priceINR, currency)}
              </span>
              {product.originalPriceINR && (
                <span className="text-sm text-[#5E4346] line-through tabular-nums">
                  {formatPrice(product.originalPriceINR, currency)}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-[#4A0D1B] text-[#E5C37A] text-[10px] font-semibold tracking-[0.12em] uppercase">
                {product.statusText}
              </span>
            </div>

            {/* 6-Tile Feature Icon Matrix (Inspired by Georgette Saree Set) */}
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

            {/* Signature Quote */}
            <div className="flex items-center justify-between py-2 border-y border-[#F7E8C6]">
              <p className="font-serif italic text-lg text-[#4A0D1B]">
                Grace in Every Thread <span className="text-[#D87277]" aria-hidden="true">✿</span>
              </p>
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                Where Heritage Meets Heart
              </span>
            </div>

            {/* Available Colors (Circular Swatches) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold tracking-[0.14em] uppercase text-[#5E4346]">
                  AVAILABLE COLORWAY:{' '}
                  <strong className="text-[#4A0D1B]">{selectedColorway}</strong>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {product.colorways.map((cw) => {
                  const active = cw.name === selectedColorway;
                  return (
                    <button
                      key={cw.name}
                      type="button"
                      onClick={() => setSelectedColorway(cw.name)}
                      aria-label={`Select colorway ${cw.name}`}
                      aria-pressed={active}
                      className={`flex flex-col items-center gap-1 p-1 border-b-2 transition-all ${
                        active ? 'border-[#4A0D1B]' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <span
                        className={`w-9 h-9 rounded-full border-2 ${
                          active ? 'border-[#B5832C] ring-1 ring-[#4A0D1B]' : 'border-[#DFCCA6]'
                        }`}
                        style={{ backgroundColor: cw.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Atelier Bespoke Finishing */}
            <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-4 space-y-3.5">
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.14em] uppercase">
                <span className="text-[#4A0D1B]">ATELIER BESPOKE FINISHING</span>
                <span className="text-[#7D5718]">CUSTOMIZED IN BHARAT</span>
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
                    Fall, Pico &amp; Hand-Rolled Silk Latkan Tassels
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
                    Made-to-Measure Blouse Tailoring
                  </span>
                  <span className="font-semibold text-[#4A0D1B] tabular-nums">
                    +{formatPrice(4500, currency)}
                  </span>
                </div>
              </label>
            </div>

            {/* Primary CTA Buttons */}
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
                      ? 'ADDED TO ACQUISITION BAG'
                      : `ACQUIRE PIECE — ${formatPrice(totalUnitPriceINR, currency)}`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label={isSaved ? 'Remove from saved' : 'Save heirloom'}
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
                onClick={onOpenConcierge}
                className="w-full border border-[#DFCCA6] hover:border-[#4A0D1B] bg-[#FDF3DC] py-3 px-4 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] inline-flex items-center justify-center gap-2 transition-colors min-h-[42px]"
              >
                <Video className="w-3.5 h-3.5 text-[#7D5718]" aria-hidden="true" />
                <span>SCHEDULE PRIVATE VIDEO WALKTHROUGH</span>
              </button>
            </div>

            {/* Delivery Check */}
            <form onSubmit={handleVerifyPincode} className="flex gap-2 pt-1">
              <label htmlFor="pdp-pincode" className="sr-only">
                Enter delivery PIN code
              </label>
              <input
                id="pdp-pincode"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Check insured delivery PIN (e.g. 110001)"
                className="flex-1 bg-[#FDF3DC] border border-[#DFCCA6] px-3 py-2 text-xs text-[#241214] min-h-[40px]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#B5832C] hover:bg-[#9E7022] text-[#2F0710] text-[10px] font-bold tracking-[0.14em] uppercase min-h-[40px]"
              >
                VERIFY
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

        {/* 4-COLUMN DETAIL FEATURE PLATES (Inspired directly by Georgette Saree Set) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: 'Artisanal Blouse Piece',
              desc: 'Includes unstitched matching handwoven blouse fabric with coordinated zari border.',
              artwork: 'empress-reverse-weave' as const,
            },
            {
              title: 'Pure Handloom Weave',
              desc: `${product.fiberComposition} woven with zero motorized powerloom intervention.`,
              artwork: product.artworkId,
            },
            {
              title: 'Rich Zari Border',
              desc: 'Individually interlocked border motifs creating a royal heirloom silhouette.',
              artwork: 'empress-kadhwa-macro' as const,
            },
            {
              title: 'Complete Heirloom Set',
              desc: '5.5m draped saree + 0.8m blouse piece sealed in acid-free archival muslin.',
              artwork: 'empress-pit-loom' as const,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-[#FFFFFF] border border-[#DFCCA6] overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <TextileArtwork artworkId={card.artwork} alt={card.title} className="w-full h-full" />
              </div>
              <div className="p-4 text-center space-y-1">
                <h2 className="font-serif text-lg text-[#4A0D1B]">{card.title}</h2>
                <p className="text-xs text-[#5E4346] leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* PRODUCT DETAILS SPEC SHEET + GARMENT PROVENANCE LEDGER */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Product Details Specs */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-7 space-y-4">
            <h2 className="font-serif text-2xl text-[#4A0D1B] border-b border-[#F7E8C6] pb-3">
              Product Details
            </h2>
            <dl className="space-y-3 text-xs">
              {[
                ['Fabric', product.fiberComposition],
                ['Blouse', '0.8 m Unstitched Matching Piece'],
                ['Pattern', product.weaveType],
                ['Border', 'Tested Pure Zari Border'],
                ['Length', 'Saree – 5.5 m | Blouse – 0.8 m'],
                ['Loom Origin', product.loomOrigin],
                ['Master Artisan', product.masterCraftsman],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between gap-4 py-1.5 border-b border-[#FDF3DC]">
                  <dt className="font-semibold text-[#5E4346]">{label}</dt>
                  <dd className="text-[#241214] text-right font-medium">{val}</dd>
                </div>
              ))}
            </dl>

            {/* Cryptographic QR Seal */}
            <div className="bg-[#4A0D1B] text-[#FDF3DC] p-4 flex items-center justify-between gap-3 dark-surface">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FDF3DC] text-[#4A0D1B] flex items-center justify-center shrink-0">
                  <QrCode className="w-8 h-8" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#E5C37A]">
                    SOVEREIGN SEAL · {product.archiveRef}
                  </p>
                  <p className="font-serif text-base">Cryptographic Provenance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenQrDossier}
                className="px-3 py-2 bg-[#B5832C] text-[#2F0710] text-[9px] font-bold tracking-[0.12em] uppercase shrink-0"
              >
                VERIFY
              </button>
            </div>
          </div>

          {/* Right: Editorial Accordions */}
          <div
            id="care-accordions"
            className="lg:col-span-7 bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-7 space-y-4"
          >
            <h2 className="font-serif text-2xl text-[#4A0D1B] border-b border-[#F7E8C6] pb-3">
              Lineage, Craftsmanship &amp; Care
            </h2>
            <div className="divide-y divide-[#F7E8C6]">
              {[
                {
                  title: 'The Legend of Botanical & Lac Dyeing',
                  body: 'Prepared in slow heritage vats using lac resin, madder root, and mineral mordants so colors mature gracefully without fading across decades.',
                },
                {
                  title: 'The Handloom Weaving Technique Explained',
                  body: `Crafted over ${product.weavingDuration} on a ${product.loomMechanism} (${product.warpDensity}), locking each motif cleanly with zero rough reverse floats.`,
                },
                {
                  title: 'Heirloom Preservation & Generational Care',
                  body: 'Store folded inside unbleached malmal cotton or acid-free archival tissue. Refold along alternate creases every four months to preserve pure silk and zari suppleness.',
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
          </div>
        </div>
      </section>

      {/* DARK WINE BOTTOM TRUST & BUY NOW BAR (Inspired by Georgette Saree Set) */}
      <section className="bg-[#2F0710] text-[#FDF3DC] border-y-2 border-[#B5832C] py-6 dark-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 w-full">
            <div className="flex items-center gap-3">
              <Plane className="w-5 h-5 text-[#E5C37A] shrink-0" aria-hidden="true" />
              <div className="text-xs">
                <p className="font-semibold">Fast &amp; Insured Delivery</p>
                <p className="text-[#DFCCA6] text-[11px]">Worldwide cedarwood dispatch</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#E5C37A] shrink-0" aria-hidden="true" />
              <div className="text-xs">
                <p className="font-semibold">Trusted Quality Assured</p>
                <p className="text-[#DFCCA6] text-[11px]">Silk Mark &amp; GI verified</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#E5C37A] shrink-0" aria-hidden="true" />
              <div className="text-xs">
                <p className="font-semibold">Easy Heritage Exchange</p>
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

        <div className="mt-5 pt-3 border-t border-[#4A0D1B] text-center">
          <p className="text-[10px] tracking-[0.26em] uppercase text-[#E5C37A]">
            TIMELESS TRADITION &nbsp;✦&nbsp; MODERN YOU
          </p>
        </div>
      </section>

      {/* Complete The Regal Drape */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
              CURATED HEIRLOOM PAIRING
            </p>
            <h2 className="font-serif text-3xl text-[#4A0D1B] mt-1">Complete The Regal Drape</h2>
          </div>
          <p className="font-serif italic text-xs text-[#5E4346]">
            Archival pairings curated by Priyontor&apos;s Senior Draper.
          </p>
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
                    {acc.guildLabel}
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
                    onClick={() =>
                      onAddToBag({
                        product: acc,
                        colorway: acc.colorways[0]?.name ?? 'ROYAL',
                        pleatArchitecture: 'traditional',
                        fallPico: false,
                        blouseTailoring: false,
                      })
                    }
                    className="bg-[#4A0D1B] hover:bg-[#390914] text-[#FDF3DC] px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[38px]"
                  >
                    ADD TO ENSEMBLE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* More Archive Treasures */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
              HERITAGE CORRIDOR
            </p>
            <h2 className="font-serif text-3xl text-[#4A0D1B] mt-1">
              More from Varanasi Archive Treasures
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('collections')}
            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] hover:text-[#7D5718]"
          >
            <span>EXPLORE ALL WEAVES</span>
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
                    {item.guildLabel}
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
                  {item.statusText}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
