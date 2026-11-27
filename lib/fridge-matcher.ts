import { RECIPES, flattenIngredients } from '@/src/data/recipes';

export interface DeterministicFridgeMatch {
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

const ALIAS_MAP: Record<string, string[]> = {
  mayo: ['mayonnaise'],
  mayonnaise: ['mayo'],
  parm: ['parmesan'],
  parmesan: ['parmesan'],
  chili: ['chilli', 'chili'],
  chilli: ['chilli', 'chili'],
  'chili flakes': ['chilli flakes', 'chili flakes'],
  'chilli flakes': ['chilli flakes', 'chili flakes'],
  cornflour: ['cornstarch'],
  cornstarch: ['cornstarch', 'cornflour'],
  oreo: ['oreo', 'oreos'],
  oreos: ['oreo', 'oreos'],
  saltine: ['saltine', 'saltines'],
  saltines: ['saltine', 'saltines'],
  'candy cane': ['candy cane', 'candy canes'],
  'candy canes': ['candy cane', 'candy canes'],
  'hot dog': ['hot dog', 'hot dogs'],
  'hot dogs': ['hot dog', 'hot dogs'],
  tortilla: ['tortilla', 'tortillas'],
  tortillas: ['tortilla', 'tortillas'],
  pickle: ['pickle', 'pickles'],
  pickles: ['pickle', 'pickles'],
  bun: ['bun', 'buns'],
  buns: ['bun', 'buns'],
  egg: ['egg', 'eggs'],
  eggs: ['egg', 'eggs'],
  pecan: ['pecan', 'pecans'],
  pecans: ['pecan', 'pecans'],
  cookie: ['cookie', 'cookies'],
  cookies: ['cookie', 'cookies'],
  'chocolate chip': ['chocolate chip', 'chocolate chips'],
  'chocolate chips': ['chocolate chip', 'chocolate chips'],
  'white chocolate': ['white chocolate'],
  'dark chocolate': ['dark chocolate'],
  'cream cheese': ['cream cheese'],
  'heavy cream': ['heavy cream'],
  'whipping cream': ['heavy cream'],
  'double cream': ['heavy cream'],
  'pizza dough': ['pizza dough'],
  'pizza sauce': ['pizza sauce'],
  marinara: ['marinara', 'marinara sauce'],
  'greek yogurt': ['greek yogurt', 'yogurt'],
  yoghurt: ['yogurt'],
  yogurt: ['yogurt'],
  'olive oil': ['olive oil'],
  'coconut oil': ['coconut oil'],
  'brown sugar': ['brown sugar'],
  'white sugar': ['white sugar', 'sugar'],
  'garlic powder': ['garlic powder'],
  'onion powder': ['onion powder'],
  'black pepper': ['black pepper'],
  'baking soda': ['baking soda'],
  'baking powder': ['baking powder'],
  'italian herbs': ['italian herb', 'italian herbs'],
  'vanilla extract': ['vanilla extract', 'vanilla'],
  vanilla: ['vanilla', 'vanilla extract'],
  flour: ['flour'],
  pasta: ['spaghetti', 'linguine', 'pasta'],
  spaghetti: ['spaghetti', 'pasta'],
  linguine: ['linguine', 'pasta'],
  cheese: ['mozzarella', 'cheddar', 'parmesan', 'cream cheese'],
  lemon: ['lemon', 'lemon juice', 'lemon wedges'],
  pepper: ['black pepper', 'cayenne pepper'],
};

const IGNORED_TOKENS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'some',
  'of',
  'with',
  'for',
  'i',
  'have',
  'got',
  'in',
  'my',
  'fridge',
  'pantry',
]);

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function singularizeWord(word: string): string {
  if (word.length <= 3) return word;
  if (word.endsWith('ies') && word.length > 4) {
    return `${word.slice(0, -3)}y`;
  }
  if (word.endsWith('es') && /(ches|shes|xes|zes|ses)$/.test(word)) {
    return word.slice(0, -2);
  }
  if (word.endsWith('s') && !word.endsWith('ss')) {
    return word.slice(0, -1);
  }
  return word;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function parseUserIngredients(input: string): string[] {
  const rawParts = input
    .split(/[,;\n]+|\band\b/gi)
    .map((part) => normalizeText(part))
    .filter((part) => part.length >= 2 && !IGNORED_TOKENS.has(part));

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const part of rawParts) {
    if (!seen.has(part)) {
      seen.add(part);
      unique.push(part);
    }
  }
  return unique;
}

