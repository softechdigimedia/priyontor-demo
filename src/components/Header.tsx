import React, { useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { CurrencyCode, PageRoute } from '../types/archive';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  wishlistCount: number;
  bagCount: number;
  onOpenWishlist: () => void;
  onOpenBag: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenConcierge: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  currency,
  onCurrencyChange,
  wishlistCount,
  bagCount,
  onOpenWishlist,
  onOpenBag,
  onOpenSearch,
  onOpenAccount,
  onOpenConcierge,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: {
    id: string;
    label: string;
    active: boolean;
    action: () => void;
  }[] = [
    {
      id: 'home',
      label: 'HOME',
      active: currentPage === 'home',
      action: () => onNavigate('home'),
    },
    {
      id: 'collections',
      label: 'SHOP COLLECTIONS',
      active: currentPage === 'collections' || currentPage === 'pdp',
      action: () => onNavigate('collections'),
    },
    {
      id: 'discover',
      label: 'DISCOVER INDIA',
      active: currentPage === 'discover',
      action: () => onNavigate('discover'),
    },
    {
      id: 'lookbooks',
      label: 'CURATED LOOKBOOKS',
      active: false,
      action: () => onNavigate('home', 'curated-lookbooks'),
    },
    {
      id: 'concierge',
      label: 'BESPOKE CONCIERGE',
      active: false,
      action: () => onOpenConcierge(),
    },
    {
      id: 'heritage',
      label: 'OUR HERITAGE',
      active: false,
      action: () => onNavigate('home', 'about-heritage'),
    },
  ];

  return (
    <>
      {/* Top Announcement & Centered Royal Crest Header */}
      <div className="bg-[#FDF3DC] border-b border-[#DFCCA6]">
        {/* Deep Wine Announcement Strip */}
        <div className="bg-[#4A0D1B] text-[#FDF3DC] px-4 py-1.5 text-center border-b border-[#B5832C]/50">
          <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase truncate">
            COMPLIMENTARY INSURED WORLDWIDE SHIPPING &nbsp;✦&nbsp; A PRODUCT OF TRADITION, MADE FOR YOU
          </p>
        </div>

        {/* Centered Logo Crest Row (Desktop & Tablet) */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
          {/* Left Utility: Search & Currency */}
          <div className="hidden md:flex items-center gap-2.5 flex-1">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search Heritage Archive"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFFFFF]/80 border border-[#DFCCA6] hover:border-[#B5832C] text-[#5E4346] text-xs transition-colors min-h-[38px]"
            >
              <Search className="w-3.5 h-3.5 text-[#7D5718]" aria-hidden="true" />
              <span className="text-[11px]">Search Sarees &amp; Weaves...</span>
            </button>

            <label htmlFor="desktop-currency-select" className="sr-only">
              Select Display Currency
            </label>
            <select
              id="desktop-currency-select"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="bg-[#FFFFFF]/80 border border-[#DFCCA6] px-2.5 py-1.5 text-[11px] font-medium text-[#241214] min-h-[38px] cursor-pointer hover:border-[#B5832C] transition-colors"
            >
              <option value="INR">INR ₹</option>
              <option value="USD">USD $</option>
              <option value="GBP">GBP £</option>
              <option value="EUR">EUR €</option>
            </select>
          </div>

          {/* Center: Actual Priyontor Heritage Gold Logo */}
          <div className="flex-1 md:flex-none flex justify-center">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              aria-label="PRIYONTOR — Where Heritage Meets Heart Home"
              className="inline-flex items-center justify-center group"
            >
              <img
                src="/assets/aistudio/Priyontor_Heritage_Gold_Logo_e65bd3b8.png"
                alt="PRIYONTOR — Where Heritage Meets Heart"
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain [mask-image:radial-gradient(ellipse_at_center,black_82%,transparent_100%)] transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </a>
          </div>

          {/* Right Utility: Patron, Wishlist, Bag */}
          <div className="hidden md:flex items-center justify-end gap-2.5 flex-1">
            <button
              type="button"
              onClick={onOpenAccount}
              aria-label="Patron Account and Provenance Registry"
              className="w-9 h-9 rounded-full border border-[#DFCCA6] bg-[#FFFFFF]/80 text-[#4A0D1B] hover:border-[#B5832C] flex items-center justify-center transition-colors"
            >
              <User className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label={`Open saved heirlooms (${wishlistCount} saved)`}
              className="relative min-w-[40px] min-h-[40px] flex items-center justify-center text-[#4A0D1B] hover:text-[#7D5718] transition-colors"
            >
              <Heart className="w-4 h-4" aria-hidden="true" />
              <span className="absolute top-0.5 right-0 min-w-[16px] h-4 px-1 rounded-full bg-[#D87277] text-[#FFFFFF] text-[9px] font-semibold flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenBag}
              aria-label={`Open acquisition bag (${bagCount} items)`}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 bg-[#4A0D1B] hover:bg-[#390914] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[38px]"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#E5C37A]" aria-hidden="true" />
              <span>BAG ({bagCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Deep Wine Navigation Ribbon (Inspired by Maha Gauri) */}
      <header className="sticky top-0 z-40 bg-[#4A0D1B] text-[#FDF3DC] border-b-2 border-[#B5832C] shadow-sm dark-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between lg:justify-center gap-4">
          {/* Mobile Controls Left */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#FDF3DC] hover:text-[#E5C37A]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-serif text-sm tracking-[0.18em] text-[#E5C37A] uppercase font-semibold"
            >
              PRIYONTOR
            </button>
          </div>

          {/* Desktop Centered Nav Links */}
          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                aria-current={item.active ? 'page' : undefined}
                className={`relative py-3 text-[11px] font-medium tracking-[0.16em] uppercase whitespace-nowrap shrink-0 transition-colors ${
                  item.active
                    ? 'text-[#E5C37A]'
                    : 'text-[#FDF3DC]/90 hover:text-[#E5C37A]'
                }`}
              >
                {item.label}
                {item.active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4A44B]"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Controls Right */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search Heritage Archive"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#FDF3DC]"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label={`Saved heirlooms (${wishlistCount})`}
              className="relative min-w-[40px] min-h-[40px] flex items-center justify-center text-[#FDF3DC]"
            >
              <Heart className="w-4 h-4" aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#D87277] text-[8px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onOpenBag}
              aria-label={`Acquisition bag (${bagCount})`}
              className="relative min-w-[40px] min-h-[40px] flex items-center justify-center text-[#E5C37A]"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              {bagCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#FDF3DC] text-[#4A0D1B] text-[8px] font-bold flex items-center justify-center">
                  {bagCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="lg:hidden bg-[#2F0710] border-t border-[#B5832C]/40 px-4 py-4 space-y-1 shadow-xl"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.action();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-3 px-2 border-b border-[#4A0D1B] text-xs font-medium tracking-[0.15em] uppercase min-h-[44px] flex items-center justify-between ${
                    item.active ? 'text-[#E5C37A] font-semibold' : 'text-[#FDF3DC]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.active && <span className="text-[9px] text-[#D87277]">✦ ACTIVE</span>}
                </button>
              ))}
            </nav>
            <div className="pt-3 flex items-center justify-between gap-3">
              <label htmlFor="mobile-currency-select" className="text-xs text-[#DFCCA6]">
                Display Currency
              </label>
              <select
                id="mobile-currency-select"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="bg-[#4A0D1B] border border-[#B5832C] px-3 py-2 text-xs font-medium text-[#FDF3DC] min-h-[40px]"
              >
                <option value="INR">INR ₹</option>
                <option value="USD">USD $</option>
                <option value="GBP">GBP £</option>
                <option value="EUR">EUR €</option>
              </select>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
