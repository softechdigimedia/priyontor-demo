import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  Minus,
  Package,
  Plus,
  Printer,
  ShieldCheck,
  Smartphone,
  Tag,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { formatPrice } from '../data/archiveData';
import { BRAND_INFO } from '../data/priyontorInfo';
import { createOrder } from '../services/ordersApi';
import {
  AuthUser,
  BagItem,
  CurrencyCode,
  OrderRecord,
  PageRoute,
  PaymentMethodId,
  ShippingMethodId,
} from '../types/archive';
import { LotusMotif } from '../components/HeritageMotifs';
import { TextileArtwork } from '../components/TextileArtwork';

interface CheckoutPageProps {
  currency: CurrencyCode;
  bag: BagItem[];
  authUser: AuthUser | null;
  authToken: string | null;
  activePromoCode: string;
  onApplyPromoCode: (code: string) => void;
  onUpdateBagQty: (key: string, delta: number) => void;
  onRemoveBagItem: (key: string) => void;
  onClearBag: () => void;
  onNavigate: (page: PageRoute) => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onOpenAccount: () => void;
  onOrderConfirmed: (order: OrderRecord) => void;
}

const SHIPPING_OPTIONS: {
  id: ShippingMethodId;
  title: string;
  eta: string;
  detail: string;
  feeINR: number;
}[] = [
  {
    id: 'india-courier',
    title: 'India Insured Courier Delivery',
    eta: '4–7 Business Days',
    detail: 'Dispatched from our Newtown, Kolkata store across all Indian cities and states.',
    feeINR: 0,
  },
  {
    id: 'worldwide-courier',
    title: 'Worldwide Insured Air Delivery',
    eta: '7–14 Business Days',
    detail:
      'Tracked international dispatch from Kolkata to UK, USA, UAE, Europe & global destinations (Complimentary on ₹20,000+).',
    feeINR: 1500,
  },
  {
    id: 'kolkata-store-pickup',
    title: 'Newtown, Kolkata Store Pick-Up',
    eta: 'Ready in 48 Hours',
    detail: `Collect from ${BRAND_INFO.storeAddress} (10% discount on 1st physical store purchase).`,
    feeINR: 0,
  },
];

function detectCardBrand(digits: string): string {
  if (/^4/.test(digits)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^(60|65|81|82|508)/.test(digits)) return 'RuPay';
  return 'Card';
}

function formatCardInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiryInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  currency,
  bag,
  authUser,
  authToken,
  activePromoCode,
  onApplyPromoCode,
  onUpdateBagQty,
  onRemoveBagItem,
  onClearBag,
  onNavigate,
  onOpenLogin,
  onOpenSignup,
  onOpenAccount,
  onOrderConfirmed,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Promo input
  const [promoInput, setPromoInput] = useState(activePromoCode);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  // Step 1: Delivery & Transit state
  const [fullName, setFullName] = useState(authUser?.name ?? '');
  const [email, setEmail] = useState(authUser?.email ?? '');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState(authUser?.city?.split('/')[0]?.trim() ?? 'Kolkata');
  const [stateName, setStateName] = useState('West Bengal');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>('india-courier');

  // Step 2: Payment (UPI & Card ONLY) & Dedication state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('card');
  const [cardName, setCardName] = useState(authUser?.name ?? '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [dedicationNote, setDedicationNote] = useState('');

  useEffect(() => {
    setPromoInput(activePromoCode);
  }, [activePromoCode]);

  useEffect(() => {
    if (authUser) {
      setFullName((prev) => prev || authUser.name);
      setEmail((prev) => prev || authUser.email);
      setCardName((prev) => prev || authUser.name);
      if (authUser.city) {
        setCity((prev) => prev || authUser.city!.split('/')[0].trim());
      }
    }
  }, [authUser]);

  const subtotalINR = bag.reduce((sum, item) => sum + item.unitPriceINR * item.quantity, 0);

  // Mirror server-authoritative discount math
  const normalizedPromo = activePromoCode.trim().toUpperCase();
  const qualifiesBulkDiscount = subtotalINR >= BRAND_INFO.bulkThresholdINR;
  const qualifiesWelcomePromo = !qualifiesBulkDiscount && normalizedPromo === BRAND_INFO.welcomePromoCode;
  const discountAmountINR = qualifiesBulkDiscount
    ? Math.round(subtotalINR * 0.1)
    : qualifiesWelcomePromo
    ? Math.round(subtotalINR * 0.05)
    : 0;
  const discountLabel = qualifiesBulkDiscount
    ? '10% Discount on Purchase of ₹20,000+'
    : qualifiesWelcomePromo
    ? '5% Welcome Discount on 1st Order (PRIYO5)'
    : null;

  const selectedShipping =
    SHIPPING_OPTIONS.find((opt) => opt.id === shippingMethod) ?? SHIPPING_OPTIONS[0];
  const shippingFeeINR =
    shippingMethod === 'worldwide-courier' && qualifiesBulkDiscount ? 0 : selectedShipping.feeINR;

  const totalINR = Math.max(0, subtotalINR - discountAmountINR + shippingFeeINR);

  const handleApplyPromo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) {
      onApplyPromoCode('');
      setPromoFeedback(null);
      return;
    }
    if (cleaned === BRAND_INFO.welcomePromoCode) {
      onApplyPromoCode(BRAND_INFO.welcomePromoCode);
      setPromoFeedback(
        qualifiesBulkDiscount
          ? 'PRIYO5 saved — 10% bulk discount (₹20,000+) already applies automatically.'
          : 'Code PRIYO5 applied: 5% Welcome Discount on your 1st Order.'
      );
    } else {
      setPromoFeedback('Invalid code. Use PRIYO5 for 5% off your 1st order.');
    }
  };

  const validateStep1 = (): boolean => {
    setErrorMsg(null);
    if (fullName.trim().length < 2) {
      setErrorMsg('Please enter the recipient full name.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address for order & dispatch confirmation.');
      return false;
    }
    if (!/^[+\d\s()-]{7,24}$/.test(phone.trim())) {
      setErrorMsg('Please enter a valid contact phone number for delivery coordination.');
      return false;
    }
    if (
      addressLine1.trim().length < 4 ||
      city.trim().length < 2 ||
      stateName.trim().length < 2 ||
      postalCode.trim().length < 3 ||
      country.trim().length < 2
    ) {
      setErrorMsg('Please complete street address, city, state, postal code, and country.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    setErrorMsg(null);
    if (paymentMethod === 'card') {
      const digits = cardNumber.replace(/\D/g, '');
      if (cardName.trim().length < 2) {
        setErrorMsg('Please enter the cardholder name.');
        return false;
      }
      if (digits.length < 13 || digits.length > 16) {
        setErrorMsg('Please enter a valid 13 to 16 digit card number.');
        return false;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.trim())) {
        setErrorMsg('Please enter a valid expiry date in MM/YY format.');
        return false;
      }
      if (!/^\d{3,4}$/.test(cardCvv.trim())) {
        setErrorMsg('Please enter a valid 3 or 4 digit security code.');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!/^[a-zA-Z0-9._-]{2,64}@[a-zA-Z0-9.-]{2,32}$/.test(upiId.trim())) {
        setErrorMsg('Please enter a valid UPI ID (for example, priyanka@okaxis).');
        return false;
      }
    }
    return true;
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContinueToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep1() || !validateStep2()) return;
    setErrorMsg(null);
    setSubmitting(true);

    const digits = cardNumber.replace(/\D/g, '');
    const paymentMeta =
      paymentMethod === 'card'
        ? {
            cardBrand: detectCardBrand(digits),
            cardLast4: digits.slice(-4),
          }
        : { upiId: upiId.trim() };

    try {
      const order = await createOrder(authToken, {
        currency,
        shippingAddress: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim() || undefined,
          city: city.trim(),
          state: stateName.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
        },
        shippingMethod,
        paymentMethod,
        paymentMeta,
        promoCode: normalizedPromo || undefined,
        dedicationNote: dedicationNote.trim() || undefined,
        items: bag.map((item) => ({
          productId: item.product.id,
          selectedSize: item.selectedSize,
          colorway: item.colorway,
          pleatArchitecture: item.pleatArchitecture,
          fallPico: item.fallPico,
          blouseTailoring: item.blouseTailoring,
          quantity: item.quantity,
        })),
      });

      setConfirmedOrder(order);
      onClearBag();
      onOrderConfirmed(order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to confirm your order right now.');
    } finally {
      setSubmitting(false);
    }
  };

  // CONFIRMED ORDER RECEIPT STATE
  if (confirmedOrder) {
    return (
      <div className="bg-[#FDF3DC] py-10 sm:py-14">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DFCCA6] pb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#164A37]/10 border border-[#164A37]/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#164A37]" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <LotusMotif className="w-5 h-4" color="#B5832C" accentColor="#D87277" />
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#164A37]">
                      PRIYONTOR ORDER CONFIRMED
                    </p>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-4xl text-[#241214] mt-1">
                    Order #{confirmedOrder.orderNumber} Confirmed
                  </h1>
                  <p className="text-xs text-[#5E4346] mt-1">
                    {confirmedOrder.estimatedDispatch}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#DFCCA6] hover:border-[#4A0D1B] text-[#241214] text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[42px] shrink-0"
              >
                <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                <span>PRINT RECEIPT</span>
              </button>
            </div>

            {/* Address & Settlement Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FDF3DC]/60 border border-[#DFCCA6] p-5 space-y-2 text-xs">
                <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
                  DELIVERY DESTINATION &amp; TRANSIT
                </p>
                <p className="font-serif text-lg text-[#241214]">
                  {confirmedOrder.shippingAddress.fullName}
                </p>
                <p className="text-[#5E4346] leading-relaxed">
                  {confirmedOrder.shippingAddress.addressLine1}
                  {confirmedOrder.shippingAddress.addressLine2
                    ? `, ${confirmedOrder.shippingAddress.addressLine2}`
                    : ''}
                  <br />
                  {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state}{' '}
                  {confirmedOrder.shippingAddress.postalCode}
                  <br />
                  {confirmedOrder.shippingAddress.country}
                </p>
                <p className="text-[#241214] pt-1">
                  {confirmedOrder.shippingAddress.phone} · {confirmedOrder.shippingAddress.email}
                </p>
                <p className="pt-2 border-t border-[#DFCCA6] font-medium text-[#4A0D1B]">
                  {confirmedOrder.shippingLabel}
                </p>
              </div>

              <div className="bg-[#FDF3DC]/60 border border-[#DFCCA6] p-5 space-y-2 text-xs">
                <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
                  PAYMENT &amp; TAX LEDGER
                </p>
                <p className="font-semibold text-[#241214]">{confirmedOrder.paymentSummary}</p>
                <p className="text-[#5E4346]">
                  Placed on{' '}
                  {new Date(confirmedOrder.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p className="text-[#5E4346]">
                  GST NO: <span className="font-mono text-[#241214]">{BRAND_INFO.gstNumber}</span>
                </p>
                {confirmedOrder.dedicationNote && (
                  <p className="pt-2 border-t border-[#DFCCA6] text-[#5E4346] italic">
                    Gift / Care Note: &ldquo;{confirmedOrder.dedicationNote}&rdquo;
                  </p>
                )}
                <div className="pt-2 border-t border-[#DFCCA6] flex items-start gap-2 text-[#164A37] font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Support: {BRAND_INFO.supportNumbers.join(' / ')} · WhatsApp:{' '}
                    {BRAND_INFO.whatsappNumbers.join(' / ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Receipt */}
            <div className="space-y-3">
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#7D5718]">
                ORDERED GARMENTS ({confirmedOrder.items.reduce((s, i) => s + i.quantity, 0)})
              </p>
              <div className="divide-y divide-[#DFCCA6] border border-[#DFCCA6]">
                {confirmedOrder.items.map((item, idx) => (
                  <div
                    key={`${item.productId}-${idx}`}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 aspect-[3/4] shrink-0 border border-[#F7E8C6] overflow-hidden">
                        <TextileArtwork
                          artworkId={item.artworkId}
                          alt={item.title}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                          {item.originBadge} · {item.archiveRef}
                        </p>
                        <h2 className="font-serif text-lg text-[#241214]">{item.title}</h2>
                        <p className="text-xs text-[#5E4346]">
                          Size: <strong className="text-[#241214]">{item.selectedSize}</strong> ·{' '}
                          {item.colorway} ·{' '}
                          {item.pleatArchitecture === 'pre-pleated'
                            ? 'Pre-Pleated'
                            : 'Traditional Unstitched'}
                          {item.fallPico ? ' · Fall & Pico' : ''}
                          {item.blouseTailoring ? ' · Blouse Stitching (+₹1,200)' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-xs text-[#5E4346] tabular-nums">Qty {item.quantity}</p>
                      <p className="font-serif text-lg text-[#241214] tabular-nums">
                        {formatPrice(item.lineTotalINR, currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="bg-[#F7E8C6]/70 border border-[#DFCCA6] p-5 space-y-2.5 text-xs">
              <div className="flex justify-between text-[#5E4346]">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-[#241214]">
                  {formatPrice(confirmedOrder.subtotalINR, currency)}
                </span>
              </div>
              {confirmedOrder.discountAmountINR > 0 && (
                <div className="flex justify-between text-[#164A37] font-semibold">
                  <span>{confirmedOrder.discountLabel || 'Priyontor Privilege Discount'}</span>
                  <span className="tabular-nums">
                    -{formatPrice(confirmedOrder.discountAmountINR, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#5E4346]">
                <span>{confirmedOrder.shippingLabel}</span>
                <span className="tabular-nums font-semibold text-[#164A37]">
                  {confirmedOrder.shippingFeeINR === 0
                    ? 'COMPLIMENTARY'
                    : formatPrice(confirmedOrder.shippingFeeINR, currency)}
                </span>
              </div>
              <div className="pt-3 border-t border-[#DFCCA6] flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[#241214]">
                  TOTAL PAID ({confirmedOrder.paymentMethod.toUpperCase()})
                </span>
                <span className="font-serif text-2xl sm:text-3xl text-[#4A0D1B] tabular-nums">
                  {formatPrice(confirmedOrder.totalINR, currency)}
                </span>
              </div>
            </div>

            {/* Post-Order Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              {authUser ? (
                <button
                  type="button"
                  onClick={onOpenAccount}
                  className="px-6 py-3.5 border border-[#4A0D1B] text-[#4A0D1B] hover:bg-[#F7E8C6] text-[11px] font-semibold tracking-[0.15em] uppercase min-h-[46px]"
                >
                  VIEW ORDER IN ACCOUNT
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="px-6 py-3.5 border border-[#DFCCA6] text-[#241214] hover:border-[#4A0D1B] text-[11px] font-semibold tracking-[0.15em] uppercase min-h-[46px]"
                >
                  RETURN TO HOME
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate('collections')}
                className="px-7 py-3.5 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase min-h-[46px]"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY BAG GUARD
  if (bag.length === 0) {
    return (
      <div className="bg-[#FDF3DC] py-16 sm:py-24">
        <div className="max-w-xl mx-auto px-4 text-center space-y-5 bg-[#FFFFFF] border border-[#DFCCA6] p-8 sm:p-12">
          <Package className="w-10 h-10 text-[#7D5718] mx-auto" aria-hidden="true" />
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
            PRIYONTOR SHOPPING BAG
          </p>
          <h1 className="font-serif text-3xl text-[#241214]">Your shopping bag is empty</h1>
          <p className="text-sm text-[#5E4346] leading-relaxed">
            Explore our 12 state-wise traditional sarees, designer drapes, mens&apos; ethnic
            Punjabis, blouses, women&apos;s breathable sets, and kids&apos; ethnic wear.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('collections')}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase min-h-[46px]"
            >
              SHOP COLLECTIONS
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-7 py-3.5 border border-[#DFCCA6] hover:border-[#4A0D1B] text-[#241214] text-[11px] font-semibold tracking-[0.16em] uppercase min-h-[46px]"
            >
              RETURN HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPieceCount = bag.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="bg-[#FDF3DC] py-8 sm:py-12">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Breadcrumb & Back */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DFCCA6] pb-5">
          <div>
            <nav
              aria-label="Checkout Breadcrumb"
              className="text-[10px] tracking-[0.16em] uppercase text-[#7D5718]"
            >
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-[#4A0D1B]"
              >
                HOME
              </button>
              <span className="mx-2">/</span>
              <button
                type="button"
                onClick={() => onNavigate('collections')}
                className="hover:text-[#4A0D1B]"
              >
                COLLECTIONS
              </button>
              <span className="mx-2">/</span>
              <span className="text-[#4A0D1B] font-semibold">CHECKOUT</span>
            </nav>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#241214] mt-1.5">
              Complete Your Priyontor Order
            </h1>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('collections')}
            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4A0D1B] hover:text-[#7D5718] min-h-[40px] self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>CONTINUE SHOPPING</span>
          </button>
        </div>

        {/* Step Indicator */}
        <ol
          aria-label="Checkout Steps"
          className="grid grid-cols-3 border border-[#DFCCA6] bg-[#FFFFFF]"
        >
          {[
            { num: 1 as const, label: '01. Delivery' },
            { num: 2 as const, label: '02. UPI / Card Payment' },
            { num: 3 as const, label: '03. Review & Place Order' },
          ].map((item) => {
            const isActive = step === item.num;
            const isCompleted = step > item.num;
            const canClick = item.num < step;
            return (
              <li key={item.num} className="border-r last:border-r-0 border-[#DFCCA6]">
                <button
                  type="button"
                  disabled={!canClick && !isActive}
                  onClick={() => canClick && setStep(item.num)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`w-full px-3 sm:px-5 py-3.5 text-left flex items-center justify-between gap-2 transition-colors min-h-[48px] ${
                    isActive
                      ? 'bg-[#4A0D1B] text-[#FDF3DC]'
                      : isCompleted
                      ? 'bg-[#F7E8C6]/60 text-[#241214] hover:bg-[#F7E8C6]'
                      : 'bg-[#FFFFFF] text-[#5E4346]/70 cursor-default'
                  }`}
                >
                  <span className="text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase truncate">
                    {item.label}
                  </span>
                  {isCompleted && (
                    <Check className="w-4 h-4 text-[#164A37] shrink-0" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        {/* Main 12-Col Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Interactive Step Forms */}
          <div className="lg:col-span-7 space-y-6">
            {/* Account Context Card */}
            {authUser ? (
              <div className="bg-[#FFFFFF] border border-[#DFCCA6] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#4A0D1B] text-[#E5C37A] flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-[#241214]">
                      Signed in as {authUser.name} ({authUser.email})
                    </p>
                    <p className="text-[#5E4346]">
                      Your order confirmation will be saved automatically in your Priyontor Account.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#FFFFFF] border border-[#DFCCA6] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <p className="font-semibold text-[#241214]">Checking out as Guest</p>
                  <p className="text-[#5E4346]">
                    Sign in or create an account to save this order in your history.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="px-3.5 py-2 border border-[#DFCCA6] hover:border-[#4A0D1B] text-[#4A0D1B] text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[38px]"
                  >
                    SIGN IN
                  </button>
                  <button
                    type="button"
                    onClick={onOpenSignup}
                    className="px-3.5 py-2 bg-[#F7E8C6] border border-[#B5832C] hover:bg-[#EBD8AC] text-[#4A0D1B] text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[38px]"
                  >
                    SIGN UP
                  </button>
                </div>
              </div>
            )}

            {/* Global Step Validation Banner */}
            {errorMsg && (
              <div
                role="alert"
                className="bg-[#F7E4E5] border border-[#D87277] px-4 py-3 text-xs text-[#4A0D1B] font-medium"
              >
                {errorMsg}
              </div>
            )}

            {/* STEP 1: DELIVERY & TRANSIT */}
            {step === 1 && (
              <form
                onSubmit={handleContinueToPayment}
                className="bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-8 space-y-6"
              >
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                    STEP 01 OF 03 · DELIVERY ACROSS INDIA &amp; WORLDWIDE
                  </p>
                  <h2 className="font-serif text-2xl text-[#241214] mt-1">
                    Delivery Address &amp; Shipping Option
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="chk-fullname"
                      className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                    >
                      RECIPIENT FULL NAME *
                    </label>
                    <input
                      id="chk-fullname"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mrs. Priyanka Ganguly Sabui"
                      className="w-full bg-[#FDF3DC]/40 border border-[#DFCCA6] px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="chk-email"
                      className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                    >
                      EMAIL ADDRESS *
                    </label>
                    <input
                      id="chk-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#FDF3DC]/40 border border-[#DFCCA6] px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="chk-phone"
                      className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                    >
                      PHONE / WHATSAPP NUMBER *
                    </label>
                    <input
                      id="chk-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98318 09747"
                      className="w-full bg-[#FDF3DC]/40 border border-[#DFCCA6] px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="chk-country"
                      className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                    >
                      DESTINATION COUNTRY *
                    </label>
                    <select
                      id="chk-country"
                      autoComplete="country-name"
                      value={country}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCountry(val);
                        if (val !== 'India' && shippingMethod === 'india-courier') {
                          setShippingMethod('worldwide-courier');
                        } else if (val === 'India' && shippingMethod === 'worldwide-courier') {
                          setShippingMethod('india-courier');
                        }
                      }}
                      className="w-full bg-[#FDF3DC]/40 border border-[#DFCCA6] px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                    >
                      <option value="India">India</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Singapore">Singapore</option>
                      <option value="France">France</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="chk-addr1"
                    className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                  >
                    STREET ADDRESS *
                  </label>
                  <input
                    id="chk-addr1"
                    type="text"
                    required
                    autoComplete="address-line1"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House / Flat No., Building, Street, Locality"
                    className="w-full bg-[#FDF3DC]/40 border border-[#DFCCA6] px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="chk-addr2"
                    className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                  >
                    APARTMENT, FLOOR OR LANDMARK (OPTIONAL)
                  </label>
                  <input
                    id="chk-addr2"
                    type="text"
                    autoComplete="address-line2"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Floor, Block, or Nearby Landmark"
                    className="w-full bg-[#FDF3DC]/40 border border-[#DFCCA6] px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="chk-city"
                      className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                    >
                      CITY *
                    </label>
                    <input
                      id="chk-city"
                      type="text"
                      required
                      autoComplete="address-level2"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kolkata"
                      className="w-full bg-[#FDF3DC]/40 border border-[#DFCCA6] px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="chk-state"
                      className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                    >
                      STATE / REGION *
                    </label>
                    <input
                      id="chk-state"
                      type="text"
                      required
                      autoComplete="address-level1"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="West Bengal"
                      className="w-full bg-[#FDF3DC]/40 border border-[#DFCCA6] px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="chk-postal"
                      className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                    >
                      PIN / POSTAL CODE *
                    </label>
                    <input
                      id="chk-postal"
                      type="text"
                      required
                      autoComplete="postal-code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="700161"
                      className="w-full bg-[#FDF3DC]/40 border border-[#DFCCA6] px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Delivery Method Selection */}
                <fieldset className="space-y-3 pt-2 border-t border-[#DFCCA6]">
                  <legend className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#7D5718] mb-2">
                    SELECT DELIVERY METHOD
                  </legend>
                  <div className="space-y-3">
                    {SHIPPING_OPTIONS.map((opt) => {
                      const active = shippingMethod === opt.id;
                      const effectiveFee =
                        opt.id === 'worldwide-courier' && qualifiesBulkDiscount ? 0 : opt.feeINR;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-colors ${
                            active
                              ? 'border-[#4A0D1B] bg-[#FDF3DC]/70'
                              : 'border-[#DFCCA6] bg-[#FFFFFF] hover:border-[#B5832C]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping-method"
                            value={opt.id}
                            checked={active}
                            onChange={() => setShippingMethod(opt.id)}
                            className="mt-1 accent-[#4A0D1B]"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-serif text-base text-[#241214] font-medium">
                                {opt.title}
                              </span>
                              <span className="text-xs font-semibold tabular-nums text-[#164A37]">
                                {effectiveFee === 0
                                  ? 'COMPLIMENTARY'
                                  : `+${formatPrice(effectiveFee, currency)}`}
                              </span>
                            </div>
                            <p className="text-[11px] font-semibold text-[#7D5718] mt-0.5">
                              {opt.eta}
                            </p>
                            <p className="text-xs text-[#5E4346] mt-1 leading-relaxed">
                              {opt.detail}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[46px]"
                  >
                    <span>CONTINUE TO PAYMENT</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT (UPI & CARD ONLY) & NOTE */}
            {step === 2 && (
              <form
                onSubmit={handleContinueToReview}
                className="bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-8 space-y-6"
              >
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                    STEP 02 OF 03 · {BRAND_INFO.paymentMethodsNote.toUpperCase()}
                  </p>
                  <h2 className="font-serif text-2xl text-[#241214] mt-1">
                    Payment Method — UPI or Card Only
                  </h2>
                  <p className="text-xs text-[#5E4346] mt-1">
                    Payment Methods Supported: UPI &amp; Card Payment Only. Cash on Delivery is not
                    supported.
                  </p>
                </div>

                {/* Payment Method Selector */}
                <fieldset className="space-y-3">
                  <legend className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#5E4346] mb-1">
                    CHOOSE PAYMENT METHOD
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: 'card' as const,
                        label: 'Credit / Debit Card',
                        sub: 'Visa, Mastercard, RuPay, Amex',
                        icon: CreditCard,
                      },
                      {
                        id: 'upi' as const,
                        label: 'UPI Payment',
                        sub: 'GPay, PhonePe, Paytm, BHIM UPI',
                        icon: Smartphone,
                      },
                    ].map((pm) => {
                      const Icon = pm.icon;
                      const active = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => {
                            setPaymentMethod(pm.id);
                            setErrorMsg(null);
                          }}
                          className={`p-4 border text-left flex items-start gap-3 transition-colors min-h-[76px] ${
                            active
                              ? 'border-[#4A0D1B] bg-[#FDF3DC]/80'
                              : 'border-[#DFCCA6] bg-[#FFFFFF] hover:border-[#B5832C]'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 mt-0.5 shrink-0 ${
                              active ? 'text-[#4A0D1B]' : 'text-[#7D5718]'
                            }`}
                            aria-hidden="true"
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#241214]">{pm.label}</p>
                            <p className="text-[11px] text-[#5E4346] mt-0.5">{pm.sub}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Contextual Payment Fields */}
                {paymentMethod === 'card' && (
                  <div className="bg-[#FDF3DC]/50 border border-[#DFCCA6] p-5 space-y-4">
                    <div className="flex items-center justify-between text-[11px] text-[#5E4346]">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#241214]">
                        <Lock className="w-3.5 h-3.5 text-[#7D5718]" aria-hidden="true" />
                        Secure Card Payment — Only last 4 digits appear on your receipt
                      </span>
                    </div>

                    <div>
                      <label
                        htmlFor="chk-card-name"
                        className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                      >
                        CARDHOLDER NAME *
                      </label>
                      <input
                        id="chk-card-name"
                        type="text"
                        required
                        autoComplete="cc-name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on card"
                        className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="chk-card-num"
                        className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                      >
                        CARD NUMBER *
                      </label>
                      <input
                        id="chk-card-num"
                        type="text"
                        inputMode="numeric"
                        required
                        autoComplete="cc-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3.5 py-2.5 text-sm font-mono text-[#241214] min-h-[44px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="chk-card-exp"
                          className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                        >
                          EXPIRY (MM/YY) *
                        </label>
                        <input
                          id="chk-card-exp"
                          type="text"
                          inputMode="numeric"
                          required
                          autoComplete="cc-exp"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiryInput(e.target.value))}
                          placeholder="08/29"
                          className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3.5 py-2.5 text-sm font-mono text-[#241214] min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="chk-card-cvv"
                          className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                        >
                          SECURITY CODE (CVV) *
                        </label>
                        <input
                          id="chk-card-cvv"
                          type="password"
                          inputMode="numeric"
                          required
                          maxLength={4}
                          autoComplete="cc-csc"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="•••"
                          className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3.5 py-2.5 text-sm font-mono text-[#241214] min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="bg-[#FDF3DC]/50 border border-[#DFCCA6] p-5 space-y-3">
                    <label
                      htmlFor="chk-upi"
                      className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346]"
                    >
                      VERIFIED UPI ID *
                    </label>
                    <input
                      id="chk-upi"
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@okaxis"
                      className="w-full bg-[#FFFFFF] border border-[#DFCCA6] px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                    />
                    <p className="text-xs text-[#5E4346]">
                      UPI instant authorization is linked to your confirmed Priyontor order number.
                    </p>
                  </div>
                )}

                {/* Gift / Delivery Note */}
                <div className="pt-2 border-t border-[#DFCCA6]">
                  <label
                    htmlFor="chk-dedication"
                    className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                  >
                    GIFT OR DELIVERY NOTE (OPTIONAL)
                  </label>
                  <textarea
                    id="chk-dedication"
                    rows={2}
                    maxLength={160}
                    value={dedicationNote}
                    onChange={(e) => setDedicationNote(e.target.value)}
                    placeholder="Optional note for your gift box or delivery instructions..."
                    className="w-full bg-[#FDF3DC]/40 border border-[#DFCCA6] px-3.5 py-2.5 text-xs text-[#241214]"
                  />
                </div>

                <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#DFCCA6] hover:border-[#4A0D1B] text-[#241214] text-[11px] font-semibold tracking-[0.15em] uppercase min-h-[46px]"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>BACK TO DELIVERY</span>
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[46px]"
                  >
                    <span>REVIEW ORDER</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: REVIEW & CONFIRM */}
            {step === 3 && (
              <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-8 space-y-6">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                    STEP 03 OF 03
                  </p>
                  <h2 className="font-serif text-2xl text-[#241214] mt-1">
                    Review &amp; Confirm Priyontor Order
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-[#DFCCA6] bg-[#FDF3DC]/40 p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                        DELIVERY DETAILS
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[10px] font-semibold text-[#4A0D1B] underline underline-offset-2"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-semibold text-[#241214]">{fullName}</p>
                    <p className="text-[#5E4346]">
                      {addressLine1}
                      {addressLine2 ? `, ${addressLine2}` : ''}, {city}, {stateName} {postalCode},{' '}
                      {country}
                    </p>
                    <p className="text-[#5E4346]">
                      {phone} · {email}
                    </p>
                    <p className="pt-1 font-medium text-[#4A0D1B]">{selectedShipping.title}</p>
                  </div>

                  <div className="border border-[#DFCCA6] bg-[#FDF3DC]/40 p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                        PAYMENT (UPI / CARD ONLY)
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-[10px] font-semibold text-[#4A0D1B] underline underline-offset-2"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-semibold text-[#241214]">
                      {paymentMethod === 'card'
                        ? `${detectCardBrand(cardNumber.replace(/\D/g, ''))} ending in •••• ${cardNumber
                            .replace(/\D/g, '')
                            .slice(-4)}`
                        : `UPI (${upiId.trim()})`}
                    </p>
                    <p className="text-[#5E4346]">
                      {dedicationNote.trim()
                        ? `Note: "${dedicationNote.trim()}"`
                        : 'No custom note added.'}
                    </p>
                    {discountLabel && (
                      <p className="text-[#164A37] font-semibold pt-1">{discountLabel}</p>
                    )}
                  </div>
                </div>

                {/* Final Items Verification */}
                <div className="space-y-3">
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#5E4346]">
                    GARMENT REVIEW ({totalPieceCount} ITEM{totalPieceCount > 1 ? 'S' : ''})
                  </p>
                  <div className="divide-y divide-[#DFCCA6] border border-[#DFCCA6]">
                    {bag.map((item) => (
                      <div key={item.key} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-12 aspect-[3/4] shrink-0 border border-[#F7E8C6] overflow-hidden">
                            <TextileArtwork
                              artworkId={item.product.artworkId}
                              alt={item.product.title}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif text-base text-[#241214] truncate">
                              {item.product.title}
                            </p>
                            <p className="text-[11px] text-[#5E4346]">
                              Size: <strong className="text-[#241214]">{item.selectedSize}</strong>{' '}
                              · {item.colorway} · Qty {item.quantity} ·{' '}
                              {item.pleatArchitecture === 'pre-pleated'
                                ? 'Pre-Pleated'
                                : 'Traditional Unstitched'}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#241214] tabular-nums shrink-0">
                          {formatPrice(item.unitPriceINR * item.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setStep(2)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#DFCCA6] hover:border-[#4A0D1B] text-[#241214] text-[11px] font-semibold tracking-[0.15em] uppercase min-h-[46px]"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>BACK TO PAYMENT</span>
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handlePlaceOrder}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#4A0D1B] hover:bg-[#2F0710] disabled:opacity-60 text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[48px]"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#E5C37A]" aria-hidden="true" />
                    <span>
                      {submitting
                        ? 'CONFIRMING YOUR ORDER...'
                        : `CONFIRM & PAY — ${formatPrice(totalINR, currency)}`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sticky Order Summary & Promo Box */}
          <aside className="lg:col-span-5 lg:sticky lg:top-16 space-y-5">
            <div className="bg-[#FFFFFF] border border-[#DFCCA6] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#DFCCA6] pb-3">
                <h2 className="font-serif text-xl text-[#241214]">
                  Order Summary ({totalPieceCount})
                </h2>
                <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]">
                  PRIYONTOR
                </span>
              </div>

              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                {bag.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-3.5 pb-4 border-b border-[#F7E8C6] last:border-b-0 last:pb-0"
                  >
                    <div className="w-16 aspect-[3/4] shrink-0 border border-[#F7E8C6] overflow-hidden">
                      <TextileArtwork
                        artworkId={item.product.artworkId}
                        alt={item.product.title}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-serif text-sm text-[#241214] leading-snug">
                          {item.product.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => onRemoveBagItem(item.key)}
                          aria-label={`Remove ${item.product.title}`}
                          className="text-[#5E4346] hover:text-[#4A0D1B] p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-[#7D5718]">
                        Size: {item.selectedSize} · {item.colorway}
                      </p>
                      <p className="text-[11px] text-[#5E4346]">
                        {item.pleatArchitecture === 'pre-pleated' ? 'Pre-Pleated' : 'Traditional'}
                        {item.fallPico ? ' · Fall & Pico' : ''}
                        {item.blouseTailoring ? ' · Blouse Stitching (+₹1,200)' : ''}
                      </p>
                      <div className="pt-1.5 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#DFCCA6]">
                          <button
                            type="button"
                            onClick={() => onUpdateBagQty(item.key, -1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#241214]"
                          >
                            <Minus className="w-3 h-3" aria-hidden="true" />
                          </button>
                          <span className="px-2 text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateBagQty(item.key, 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#241214]"
                          >
                            <Plus className="w-3 h-3" aria-hidden="true" />
                          </button>
                        </div>
                        <span className="text-xs font-semibold text-[#241214] tabular-nums">
                          {formatPrice(item.unitPriceINR * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code & Discounts */}
              <form onSubmit={handleApplyPromo} className="space-y-2 border-t border-[#DFCCA6] pt-4">
                <label
                  htmlFor="chk-promo"
                  className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#7D5718]"
                >
                  <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>PROMO CODE (PRIYO5 FOR 5% OFF 1ST ORDER)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="chk-promo"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter PRIYO5"
                    className="flex-1 bg-[#FDF3DC]/50 border border-[#DFCCA6] px-3 py-2 text-xs font-mono uppercase text-[#241214] min-h-[40px]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[40px]"
                  >
                    APPLY
                  </button>
                </div>
                {promoFeedback && (
                  <p className="text-[11px] text-[#164A37] font-medium">{promoFeedback}</p>
                )}
              </form>

              {/* Totals */}
              <div className="bg-[#F7E8C6]/70 border border-[#DFCCA6] p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#5E4346]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#241214] tabular-nums">
                    {formatPrice(subtotalINR, currency)}
                  </span>
                </div>
                {discountAmountINR > 0 && (
                  <div className="flex justify-between text-[#164A37] font-semibold">
                    <span>{discountLabel}</span>
                    <span className="tabular-nums">
                      -{formatPrice(discountAmountINR, currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#5E4346]">
                  <span>{selectedShipping.title}</span>
                  <span className="font-semibold text-[#164A37] tabular-nums">
                    {shippingFeeINR === 0 ? 'COMPLIMENTARY' : formatPrice(shippingFeeINR, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-[#5E4346]">
                  <span>GST ({BRAND_INFO.gstNumber})</span>
                  <span className="text-[#241214]">Included</span>
                </div>
                <div className="pt-2.5 border-t border-[#DFCCA6] flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[#241214]">
                    ORDER TOTAL
                  </span>
                  <span className="font-serif text-2xl text-[#4A0D1B] tabular-nums">
                    {formatPrice(totalINR, currency)}
                  </span>
                </div>
                {!qualifiesBulkDiscount && subtotalINR > 0 && (
                  <p className="text-[11px] text-[#7D5718]">
                    Add {formatPrice(BRAND_INFO.bulkThresholdINR - subtotalINR, currency)} more to
                    unlock <strong>10% Off ₹20,000+</strong> &amp; complimentary worldwide courier.
                  </p>
                )}
              </div>

              {/* Trust & Store Note */}
              <div className="space-y-2 text-[11px] text-[#5E4346] pt-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7D5718] shrink-0" aria-hidden="true" />
                  <span>UPI &amp; Card Payments Only · 7-Day Return &amp; Exchange</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7D5718] shrink-0" aria-hidden="true" />
                  <span>Shipping Across {BRAND_INFO.deliveryLocations}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
