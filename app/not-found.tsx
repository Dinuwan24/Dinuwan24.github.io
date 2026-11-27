import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <p className="text-[15px] font-semibold text-[#B53D24]">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-[#211915] sm:text-4xl">
          That recipe wasn&apos;t found
        </h1>
        <p className="mt-4 text-[18px] leading-relaxed text-[#4F443C]">
          The page you&apos;re looking for may have moved, or the recipe link may have a typo. Head back to Hyun&apos;s kitchen to browse all 11 comfort food recipes.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#B53D24] px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-[#99311B]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Back to Recipes by Hyun</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
