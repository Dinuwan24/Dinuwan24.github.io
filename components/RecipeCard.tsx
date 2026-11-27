import Link from 'next/link';
import { Clock } from 'lucide-react';
import {
  Recipe,
  formatMinutesDisplay,
  getTotalMinutes,
} from '@/src/data/recipes';
import RecipeImage from './RecipeImage';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const totalMinutes = getTotalMinutes(recipe);
  const timeDisplay =
    formatMinutesDisplay(totalMinutes) ?? recipe.totalTimeLabel ?? 'Time coming soon';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5DDD2] bg-[#FFFDF9] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4C5B4] hover:shadow-md">
      <Link
        href={`/recipes/${recipe.slug}`}
        className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#B53D24]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFE7DB]">
          <RecipeImage
            src={recipe.image}
            alt={recipe.imageAlt}
            title={recipe.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <h3 className="font-display text-[22px] font-semibold leading-snug text-[#211915] transition-colors group-hover:text-[#B53D24]">
              {recipe.title}
            </h3>
            <p className="mt-2.5 text-[16px] leading-relaxed text-[#4F443C]">
              {recipe.shortLine}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[#F0E8DD] pt-4 text-[14px] font-medium text-[#5A4F47]">
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Clock className="h-4 w-4 shrink-0 text-[#1D3B2B]" aria-hidden="true" />
              <span>{timeDisplay}</span>
            </span>
            <span className="font-semibold text-[#B53D24] group-hover:underline underline-offset-4 whitespace-nowrap shrink-0">
              View recipe
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
