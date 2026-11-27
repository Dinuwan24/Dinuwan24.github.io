import {
  Recipe,
  RECIPES,
  SITE_NAME,
  SITE_URL,
  HOME_SEO_DESCRIPTION,
  flattenIngredients,
  flattenMethodSteps,
  getTotalMinutes,
  minutesToIsoDuration,
} from '@/src/data/recipes';

export interface HowToStepJsonLd {
  '@type': 'HowToStep';
  position: number;
  text: string;
}

export interface RecipeJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Recipe';
  name: string;
  image: string[];
  description: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  url: string;
  recipeYield?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeIngredient: string[];
  recipeInstructions: HowToStepJsonLd[];
}

/**
 * Generates the Schema.org Recipe JSON-LD strictly from the authoritative
 * recipe data file, always preserving the ORIGINAL unscaled quantities.
 * Never fabricates times, yields, ingredients, nutrition, ratings, or reviews.
 */
export function buildRecipeJsonLd(recipe: Recipe): RecipeJsonLd {
  const prepTime = minutesToIsoDuration(recipe.prepMinutes);
  const cookTime = minutesToIsoDuration(recipe.cookMinutes);
  const totalTime = minutesToIsoDuration(getTotalMinutes(recipe));

  const originalIngredients = flattenIngredients(recipe);
  const originalSteps = flattenMethodSteps(recipe);

  const schema: RecipeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: [`${SITE_URL}${recipe.image}`],
    description: recipe.seoDescription,
    author: {
      '@type': 'Person',
      name: 'Hyun',
    },
    url: `${SITE_URL}/recipes/${recipe.slug}`,
    recipeIngredient: originalIngredients,
    recipeInstructions: originalSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step,
    })),
  };

  if (recipe.makes) {
    schema.recipeYield = recipe.makes;
  }
  if (prepTime) {
    schema.prepTime = prepTime;
  }
  if (cookTime) {
    schema.cookTime = cookTime;
  }
  if (totalTime) {
    schema.totalTime = totalTime;
  }

  return schema;
}

export function buildHomeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: HOME_SEO_DESCRIPTION,
    publisher: {
      '@type': 'Person',
      name: 'Hyun',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: RECIPES.map((recipe, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/recipes/${recipe.slug}`,
        name: recipe.title,
      })),
    },
  };
}
