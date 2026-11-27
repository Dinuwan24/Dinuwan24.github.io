import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Flame,
  Utensils,
} from 'lucide-react';
import {
  PATREON_URL,
  RECIPES,
  SITE_NAME,
  SITE_URL,
  formatMinutesDisplay,
  getRecipeBySlug,
  getRelatedRecipes,
  getTotalMinutes,
} from '@/src/data/recipes';
import { buildRecipeJsonLd } from '@/lib/recipe-schema';
import RecipeImage from '@/components/RecipeImage';
import RecipeScalerSection from '@/components/RecipeScalerSection';
import PrintRecipeButton from '@/components/PrintRecipeButton';
import RecipeCard from '@/components/RecipeCard';
import HandsFreeCookingMode from '@/components/HandsFreeCookingMode';

export const dynamicParams = false;

export function generateStaticParams() {
  return RECIPES.map((recipe) => ({
    slug: recipe.slug,
  }));
}

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    return {
      title: `Recipe Not Found | ${SITE_NAME}`,
    };
  }

  const canonicalUrl = `${SITE_URL}/recipes/${recipe.slug}`;
  const fullImageUrl = `${SITE_URL}${recipe.image}`;

  return {
    title: recipe.seoTitle,
    description: recipe.seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: recipe.seoTitle,
      description: recipe.seoDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'article',
      locale: 'en_US',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 900,
          alt: recipe.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.seoTitle,
      description: recipe.seoDescription,
      images: [fullImageUrl],
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const recipeJsonLd = buildRecipeJsonLd(recipe);
  const relatedRecipes = getRelatedRecipes(recipe.slug, 3);

  const makesDisplay = recipe.makes ?? 'Coming soon';
  const prepDisplay =
    recipe.prepTimeLabel ?? formatMinutesDisplay(recipe.prepMinutes) ?? 'Coming soon';
  const cookDisplay =
    recipe.cookTimeLabel ?? formatMinutesDisplay(recipe.cookMinutes) ?? 'Coming soon';
  const totalMinutes = getTotalMinutes(recipe);
  const totalDisplay =
    recipe.totalTimeLabel ?? formatMinutesDisplay(totalMinutes);

  const hasMethodSteps = recipe.method.some((section) => section.steps.length > 0);
  const methodSectionsWithOffsets = recipe.method.reduce<
    Array<{ heading?: string; steps: Array<{ number: number; text: string }> }>
  >((acc, section) => {
    const prevCount = acc.reduce((sum, s) => sum + s.steps.length, 0);
    return [
      ...acc,
      {
        heading: section.heading,
        steps: section.steps.map((text, idx) => ({
          number: prevCount + idx + 1,
          text,
        })),
      },
    ];
  }, []);

  const handsFreeSteps = methodSectionsWithOffsets.flatMap((section) =>
    section.steps.map((step) => ({
      number: step.number,
      sectionHeading: section.heading,
      text: step.text,
    }))
  );

  return (
    <>
      {/* Recipe JSON-LD strictly from src/data/recipes.ts — always ORIGINAL unscaled quantities */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
      />

      <article className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="no-print mb-6">
            <Link
              href="/#recipes"
              className="inline-flex min-h-[44px] items-center gap-2 text-[16px] font-semibold text-[#1D3B2B] transition-colors hover:text-[#B53D24] hover:underline underline-offset-4"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Back to all recipes</span>
            </Link>
          </nav>

          {/* Print-only brand header */}
          <p className="print-only hidden text-sm font-semibold text-[#444]">
            {SITE_NAME} — {SITE_URL}/recipes/{recipe.slug}
          </p>

          {/* Recipe title & intro */}
          <header className="max-w-3xl">
            <h1 className="font-display text-[34px] font-semibold leading-[1.15] tracking-tight text-[#211915] sm:text-[46px] [text-wrap:balance]">
              {recipe.title}
            </h1>

            {recipe.intro && recipe.intro.length > 0 ? (
              <div className="mt-5 space-y-4 text-[18px] leading-relaxed text-[#423832]">
                {recipe.intro.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <p className="text-[18px] leading-relaxed text-[#423832]">
                  {recipe.seoDescription}
                </p>
                <p className="no-print text-[15px] italic text-[#6D5E54]">
                  [Placeholder: Full personal recipe intro will appear here once Hyun&apos;s verbatim text is added.]
                </p>
              </div>
            )}

            {/* Quick actions */}
            <div className="no-print mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#ingredients-heading"
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B53D24] px-6 py-2.5 text-[16px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#99311B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24]"
              >
                Jump to Recipe
              </a>
              <HandsFreeCookingMode
                slug={recipe.slug}
                title={recipe.title}
                steps={handsFreeSteps}
              />
              <PrintRecipeButton />
            </div>
          </header>

          {/* Makes / Prep / Cook chips */}
          <section
            aria-label="Recipe timing and yield"
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          >
            <div className="print-clean-card flex items-center gap-3.5 rounded-xl border border-[#E4DACE] bg-[#FFFDF9] px-5 py-4">
              <Utensils className="h-5 w-5 shrink-0 text-[#B53D24]" aria-hidden="true" />
              <div>
                <p className="text-[13px] font-semibold text-[#665950]">Yield</p>
                <p className="text-[17px] font-semibold text-[#211915] tabular-nums">
                  {makesDisplay}
                </p>
              </div>
            </div>

            <div className="print-clean-card flex items-center gap-3.5 rounded-xl border border-[#E4DACE] bg-[#FFFDF9] px-5 py-4">
              <Clock className="h-5 w-5 shrink-0 text-[#1D3B2B]" aria-hidden="true" />
              <div>
                <p className="text-[13px] font-semibold text-[#665950]">Prep Time</p>
                <p className="text-[17px] font-semibold text-[#211915] tabular-nums">
                  {prepDisplay}
                </p>
              </div>
            </div>

            <div className="print-clean-card flex items-center gap-3.5 rounded-xl border border-[#E4DACE] bg-[#FFFDF9] px-5 py-4">
              <Flame className="h-5 w-5 shrink-0 text-[#B53D24]" aria-hidden="true" />
              <div>
                <p className="text-[13px] font-semibold text-[#665950]">Cook Time</p>
                <p className="text-[17px] font-semibold text-[#211915] tabular-nums">
                  {cookDisplay}
                </p>
              </div>
            </div>

            {totalDisplay && (
              <div className="print-clean-card flex items-center gap-3.5 rounded-xl border border-[#E4DACE] bg-[#FFFDF9] px-5 py-4">
                <Clock className="h-5 w-5 shrink-0 text-[#1D3B2B]" aria-hidden="true" />
                <div>
                  <p className="text-[13px] font-semibold text-[#665950]">Total Time</p>
                  <p className="text-[17px] font-semibold text-[#211915] tabular-nums">
                    {totalDisplay}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Hero Recipe Photo */}
          <figure className="mt-8 overflow-hidden rounded-2xl border border-[#E4DACE] bg-[#EFE7DB]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              <RecipeImage
                src={recipe.image}
                alt={recipe.imageAlt}
                title={recipe.title}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </figure>

          {/* Ingredients (with Client Serving Scaler) & Numbered Method Steps */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10 print:block print:space-y-8">
            <div className="lg:col-span-5">
              <RecipeScalerSection
                ingredients={recipe.ingredients}
                makes={recipe.makes}
              />
            </div>

            <section
              aria-labelledby="method-heading"
              className="print-clean-card rounded-2xl border border-[#E4DACE] bg-[#FFFDF9] p-6 sm:p-8 lg:col-span-7"
            >
              <div className="border-b border-[#EDE5DA] pb-5">
                <h2
                  id="method-heading"
                  className="font-display text-2xl font-semibold text-[#211915] sm:text-[28px]"
                >
                  Method
                </h2>
              </div>

              {!hasMethodSteps ? (
                <div className="mt-6 rounded-xl border border-dashed border-[#D6C8B8] bg-[#FAF6F0] p-6">
                  <p className="text-[17px] font-semibold text-[#211915]">
                    Step-by-step method — awaiting verbatim recipe text
                  </p>
                  <p className="mt-2 text-[16px] leading-relaxed text-[#574C44]">
                    Hyun&apos;s exact numbered instructions for{' '}
                    <span className="font-medium text-[#211915]">{recipe.title}</span>{' '}
                    will be inserted here verbatim as soon as they arrive. Both this method list and the page&apos;s Recipe JSON-LD structured data generate automatically from the same data file.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-8">
                  {methodSectionsWithOffsets.map((section, sectionIdx) => (
                    <div key={section.heading ?? `method-${sectionIdx}`}>
                      {section.heading && (
                        <h3 className="mb-4 font-sans text-[16px] font-bold tracking-wide text-[#1D3B2B]">
                          {section.heading}
                        </h3>
                      )}
                      <ol className="space-y-6">
                        {section.steps.map((step) => (
                          <li
                            key={`${sectionIdx}-${step.number}`}
                            className="flex items-start gap-4"
                          >
                            <span
                              aria-hidden="true"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B53D24] font-display text-[17px] font-semibold text-white tabular-nums"
                            >
                              {step.number}
                            </span>
                            <p className="pt-0.5 text-[18px] leading-[1.7] text-[#211915]">
                              {step.text}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              )}

              {recipe.tips && (
                <div className="mt-8 rounded-xl border border-[#E4DACE] bg-[#FAF6F0] p-5 sm:p-6">
                  <p className="text-[17px] leading-relaxed text-[#211915]">
                    {recipe.tips}
                  </p>
                </div>
              )}

              {recipe.postScript && (
                <p className="mt-5 text-[16px] leading-relaxed text-[#4F443C]">
                  {recipe.postScript}
                </p>
              )}

              {recipe.closingQuestion && (
                <p className="mt-6 font-display text-[20px] font-medium leading-snug text-[#1D3B2B]">
                  {recipe.closingQuestion}
                </p>
              )}

              {recipe.notes && recipe.notes.length > 0 && (
                <div className="mt-8 border-t border-[#EDE5DA] pt-6">
                  <h3 className="font-display text-xl font-semibold text-[#1D3B2B]">
                    Kitchen Notes
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-[17px] leading-relaxed text-[#423832]">
                    {recipe.notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>

          {/* Patreon Support Banner (hidden on print) */}
          <aside className="no-print mt-12 rounded-2xl border border-[#DDD2C3] bg-[#F4EDE2] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-semibold text-[#211915]">
                  Want more cozy recipes from Hyun?
                </h2>
                <p className="mt-2 text-[17px] leading-relaxed text-[#4F443C]">
                  Join Hyun on Patreon for exclusive comfort food recipes or grab her printable recipe eBooks.
                </p>
              </div>
              <a
                href={PATREON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#B53D24] px-6 py-3 text-[16px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#99311B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24]"
              >
                <span>Join on Patreon</span>
                <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </aside>

          {/* More Recipes (hidden on print) */}
          <section
            aria-labelledby="more-recipes-heading"
            className="no-print mt-16 border-t border-[#E5DDD2] pt-12"
          >
            <div className="flex items-end justify-between gap-4">
              <h2
                id="more-recipes-heading"
                className="font-display text-2xl font-semibold text-[#211915] sm:text-3xl"
              >
                More from Hyun&apos;s Kitchen
              </h2>
              <Link
                href="/#recipes"
                className="text-[16px] font-semibold text-[#B53D24] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                View all 11
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedRecipes.map((related) => (
                <RecipeCard key={related.slug} recipe={related} />
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
