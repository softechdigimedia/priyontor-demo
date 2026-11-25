import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BRAND_INFO, PolicyEntry } from '../data/priyontorInfo';
import { PageRoute, ProductCategoryId } from '../types/archive';
import { BenarasGhatMotif, LotusMotif } from './HeritageMotifs';

interface FooterProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  onFilterCategory: (cat: 'all' | ProductCategoryId) => void;
  onOpenPolicyTab: (tab: PolicyEntry['id'] | 'size-chart') => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onFilterCategory,
  onOpenPolicyTab,
  onOpenContact,
}) => {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setJoined(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#2F0710] text-[#FDF3DC] border-t-2 border-[#B5832C] dark-surface">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Top Benaras Ghat & Lotus Crest Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-10 mb-10 border-b border-[#B5832C]/35">
          <div className="flex items-center gap-3">
            <LotusMotif className="w-8 h-6" color="#E5C37A" accentColor="#D87277" />
            <p className="font-serif italic text-sm sm:text-base text-[#E5C37A]">
              &ldquo;{BRAND_INFO.tagline}&rdquo;
            </p>
          </div>
          <BenarasGhatMotif className="w-32 h-9" color="#E5C37A" accentColor="#D87277" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand, Addresses & GST Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-block bg-[#FDF3DC] px-5 py-3 border border-[#B5832C]">
              <img
                src="/assets/aistudio/Priyontor_Heritage_Gold_Logo_e65bd3b8.png"
                alt="PRIYONTOR Logo"
                className="h-14 w-auto object-contain [mask-image:radial-gradient(ellipse_at_center,black_82%,transparent_100%)]"
              />
            </div>
            <p className="text-xs leading-relaxed text-[#E9DAC0]">
              Debuted internationally at <strong className="text-[#FDF3DC]">{BRAND_INFO.debutMilestone}</strong> ({BRAND_INFO.launchpad}) and rooted in {BRAND_INFO.birthplace}.
            </p>
            <div className="space-y-2 text-[11px] text-[#E9DAC0] pt-1">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E5C37A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-[#FDF3DC]">Store Address:</strong> {BRAND_INFO.storeAddress}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E5C37A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-[#FDF3DC]">Registered Address:</strong> {BRAND_INFO.registeredAddress}
                </span>
              </p>
              <p className="text-[10px] font-mono text-[#E5C37A] pt-1">
                GST NO: {BRAND_INFO.gstNumber} · PAYMENT: UPI &amp; CARD ONLY
              </p>
            </div>
          </div>

          {/* Collections & Wardrobes */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#E5C37A] mb-4">
              COLLECTIONS
            </h3>
            <ul className="space-y-2.5 text-xs text-[#E9DAC0]">
              <li>
                <button
                  type="button"
                  onClick={() => onFilterCategory('sarees')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  State-Wise Heritage Sarees
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterCategory('designer-sarees')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  Designer Sarees for Women
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterCategory('womens-sets')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  Women&apos;s Co-Ord &amp; Kurta Sets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterCategory('blouses')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  Blouses for Women
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterCategory('mens-punjabi')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  Mens&apos; Ethnic Punjabi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterCategory('kids-wear')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  Kids&apos; Ethnic Wear
                </button>
              </li>
            </ul>
          </div>

          {/* Business Policies & Size Guide */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#E5C37A] mb-4">
              POLICIES, CARE &amp; SIZE CHART
            </h3>
            <ul className="space-y-2.5 text-xs text-[#E9DAC0]">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyTab('shipping')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  Shipping Policy (India &amp; Worldwide)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyTab('returns')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  Return &amp; Exchange Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyTab('refund')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  Refund &amp; Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyTab('size-chart')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  Garment Size Chart (38–44 &amp; Kids)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyTab('care')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  Washing &amp; Care Instructions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyTab('privacy')}
                  className="hover:text-[#E5C37A] transition-colors text-left"
                >
                  Privacy Policy &amp; Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Contact, WhatsApp & Dispatch Updates */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#E5C37A]">
              CUSTOMER SUPPORT &amp; WHATSAPP
            </h3>
            <div className="space-y-2 text-xs text-[#E9DAC0]">
              <p className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E5C37A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Support: {BRAND_INFO.supportNumbers.join(' / ')}</span>
              </p>
              <p className="flex items-start gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#E5C37A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>WhatsApp Enquiries: {BRAND_INFO.whatsappNumbers.join(' / ')}</span>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E5C37A] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="break-all">{BRAND_INFO.emails.join(' / ')}</span>
              </p>
            </div>

            <form onSubmit={handleJoin} className="flex gap-0 pt-1">
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address for Priyontor updates
              </label>
              <input
                id="footer-newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setJoined(false);
                }}
                placeholder="Your email for festive updates"
                className="flex-1 min-w-0 bg-[#4A0D1B] border border-[#B5832C]/60 px-3 py-2.5 text-xs text-[#FDF3DC] placeholder:text-[#DFCCA6]/70 min-h-[42px]"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="bg-[#B5832C] hover:bg-[#D4A44B] text-[#2F0710] px-4 flex items-center justify-center transition-colors min-h-[42px]"
              >
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
            {joined && (
              <p role="status" className="text-[11px] text-[#E5C37A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Subscribed to Priyontor updates.</span>
              </p>
            )}

            <div className="pt-1 flex items-center gap-3 text-[10px] tracking-[0.14em] uppercase text-[#E5C37A]">
              <span>FOLLOW:</span>
              {BRAND_INFO.socialPlatforms.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-[#FDF3DC] underline underline-offset-2"
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#4A0D1B] bg-[#23050C]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] tracking-[0.14em] uppercase text-[#DFCCA6]">
          <p>© 2026 PRIYONTOR · ROOTED IN KOLKATA, INDIA · DEBUT AT LONDON MAHOTSAV 2026.</p>
          <div className="flex flex-wrap items-center gap-5">
            <button type="button" onClick={() => onOpenPolicyTab('terms')} className="hover:text-[#E5C37A]">
              TERMS &amp; CONDITIONS
            </button>
            <button type="button" onClick={() => onOpenPolicyTab('privacy')} className="hover:text-[#E5C37A]">
              PRIVACY POLICY
            </button>
            <button type="button" onClick={() => onNavigate('home', 'about-heritage')} className="hover:text-[#E5C37A]">
              FOUNDER STORY
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
