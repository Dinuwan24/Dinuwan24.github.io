'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Loader2,
  Refrigerator,
  Search,
  X,
} from 'lucide-react';
import RecipeImage from './RecipeImage';

interface FridgeMatch {
  slug: string;
  title: string;
  url: string;
  image: string;
  imageAlt: string;
  matchStrength: 'Best Match' | 'Good Match' | 'Partial Match';
  matchedIngredients: string[];
  missingIngredients: string[];
  reason: string;
  ingredientListPending: boolean;
}

const EXAMPLE_PANTRIES = [
  'mozzarella, cheddar, bread, butter',
  'shrimp, garlic, butter, lemon, parsley',
  'Oreos, cream cheese, white chocolate',
];

export default function FridgeFinder() {
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [matches, setMatches] = useState<FridgeMatch[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runFinder = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    setIngredientsInput(trimmed);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/fridge-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: trimmed }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        summary?: string;
        matches?: FridgeMatch[];
        error?: string;
      };

      if (!res.ok) {
        throw new Error(
          data.error ||
            'The fridge finder is currently unavailable — you can still browse all 11 recipes below.'
        );
      }

      setSummary(data.summary ?? null);
      setMatches(Array.isArray(data.matches) ? data.matches : []);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'The fridge finder is currently unavailable — you can still browse all 11 recipes below.'
      );
      setSummary(null);
      setMatches(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runFinder(ingredientsInput);
  };

  const handleClear = () => {
    setIngredientsInput('');
    setSummary(null);
    setMatches(null);
    setErrorMessage(null);
  };

  return (
    <section
      id="fridge-finder"
      aria-labelledby="fridge-finder-heading"
      className="border-b border-[#E5DDD2] bg-[#F4EDE2] py-12 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#DFD3C3] bg-[#FFFDF9] p-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 text-[15px] font-semibold text-[#1D3B2B]">
              <Refrigerator className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>Kitchen Matcher</span>
            </div>
            <h2
              id="fridge-finder-heading"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#211915] sm:text-3xl"
            >
              What&apos;s in your fridge?
            </h2>
            <p className="mt-2 text-[17px] leading-relaxed text-[#4F443C]">
              Type the ingredients you already have and we&apos;ll rank the best matches from Hyun&apos;s 11 real recipes and show what you&apos;re missing.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch"
          >
            <label htmlFor="fridge-ingredients-input" className="sr-only">
              Ingredients you have on hand
            </label>
            <div className="relative flex-1">
              <input
                id="fridge-ingredients-input"
                type="text"
                value={ingredientsInput}
                onChange={(e) => setIngredientsInput(e.target.value)}
                placeholder="e.g. mozzarella, garlic, butter, flour tortillas, pepperoni..."
                disabled={isLoading}
                className="min-h-[54px] w-full rounded-xl border border-[#D4C5B4] bg-white px-4 pr-11 text-[17px] text-[#211915] placeholder:text-[#786A60] focus:border-[#B53D24] focus:outline-none"
              />
              {ingredientsInput && !isLoading && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear ingredients"
                  className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#6D5E54] hover:bg-[#F3ECE1] hover:text-[#211915]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || ingredientsInput.trim().length < 2}
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-[#B53D24] px-7 py-3 text-[17px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#99311B] disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin shrink-0" aria-hidden="true" />
                  <span>Matching recipes...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>Find Recipes</span>
                </>
              )}
            </button>
          </form>

          {/* Quick-try interactive buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-medium text-[#5E524A]">Try:</span>
            {EXAMPLE_PANTRIES.map((example) => (
              <button
                key={example}
                type="button"
                disabled={isLoading}
                onClick={() => void runFinder(example)}
                className="min-h-[40px] rounded-lg border border-[#E2D8CB] bg-[#FAF6F0] px-3.5 py-1.5 text-[14px] font-medium text-[#3A302A] transition-colors hover:border-[#1D3B2B] hover:text-[#1D3B2B] disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>

          {/* Graceful error state */}
          {errorMessage && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-[#E4B8AE] bg-[#FDF2EF] px-5 py-4 text-[16px] leading-relaxed text-[#7D2312]"
            >
              {errorMessage}
            </div>
          )}

          {/* Ranked matches */}
          {matches !== null && (
            <div className="mt-8 border-t border-[#EAE0D3] pt-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {summary && (
                  <p className="text-[18px] font-medium text-[#211915]">
                    {summary}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[15px] font-semibold text-[#5E524A] underline-offset-4 hover:text-[#B53D24] hover:underline whitespace-nowrap shrink-0"
                >
                  Clear results
                </button>
              </div>

              {matches.length === 0 ? (
                <p className="mt-4 text-[16px] text-[#574C44]">
                  No direct matches popped up from our 11 recipes — browse the full recipe collection just below for dinner and dessert inspiration.
                </p>
              ) : (
                <ol className="mt-6 divide-y divide-[#EDE5DA]">
                  {matches.map((match, idx) => (
                    <li
                      key={match.slug}
                      className="flex flex-col gap-5 py-6 first:pt-2 last:pb-0 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <Link
                          href={match.url}
                          className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl border border-[#E5DDD2] bg-[#EFE7DB] sm:w-40"
                        >
                          <RecipeImage
                            src={match.image}
                            alt={match.imageAlt}
                            title={match.title}
                            sizes="(max-width: 640px) 100vw, 160px"
                            className="object-cover"
                          />
                        </Link>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-[#1D3B2B] tabular-nums">
                            <span>#{idx + 1}</span>
                            <span aria-hidden="true">·</span>
                            <span>{match.matchStrength}</span>
                            {match.ingredientListPending && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-medium text-[#6B5C52]">
                                  Matched from summary (full ingredient list coming soon)
                                </span>
                              </>
                            )}
                          </div>

                          <h3 className="mt-1 font-display text-[22px] font-semibold leading-snug text-[#211915]">
                            <Link
                              href={match.url}
                              className="transition-colors hover:text-[#B53D24]"
                            >
                              {match.title}
                            </Link>
                          </h3>

                          <p className="mt-1.5 text-[16px] leading-relaxed text-[#4F443C]">
                            {match.reason}
                          </p>

                          <dl className="mt-3 space-y-1.5 text-[15px]">
                            {match.matchedIngredients.length > 0 && (
                              <div className="flex flex-wrap gap-x-2">
                                <dt className="font-semibold text-[#1D3B2B]">
                                  You have:
                                </dt>
                                <dd className="text-[#3A302A]">
                                  {match.matchedIngredients.join(', ')}
                                </dd>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-x-2">
                              <dt className="font-semibold text-[#B53D24]">
                                Missing:
                              </dt>
                              <dd className="text-[#3A302A]">
                                {match.missingIngredients.length > 0
                                  ? match.missingIngredients.join(', ')
                                  : match.ingredientListPending
                                    ? 'Full ingredient list not posted yet'
                                    : 'Nothing missing — you have everything!'}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Link
                          href={match.url}
                          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#1D3B2B] px-5 py-2.5 text-[16px] font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#152D20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D3B2B] md:w-auto"
                        >
                          <span>View Recipe</span>
                          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                        </Link>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
