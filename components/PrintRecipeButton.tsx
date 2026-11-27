'use client';

import { Printer } from 'lucide-react';

export default function PrintRecipeButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-[#1D3B2B] bg-white px-5 py-2.5 text-[16px] font-semibold text-[#1D3B2B] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#1D3B2B] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D3B2B]"
    >
      <Printer className="h-5 w-5" aria-hidden="true" />
      <span>Print Recipe</span>
    </button>
  );
}
