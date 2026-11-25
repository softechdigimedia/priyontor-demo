/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PRODUCTS } from './data/archiveData';
import { PolicyEntry } from './data/priyontorInfo';
import {
  AuthUser,
  BagItem,
  CurrencyCode,
  FilterState,
  OrderRecord,
  PageRoute,
  Product,
  ProductCategoryId,
  SareeMapCategoryId,
  WardrobeSegment,
} from './types/archive';
import {
  fetchCurrentUser,
  loginPatron,
  logoutPatron,
  signupPatron,
  syncPatronWishlist,
} from './services/authApi';
import { fetchPatronOrders } from './services/ordersApi';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ActiveModalType, ModalsAndDrawers } from './components/ModalsAndDrawers';
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { DiscoverIndiaPage } from './pages/DiscoverIndiaPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [wishlistIds, setWishlistIds] = useState<string[]>(['up-banarasi-silk']);
  const [bag, setBag] = useState<BagItem[]>([]);
  // PDF Requirement: 5% Welcome Discount [PRIYO5] pop-up opens right after launching the website
  const [activeModal, setActiveModal] = useState<ActiveModalType>('welcome-offer');
  const [activePromoCode, setActivePromoCode] = useState<string>('');
  const [activePolicyTab, setActivePolicyTab] = useState<PolicyEntry['id'] | 'size-chart'>('shipping');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [patronOrders, setPatronOrders] = useState<OrderRecord[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    wardrobe: 'all',
    mapCategory: null,
    regions: [],
    weaves: [],
    fibers: [],
    giMarks: [],
    maxPriceINR: 25000,
    readiness: 'all',
    sortBy: 'curator',
    searchQuery: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  useEffect(() => {
    let mounted = true;
    fetchCurrentUser(null)
      .then((res) => {
        if (!mounted || !res) return;
        setAuthUser(res.user);
        setAuthToken(res.token || null);
        if (res.user.wishlistIds.length > 0) {
          setWishlistIds(res.user.wishlistIds);
        }
        fetchPatronOrders(res.token || null)
          .then((orders) => {
            if (mounted) setPatronOrders(orders);
          })
          .catch(() => {});
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async (payload: { email: string; password: string }) => {
    setAuthLoading(true);
    try {
      const { user, token } = await loginPatron(payload);
      setAuthUser(user);
      setAuthToken(token);
      if (user.wishlistIds.length > 0) {
        setWishlistIds(user.wishlistIds);
      }
      fetchPatronOrders(token)
        .then((orders) => setPatronOrders(orders))
        .catch(() => {});
      setActiveModal(null);
      showToast(`Welcome back, ${user.name}.`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (payload: {
    name: string;
    email: string;
    password: string;
    city?: string;
  }) => {
    setAuthLoading(true);
    try {
      const { user, token } = await signupPatron({
        ...payload,
        wishlistIds,
      });
      setAuthUser(user);
      setAuthToken(token);
      setPatronOrders([]);
      setActiveModal(null);
      showToast(`Account created. Welcome to Priyontor, ${user.name}.`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await logoutPatron(authToken);
    } catch {
      // Clear local session state even if network fails
    } finally {
      setAuthUser(null);
      setAuthToken(null);
      setPatronOrders([]);
      setAuthLoading(false);
      setActiveModal(null);
      showToast('You have signed out of your Priyontor account.');
    }
  };

  const handleNavigate = (page: PageRoute, sectionId?: string) => {
    setCurrentPage(page);
    if (sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from wishlist.' : 'Saved to your Priyontor wishlist.');
      if (authUser) {
        syncPatronWishlist(authToken, next).catch(() => {});
      }
      return next;
    });
  };

  const handleAddToBag = ({
    product,
    selectedSize,
    colorway,
    pleatArchitecture,
    fallPico,
    blouseTailoring,
  }: {
    product: Product;
    selectedSize: string;
    colorway: string;
    pleatArchitecture: 'traditional' | 'pre-pleated';
    fallPico: boolean;
    blouseTailoring: boolean;
  }) => {
    const unitPriceINR = product.priceINR + (blouseTailoring ? 1200 : 0);
    const key = `${product.id}-${selectedSize}-${colorway}-${pleatArchitecture}-${fallPico}-${blouseTailoring}`;

    setBag((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          key,
          product,
          selectedSize,
          colorway,
          pleatArchitecture,
          fallPico,
          blouseTailoring,
          quantity: 1,
          unitPriceINR,
        },
      ];
    });
    showToast(`${product.title} (${selectedSize}) added to your Bag.`);
    setActiveModal('bag');
  };

  const handleQuickAcquire = (product: Product) => {
    handleAddToBag({
      product,
      selectedSize: product.availableSizes[0] ?? 'FREE SIZE',
      colorway: product.colorways[0]?.name ?? 'HERITAGE EDITION',
      pleatArchitecture: 'traditional',
      fallPico: true,
      blouseTailoring: false,
    });
  };

  const handleUpdateBagQty = (key: string, delta: number) => {
    setBag((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveBagItem = (key: string) => {
    setBag((prev) => prev.filter((item) => item.key !== key));
  };

  const handleFilterByCategory = (cat: 'all' | ProductCategoryId) => {
    setFilters((prev) => ({
      ...prev,
      category: cat,
      wardrobe: 'all',
      mapCategory: null,
      regions: [],
    }));
    handleNavigate('collections');
  };

  const handleFilterByWardrobe = (wardrobe: 'all' | WardrobeSegment) => {
    setFilters((prev) => ({
      ...prev,
      category: 'all',
      wardrobe,
      mapCategory: null,
      regions: [],
    }));
    handleNavigate('collections');
  };

  const handleFilterByRegion = (region: string) => {
    setFilters((prev) => ({
      ...prev,
      category: 'all',
      wardrobe: 'all',
      mapCategory: null,
      regions: [region],
    }));
    handleNavigate('collections');
  };

  const handleSelectMapCategory = (mapCategory: SareeMapCategoryId) => {
    setFilters((prev) => ({
      ...prev,
      category: 'all',
      wardrobe: 'all',
      mapCategory,
      regions: [],
      weaves: [],
      fibers: [],
      giMarks: [],
      maxPriceINR: 25000,
      readiness: 'all',
      searchQuery: '',
    }));
    handleNavigate('collections');
  };

  const handleApplyPromoCode = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    setActivePromoCode(cleaned);
    if (cleaned === 'PRIYO5') {
      showToast('Code PRIYO5 applied: 5% Welcome Discount on your 1st order.');
    }
  };

  const handleOpenPolicyTab = (tab: PolicyEntry['id'] | 'size-chart') => {
    setActivePolicyTab(tab);
    setActiveModal('policies');
  };

  const totalBagCount = bag.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF3DC] text-[#241214]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[#4A0D1B] focus:text-[#FDF3DC] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold"
      >
        Skip to main content
      </a>

      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        wishlistCount={wishlistIds.length}
        bagCount={totalBagCount}
        authUser={authUser}
        onOpenWishlist={() => setActiveModal('wishlist')}
        onOpenBag={() => setActiveModal('bag')}
        onOpenAccount={() => setActiveModal('account')}
        onOpenLogin={() => setActiveModal('login')}
        onOpenSignup={() => setActiveModal('signup')}
        onLogout={handleLogout}
        onOpenPolicies={() => handleOpenPolicyTab('size-chart')}
      />

      <main id="main-content" className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            currency={currency}
            wishlistIds={wishlistIds}
            authUser={authUser}
            authToken={authToken}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAcquire}
            onNavigate={handleNavigate}
            onFilterByCategory={handleFilterByCategory}
            onFilterByWardrobe={handleFilterByWardrobe}
            onFilterByRegion={handleFilterByRegion}
            onSelectMapCategory={handleSelectMapCategory}
            onApplyPromoCode={handleApplyPromoCode}
            onOpenPolicyTab={handleOpenPolicyTab}
            onOpenContact={() => setActiveModal('contact')}
            onInquirySubmitted={(refNum) =>
              showToast(`Enquiry #${refNum} received. Our Kolkata team will contact you shortly.`)
            }
          />
        )}

        {currentPage === 'collections' && (
          <CollectionsPage
            currency={currency}
            filters={filters}
            onFiltersChange={setFilters}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAcquire}
            onNavigate={handleNavigate}
            onOpenPolicyTab={handleOpenPolicyTab}
            onOpenContact={() => setActiveModal('contact')}
          />
        )}

        {currentPage === 'discover' && (
          <DiscoverIndiaPage
            currency={currency}
            onSelectProduct={handleSelectProduct}
            onQuickAcquire={handleQuickAcquire}
            onSelectMapCategory={handleSelectMapCategory}
            onOpenPolicyTab={handleOpenPolicyTab}
            onOpenContact={() => setActiveModal('contact')}
          />
        )}

        {currentPage === 'pdp' && (
          <ProductDetailPage
            key={selectedProduct.id}
            product={selectedProduct}
            currency={currency}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToBag={handleAddToBag}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
            onOpenPolicyTab={handleOpenPolicyTab}
            onOpenContact={() => setActiveModal('contact')}
            onOpenMacroZoom={() => setActiveModal('macro')}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            currency={currency}
            bag={bag}
            authUser={authUser}
            authToken={authToken}
            activePromoCode={activePromoCode}
            onApplyPromoCode={handleApplyPromoCode}
            onUpdateBagQty={handleUpdateBagQty}
            onRemoveBagItem={handleRemoveBagItem}
            onClearBag={() => setBag([])}
            onNavigate={handleNavigate}
            onOpenLogin={() => setActiveModal('login')}
            onOpenSignup={() => setActiveModal('signup')}
            onOpenAccount={() => setActiveModal('account')}
            onOrderConfirmed={(order) => {
              if (authUser) {
                setPatronOrders((prev) => [order, ...prev]);
              }
              showToast(`Order #${order.orderNumber} confirmed.`);
            }}
          />
        )}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onFilterCategory={handleFilterByCategory}
        onOpenPolicyTab={handleOpenPolicyTab}
        onOpenContact={() => setActiveModal('contact')}
      />

      <ModalsAndDrawers
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSwitchModal={setActiveModal}
        currency={currency}
        bag={bag}
        onUpdateBagQty={handleUpdateBagQty}
        onRemoveBagItem={handleRemoveBagItem}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
        macroProduct={selectedProduct}
        authUser={authUser}
        authToken={authToken}
        authLoading={authLoading}
        patronOrders={patronOrders}
        activePromoCode={activePromoCode}
        onApplyPromoCode={handleApplyPromoCode}
        activePolicyTab={activePolicyTab}
        onChangePolicyTab={setActivePolicyTab}
        onProceedToCheckout={() => {
          setActiveModal(null);
          handleNavigate('checkout');
        }}
        onExploreCollections={() => {
          setActiveModal(null);
          handleNavigate('collections');
        }}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onLogout={handleLogout}
      />

      {/* Accessible Live Toast Notification */}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-5 right-5 z-40 pointer-events-none"
      >
        {toastMessage && (
          <div className="bg-[#2F0710] text-[#FDF3DC] border border-[#B5832C] px-4 py-3 text-xs font-medium shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
