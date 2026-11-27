import type { Metadata } from 'next';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import {
  FACEBOOK_URL,
  HOME_SEO_DESCRIPTION,
  HOME_SEO_TITLE,
  PATREON_URL,
  PINTEREST_DOMAIN_VERIFY,
  RECIPES,
  SITE_NAME,
  SITE_URL,
  getRecipeBySlug,
} from '@/src/data/recipes';
import { buildHomeJsonLd } from '@/lib/recipe-schema';
import RecipeCard from '@/components/RecipeCard';
import PatreonSection from '@/components/PatreonSection';
import FridgeFinder from '@/components/FridgeFinder';
import EmailSignupForm from '@/components/EmailSignupForm';
import HeroBanner, { type HeroSlide } from '@/components/HeroBanner';

export const metadata: Metadata = {
  title: HOME_SEO_TITLE,
  description: HOME_SEO_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${SITE_URL}/images/hyun-kitchen-hero.jpg`,
        width: 1408,
        height: 768,
        alt: 'Recipes by Hyun comfort food table spread',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
    images: [`${SITE_URL}/images/hyun-kitchen-hero.jpg`],
  },
  other: {
    'p:domain_verify': PINTEREST_DOMAIN_VERIFY,
  },
};

export default function HomePage() {
  const homeJsonLd = buildHomeJsonLd();

  const nashvilleRecipe = getRecipeBySlug('nashville-hot-chicken-burger');
  const mousseCakeRecipe = getRecipeBySlug('no-bake-chocolate-mousse-cake');

  const heroSlides: HeroSlide[] = [
    {
      src: '/images/hyun-banner-pancakes.jpg',
      alt: 'Hyun holding a plate of pancakes in her kitchen',
      objectPosition: 'object-[50%_25%]',
    },
    {
      src: nashvilleRecipe?.image ?? '/images/nashville-hot-chicken-burger.jpg',
      alt:
        nashvilleRecipe?.imageAlt ??
        'Crispy Nashville hot chicken burger on a toasted brioche bun',
      objectPosition: 'object-center',
    },
    {
      src: '/images/hyun-banner-cheesy.jpg',
      alt: 'Hyun presenting a cheesy baked dish',
      objectPosition: 'object-[50%_25%]',
    },
    {
      src: mousseCakeRecipe?.image ?? '/images/no-bake-chocolate-mousse-cake.jpg',
      alt:
        mousseCakeRecipe?.imageAlt ??
        'Slice of rich no-bake chocolate mousse cake with smooth chocolate glaze',
      objectPosition: 'object-center',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      {/* Rotating 4-Slide Hero Banner */}
      <HeroBanner
        siteName={SITE_NAME}
        headline="Comfort food recipes — oozy cheesy chicken, decadent cheesecakes"
        tagline="Cheesy bites, easy dinners and homemade sweets — simple recipes made with love, straight from Hyun's kitchen."
        slides={heroSlides}
      />

      {/* What's in your fridge? AI Finder */}
      <FridgeFinder />

      {/* All 11 Recipes Grid */}
      <section
        id="recipes"
        aria-labelledby="recipes-heading"
        className="py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 border-b border-[#E5DDD2] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="recipes-heading"
                className="font-display text-3xl font-semibold tracking-tight text-[#211915] sm:text-4xl"
              >
                All Recipes
              </h2>
              <p className="mt-2 text-[17px] text-[#4F443C]">
                Cheesy bites, cozy weeknight dinners, holiday favorites, and homemade sweets.
              </p>
            </div>
            <p className="text-[15px] font-semibold text-[#1D3B2B] tabular-nums whitespace-nowrap">
              {RECIPES.length} Kitchen Favorites
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {RECIPES.map((recipe) => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Recipe Email Signup (front-end slot for MailerLite at launch) */}
      <EmailSignupForm variant="section" />

      {/* About Hyun Section */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="border-t border-[#E5DDD2] bg-[#FFFDF9] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] max-w-[440px] overflow-hidden rounded-2xl border-2 border-[#DDD0BE] bg-[#EFE7DB] shadow-xs lg:mx-0">
                <Image
                  src="/images/hyun-about.jpg"
                  alt="Hyun in her kitchen"
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  referrerPolicy="no-referrer"
                  className="object-cover object-top"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="text-[15px] font-semibold text-[#B53D24]">
                About the Cook
              </p>
              <h2
                id="about-heading"
                className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#211915] sm:text-4xl [text-wrap:balance]"
              >
                Hey cutie, I&apos;m Hyun!
              </h2>

              <div className="mt-5 space-y-4 text-[18px] leading-relaxed text-[#423832]">
                <p>
                  Welcome into my kitchen! I started <strong>{SITE_NAME}</strong> because I believe the very best meals are the cozy, no-stress ones you actually crave at the end of a long day — golden crispy toast oozing with melted cheese, garlicky butter sauces you want to scoop up with bread, and sweet treats that make the whole house smell amazing.
                </p>
                <p>
                  Nothing here is fussy or intimidating. Every recipe is written for real home cooks using everyday pantry ingredients, clear steps, and lots of love — whether you&apos;re making a quick weeknight dinner for two or sharing a tray of holiday treats with family.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#1D3B2B] px-6 py-3 text-[16px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#152D20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D3B2B]"
                >
                  <span>Follow on Facebook</span>
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
                <a
                  href={PATREON_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#D4C5B4] bg-[#FAF6F0] px-6 py-3 text-[16px] font-semibold text-[#211915] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#B53D24] hover:text-[#B53D24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24]"
                >
                  <span>Visit Hyun&apos;s Patreon</span>
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patreon & Recipe eBooks Section */}
      <PatreonSection />
    </>
  );
}
