'use client';

import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { IngredientSection } from '@/src/data/recipes';
import { scaleIngredientLine, scaleYieldText } from '@/lib/scale-ingredient';

interface RecipeScalerSectionProps {
  ingredients: IngredientSection[];
  makes: string | null;
}

const SCALE_OPTIONS = [
  { value: 0.5, label: '½×' },
  { value: 1, label: '1×' },
  { value: 2, label: '2×' },
  { value: 3, label: '3×' },
];

export default function RecipeScalerSection({
  ingredients,
  makes,
}: RecipeScalerSectionProps) {
  const [multiplier, setMultiplier] = useState<number>(1);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const hasIngredients = ingredients.some((section) => section.items.length > 0);
  const scaledYield = makes ? scaleYieldText(makes, multiplier) : null;

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section
      aria-labelledby="ingredients-heading"
      className="print-clean-card rounded-2xl border border-[#E4DACE] bg-[#FFFDF9] p-6 sm:p-8"
    >
      <div className="flex flex-col gap-4 border-b border-[#EDE5DA] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="ingredients-heading"
            className="font-display text-2xl font-semibold text-[#211915] sm:text-[28px]"
          >
            Ingredients
          </h2>
          {scaledYield && (
            <p className="mt-1 text-[16px] text-[#574C44]">
              {multiplier === 1 ? (
                <span>{makes}</span>
              ) : (
                <span>
                  Scaled ({SCALE_OPTIONS.find((o) => o.value === multiplier)?.label}):{' '}
                  <strong className="font-semibold text-[#211915]">{scaledYield}</strong>
                </span>
              )}
            </p>
          )}
        </div>

        {/* Serving scaler controls (client interactive; JSON-LD always stays 1x original) */}
        <div className="no-print flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[14px] font-semibold text-[#574C44]">
            Scale:
          </span>
          <div
            role="group"
            aria-label="Scale recipe servings"
            className="inline-flex items-center gap-1 rounded-xl border border-[#E2D8CB] bg-[#F6F0E7] p-1"
          >
            {SCALE_OPTIONS.map((option) => {
              const isActive = multiplier === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMultiplier(option.value)}
                  disabled={!hasIngredients}
                  aria-pressed={isActive}
                  className={`min-h-[44px] min-w-[48px] rounded-lg px-3.5 text-[15px] font-semibold tabular-nums whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24] disabled:cursor-not-allowed disabled:opacity-50 ${
                    isActive
                      ? 'bg-[#B53D24] text-white shadow-xs'
                      : 'text-[#3A302A] hover:bg-[#EAE0D3]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {multiplier !== 1 && (
            <button
              type="button"
              onClick={() => setMultiplier(1)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-[14px] font-medium text-[#574C44] whitespace-nowrap shrink-0 hover:bg-[#F3ECE1] hover:text-[#211915] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
      </div>

      {!hasIngredients ? (
        <div className="mt-6 rounded-xl border border-dashed border-[#D6C8B8] bg-[#FAF6F0] p-6">
          <p className="text-[17px] font-semibold text-[#211915]">
            Ingredients list — awaiting verbatim recipe text
          </p>
          <p className="mt-2 text-[16px] leading-relaxed text-[#574C44]">
            The exact ingredient measurements for this recipe will appear here as soon as Hyun&apos;s verbatim recipe text is added to the recipe data file. Once added, the serving scaler above will automatically adjust quantities for ½×, 1×, 2×, and 3× batches.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-7">
          {ingredients.map((section, sectionIdx) => (
            <div key={section.heading ?? `section-${sectionIdx}`}>
              {section.heading && (
                <h3 className="mb-3 font-sans text-[16px] font-bold tracking-wide text-[#1D3B2B]">
                  {section.heading}
                </h3>
              )}
              <ul className="divide-y divide-[#F0E8DD]">
                {section.items.map((item, itemIdx) => {
                  const key = `${sectionIdx}-${itemIdx}`;
                  const isChecked = Boolean(checkedItems[key]);
                  const displayedText = scaleIngredientLine(item, multiplier);

                  return (
                    <li key={key} className="py-1">
                      <label className="flex min-h-[48px] cursor-pointer items-start gap-3.5 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#FAF6F0]">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(key)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`no-print mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                            isChecked
                              ? 'border-[#1D3B2B] bg-[#1D3B2B] text-white'
                              : 'border-[#C7B9A8] bg-white'
                          }`}
                        >
                          {isChecked && <Check className="h-4 w-4 stroke-[2.5]" />}
                        </span>
                        <span
                          className={`text-[18px] leading-relaxed tabular-nums ${
                            isChecked
                              ? 'text-[#8C7E74] line-through'
                              : 'text-[#211915]'
                          }`}
                        >
                          {displayedText}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
