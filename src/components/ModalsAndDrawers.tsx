import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  LogOut,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import { PRODUCTS, formatPrice } from '../data/archiveData';
import {
  BRAND_INFO,
  BUSINESS_POLICIES,
  PolicyEntry,
  SIZE_CHARTS,
} from '../data/priyontorInfo';
import { AuthUser, BagItem, CurrencyCode, OrderRecord, Product } from '../types/archive';
import { ContactStoreSection } from './ContactStoreSection';
import { BenarasGhatMotif, LotusMotif } from './HeritageMotifs';
import { TextileArtwork } from './TextileArtwork';

export type ActiveModalType =
  | null
  | 'bag'
  | 'wishlist'
  | 'search'
  | 'welcome-offer'
  | 'policies'
  | 'contact'
  | 'account'
  | 'login'
  | 'signup'
  | 'macro';

interface ModalsAndDrawersProps {
  activeModal: ActiveModalType;
  onClose: () => void;
  onSwitchModal: (modal: ActiveModalType) => void;
  currency: CurrencyCode;
  bag: BagItem[];
  onUpdateBagQty: (key: string, delta: number) => void;
  onRemoveBagItem: (key: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  macroProduct: Product;
  authUser: AuthUser | null;
  authToken?: string | null;
  authLoading: boolean;
  patronOrders: OrderRecord[];
  activePromoCode: string;
  onApplyPromoCode: (code: string) => void;
  activePolicyTab: PolicyEntry['id'] | 'size-chart';
  onChangePolicyTab: (tab: PolicyEntry['id'] | 'size-chart') => void;
  onProceedToCheckout: () => void;
  onExploreCollections: () => void;
  onLogin: (payload: { email: string; password: string }) => Promise<void>;
  onSignup: (payload: {
    name: string;
    email: string;
    password: string;
    city?: string;
  }) => Promise<void>;
  onLogout: () => Promise<void>;
}

export const ModalsAndDrawers: React.FC<ModalsAndDrawersProps> = ({
  activeModal,
  onClose,
  onSwitchModal,
  currency,
  bag,
  onUpdateBagQty,
  onRemoveBagItem,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  macroProduct,
  authUser,
  authToken = null,
  authLoading,
  patronOrders,
  activePromoCode,
  onApplyPromoCode,
  activePolicyTab,
  onChangePolicyTab,
  onProceedToCheckout,
  onExploreCollections,
  onLogin,
  onSignup,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [macroScale, setMacroScale] = useState(2);
  const [copiedWelcomeCode, setCopiedWelcomeCode] = useState(false);

  // Auth modal state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCity, setSignupCity] = useState('Kolkata / Newtown');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setAuthError(null);
  }, [activeModal]);

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

  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!loginEmail.trim() || !loginPassword) {
      setAuthError('Please enter your email address and password.');
      return;
    }
    try {
      await onLogin({ email: loginEmail.trim(), password: loginPassword });
      setLoginPassword('');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Unable to sign in right now.');
    }
  };

  const handleSignupFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (signupName.trim().length < 2) {
      setAuthError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!signupEmail.trim().includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (signupPassword.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setAuthError('Passwords do not match. Please verify both fields.');
      return;
    }
    try {
      await onSignup({
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        city: signupCity.trim(),
      });
      setSignupPassword('');
      setSignupConfirm('');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Unable to create account right now.');
    }
  };

  const bagSubtotalINR = bag.reduce((sum, item) => sum + item.unitPriceINR * item.quantity, 0);
  const bagDiscountINR =
    bagSubtotalINR >= BRAND_INFO.bulkThresholdINR
      ? Math.round(bagSubtotalINR * 0.1)
      : activePromoCode.toUpperCase() === BRAND_INFO.welcomePromoCode
        ? Math.round(bagSubtotalINR * 0.05)
        : 0;
  const bagDiscountLabel =
    bagSubtotalINR >= BRAND_INFO.bulkThresholdINR
      ? '10% Off (₹20,000+ Order Privilege)'
      : activePromoCode.toUpperCase() === BRAND_INFO.welcomePromoCode
        ? '5% Off First Order (PRIYO5)'
        : null;
  const bagEstimatedTotalINR = Math.max(0, bagSubtotalINR - bagDiscountINR);

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.regionLabel.toLowerCase().includes(q) ||
          p.weaveType.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.guildLabel.toLowerCase().includes(q)
        );
      })
    : PRODUCTS.slice(0, 6);

  const selectedPolicyEntry =
    BUSINESS_POLICIES.find((p) => p.id === activePolicyTab) ?? BUSINESS_POLICIES[0];

  const handleCopyWelcome = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(BRAND_INFO.welcomePromoCode).catch(() => {});
    }
    onApplyPromoCode(BRAND_INFO.welcomePromoCode);
    setCopiedWelcomeCode(true);
    window.setTimeout(() => setCopiedWelcomeCode(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="PRIYONTOR Overlay"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#241214]/65 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* SLIDE-OVER DRAWERS: Bag & Wishlist */}
      {(activeModal === 'bag' || activeModal === 'wishlist') && (
        <div className="relative z-10 w-full max-w-md bg-[#FDF3DC] h-full flex flex-col border-l border-[#DFCCA6] shadow-2xl">
          <div className="px-6 py-5 border-b border-[#DFCCA6] flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                PRIYONTOR SHOPPING BAG
              </p>
              <h2 className="font-serif text-2xl text-[#241214]">
                {activeModal === 'bag'
                  ? `Your Bag (${bag.reduce((s, i) => s + i.quantity, 0)})`
                  : `Saved Wishlist (${wishlistProducts.length})`}
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
              bag.length === 0 ? (
                <div className="text-center py-14 space-y-3">
                  <LotusMotif className="w-10 h-7 mx-auto" color="#4A0D1B" accentColor="#B5832C" />
                  <p className="font-serif text-xl text-[#241214]">Your shopping bag is empty</p>
                  <p className="text-xs text-[#5E4346]">
                    Explore Indian state-wise sarees, Designer sarees, Mens&apos; Punjabi, Kids&apos; wear, Blouses, and Women&apos;s sets.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onExploreCollections();
                    }}
                    className="mt-2 px-5 py-2.5 bg-[#4A0D1B] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.16em] uppercase"
                  >
                    EXPLORE COLLECTIONS
                  </button>
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
                        SIZE: {item.selectedSize} · {item.colorway}
                      </p>
                      {(item.product.category === 'sarees' ||
                        item.product.category === 'designer-sarees') && (
                        <p className="text-[11px] text-[#5E4346]">
                          {item.pleatArchitecture === 'pre-pleated'
                            ? 'Pre-Pleated (+3 Days)'
                            : 'Traditional Unstitched'}
                          {item.fallPico ? ' · Complimentary Fall & Pico' : ''}
                          {item.blouseTailoring ? ' · Blouse Stitching (+₹1,200)' : ''}
                        </p>
                      )}
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
                <p className="font-serif text-xl text-[#241214]">No saved items yet</p>
                <p className="text-xs text-[#5E4346]">
                  Select the heart icon on any saree or garment to save it to your wishlist.
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
                        VIEW PRODUCT
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

          {activeModal === 'bag' && bag.length > 0 && (
            <div className="p-6 border-t border-[#DFCCA6] bg-[#F7E8C6] space-y-3.5">
              {/* Promo PRIYO5 Quick Apply */}
              {bagSubtotalINR < BRAND_INFO.bulkThresholdINR && (
                <div className="flex items-center justify-between gap-2 bg-[#FFFFFF]/80 border border-[#DFCCA6] px-3 py-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-[#4A0D1B] font-medium">
                    <Tag className="w-3.5 h-3.5 text-[#B5832C]" aria-hidden="true" />
                    {activePromoCode.toUpperCase() === BRAND_INFO.welcomePromoCode
                      ? 'PRIYO5 applied (5% off 1st order)'
                      : '1st order? Apply PRIYO5 for 5% off'}
                  </span>
                  {activePromoCode.toUpperCase() === BRAND_INFO.welcomePromoCode ? (
                    <button
                      type="button"
                      onClick={() => onApplyPromoCode('')}
                      className="text-[10px] font-semibold uppercase text-[#5E4346] underline"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onApplyPromoCode(BRAND_INFO.welcomePromoCode)}
                      className="px-2.5 py-1 bg-[#4A0D1B] text-[#FDF3DC] text-[9px] font-semibold tracking-[0.12em] uppercase"
                    >
                      APPLY PRIYO5
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#5E4346]">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-[#241214]">
                    {formatPrice(bagSubtotalINR, currency)}
                  </span>
                </div>
                {bagDiscountINR > 0 && bagDiscountLabel && (
                  <div className="flex items-center justify-between text-[#164A37] font-medium">
                    <span>{bagDiscountLabel}</span>
                    <span className="tabular-nums">−{formatPrice(bagDiscountINR, currency)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#5E4346]">
                  <span>Delivery (India &amp; Worldwide)</span>
                  <span className="font-semibold text-[#164A37]">UPI &amp; CARD ONLY</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#DFCCA6]">
                <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[#241214]">
                  ESTIMATED TOTAL
                </span>
                <span className="font-serif text-2xl text-[#4A0D1B] tabular-nums">
                  {formatPrice(bagEstimatedTotalINR, currency)}
                </span>
              </div>
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[46px]"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          )}
        </div>
      )}

      {/* CENTERED MODALS */}
      {activeModal !== 'bag' && activeModal !== 'wishlist' && (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-[#FDF3DC] border-2 border-[#B5832C] w-full max-w-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#241214] hover:text-[#4A0D1B]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* WELCOME DISCOUNT POP-UP (PRIYO5 - 5% OFF ON 1ST ORDER RIGHT AFTER OPENING WEBSITE) */}
            {activeModal === 'welcome-offer' && (
              <div className="text-center space-y-5">
                <div className="flex flex-col items-center gap-2">
                  <LotusMotif className="w-12 h-8" color="#4A0D1B" accentColor="#B5832C" />
                  <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#7D5718]">
                    WELCOME TO {BRAND_INFO.name} · {BRAND_INFO.debutMilestone.toUpperCase()}
                  </p>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-[#4A0D1B] leading-tight">
                  Welcome Discount: <span className="italic text-[#B5832C]">5% Off</span> Your 1st Order
                </h2>

                <p className="text-xs sm:text-sm text-[#5E4346] max-w-lg mx-auto leading-relaxed">
                  {BRAND_INFO.tagline}. Enjoy an exclusive welcome privilege across Indian Heritage Sarees, Designer Sarees, Mens&apos; Punjabi, Kids&apos; Wear, Blouses &amp; Women&apos;s Co-Ord &amp; Kurta Sets.
                </p>

                <div className="bg-[#4A0D1B] text-[#FDF3DC] border border-[#B5832C] p-5 space-y-3 dark-surface">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#E5C37A] font-semibold">
                    WELCOME PROMO CODE (ALL PRODUCTS · 1ST ORDER)
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="px-5 py-2 bg-[#2F0710] border border-[#E5C37A] font-mono text-xl font-bold tracking-[0.2em] text-[#E5C37A]">
                      {BRAND_INFO.welcomePromoCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyWelcome}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B5832C] hover:bg-[#D4A44B] text-[#2F0710] text-[10px] font-bold tracking-[0.14em] uppercase min-h-[40px]"
                    >
                      {copiedWelcomeCode ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>APPLIED &amp; COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>COPY &amp; APPLY CODE</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#E9DAC0]">
                    Also enjoy <strong>10% Off on ₹20,000+ purchases</strong> &amp; <strong>10% Off on your 1st physical purchase</strong> at our Newtown, Kolkata store.
                  </p>
                </div>

                <div className="flex justify-center">
                  <BenarasGhatMotif className="w-36 h-9" color="#B5832C" accentColor="#4A0D1B" />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onApplyPromoCode(BRAND_INFO.welcomePromoCode);
                      onClose();
                      onExploreCollections();
                    }}
                    className="w-full sm:w-auto px-7 py-3.5 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase min-h-[44px]"
                  >
                    APPLY PRIYO5 &amp; SHOP NOW
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3.5 border border-[#DFCCA6] hover:border-[#4A0D1B] text-[#5E4346] text-[11px] font-semibold tracking-[0.14em] uppercase min-h-[44px]"
                  >
                    CONTINUE BROWSING
                  </button>
                </div>
              </div>
            )}

            {/* SEARCH MODAL */}
            {activeModal === 'search' && (
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                    PRIYONTOR CATALOG SEARCH
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#241214] mt-1">
                    Search Sarees, Punjabi, Kids &amp; Sets
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
                    placeholder="Search Banarasi, Jamdani, Tussar, Punjabi, Blouse, Co-Ord..."
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

            {/* BUSINESS POLICIES, SIZE CHART & CARE MODAL */}
            {activeModal === 'policies' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <LotusMotif className="w-9 h-6 shrink-0" color="#4A0D1B" accentColor="#B5832C" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                      BUSINESS POLICIES, SIZE CHART &amp; GARMENT CARE
                    </p>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#241214]">
                      Priyontor Information Guide
                    </h2>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-1.5 border-b border-[#DFCCA6] pb-3">
                  {[
                    { id: 'size-chart' as const, label: 'Size Chart' },
                    { id: 'care' as const, label: 'Washing & Care' },
                    { id: 'shipping' as const, label: 'Shipping' },
                    { id: 'returns' as const, label: 'Returns & Exchange' },
                    { id: 'refund' as const, label: 'Refunds' },
                    { id: 'cancellation' as const, label: 'Cancellation' },
                    { id: 'privacy' as const, label: 'Privacy' },
                    { id: 'terms' as const, label: 'Terms' },
                  ].map((tab) => {
                    const active = activePolicyTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChangePolicyTab(tab.id)}
                        className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase border transition-colors ${
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

                {activePolicyTab === 'size-chart' ? (
                  <div className="space-y-3">
                    <p className="text-xs text-[#5E4346]">
                      Official Priyontor garment sizing across Sarees, Women&apos;s Sets, Blouses, Mens&apos; Punjabi, and Kids&apos; Ethnic Wear:
                    </p>
                    <div className="bg-[#FFFFFF] border border-[#DFCCA6] divide-y divide-[#F7E8C6]">
                      {SIZE_CHARTS.map((row) => (
                        <div key={row.category} className="p-3.5 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-serif text-base text-[#4A0D1B] font-semibold">
                              {row.category}
                            </p>
                            <span className="px-2.5 py-0.5 bg-[#F7E8C6] border border-[#B5832C]/50 text-[10px] font-bold tracking-[0.12em] uppercase text-[#4A0D1B]">
                              {row.sizeSpec}
                            </span>
                          </div>
                          <p className="text-xs text-[#5E4346]">{row.measurements}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-5 space-y-3">
                    <h3 className="font-serif text-2xl text-[#4A0D1B]">
                      {selectedPolicyEntry.title}
                    </h3>
                    <p className="text-xs font-medium text-[#7D5718]">
                      {selectedPolicyEntry.summary}
                    </p>
                    <ul className="space-y-2.5 pt-2 border-t border-[#F7E8C6] text-xs text-[#5E4346] leading-relaxed">
                      {selectedPolicyEntry.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2">
                          <Sparkles
                            className="w-3.5 h-3.5 text-[#B5832C] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-[#F7E8C6] border border-[#DFCCA6] p-3.5 text-[11px] text-[#4A0D1B] flex flex-wrap items-center justify-between gap-2">
                  <span>GSTIN: {BRAND_INFO.gstNumber} · Payments: {BRAND_INFO.paymentMethodsNote}</span>
                  <span>Delivery: {BRAND_INFO.deliveryLocations}</span>
                </div>
              </div>
            )}

            {/* CONTACT, STORE & WHATSAPP MODAL */}
            {activeModal === 'contact' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <LotusMotif className="w-9 h-6 shrink-0" color="#4A0D1B" accentColor="#B5832C" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                      PRIYONTOR KOLKATA &amp; CUSTOMER CARE
                    </p>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#241214]">
                      Store Details &amp; Contact Form
                    </h2>
                  </div>
                </div>

                <ContactStoreSection
                  compact
                  authUser={authUser}
                  authToken={authToken}
                />
              </div>
            )}

            {/* 4K THREAD MACRO MODAL */}
            {activeModal === 'macro' && (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                    4K THREAD &amp; TEXTURE INSPECTION
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
                    {macroProduct.fiberComposition}
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
                        {z}X ZOOM
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LOGIN, SIGNUP & PATRON ACCOUNT MODAL */}
            {(activeModal === 'login' || activeModal === 'signup' || activeModal === 'account') && (
              <div className="space-y-5">
                {authUser ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#4A0D1B] text-[#E5C37A] flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                          {authUser.memberTier}
                        </p>
                        <h2 className="font-serif text-2xl sm:text-3xl text-[#241214]">
                          {authUser.name}
                        </h2>
                        <p className="text-xs text-[#5E4346] mt-0.5">{authUser.email}</p>
                      </div>
                    </div>

                    <dl className="bg-[#FFFFFF] border border-[#DFCCA6] p-5 space-y-3 text-xs">
                      <div className="flex justify-between py-1 border-b border-[#F7E8C6]">
                        <dt className="text-[#5E4346]">City / Region</dt>
                        <dd className="font-semibold text-[#241214]">
                          {authUser.city || 'Kolkata / Worldwide'}
                        </dd>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F7E8C6]">
                        <dt className="text-[#5E4346]">Saved Wishlist Items</dt>
                        <dd className="font-semibold text-[#4A0D1B] tabular-nums">
                          {wishlistIds.length} Items
                        </dd>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F7E8C6]">
                        <dt className="text-[#5E4346]">Shopping Bag</dt>
                        <dd className="font-semibold text-[#241214] tabular-nums">
                          {bag.reduce((s, i) => s + i.quantity, 0)} Pieces
                        </dd>
                      </div>
                      <div className="flex justify-between py-1">
                        <dt className="text-[#5E4346]">Member Since</dt>
                        <dd className="font-mono text-[#241214]">
                          {new Date(authUser.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </dd>
                      </div>
                    </dl>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => onSwitchModal('wishlist')}
                        className="py-3 bg-[#FFFFFF] border border-[#DFCCA6] hover:border-[#4A0D1B] text-[#241214] text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[44px]"
                      >
                        VIEW WISHLIST ({wishlistIds.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => onSwitchModal('bag')}
                        className="py-3 bg-[#F7E8C6] border border-[#B5832C] hover:bg-[#EBD8AC] text-[#4A0D1B] text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[44px]"
                      >
                        OPEN SHOPPING BAG
                      </button>
                    </div>

                    {/* Recent Confirmed Orders */}
                    <div className="space-y-2.5 pt-2">
                      <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
                        RECENT CONFIRMED ORDERS ({patronOrders.length})
                      </p>
                      {patronOrders.length === 0 ? (
                        <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-4 text-xs text-[#5E4346]">
                          No confirmed orders yet. Orders placed while signed in appear here with dispatch details.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {patronOrders.map((ord) => (
                            <div
                              key={ord.id}
                              className="bg-[#FFFFFF] border border-[#DFCCA6] p-3.5 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="min-w-0">
                                <p className="font-mono font-semibold text-[#241214]">
                                  #{ord.orderNumber}
                                </p>
                                <p className="text-[11px] text-[#5E4346] truncate">
                                  {ord.items.reduce((s, i) => s + i.quantity, 0)} piece(s) ·{' '}
                                  {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-semibold text-[#4A0D1B] tabular-nums">
                                  {formatPrice(ord.totalINR, currency)}
                                </p>
                                <p className="text-[10px] uppercase tracking-[0.1em] text-[#164A37]">
                                  Confirmed
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#DFCCA6] flex items-center justify-between gap-4">
                      <p className="text-[11px] text-[#5E4346]">
                        Use code <strong>PRIYO5</strong> for 5% off your 1st order.
                      </p>
                      <button
                        type="button"
                        disabled={authLoading}
                        onClick={onLogout}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-[#4A0D1B] hover:bg-[#2F0710] disabled:opacity-60 text-[#FDF3DC] text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[44px] shrink-0"
                      >
                        <LogOut className="w-3.5 h-3.5 text-[#E5C37A]" aria-hidden="true" />
                        <span>{authLoading ? 'SIGNING OUT...' : 'LOG OUT'}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                        PRIYONTOR ACCOUNT
                      </p>
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#241214] mt-1">
                        {activeModal === 'signup'
                          ? 'Create Your Priyontor Account'
                          : 'Sign In to Priyontor'}
                      </h2>
                      <p className="text-xs text-[#5E4346] mt-1">
                        Save your favourite weaves, track deliveries, and redeem welcome privileges.
                      </p>
                    </div>

                    {/* Mode Switch Tabs */}
                    <div
                      role="tablist"
                      aria-label="Patron Authentication Mode"
                      className="grid grid-cols-2 border border-[#DFCCA6] bg-[#FFFFFF]"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeModal !== 'signup'}
                        onClick={() => onSwitchModal('login')}
                        className={`py-2.5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[40px] ${
                          activeModal !== 'signup'
                            ? 'bg-[#4A0D1B] text-[#FDF3DC]'
                            : 'text-[#5E4346] hover:text-[#241214]'
                        }`}
                      >
                        SIGN IN
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeModal === 'signup'}
                        onClick={() => onSwitchModal('signup')}
                        className={`py-2.5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[40px] ${
                          activeModal === 'signup'
                            ? 'bg-[#4A0D1B] text-[#FDF3DC]'
                            : 'text-[#5E4346] hover:text-[#241214]'
                        }`}
                      >
                        SIGN UP
                      </button>
                    </div>

                    {authError && (
                      <div
                        role="alert"
                        className="bg-[#F7E4E5] border border-[#D87277] px-4 py-3 text-xs text-[#4A0D1B] font-medium"
                      >
                        {authError}
                      </div>
                    )}

                    {activeModal === 'signup' ? (
                      <form onSubmit={handleSignupFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="signup-name"
                              className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                            >
                              FULL NAME
                            </label>
                            <input
                              id="signup-name"
                              type="text"
                              required
                              autoComplete="name"
                              value={signupName}
                              onChange={(e) => setSignupName(e.target.value)}
                              placeholder="Enter your full name"
                              className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3 py-2.5 text-xs text-[#241214] min-h-[42px]"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="signup-city"
                              className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                            >
                              CITY / LOCATION
                            </label>
                            <input
                              id="signup-city"
                              type="text"
                              value={signupCity}
                              onChange={(e) => setSignupCity(e.target.value)}
                              placeholder="Kolkata / London"
                              className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3 py-2.5 text-xs text-[#241214] min-h-[42px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="signup-email"
                            className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                          >
                            EMAIL ADDRESS
                          </label>
                          <input
                            id="signup-email"
                            type="email"
                            required
                            autoComplete="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3 py-2.5 text-xs text-[#241214] min-h-[42px]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="signup-password"
                              className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                            >
                              PASSWORD (MIN 8 CHARS)
                            </label>
                            <div className="relative">
                              <input
                                id="signup-password"
                                type={showSignupPassword ? 'text' : 'password'}
                                required
                                minLength={8}
                                autoComplete="new-password"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                className="w-full bg-[#FFFFFF] border border-[#DFCCA6] pl-3 pr-10 py-2.5 text-xs text-[#241214] min-h-[42px]"
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignupPassword((v) => !v)}
                                aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5E4346] hover:text-[#241214] p-1"
                              >
                                {showSignupPassword ? (
                                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                                ) : (
                                  <Eye className="w-4 h-4" aria-hidden="true" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="signup-confirm"
                              className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                            >
                              CONFIRM PASSWORD
                            </label>
                            <input
                              id="signup-confirm"
                              type={showSignupPassword ? 'text' : 'password'}
                              required
                              minLength={8}
                              autoComplete="new-password"
                              value={signupConfirm}
                              onChange={(e) => setSignupConfirm(e.target.value)}
                              placeholder="Repeat password"
                              className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3 py-2.5 text-xs text-[#241214] min-h-[42px]"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full py-3.5 bg-[#4A0D1B] hover:bg-[#2F0710] disabled:opacity-60 text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase min-h-[44px]"
                        >
                          {authLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleLoginFormSubmit} className="space-y-4">
                        <div>
                          <label
                            htmlFor="login-email"
                            className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                          >
                            EMAIL ADDRESS
                          </label>
                          <input
                            id="login-email"
                            type="email"
                            required
                            autoComplete="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3 py-2.5 text-xs text-[#241214] min-h-[42px]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="login-password"
                            className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                          >
                            PASSWORD
                          </label>
                          <div className="relative">
                            <input
                              id="login-password"
                              type={showLoginPassword ? 'text' : 'password'}
                              required
                              autoComplete="current-password"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              placeholder="Enter your password"
                              className="w-full bg-[#FFFFFF] border border-[#DFCCA6] pl-3 pr-10 py-2.5 text-xs text-[#241214] min-h-[42px]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowLoginPassword((v) => !v)}
                              aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5E4346] hover:text-[#241214] p-1"
                            >
                              {showLoginPassword ? (
                                <EyeOff className="w-4 h-4" aria-hidden="true" />
                              ) : (
                                <Eye className="w-4 h-4" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full py-3.5 bg-[#4A0D1B] hover:bg-[#2F0710] disabled:opacity-60 text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase min-h-[44px]"
                        >
                          {authLoading ? 'SIGNING IN...' : 'SIGN IN TO ACCOUNT'}
                        </button>

                        <p className="text-[11px] text-center text-[#5E4346] pt-1">
                          New to Priyontor?{' '}
                          <button
                            type="button"
                            onClick={() => onSwitchModal('signup')}
                            className="font-semibold text-[#4A0D1B] underline underline-offset-2"
                          >
                            Create an account
                          </button>
                        </p>
                      </form>
                    )}

                    <div className="pt-2 border-t border-[#DFCCA6] flex items-center gap-2 text-[11px] text-[#5E4346]">
                      <ShieldCheck className="w-4 h-4 text-[#7D5718] shrink-0" aria-hidden="true" />
                      <span>
                        Passwords use scrypt hashing with verified HTTP-only session cookies.
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
