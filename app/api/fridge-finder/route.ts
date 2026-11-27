import { NextRequest, NextResponse } from 'next/server';
import { ThinkingLevel } from '@google/genai';
import { TEXT_MODEL, getGeminiClient } from '@/lib/gemini';
import { rankRecipesDeterministically } from '@/lib/fridge-matcher';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { ingredients?: string };
    const userIngredients =
      typeof body.ingredients === 'string'
        ? body.ingredients.trim().slice(0, 800)
        : '';

    if (userIngredients.length < 2) {
      return NextResponse.json(
        { error: 'Please type at least one ingredient you have on hand.' },
        { status: 400 }
      );
    }

    // Step 1: Compute ranked matches 100% deterministically from src/data/recipes.ts
    // (most matched ingredients first, then fewest missing, then canonical recipe order).
    const { matches } = rankRecipesDeterministically(userIngredients, 5);

    const fallbackSummary =
      matches.length > 0
        ? `Found ${matches.length} matching ${matches.length === 1 ? 'recipe' : 'recipes'} from Hyun's kitchen — starting with ${matches[0].title}!`
        : "None of Hyun's 11 recipes directly use those ingredients, but browse all 11 comfort food recipes below for inspiration.";

    // Step 2: Use Gemini ONLY to write the short friendly summary line (never to choose or reorder results).
    let summary = fallbackSummary;
    try {
      const ai = getGeminiClient();
      const summaryContext = matches.map((m, i) => ({
        rank: i + 1,
        title: m.title,
        matchedCount: m.matchedIngredients.length,
        missingCount: m.missingIngredients.length,
      }));

      const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: [
          `Visitor ingredients: ${userIngredients}`,
          `Pre-ranked deterministic matches (DO NOT add, remove, or reorder): ${JSON.stringify(summaryContext)}`,
          'Write 1 to 2 warm, friendly sentences from Hyun summarizing these exact matches.',
        ].join('\n'),
        config: {
          systemInstruction:
            'You are Hyun from Recipes by Hyun. Write ONLY a short, warm 1-2 sentence plain-text summary of the pre-ranked recipe matches provided. Never invent recipes, never change the ranking, and never mention YouTube, Instagram, TikTok, RM11, or Beautiful Hub.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const generated = (response.text ?? '').trim();
      if (generated.length > 0) {
        summary = generated;
      }
    } catch {
      // Deterministic ranking still works seamlessly even if Gemini summary is unavailable.
      summary = fallbackSummary;
    }

    return NextResponse.json({
      summary,
      matches,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          'Could not check your ingredients right now — you can still browse all 11 recipes below.',
      },
      { status: 500 }
    );
  }
}
