import { ArrowUpRight, BookOpen } from 'lucide-react';
import { PATREON_URL } from '@/src/data/recipes';

const PATREON_TIERS = [
  {
    name: 'Your Cooking Girl (Basic)',
    price: '$5',
    cadence: '/month',
    featured: false,
    summary:
      'Support Hyun’s kitchen every month and get early access to cozy comfort food recipes, behind-the-scenes cooking updates, and community recipe polls.',
    ctaLabel: 'Join Basic on Patreon',
  },
  {
    name: 'Private Cook Girl (Exclusive VIP)',
    price: '$20',
    cadence: '/month',
    featured: true,
    summary:
      'For devoted comfort-food lovers who want full VIP access — exclusive member-only recipes, personal kitchen notes, and priority recipe requests straight from Hyun.',
    ctaLabel: 'Join Exclusive VIP on Patreon',
  },
];

const RECIPE_EBOOKS = [
  {
    title: 'Hyun’s Signature Comfort Food eBook',
    price: '$6.50',
    summary:
      'A printable digital collection of Hyun’s favorite cheesy, cozy, and crowd-pleasing recipes formatted cleanly for your kitchen tablet or binder.',
    ctaLabel: 'Get the $6.50 eBook on Patreon',
  },
  {
    title: 'Hyun’s Sweet & Easy Treats eBook',
    price: '$4.50',
    summary:
      'Simple, no-fuss homemade sweets and snackable bites you can pull together for weeknights, cravings, and holiday trays.',
    ctaLabel: 'Get the $4.50 eBook on Patreon',
  },
];

export default function PatreonSection() {
  return (
    <section
      id="patreon"
      aria-labelledby="patreon-heading"
      className="border-t border-[#E5DDD2] bg-[#F4EDE2] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl">
          <p className="text-[15px] font-semibold text-[#1D3B2B]">
            Support Hyun&apos;s Kitchen
          </p>
          <h2
            id="patreon-heading"
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#211915] sm:text-4xl [text-wrap:balance]"
          >
            Cook even closer with Hyun on Patreon
          </h2>
          <p className="mt-4 text-[18px] leading-relaxed text-[#4F443C]">
            Love these comfort food recipes? Join the Patreon family for monthly perks, or pick up a downloadable recipe eBook to keep right in your kitchen.
          </p>
        </div>

        {/* Two Patreon membership tier cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {PATREON_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col justify-between rounded-2xl p-6 sm:p-8 ${
                tier.featured
                  ? 'border-2 border-[#B53D24] bg-[#FFFDF9]'
                  : 'border border-[#DDD2C3] bg-[#FFFDF9]'
              }`}
            >
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#EFE7DB] pb-5">
                  <h3 className="font-display text-2xl font-semibold text-[#211915]">
                    {tier.name}
                  </h3>
                  <p className="font-display text-3xl font-bold text-[#B53D24] tabular-nums whitespace-nowrap">
                    {tier.price}
                    <span className="font-sans text-[16px] font-medium text-[#5A4F47]">
                      {tier.cadence}
                    </span>
                  </p>
                </div>

                <p className="mt-5 text-[17px] leading-relaxed text-[#4F443C]">
                  {tier.summary}
                </p>
              </div>

              <div className="mt-8">
                <a
                  href={PATREON_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-[16px] font-semibold whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24] ${
                    tier.featured
                      ? 'bg-[#B53D24] text-white hover:bg-[#99311B]'
                      : 'bg-[#1D3B2B] text-white hover:bg-[#152D20]'
                  }`}
                >
                  <span>{tier.ctaLabel}</span>
                  <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Two Recipe eBooks */}
        <div id="ebooks" className="mt-14 pt-12 border-t border-[#E1D7C8]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold text-[#211915] sm:text-3xl">
                Downloadable Recipe eBooks
              </h3>
              <p className="mt-2 text-[17px] text-[#4F443C]">
                One-time digital downloads available directly in Hyun&apos;s Patreon shop.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {RECIPE_EBOOKS.map((book) => (
              <div
                key={book.price}
                className="flex flex-col justify-between rounded-2xl border border-[#DDD2C3] bg-[#FFFDF9] p-6 sm:p-8"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <BookOpen
                        className="mt-1 h-6 w-6 shrink-0 text-[#1D3B2B]"
                        aria-hidden="true"
                      />
                      <h4 className="font-display text-[22px] font-semibold leading-snug text-[#211915]">
                        {book.title}
                      </h4>
                    </div>
                    <span className="font-display text-2xl font-bold text-[#1D3B2B] tabular-nums whitespace-nowrap shrink-0">
                      {book.price}
                    </span>
                  </div>
                  <p className="mt-4 text-[16px] leading-relaxed text-[#4F443C]">
                    {book.summary}
                  </p>
                </div>

                <div className="mt-7">
                  <a
                    href={PATREON_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#B53D24] bg-white px-5 py-3 text-[16px] font-semibold text-[#B53D24] whitespace-nowrap transition-colors duration-150 hover:bg-[#B53D24] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24]"
                  >
                    <span>{book.ctaLabel}</span>
                    <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
