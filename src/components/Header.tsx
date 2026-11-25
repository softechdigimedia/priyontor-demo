import React, { useState } from 'react';
import { Heart, LogIn, LogOut, Menu, ShoppingBag, User, X } from 'lucide-react';
import { AuthUser, PageRoute } from '../types/archive';
import { LotusMotif } from './HeritageMotifs';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  wishlistCount: number;
  bagCount: number;
  authUser: AuthUser | null;
  onOpenWishlist: () => void;
  onOpenBag: () => void;
  onOpenAccount: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onLogout: () => void;
  onOpenPolicies: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  wishlistCount,
  bagCount,
  authUser,
  onOpenWishlist,
  onOpenBag,
  onOpenAccount,
  onOpenLogin,
  onOpenSignup,
  onLogout,
  onOpenPolicies,
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
      label: 'STATE SAREES MAP',
      active: currentPage === 'discover',
      action: () => onNavigate('discover'),
    },
    {
      id: 'about',
      label: 'ABOUT & FOUNDER',
      active: false,
      action: () => onNavigate('home', 'about-heritage'),
    },
    {
      id: 'policies',
      label: 'SIZE & POLICIES',
      active: false,
      action: () => onOpenPolicies(),
    },
    {
      id: 'contact',
      label: 'CONTACT & STORE',
      active: false,
      action: () => onNavigate('home', 'contact-store'),
    },
  ];

  return (
    <>
      <div className="bg-[#FDF3DC]">
        {/* Deep Wine Announcement Strip */}
        <div className="bg-[#4A0D1B] text-[#FDF3DC] px-4 py-2 text-center border-b border-[#B5832C]/60">
          <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase truncate">
            REDEFINING INDIAN HERITAGE &amp; CULTURE TO THE WORLD &nbsp;✦&nbsp; USE CODE PRIYO5 FOR 5% OFF ON 1ST ORDER
          </p>
        </div>

        {/* Centered Logo Crest Row (Desktop & Tablet) */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
          {/* Left Symmetry Spacer */}
          <div className="hidden md:flex items-center flex-1" aria-hidden="true" />

          {/* Center: Priyontor Heritage Gold Logo */}
          <div className="flex-1 md:flex-none flex justify-center">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              aria-label="PRIYONTOR Home"
              className="inline-flex items-center justify-center group"
            >
              <img
                src="/assets/aistudio/Priyontor_Heritage_Gold_Logo_e65bd3b8.png"
                alt="PRIYONTOR — Heritage Indian Fashion"
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain [mask-image:radial-gradient(ellipse_at_center,black_82%,transparent_100%)] transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </a>
          </div>

          {/* Right Utility: Patron Auth, Wishlist, Bag */}
          <div className="hidden md:flex items-center justify-end gap-2.5 flex-1">
            {authUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onOpenAccount}
                  aria-label={`Open ${authUser.name} account`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B5832C] bg-[#FFFFFF]/90 text-[#4A0D1B] hover:bg-[#F7E8C6] text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors min-h-[38px]"
                >
                  <User className="w-3.5 h-3.5 text-[#7D5718]" aria-hidden="true" />
                  <span className="max-w-[110px] truncate">{authUser.name.split(' ')[0]}</span>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  aria-label="Log out of your account"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[#DFCCA6] bg-[#FFFFFF]/70 hover:border-[#4A0D1B] text-[#4A0D1B] text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors min-h-[38px] whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>LOG OUT</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#DFCCA6] bg-[#FFFFFF]/80 hover:border-[#4A0D1B] text-[#4A0D1B] text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors min-h-[38px] whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>SIGN IN</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenSignup}
                  className="inline-flex items-center px-3 py-1.5 border border-[#B5832C] bg-[#F7E8C6] hover:bg-[#EBD8AC] text-[#4A0D1B] text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors min-h-[38px] whitespace-nowrap"
                >
                  SIGN UP
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label={`Open wishlist (${wishlistCount} saved)`}
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
              aria-label={`Open shopping bag (${bagCount} items)`}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 bg-[#4A0D1B] hover:bg-[#390914] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors min-h-[38px] whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#E5C37A]" aria-hidden="true" />
              <span>BAG ({bagCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Prominent Deep Wine & Antique Gold Navigation Bar */}
      <header className="sticky top-0 z-40 bg-gradient-to-b from-[#4A0D1B] via-[#3E0A16] to-[#2F0710] text-[#FDF3DC] border-t-2 border-b-2 border-[#B5832C] shadow-[0_8px_24px_rgba(47,7,16,0.28)] dark-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Mobile Controls Left */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#FDF3DC] hover:text-[#E5C37A]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-serif text-base tracking-[0.2em] text-[#E5C37A] uppercase font-semibold"
            >
              PRIYONTOR
            </button>
          </div>

          {/* Left Lotus Frame Accent (Desktop) */}
          <div className="hidden xl:flex items-center shrink-0" aria-hidden="true">
            <LotusMotif className="w-7 h-5" color="#E5C37A" accentColor="#D87277" />
          </div>

          {/* Desktop Centered Prominent Nav Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex flex-1 items-center justify-center gap-2 xl:gap-5"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                aria-current={item.active ? 'page' : undefined}
                className={`relative px-3.5 xl:px-4 h-14 sm:h-16 inline-flex items-center text-[12px] font-semibold tracking-[0.17em] uppercase whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C37A] ${
                  item.active
                    ? 'text-[#E5C37A] bg-[#5C1223]/75'
                    : 'text-[#FDF3DC] hover:text-[#E5C37A] hover:bg-[#5C1223]/45'
                }`}
              >
                <span>{item.label}</span>
                {item.active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5C37A]"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Lotus Frame Accent (Desktop) */}
          <div className="hidden xl:flex items-center shrink-0" aria-hidden="true">
            <LotusMotif className="w-7 h-5" color="#E5C37A" accentColor="#D87277" />
          </div>

          {/* Mobile Controls Right */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={authUser ? onOpenAccount : onOpenLogin}
              aria-label={authUser ? `Patron account (${authUser.name})` : 'Sign in or sign up'}
              className="min-w-[42px] min-h-[42px] flex items-center justify-center text-[#E5C37A]"
            >
              <User className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label={`Saved items (${wishlistCount})`}
              className="relative min-w-[42px] min-h-[42px] flex items-center justify-center text-[#FDF3DC]"
            >
              <Heart className="w-4 h-4" aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1 w-3.5 h-3.5 rounded-full bg-[#D87277] text-[8px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onOpenBag}
              aria-label={`Shopping bag (${bagCount})`}
              className="relative min-w-[42px] min-h-[42px] flex items-center justify-center text-[#E5C37A]"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              {bagCount > 0 && (
                <span className="absolute top-1.5 right-1 w-3.5 h-3.5 rounded-full bg-[#FDF3DC] text-[#4A0D1B] text-[8px] font-bold flex items-center justify-center">
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
            className="lg:hidden bg-[#2F0710] border-t border-[#B5832C]/50 px-4 py-4 space-y-2 shadow-xl"
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
                  className={`text-left py-3.5 px-3 border-b border-[#4A0D1B] text-xs font-semibold tracking-[0.16em] uppercase min-h-[44px] flex items-center justify-between ${
                    item.active ? 'text-[#E5C37A] bg-[#4A0D1B]/60' : 'text-[#FDF3DC]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.active && <span className="text-[9px] text-[#E5C37A]">✦ ACTIVE</span>}
                </button>
              ))}
            </nav>

            {/* Mobile Patron Account / Auth Row */}
            <div className="pt-2 pb-1">
              {authUser ? (
                <div className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAccount();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-xs text-[#FDF3DC]"
                  >
                    <span className="block text-[9px] tracking-[0.14em] uppercase text-[#E5C37A]">
                      SIGNED IN PATRON
                    </span>
                    <span className="font-semibold">{authUser.name}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#B5832C] text-[#E5C37A] text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[40px]"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>LOG OUT</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 border border-[#B5832C] text-[#FDF3DC] text-[10px] font-semibold tracking-[0.14em] uppercase min-h-[44px]"
                  >
                    SIGN IN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSignup();
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 bg-[#B5832C] text-[#2F0710] text-[10px] font-bold tracking-[0.14em] uppercase min-h-[44px]"
                  >
                    SIGN UP
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
