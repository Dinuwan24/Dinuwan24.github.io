'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { PATREON_URL, SITE_NAME } from '@/src/data/recipes';

const NAV_LINKS = [
  { label: 'Recipes', href: '/#recipes' },
  { label: 'Fridge Finder', href: '/#fridge-finder' },
  { label: 'About', href: '/#about' },
  { label: 'Patreon', href: '/#patreon' },
  { label: 'eBooks', href: '/#ebooks' },
];

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="no-print border-b border-[#E5DDD2] bg-[#FAF6F0]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-element brand wordmark */}
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight text-[#211915] whitespace-nowrap shrink-0 transition-colors hover:text-[#B53D24] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B53D24]"
        >
          {SITE_NAME}
        </Link>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-[16px] font-medium text-[#4A3F38]"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 py-1 underline-offset-4 transition-colors hover:text-[#B53D24] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B53D24]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="hidden md:flex items-center shrink-0">
          <a
            href={PATREON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#B53D24] px-5 py-2.5 text-[15px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#99311B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24]"
          >
            Join on Patreon
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg border border-[#DCD2C5] bg-[#FFFDF9] text-[#211915] md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24]"
        >
          {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-[#E5DDD2] bg-[#FFFDF9] px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[48px] items-center rounded-lg px-3 text-[17px] font-medium text-[#211915] transition-colors hover:bg-[#F3ECE1] hover:text-[#B53D24]"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3">
              <a
                href={PATREON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#B53D24] px-5 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-[#99311B]"
              >
                Join on Patreon
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