function expandTermVariants(term: string): string[] {
  const variants = new Set<string>([term]);
  const singularPhrase = term
    .split(' ')
    .map((w) => singularizeWord(w))
    .join(' ');
  variants.add(singularPhrase);

  const mapped = ALIAS_MAP[term] ?? ALIAS_MAP[singularPhrase];
  if (mapped) {
    for (const m of mapped) {
      variants.add(m);
    }
  }

  return Array.from(variants).filter((v) => v.length >= 2);
}

function ingredientLineMatchesTerm(
  normalizedLine: string,
  singularizedLine: string,
  term: string
): boolean {
  const variants = expandTermVariants(term);

  // Guard against overly broad matches for specific multi-word ingredients
  if (term === 'cream') {
    return /\bheavy cream\b/.test(normalizedLine);
  }
  if (term === 'milk') {
    return /\bmilk\b/.test(normalizedLine);
  }
  if (term === 'butter') {
    return /\bbutter\b/.test(normalizedLine);
  }

  for (const variant of variants) {
    const pattern = new RegExp(`\\b${escapeRegExp(variant)}\\b`, 'i');
    if (pattern.test(normalizedLine) || pattern.test(singularizedLine)) {
      return true;
    }
  }
  return false;
}

/**
 * Deterministically ranks recipes from src/data/recipes.ts by:
 * 1) Most matched ingredients first
 * 2) Fewest missing ingredients second
 * 3) Original recipe order as stable tie-breaker
 */
export function rankRecipesDeterministically(
  rawInput: string,
  maxResults = 5
): {
  parsedTerms: string[];
  matches: DeterministicFridgeMatch[];
} {
  const parsedTerms = parseUserIngredients(rawInput);
  if (parsedTerms.length === 0) {
    return { parsedTerms: [], matches: [] };
  }

  const scored = RECIPES.map((recipe, recipeIndex) => {
    const allIngredients = flattenIngredients(recipe);
    const matchedIngredients: string[] = [];
    const missingIngredients: string[] = [];

    for (const line of allIngredients) {
      const normalizedLine = normalizeText(line);
      const singularizedLine = normalizedLine
        .split(' ')
        .map((w) => singularizeWord(w))
        .join(' ');

      const isMatched = parsedTerms.some((term) =>
        ingredientLineMatchesTerm(normalizedLine, singularizedLine, term)
      );

      if (isMatched) {
        matchedIngredients.push(line);
      } else {
        missingIngredients.push(line);
      }
    }

    return {
      recipe,
      recipeIndex,
      allIngredients,
      matchedIngredients,
      missingIngredients,
    };
  })
    .filter((entry) => entry.matchedIngredients.length > 0)
    .sort((a, b) => {
      // 1. Most matched ingredients first
      if (b.matchedIngredients.length !== a.matchedIngredients.length) {
        return b.matchedIngredients.length - a.matchedIngredients.length;
      }
      // 2. Fewest missing ingredients second
      if (a.missingIngredients.length !== b.missingIngredients.length) {
        return a.missingIngredients.length - b.missingIngredients.length;
      }
      // 3. Stable canonical recipe order tie-breaker
      return a.recipeIndex - b.recipeIndex;
    })
    .slice(0, maxResults);

  const matches: DeterministicFridgeMatch[] = scored.map((entry) => {
    const matchedCount = entry.matchedIngredients.length;
    const totalCount = entry.allIngredients.length;
    const missingCount = entry.missingIngredients.length;
    const ratio = totalCount > 0 ? matchedCount / totalCount : 0;

    let matchStrength: 'Best Match' | 'Good Match' | 'Partial Match';
    if (missingCount === 0 || ratio >= 0.45 || matchedCount >= 4) {
      matchStrength = 'Best Match';
    } else if (ratio >= 0.25 || matchedCount >= 2) {
      matchStrength = 'Good Match';
    } else {
      matchStrength = 'Partial Match';
    }

    const reason =
      missingCount === 0
        ? `Matches all ${totalCount} ingredients in this recipe.`
        : `Matches ${matchedCount} of ${totalCount} ingredients — ${missingCount} more ${missingCount === 1 ? 'item' : 'items'} needed.`;

    return {
      slug: entry.recipe.slug,
      title: entry.recipe.title,
      url: `/recipes/${entry.recipe.slug}`,
      image: entry.recipe.image,
      imageAlt: entry.recipe.imageAlt,
      matchStrength,
      matchedIngredients: entry.matchedIngredients,
      missingIngredients: entry.missingIngredients,
      reason,
      ingredientListPending: totalCount === 0,
    };
  });

  return { parsedTerms, matches };
}
