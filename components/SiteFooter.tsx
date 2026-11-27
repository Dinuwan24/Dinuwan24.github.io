import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import {
  AFFILIATE_DISCLOSURE,
  FACEBOOK_URL,
  PATREON_URL,
  SITE_NAME,
} from '@/src/data/recipes';
import EmailSignupForm from './EmailSignupForm';

export default function SiteFooter() {
  return (
    <footer className="no-print border-t border-[#183324] bg-[#1D3B2B] text-[#F5EFE6]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start">
          {/* Brand summary */}
          <div className="md:col-span-5 space-y-3">
            <Link
              href="/"
              className="font-display text-2xl font-semibold tracking-tight text-white hover:text-[#F4D5C6] transition-colors"
            >
              {SITE_NAME}
            </Link>
            <p className="max-w-md text-[16px] leading-relaxed text-[#DCE7DF]">
              Warm, approachable comfort food recipes from Hyun&apos;s home kitchen — cheesy bites, easy weeknight dinners, and homemade sweets made with love.
            </p>
          </div>

          {/* Site links */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="font-sans text-[15px] font-semibold tracking-wide text-white">
              Explore
            </h2>
            <ul className="space-y-2 text-[16px] text-[#DCE7DF]">
              <li>
                <Link href="/#recipes" className="inline-flex min-h-[40px] items-center hover:text-white hover:underline underline-offset-4">
                  All 11 Recipes
                </Link>
              </li>
              <li>
                <Link href="/#about" className="inline-flex min-h-[40px] items-center hover:text-white hover:underline underline-offset-4">
                  About Hyun
                </Link>
              </li>
              <li>
                <Link href="/#patreon" className="inline-flex min-h-[40px] items-center hover:text-white hover:underline underline-offset-4">
                  Patreon &amp; eBooks
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & only allowed social link (Facebook) */}
          <div className="md:col-span-4 space-y-3">
            <h2 className="font-sans text-[15px] font-semibold tracking-wide text-white">
              Connect
            </h2>
            <ul className="space-y-2 text-[16px] text-[#DCE7DF]">
              <li>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 hover:text-white hover:underline underline-offset-4"
                >
                  <span>Follow on Facebook</span>
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={PATREON_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 hover:text-white hover:underline underline-offset-4"
                >
                  <span>Support on Patreon</span>
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Compact weekly recipe signup line */}
        <EmailSignupForm variant="footer" />

        {/* Affiliate disclosure (exact verbatim line) & copyright */}
        <div className="mt-8 border-t border-[#2E543E] pt-8 space-y-3">
          <p className="text-[15px] leading-relaxed text-[#E3ECE6]">
            {AFFILIATE_DISCLOSURE}
          </p>
          <p className="text-[14px] text-[#B8CCBF]">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
