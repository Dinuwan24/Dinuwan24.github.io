import { GoogleGenAI } from '@google/genai';
import {
  RECIPES,
  flattenIngredients,
  flattenMethodSteps,
  formatMinutesDisplay,
  getTotalMinutes,
  isRecipePlaceholder,
} from '@/src/data/recipes';

export const TEXT_MODEL = 'gemini-4-hydrogen';

export class GeminiUnavailableError extends Error {
  status: number;

  constructor(message: string, status = 503) {
    super(message);
    this.name = 'GeminiUnavailableError';
    this.status = status;
  }
}

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new GeminiUnavailableError(
      'AI features are currently unavailable. You can still browse and cook all 11 recipes normally.',
      503
    );
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface SerializedRecipeContext {
  slug: string;
  url: string;
  title: string;
  description: string;
  status: 'complete' | 'awaiting_verbatim_text';
  makes: string | null;
  prepTime: string | null;
  cookTime: string | null;
  totalTime: string | null;
  intro: string[] | null;
  ingredients: string[];
  method: string[];
  tips: string | null;
  closingQuestion: string | null;
  notes: string[];
}

/**
 * Serializes all 11 recipes strictly from the single authoritative data file
 * (src/data/recipes.ts) in read-only form for Gemini grounding.
 */
export function buildRecipesKnowledgeContext(): SerializedRecipeContext[] {
  return RECIPES.map((recipe) => {
    const flatIngredients = flattenIngredients(recipe);
    const flatSteps = flattenMethodSteps(recipe);
    const totalMins = getTotalMinutes(recipe);
    const pending = isRecipePlaceholder(recipe) || (flatIngredients.length === 0 && flatSteps.length === 0);

    return {
      slug: recipe.slug,
      url: `/recipes/${recipe.slug}`,
      title: recipe.title,
      description: recipe.seoDescription,
      status: pending ? 'awaiting_verbatim_text' : 'complete',
      makes: recipe.makes,
      prepTime: recipe.prepTimeLabel ?? formatMinutesDisplay(recipe.prepMinutes),
      cookTime: recipe.cookTimeLabel ?? formatMinutesDisplay(recipe.cookMinutes),
      totalTime: recipe.totalTimeLabel ?? formatMinutesDisplay(totalMins),
      intro: recipe.intro,
      ingredients: flatIngredients,
      method: flatSteps,
      tips: recipe.tips ?? null,
      closingQuestion: recipe.closingQuestion ?? null,
      notes: recipe.notes ?? [],
    };
  });
}

export function extractApiErrorMessage(error: unknown): {
  status: number;
  message: string;
} {
  if (error instanceof GeminiUnavailableError) {
    return { status: error.status, message: error.message };
  }

  const raw =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Unknown error';

  if (/API_KEY_INVALID|PERMISSION_DENIED|401|403/i.test(raw)) {
    return {
      status: 503,
      message:
        'The AI service could not authenticate right now. Please check the API key in Settings > Secrets, or continue browsing all recipes normally.',
    };
  }

  if (/RESOURCE_EXHAUSTED|429/i.test(raw)) {
    return {
      status: 429,
      message:
        'The AI kitchen helper is taking a quick breather due to high traffic. Please try again in a moment.',
    };
  }

  return {
    status: 503,
    message:
      'The AI kitchen helper is temporarily unavailable. All 11 recipes on the site remain ready to browse.',
  };
}
