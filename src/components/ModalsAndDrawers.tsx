import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Minus,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { PRODUCTS, formatPrice } from '../data/archiveData';
import { BagItem, CurrencyCode, Product } from '../types/archive';
import { TextileArtwork } from './TextileArtwork';

export type ActiveModalType =
  | null
  | 'bag'
  | 'wishlist'
  | 'search'
  | 'concierge'
  | 'qr'
  | 'royalties'
  | 'account'
  | 'macro';

interface ModalsAndDrawersProps {
  activeModal: ActiveModalType;
  onClose: () => void;
  currency: CurrencyCode;
  bag: BagItem[];
  onUpdateBagQty: (key: string, delta: number) => void;
  onRemoveBagItem: (key: string) => void;
  onClearBag: () => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  macroProduct: Product;
}

export const ModalsAndDrawers: React.FC<ModalsAndDrawersProps> = ({
  activeModal,
  onClose,
  currency,
  bag,
  onUpdateBagQty,
  onRemoveBagItem,
  onClearBag,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  macroProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [conciergeSubmitted, setConciergeSubmitted] = useState(false);
  const [conciergeForm, setConciergeForm] = useState({
    name: '',
    email: '',
    city: 'New Delhi / Global Video',
    corridor: 'Varanasi Kadhwa Brocade',
  });
  const [macroScale, setMacroScale] = useState(2);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  const bagSubtotalINR = bag.reduce((sum, item) => sum + item.unitPriceINR * item.quantity, 0);
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.regionLabel.toLowerCase().includes(q) ||
          p.weaveType.toLowerCase().includes(q) ||
          p.guildLabel.toLowerCase().includes(q)
        );
      })
    : PRODUCTS.slice(0, 6);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Atelier Archive Overlay"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#241214]/60 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* SLIDE-OVER DRAWERS: Bag & Wishlist */}
      {(activeModal === 'bag' || activeModal === 'wishlist') && (
        <div className="relative z-10 w-full max-w-md bg-[#FDF3DC] h-full flex flex-col border-l border-[#DFCCA6] shadow-2xl">
          <div className="px-6 py-5 border-b border-[#DFCCA6] flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                PRIYONTOR VAULT
              </p>
              <h2 className="font-serif text-2xl text-[#241214]">
                {activeModal === 'bag'
                  ? `Acquisition Bag (${bag.reduce((s, i) => s + i.quantity, 0)})`
                  : `Saved Heirlooms (${wishlistProducts.length})`}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#241214] hover:text-[#4A0D1B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {activeModal === 'bag' ? (
              checkoutDone ? (
                <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-6 text-center space-y-4">
                  <CheckCircle2 className="w-10 h-10 text-[#164A37] mx-auto" aria-hidden="true" />
                  <h3 className="font-serif text-2xl text-[#241214]">
                    Vault Allocation Confirmed
                  </h3>
                  <p className="text-xs text-[#5E4346] leading-relaxed">
                    Order <strong className="font-mono text-[#241214]">#PRY-2025-8841</strong> has
                    been assigned to our Varanasi &amp; New Delhi archival curators. Your physical
                    GI provenance docket and insured courier airwaybill will be dispatched shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutDone(false);
                      onClose();
                    }}
                    className="w-full py-3 bg-[#4A0D1B] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.16em] uppercase"
                  >
                    RETURN TO ARCHIVE
                  </button>
                </div>
              ) : bag.length === 0 ? (
                <div className="text-center py-14 space-y-3">
                  <p className="font-serif text-xl text-[#241214]">Your acquisition vault is empty</p>
                  <p className="text-xs text-[#5E4346]">
                    Explore sovereign weaves across our regional craft corridors to reserve an
                    heirloom.
                  </p>
                </div>
              ) : (
                bag.map((item) => (
                  <div
                    key={item.key}
                    className="bg-[#FFFFFF] border border-[#DFCCA6] p-4 flex gap-4"
                  >
                    <div className="w-20 aspect-[3/4] shrink-0 border border-[#F7E8C6] overflow-hidden">
                      <TextileArtwork
                        artworkId={item.product.artworkId}
                        alt={item.product.title}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-base text-[#241214] leading-snug">
                          {item.product.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveBagItem(item.key)}
                          aria-label={`Remove ${item.product.title}`}
                          className="text-[#5E4346] hover:text-[#4A0D1B]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] tracking-[0.1em] uppercase text-[#7D5718]">
                        {item.colorway}
                      </p>
                      <p className="text-[11px] text-[#5E4346]">
                        {item.pleatArchitecture === 'pre-pleated'
                          ? 'Pre-Pleated (+3 Days)'
                          : 'Traditional Unstitched'}
                        {item.fallPico ? ' · Complimentary Fall & Pico' : ''}
                        {item.blouseTailoring ? ' · Bespoke Blouse Tailoring' : ''}
                      </p>
                      <div className="pt-2 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#DFCCA6]">
                          <button
                            type="button"
                            onClick={() => onUpdateBagQty(item.key, -1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#241214]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateBagQty(item.key, 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#241214]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-[#241214] tabular-nums">
                          {formatPrice(item.unitPriceINR * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : wishlistProducts.length === 0 ? (
              <div className="text-center py-14 space-y-2">
                <p className="font-serif text-xl text-[#241214]">No saved heirlooms yet</p>
                <p className="text-xs text-[#5E4346]">
                  Select the heart icon on any weave to curate your personal archive shortlist.
                </p>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#FFFFFF] border border-[#DFCCA6] p-4 flex gap-4 items-center"
                >
                  <div className="w-16 aspect-[3/4] shrink-0 border border-[#F7E8C6] overflow-hidden">
                    <TextileArtwork
                      artworkId={product.artworkId}
                      alt={product.title}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                      {product.originBadge}
                    </p>
                    <h3 className="font-serif text-base text-[#241214] truncate">{product.title}</h3>
                    <p className="text-xs font-semibold text-[#241214] tabular-nums mt-0.5">
                      {formatPrice(product.priceINR, currency)}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#4A0D1B] underline underline-offset-2"
                      >
                        INSPECT PIECE
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(product.id)}
                        className="text-[10px] text-[#5E4346] hover:text-[#241214]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {activeModal === 'bag' && bag.length > 0 && !checkoutDone && (
            <div className="p-6 border-t border-[#DFCCA6] bg-[#F7E8C6] space-y-4">
              <div className="flex items-center justify-between text-xs text-[#5E4346]">
                <span>Insured Cedarwood Air Courier</span>
                <span className="font-semibold text-[#164A37]">COMPLIMENTARY</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[#241214]">
                  TOTAL ARCHIVE VALUE
                </span>
                <span className="font-serif text-2xl text-[#241214] tabular-nums">
                  {formatPrice(bagSubtotalINR, currency)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClearBag();
                  setCheckoutDone(true);
                }}
                className="w-full py-3.5 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[46px]"
              >
                COMPLETE SOVEREIGN ACQUISITION
              </button>
            </div>
          )}
        </div>
      )}

      {/* CENTERED MODALS */}
      {activeModal !== 'bag' && activeModal !== 'wishlist' && (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-[#FDF3DC] border border-[#DFCCA6] w-full max-w-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#241214] hover:text-[#4A0D1B]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* SEARCH MODAL */}
            {activeModal === 'search' && (
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                    HERITAGE ARCHIVE SEARCH
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#241214] mt-1">
                    Search Weaves, Guilds &amp; Corridors
                  </h2>
                </div>
                <div className="relative">
                  <Search
                    className="w-4 h-4 text-[#5E4346] absolute left-3.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Kadhwa, Patola, Jamdani, Muga, Pashmina..."
                    className="w-full bg-[#FFFFFF] border border-[#DFCCA6] pl-10 pr-4 py-3 text-sm text-[#241214]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2.5 bg-[#FFFFFF] border border-[#DFCCA6] hover:border-[#4A0D1B] text-left transition-colors"
                    >
                      <div className="w-12 aspect-[3/4] shrink-0 overflow-hidden">
                        <TextileArtwork artworkId={p.artworkId} alt={p.title} className="w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[#7D5718] truncate">
                          {p.originBadge}
                        </p>
                        <p className="font-serif text-sm text-[#241214] truncate">{p.title}</p>
                        <p className="text-xs font-semibold text-[#241214] tabular-nums">
                          {formatPrice(p.priceINR, currency)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CONCIERGE APPOINTMENT MODAL */}
            {activeModal === 'concierge' && (
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                    PRIVATE CLIENT CONCIERGE
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#241214] mt-1">
                    Schedule a Private Textile Walkthrough
                  </h2>
                  <p className="text-xs text-[#5E4346] mt-1.5">
                    Connect live via 4K macro camera with our New Delhi Atelier Curators or master
                    guild hubs in Varanasi, Patan, and Kanchipuram.
                  </p>
                </div>

                {conciergeSubmitted ? (
                  <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-6 space-y-3 text-center">
                    <CheckCircle2 className="w-9 h-9 text-[#164A37] mx-auto" aria-hidden="true" />
                    <h3 className="font-serif text-xl text-[#241214]">
                      Private Consultation Requested
                    </h3>
                    <p className="text-xs text-[#5E4346]">
                      Thank you, {conciergeForm.name || 'Patron'}. Our Senior Textile Curator will
                      send your confidential appointment dossier for {conciergeForm.corridor} to{' '}
                      {conciergeForm.email || 'your email'}.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setConciergeSubmitted(false);
                        onClose();
                      }}
                      className="px-5 py-2.5 bg-[#4A0D1B] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.14em] uppercase"
                    >
                      CLOSE
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setConciergeSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="concierge-name"
                          className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                        >
                          PATRON FULL NAME
                        </label>
                        <input
                          id="concierge-name"
                          required
                          value={conciergeForm.name}
                          onChange={(e) =>
                            setConciergeForm((f) => ({ ...f, name: e.target.value }))
                          }
                          placeholder="e.g. Maharani Gayatri Devi"
                          className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3 py-2.5 text-xs text-[#241214]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="concierge-email"
                          className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                        >
                          CONFIDENTIAL EMAIL
                        </label>
                        <input
                          id="concierge-email"
                          type="email"
                          required
                          value={conciergeForm.email}
                          onChange={(e) =>
                            setConciergeForm((f) => ({ ...f, email: e.target.value }))
                          }
                          placeholder="patron@estate.org"
                          className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3 py-2.5 text-xs text-[#241214]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="concierge-city"
                          className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                        >
                          CONSULTATION FORMAT
                        </label>
                        <select
                          id="concierge-city"
                          value={conciergeForm.city}
                          onChange={(e) =>
                            setConciergeForm((f) => ({ ...f, city: e.target.value }))
                          }
                          className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3 py-2.5 text-xs text-[#241214]"
                        >
                          <option>4K Video Walkthrough (Global)</option>
                          <option>New Delhi Mehrauli Atelier</option>
                          <option>London Mayfair Private Trunk</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="concierge-corridor"
                          className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                        >
                          TEXTILE CORRIDOR OF INTEREST
                        </label>
                        <select
                          id="concierge-corridor"
                          value={conciergeForm.corridor}
                          onChange={(e) =>
                            setConciergeForm((f) => ({ ...f, corridor: e.target.value }))
                          }
                          className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3 py-2.5 text-xs text-[#241214]"
                        >
                          <option>Varanasi Kadhwa Brocade</option>
                          <option>Patan Double Ikat Patola</option>
                          <option>Bridal Trousseau Curation</option>
                          <option>Changthangi Sozni Pashmina</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase min-h-[44px]"
                    >
                      REQUEST PRIVATE APPOINTMENT
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* CRYPTOGRAPHIC QR DOSSIER MODAL */}
            {activeModal === 'qr' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4A0D1B] text-[#FDF3DC] flex items-center justify-center">
                    <QrCode className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                      SOVEREIGN CRYPTOGRAPHIC SEAL
                    </p>
                    <h2 className="font-serif text-2xl text-[#241214]">
                      Provenance Ledger · PRY-VNS-2024-8841
                    </h2>
                  </div>
                </div>
                <dl className="bg-[#FFFFFF] border border-[#DFCCA6] p-5 space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#F7E8C6]">
                    <dt className="text-[#5E4346]">Guild &amp; Master Artisan</dt>
                    <dd className="font-semibold text-[#241214]">Ustad M. Farooq · Madanpura</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F7E8C6]">
                    <dt className="text-[#5E4346]">GI Registry Certificate</dt>
                    <dd className="font-mono text-[#241214]">GI-APP-46 / SILK MARK #5882</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F7E8C6]">
                    <dt className="text-[#5E4346]">Silver &amp; Zari Assay</dt>
                    <dd className="font-semibold text-[#241214]">98.5% Silver Core · 24K Gold Foil</dd>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <dt className="text-[#5E4346]">Direct Artisan Royalty Disbursed</dt>
                    <dd className="font-semibold text-[#164A37]">72% Verified Direct Settlement</dd>
                  </div>
                </dl>
              </div>
            )}

            {/* ROYALTIES LEDGER MODAL */}
            {activeModal === 'royalties' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-7 h-7 text-[#4A0D1B]" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                      PRIYONTOR ETHICAL CODEX
                    </p>
                    <h2 className="font-serif text-2xl text-[#241214]">
                      Direct Weaver Royalties Ledger
                    </h2>
                  </div>
                </div>
                <p className="text-xs text-[#5E4346] leading-relaxed">
                  Zero middlemen or commission brokers. Every heirloom acquisition distributes
                  audited royalties directly to the originating craft guild.
                </p>
                <div className="bg-[#FFFFFF] border border-[#DFCCA6] divide-y divide-[#F7E8C6] text-xs">
                  {[
                    ['Madanpura Kadhwa Guild (Varanasi)', '72% Direct', '142 Looms Funded'],
                    ['Salviwada Patola Lineage (Patan)', '74% Direct', '14 Master Families'],
                    ['Phulia Jamdani Collective (Bengal)', '71% Direct', '88 Bamboo Pit-Looms'],
                    ['Kanihama Sozni & Kani Guild (Kashmir)', '73% Direct', '64 Charkha Artisans'],
                  ].map(([guild, share, note]) => (
                    <div key={guild} className="p-3.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#241214]">{guild}</p>
                        <p className="text-[11px] text-[#5E4346]">{note}</p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#4A0D1B]">
                        {share}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4K THREAD MACRO MODAL */}
            {activeModal === 'macro' && (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                    4K THREAD MACRO INSPECTION
                  </p>
                  <h2 className="font-serif text-2xl text-[#241214]">{macroProduct.title}</h2>
                </div>
                <div className="aspect-[4/3] overflow-hidden border border-[#DFCCA6] bg-[#241214]">
                  <div
                    className="w-full h-full transition-transform duration-200 origin-center"
                    style={{ transform: `scale(${macroScale})` }}
                  >
                    <TextileArtwork
                      artworkId="empress-kadhwa-macro"
                      alt={`Magnified weave of ${macroProduct.title}`}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-[#5E4346]">
                    Warp: {macroProduct.warpDensity} · Weft: {macroProduct.weftDensity}
                  </p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((z) => (
                      <button
                        key={z}
                        type="button"
                        onClick={() => setMacroScale(z)}
                        className={`px-3 py-1.5 text-[10px] font-semibold border ${
                          macroScale === z
                            ? 'bg-[#4A0D1B] text-[#FDF3DC] border-[#4A0D1B]'
                            : 'bg-[#FFFFFF] text-[#241214] border-[#DFCCA6]'
                        }`}
                      >
                        {z}X LOUPE
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PATRON ACCOUNT MODAL */}
            {activeModal === 'account' && (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                    PATRON REGISTRY
                  </p>
                  <h2 className="font-serif text-2xl text-[#241214]">
                    Private Collector Dossier
                  </h2>
                </div>
                <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-5 space-y-2 text-xs">
                  <p className="font-semibold text-[#241214]">
                    Saved Heirlooms: {wishlistIds.length} · Items in Bag:{' '}
                    {bag.reduce((s, i) => s + i.quantity, 0)}
                  </p>
                  <p className="text-[#5E4346]">
                    Your private vault selections and bespoke measurements are preserved locally
                    for this session.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
