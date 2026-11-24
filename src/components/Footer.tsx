import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageRoute } from '../types/archive';

interface FooterProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  onFilterCategory: (cat: 'all' | 'sarees' | 'lehengas' | 'kurtas' | 'anarkalis') => void;
  onOpenConcierge: () => void;
  onOpenRoyalties: () => void;
  onOpenQrDossier: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onFilterCategory,
  onOpenConcierge,
  onOpenRoyalties,
  onOpenQrDossier,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Crest Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="inline-block bg-[#FDF3DC] px-5 py-3 border border-[#B5832C]">
              <img
                src="/assets/aistudio/Priyontor_Heritage_Gold_Logo_e65bd3b8.png"
                alt="PRIYONTOR — Where Heritage Meets Heart"
                className="h-16 w-auto object-contain [mask-image:radial-gradient(ellipse_at_center,black_82%,transparent_100%)]"
              />
            </div>
            <p className="text-xs leading-relaxed text-[#E9DAC0] max-w-sm">
              Where Heritage Meets Heart. A sovereign handloom archive bridging ancient Indian
              weaving lineages with contemporary global couture.
            </p>
            <div className="flex flex-wrap gap-2 text-[9px] font-semibold tracking-[0.14em] uppercase text-[#E5C37A]">
              <span className="px-2.5 py-1 border border-[#B5832C]/50 bg-[#4A0D1B]">SILK MARK</span>
              <span className="px-2.5 py-1 border border-[#B5832C]/50 bg-[#4A0D1B]">GI REGISTERED</span>
              <span className="px-2.5 py-1 border border-[#B5832C]/50 bg-[#4A0D1B]">CRAFT MARK</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#E5C37A] mb-4">
              QUICK LINKS
            </h3>
            <ul className="space-y-2.5 text-xs text-[#E9DAC0]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#D87277] transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterCategory('sarees')}
                  className="hover:text-[#D87277] transition-colors text-left"
                >
                  Sarees &amp; Drapes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterCategory('lehengas')}
                  className="hover:text-[#D87277] transition-colors text-left"
                >
                  Bridal Couture
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('discover')}
                  className="hover:text-[#D87277] transition-colors text-left"
                >
                  Discover India Map
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', 'curated-lookbooks')}
                  className="hover:text-[#D87277] transition-colors text-left"
                >
                  Curated Lookbooks
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Provenance */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#E5C37A] mb-4">
              CUSTOMER CARE &amp; PROVENANCE
            </h3>
            <ul className="space-y-2.5 text-xs text-[#E9DAC0]">
              <li>
                <button
                  type="button"
                  onClick={onOpenConcierge}
                  className="hover:text-[#D87277] transition-colors text-left"
                >
                  Private Video Walkthrough
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenQrDossier}
                  className="hover:text-[#D87277] transition-colors text-left"
                >
                  Scan QR Authenticity Dossier
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenRoyalties}
                  className="hover:text-[#D87277] transition-colors text-left"
                >
                  Artisan Direct Royalties Ledger
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('pdp', 'care-accordions')}
                  className="hover:text-[#D87277] transition-colors text-left"
                >
                  Heritage Care &amp; Preservation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('collections')}
                  className="hover:text-[#D87277] transition-colors text-left"
                >
                  Shipping &amp; 7-Day Exchange
                </button>
              </li>
            </ul>
          </div>

          {/* Join Our Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#E5C37A]">
              JOIN OUR NEWSLETTER
            </h3>
            <p className="text-xs text-[#E9DAC0] leading-relaxed">
              Be the first to know about new heirloom loom drops, private trunk shows, and
              monographs.
            </p>
            <form onSubmit={handleJoin} className="flex gap-0">
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address for newsletter
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
                placeholder="Your email address"
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
                <span>Welcome to the Priyontor Heritage Circle.</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#4A0D1B] bg-[#23050C]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] tracking-[0.14em] uppercase text-[#DFCCA6]">
          <p>© 2026 PRIYONTOR ATELIER. A PRODUCT OF TRADITION, MADE FOR YOU.</p>
          <div className="flex flex-wrap items-center gap-5">
            <button type="button" onClick={onOpenQrDossier} className="hover:text-[#E5C37A]">
              TERMS OF HERITAGE
            </button>
            <button type="button" onClick={onOpenConcierge} className="hover:text-[#E5C37A]">
              CLIENT CHARTER
            </button>
            <button type="button" onClick={onOpenRoyalties} className="hover:text-[#E5C37A]">
              WEAVER CODEX
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
