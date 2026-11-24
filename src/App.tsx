/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PRODUCTS } from './data/archiveData';
import { BagItem, CurrencyCode, FilterState, PageRoute, Product, SareeMapCategoryId } from './types/archive';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ActiveModalType, ModalsAndDrawers } from './components/ModalsAndDrawers';
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { DiscoverIndiaPage } from './pages/DiscoverIndiaPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [wishlistIds, setWishlistIds] = useState<string[]>(['empress-varanasi']);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    mapCategory: null,
    regions: [],
    weaves: [],
    fibers: [],
    giMarks: [],
    maxPriceINR: 600000,
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
      showToast(exists ? 'Removed from saved heirlooms.' : 'Saved to your heirloom shortlist.');
      return next;
    });
  };

  const handleAddToBag = ({
    product,
    colorway,
    pleatArchitecture,
    fallPico,
    blouseTailoring,
  }: {
    product: Product;
    colorway: string;
    pleatArchitecture: 'traditional' | 'pre-pleated';
    fallPico: boolean;
    blouseTailoring: boolean;
  }) => {
    const unitPriceINR = product.priceINR + (blouseTailoring ? 4500 : 0);
    const key = `${product.id}-${colorway}-${pleatArchitecture}-${fallPico}-${blouseTailoring}`;

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
          colorway,
          pleatArchitecture,
          fallPico,
          blouseTailoring,
          quantity: 1,
          unitPriceINR,
        },
      ];
    });
    showToast(`${product.title} added to Acquisition Bag.`);
    setActiveModal('bag');
  };

  const handleQuickAcquire = (product: Product) => {
    handleAddToBag({
      product,
      colorway: product.colorways[0]?.name ?? 'ARCHIVE EDITION',
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

  const handleFilterByCategory = (
    cat: 'all' | 'sarees' | 'lehengas' | 'kurtas' | 'anarkalis'
  ) => {
    setFilters((prev) => ({
      ...prev,
      category: cat,
      mapCategory: null,
      regions: [],
    }));
    handleNavigate('collections');
  };

  const handleFilterByRegion = (region: string) => {
    setFilters((prev) => ({
      ...prev,
      category: 'all',
      mapCategory: null,
      regions: [region],
    }));
    handleNavigate('collections');
  };

  const handleSelectMapCategory = (mapCategory: SareeMapCategoryId) => {
    setFilters((prev) => ({
      ...prev,
      category: 'all',
      mapCategory,
      regions: [],
      weaves: [],
      fibers: [],
      giMarks: [],
      maxPriceINR: 600000,
      readiness: 'all',
      searchQuery: '',
    }));
    handleNavigate('collections');
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
        currency={currency}
        onCurrencyChange={setCurrency}
        wishlistCount={wishlistIds.length}
        bagCount={totalBagCount}
        onOpenWishlist={() => setActiveModal('wishlist')}
        onOpenBag={() => setActiveModal('bag')}
        onOpenSearch={() => setActiveModal('search')}
        onOpenAccount={() => setActiveModal('account')}
        onOpenConcierge={() => setActiveModal('concierge')}
      />

      <main id="main-content" className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            currency={currency}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAcquire}
            onNavigate={handleNavigate}
            onFilterByCategory={handleFilterByCategory}
            onFilterByRegion={handleFilterByRegion}
            onSelectMapCategory={handleSelectMapCategory}
            onOpenRoyalties={() => setActiveModal('royalties')}
            onOpenConcierge={() => setActiveModal('concierge')}
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
            onNavigate={handleNavigate}
            onOpenConcierge={() => setActiveModal('concierge')}
          />
        )}

        {currentPage === 'discover' && (
          <DiscoverIndiaPage
            currency={currency}
            onSelectProduct={handleSelectProduct}
            onQuickAcquire={handleQuickAcquire}
            onOpenConcierge={() => setActiveModal('concierge')}
            onOpenQrDossier={() => setActiveModal('qr')}
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
            onOpenConcierge={() => setActiveModal('concierge')}
            onOpenQrDossier={() => setActiveModal('qr')}
            onOpenMacroZoom={() => setActiveModal('macro')}
          />
        )}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onFilterCategory={handleFilterByCategory}
        onOpenConcierge={() => setActiveModal('concierge')}
        onOpenRoyalties={() => setActiveModal('royalties')}
        onOpenQrDossier={() => setActiveModal('qr')}
      />

      <ModalsAndDrawers
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        currency={currency}
        bag={bag}
        onUpdateBagQty={handleUpdateBagQty}
        onRemoveBagItem={handleRemoveBagItem}
        onClearBag={() => setBag([])}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
        macroProduct={selectedProduct}
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
