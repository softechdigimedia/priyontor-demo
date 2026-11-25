import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { BRAND_INFO, INQUIRY_TOPICS } from '../data/priyontorInfo';
import { ContactInquiryReceipt, submitContactInquiry } from '../services/contactApi';
import { AuthUser } from '../types/archive';
import { BenarasGhatMotif, LotusMotif } from './HeritageMotifs';

interface ContactStoreSectionProps {
  id?: string;
  authUser?: AuthUser | null;
  authToken?: string | null;
  compact?: boolean;
  onInquirySubmitted?: (receipt: ContactInquiryReceipt) => void;
}

export const ContactStoreSection: React.FC<ContactStoreSectionProps> = ({
  id = 'contact-store',
  authUser = null,
  authToken = null,
  compact = false,
  onInquirySubmitted,
}) => {
  const [fullName, setFullName] = useState(authUser?.name ?? '');
  const [email, setEmail] = useState(authUser?.email ?? '');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState<string>(INQUIRY_TOPICS[0]);
  const [visitDate, setVisitDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ContactInquiryReceipt | null>(null);

  useEffect(() => {
    if (authUser) {
      setFullName((prev) => prev || authUser.name);
      setEmail((prev) => prev || authUser.email);
    }
  }, [authUser]);

  const showVisitDateField = topic === INQUIRY_TOPICS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!/^[+\d\s()-]{7,24}$/.test(phone.trim())) {
      setErrorMsg('Please enter a valid phone or WhatsApp number.');
      return;
    }
    if (message.trim().length < 10) {
      setErrorMsg('Please include at least 10 characters describing your enquiry.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await submitContactInquiry(authToken ?? null, {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        topic,
        visitDate: showVisitDateField && visitDate ? visitDate : undefined,
        message: message.trim(),
      });
      setReceipt(created);
      setMessage('');
      setVisitDate('');
      onInquirySubmitted?.(created);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to send your message right now.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const Wrapper = compact ? 'div' : 'section';

  return (
    <Wrapper
      id={compact ? undefined : id}
      aria-labelledby={compact ? undefined : 'contact-store-heading'}
      className={
        compact
          ? 'space-y-6'
          : 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-10'
      }
    >
      {!compact && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFCCA6] pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <LotusMotif className="w-7 h-5" color="#4A0D1B" accentColor="#B5832C" />
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
                VISIT NEWTOWN, KOLKATA OR WRITE TO US
              </p>
            </div>
            <h2
              id="contact-store-heading"
              className="font-serif text-3xl sm:text-4xl text-[#4A0D1B] text-balance"
            >
              Visit Our Store &amp; Connect With Priyontor
            </h2>
            <p className="text-xs sm:text-sm text-[#5E4346] leading-relaxed">
              Book a private drape viewing at our Newtown, Kolkata boutique to unlock{' '}
              <strong className="text-[#4A0D1B]">10% off your first in-store purchase</strong>, or
              send us your sizing, saree, or worldwide shipping questions below.
            </p>
          </div>
          <BenarasGhatMotif
            className="w-32 h-9 shrink-0 hidden sm:block"
            color="#4A0D1B"
            accentColor="#B5832C"
          />
        </div>
      )}

      <div
        className={
          compact
            ? 'space-y-6'
            : 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch'
        }
      >
        {/* LEFT COLUMN: STORE DETAILS & DIRECT CHANNELS */}
        <div
          className={`${
            compact ? '' : 'lg:col-span-5'
          } bg-[#4A0D1B] text-[#FDF3DC] border-2 border-[#B5832C] p-6 sm:p-8 flex flex-col justify-between space-y-6 dark-surface`}
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-[#B5832C]/40 pb-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#E5C37A]">
                  PRIYONTOR BOUTIQUE &amp; SUPPORT
                </p>
                <h3 className="font-serif text-2xl text-[#FDF3DC] mt-1">
                  Newtown, Kolkata Store
                </h3>
              </div>
              <LotusMotif className="w-8 h-6 shrink-0" color="#E5C37A" accentColor="#D87277" />
            </div>

            {/* Store Address Highlight */}
            <div className="bg-[#2F0710] border border-[#B5832C]/60 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#E5C37A] font-semibold tracking-[0.14em] uppercase text-[10px]">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>FLAGSHIP STORE ADDRESS</span>
              </div>
              <p className="text-[#FDF3DC] leading-relaxed">{BRAND_INFO.storeAddress}</p>
              <div className="pt-2 border-t border-[#B5832C]/35 flex items-start gap-2 text-[11px] text-[#E5C37A]">
                <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  10% Discount on your 1st physical purchase at our Newtown, Kolkata store.
                </span>
              </div>
            </div>

            {/* Registered Address & Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#E5C37A]">
                  REGISTERED ADDRESS
                </p>
                <p className="text-[#E9DAC0] leading-relaxed">{BRAND_INFO.registeredAddress}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#E5C37A] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>STORE &amp; CARE HOURS</span>
                </p>
                <p className="text-[#E9DAC0] leading-relaxed">
                  Mon – Sat: 10:30 AM – 7:30 PM IST
                  <br />
                  Sunday by prior appointment
                </p>
              </div>
            </div>

            {/* Direct Contact Channels */}
            <div className="space-y-3 pt-4 border-t border-[#B5832C]/40 text-xs">
              <div className="flex items-start gap-3">
                <MessageCircle
                  className="w-4 h-4 text-[#E5C37A] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#E5C37A]">
                    WHATSAPP ENQUIRIES &amp; QUERIES
                  </p>
                  <p className="text-[#FDF3DC] font-mono tabular-nums mt-0.5">
                    {BRAND_INFO.whatsappNumbers.join(' / ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#E5C37A] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#E5C37A]">
                    CUSTOMER SUPPORT &amp; OFFICE CONTACT
                  </p>
                  <p className="text-[#FDF3DC] font-mono tabular-nums mt-0.5">
                    Support: {BRAND_INFO.supportNumbers.join(' / ')}
                  </p>
                  <p className="text-[#E9DAC0] font-mono tabular-nums text-[11px] mt-0.5">
                    Office: {BRAND_INFO.contactNumbers.join(' / ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#E5C37A] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#E5C37A]">
                    BUSINESS EMAILS
                  </p>
                  <p className="text-[#FDF3DC] break-all mt-0.5">
                    {BRAND_INFO.emails.join(' / ')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#B5832C]/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#E9DAC0]">
            <span>
              GST NO: <strong className="font-mono text-[#E5C37A]">{BRAND_INFO.gstNumber}</strong>
            </span>
            <span>{BRAND_INFO.socialPlatforms.join(' · ')}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CONTACT & APPOINTMENT FORM */}
        <div
          className={`${
            compact ? '' : 'lg:col-span-7'
          } bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-8 flex flex-col justify-between`}
        >
          {receipt ? (
            <div className="my-auto py-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#164A37]/10 border border-[#164A37]/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#164A37]" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#164A37]">
                    ENQUIRY RECEIVED
                  </p>
                  <h3 className="font-serif text-2xl text-[#241214]">
                    Thank You for Writing to Priyontor
                  </h3>
                  <p className="text-xs text-[#5E4346]">
                    Reference:{' '}
                    <strong className="font-mono text-[#4A0D1B]">
                      {receipt.referenceNumber}
                    </strong>{' '}
                    · Topic: {receipt.topic}
                    {receipt.visitDate ? ` · Requested Visit: ${receipt.visitDate}` : ''}
                  </p>
                </div>
              </div>

              <div className="bg-[#FDF3DC] border border-[#DFCCA6] p-4 text-xs text-[#5E4346] leading-relaxed space-y-1.5">
                <p>
                  Our Newtown, Kolkata team will respond shortly via email or WhatsApp (
                  {BRAND_INFO.whatsappNumbers.join(' / ')}).
                </p>
                <p className="text-[#4A0D1B] font-medium">
                  Store Address: {BRAND_INFO.storeAddress}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="px-6 py-3 bg-[#4A0D1B] hover:bg-[#2F0710] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[44px]"
              >
                SEND ANOTHER ENQUIRY
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#7D5718]">
                  DIRECT ENQUIRY &amp; STORE APPOINTMENT FORM
                </p>
                <h3 className="font-serif text-2xl text-[#241214] mt-1">
                  Send Us a Message
                </h3>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="bg-[#F7E4E5] border border-[#D87277] px-4 py-3 text-xs text-[#4A0D1B] font-medium"
                >
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={compact ? 'modal-inq-name' : 'home-inq-name'}
                    className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                  >
                    FULL NAME *
                  </label>
                  <input
                    id={compact ? 'modal-inq-name' : 'home-inq-name'}
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-[#FDF3DC]/45 border border-[#DFCCA6] focus:border-[#4A0D1B] focus:outline-none px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                  />
                </div>
                <div>
                  <label
                    htmlFor={compact ? 'modal-inq-email' : 'home-inq-email'}
                    className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                  >
                    EMAIL ADDRESS *
                  </label>
                  <input
                    id={compact ? 'modal-inq-email' : 'home-inq-email'}
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#FDF3DC]/45 border border-[#DFCCA6] focus:border-[#4A0D1B] focus:outline-none px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={compact ? 'modal-inq-phone' : 'home-inq-phone'}
                    className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                  >
                    PHONE / WHATSAPP NUMBER *
                  </label>
                  <input
                    id={compact ? 'modal-inq-phone' : 'home-inq-phone'}
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98318 09747"
                    className="w-full bg-[#FDF3DC]/45 border border-[#DFCCA6] focus:border-[#4A0D1B] focus:outline-none px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                  />
                </div>
                <div>
                  <label
                    htmlFor={compact ? 'modal-inq-topic' : 'home-inq-topic'}
                    className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                  >
                    ENQUIRY TOPIC *
                  </label>
                  <select
                    id={compact ? 'modal-inq-topic' : 'home-inq-topic'}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-[#FDF3DC]/45 border border-[#DFCCA6] focus:border-[#4A0D1B] focus:outline-none px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                  >
                    {INQUIRY_TOPICS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {showVisitDateField && (
                <div>
                  <label
                    htmlFor={compact ? 'modal-inq-date' : 'home-inq-date'}
                    className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                  >
                    PREFERRED NEWTOWN STORE VISIT DATE (OPTIONAL)
                  </label>
                  <input
                    id={compact ? 'modal-inq-date' : 'home-inq-date'}
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full sm:w-64 bg-[#FDF3DC]/45 border border-[#DFCCA6] focus:border-[#4A0D1B] focus:outline-none px-3.5 py-2.5 text-sm text-[#241214] min-h-[44px]"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor={compact ? 'modal-inq-msg' : 'home-inq-msg'}
                  className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5E4346] mb-1"
                >
                  MESSAGE &amp; GARMENT DETAILS *
                </label>
                <textarea
                  id={compact ? 'modal-inq-msg' : 'home-inq-msg'}
                  rows={4}
                  required
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share the saree state/weave, garment sizes (38–44 or kids age), or store visit timing you would like assistance with..."
                  className="w-full bg-[#FDF3DC]/45 border border-[#DFCCA6] focus:border-[#4A0D1B] focus:outline-none px-3.5 py-2.5 text-sm text-[#241214]"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[#5E4346]">
                  <ShieldCheck className="w-4 h-4 text-[#7D5718] shrink-0" aria-hidden="true" />
                  <span>Direct response from our Kolkata team · Payments: UPI &amp; Card only</span>
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#4A0D1B] hover:bg-[#2F0710] disabled:opacity-60 text-[#FDF3DC] text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors min-h-[46px] shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-[#E5C37A]" aria-hidden="true" />
                  <span>{submitting ? 'SENDING...' : 'SUBMIT ENQUIRY'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Wrapper>
  );
};
