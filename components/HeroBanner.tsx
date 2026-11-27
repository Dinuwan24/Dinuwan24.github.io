'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

export interface HeroSlide {
  src: string;
  alt: string;
  objectPosition?: string;
}

interface HeroBannerProps {
  siteName: string;
  headline: string;
  tagline: string;
  slides: HeroSlide[];
}

const SLIDE_INTERVAL_MS = 5000;

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export default function HeroBanner({
  siteName,
  headline,
  tagline,
  slides,
}: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (prefersReducedMotion || isPaused || slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, isPaused, slides.length]);

  return (
    <section
      aria-label="Featured kitchen banner"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
      className="relative w-full overflow-hidden border-b border-[#E5DDD2] bg-[#2C211C]"
    >
      {/* Crossfading background slides */}
      <div className="absolute inset-0">
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={slide.src}
              aria-hidden={!isActive}
              className={`absolute inset-0 ${
                prefersReducedMotion
                  ? 'transition-none'
                  : 'transition-opacity duration-1000 ease-out'
              } ${isActive ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={idx === 0}
                referrerPolicy="no-referrer"
                className={`object-cover ${slide.objectPosition ?? 'object-center'}`}
              />
            </div>
          );
        })}

        {/* Soft warm scrim for strong contrast on bright and dark photos alike */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#1D1510]/85 via-[#1D1510]/58 to-[#1D1510]/35 sm:bg-gradient-to-r sm:from-[#1D1510]/85 sm:via-[#1D1510]/58 sm:to-[#1D1510]/20"
        />
      </div>

      {/* Overlaid Hero Copy & Actions */}
      <div className="relative z-10 mx-auto flex min-h-[470px] max-w-6xl flex-col justify-between px-4 py-14 sm:min-h-[540px] sm:px-6 sm:py-16 lg:min-h-[580px] lg:px-8 lg:py-20">
        <div className="my-auto max-w-2xl">
          <p className="text-[15px] font-semibold tracking-wide text-[#F3D8C6]">
            Welcome to {siteName}
          </p>
          <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.14] tracking-tight text-[#FFFDF9] sm:text-[46px] lg:text-[52px] [text-wrap:balance]">
            {headline}
          </h1>
          <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-[#F4ECE2]">
            {tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#recipes"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#B53D24] px-7 py-3 text-[17px] font-semibold text-white whitespace-nowrap shrink-0 shadow-sm transition-colors duration-150 hover:bg-[#99311B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>Explore All 11 Recipes</span>
              <ArrowDown className="h-5 w-5 shrink-0" aria-hidden="true" />
            </a>
            <Link
              href="#about"
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-[#FAF6F0]/75 bg-[#FAF6F0]/15 px-6 py-3 text-[17px] font-semibold text-white whitespace-nowrap shrink-0 backdrop-blur-xs transition-colors duration-150 hover:bg-[#FAF6F0] hover:text-[#211915] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Meet Hyun
            </Link>
          </div>
        </div>

        {/* Slide indicator dots */}
        <div
          role="group"
          aria-label="Hero banner slides"
          className="mt-10 flex items-center gap-1.5"
        >
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Show slide ${idx + 1} of ${slides.length}: ${slide.alt}`}
                aria-current={isActive ? 'true' : undefined}
                className="flex h-10 min-w-[32px] items-center justify-center rounded-full px-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span
                  aria-hidden="true"
                  className={`block h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-7 bg-[#FFFDF9]'
                      : 'w-2.5 bg-[#FFFDF9]/50 hover:bg-[#FFFDF9]/80'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
