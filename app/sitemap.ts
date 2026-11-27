import type { MetadataRoute } from 'next';
import { RECIPES, SITE_URL } from '@/src/data/recipes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const recipeEntries: MetadataRoute.Sitemap = RECIPES.map((recipe) => ({
    url: `${SITE_URL}/recipes/${recipe.slug}`,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...recipeEntries,
  ];
}
