import React, { useState } from 'react';
import { Quote, Star } from 'lucide-react';
import { PATRON_TESTIMONIALS, PatronTestimonial } from '../data/priyontorInfo';
import { LotusMotif } from './HeritageMotifs';

type TestimonialFilter = 'all' | PatronTestimonial['segment'];

const FILTER_TABS: { id: TestimonialFilter; label: string }[] = [
  { id: 'all', label: 'All Patron Stories' },
  { id: 'sarees', label: 'State & Designer Sarees' },
  { id: 'family', label: "Mens' & Kids' Wardrobe" },
  { id: 'store-london', label: 'London Mahotsav & Store' },
];

export const TestimonialsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<TestimonialFilter>('all');

  const visibleTestimonials =
    activeFilter === 'all'
      ? PATRON_TESTIMONIALS
      : PATRON_TESTIMONIALS.filter((t) => t.segment === activeFilter);

  return (
    <section
      id="patron-testimonials"
      aria-labelledby="testimonials-heading"
      className="bg-[#F7E8C6]/65 border-y border-[#DFCCA6] py-14 sm:py-16"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#DFCCA6] pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <LotusMotif className="w-7 h-5" color="#4A0D1B" accentColor="#B5832C" />
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7D5718]">
                PATRON REFLECTIONS · KOLKATA TO LONDON
              </p>
            </div>
            <h2
              id="testimonials-heading"
              className="font-serif text-3xl sm:text-4xl text-[#4A0D1B] text-balance"
            >
              Cherished Across Generations &amp; Borders
            </h2>
            <p className="text-xs sm:text-sm text-[#5E4346] leading-relaxed">
              Reflections from families, brides, and collectors wearing Priyontor across India,
              our Newtown boutique, and our London Mahotsav 2026 showcase.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
            <div className="bg-[#FFFFFF] border border-[#DFCCA6] px-4 py-3 flex items-center gap-3">
              <div className="flex items-center gap-0.5 text-[#B5832C]" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                ))}
              </div>
              <div className="text-xs">
                <span className="font-serif font-semibold text-[#241214] tabular-nums">5.0</span>
                <span className="text-[#5E4346] mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span className="text-[#5E4346] tabular-nums">
                  {PATRON_TESTIMONIALS.length} Verified Patron Stories
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter patron testimonials"
          className="flex flex-wrap items-center gap-2"
        >
          {FILTER_TABS.map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase border transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
                  active
                    ? 'bg-[#4A0D1B] text-[#FDF3DC] border-[#4A0D1B]'
                    : 'bg-[#FFFFFF] text-[#5E4346] border-[#DFCCA6] hover:border-[#4A0D1B] hover:text-[#241214]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTestimonials.map((item) => (
            <article
              key={item.id}
              className="bg-[#FFFFFF] border border-[#DFCCA6] p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-colors hover:border-[#B5832C]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="flex items-center gap-1 text-[#B5832C]"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {Array.from({ length: item.rating }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className="w-3.5 h-3.5 fill-current"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-[#D8A7A7]" aria-hidden="true" />
                </div>

                <blockquote className="text-xs sm:text-sm text-[#241214] leading-relaxed font-normal">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[#F7E8C6] space-y-1.5">
                <p className="font-serif text-base font-medium text-[#4A0D1B]">
                  {item.patronName}
                </p>
                <p className="text-[11px] text-[#5E4346]">
                  <span>{item.location}</span>
                  <span className="mx-1.5" aria-hidden="true">
                    ·
                  </span>
                  <span>{item.occasion}</span>
                </p>
                <p className="text-[11px] font-medium text-[#7D5718]">
                  {item.garmentPurchased}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
