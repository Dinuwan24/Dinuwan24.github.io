import { NextRequest, NextResponse } from 'next/server';
import { ThinkingLevel, Type } from '@google/genai';
import { RECIPES, getRecipeBySlug } from '@/src/data/recipes';
import {
  TEXT_MODEL,
  buildRecipesKnowledgeContext,
  extractApiErrorMessage,
  getGeminiClient,
} from '@/lib/gemini';

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

const VALID_SLUGS = new Set(RECIPES.map((r) => r.slug));
const OFF_TOPIC_REFUSAL =
  "I only know Hyun's 11 recipes, cutie — ask me about one of those and I'm all yours!";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages?: ChatMessageInput[];
      currentRecipeSlug?: string;
    };

    const incomingMessages = Array.isArray(body.messages) ? body.messages : [];
    const cleanedMessages = incomingMessages
      .filter(
        (m): m is ChatMessageInput =>
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim().length > 0
      )
      .slice(-10)
      .map((m) => ({
        role: m.role,
        content: m.content.trim().slice(0, 1200),
      }));

    if (cleanedMessages.length === 0) {
      return NextResponse.json(
        { error: 'Please ask a question about one of our 11 recipes.' },
        { status: 400 }
      );
    }

    const currentRecipe =
      typeof body.currentRecipeSlug === 'string'
        ? getRecipeBySlug(body.currentRecipeSlug)
        : undefined;

    const recipesContext = buildRecipesKnowledgeContext();
    const ai = getGeminiClient();

    const systemInstruction = [
      'You are "Hyun", the warm, friendly home cook behind the website "Recipes by Hyun".',
      'STRICT GROUNDING RULES — FOLLOW WITHOUT EXCEPTION:',
      '1. Answer ONLY using the exact 11 recipes provided in RECIPES_DATA below. Never use outside culinary knowledge to fill in missing ingredients, measurements, oven temperatures, cook times, prep times, yields, steps, nutrition, or ratings.',
      '2. NEVER invent a recipe, ingredient, measurement, or step that is not explicitly present in RECIPES_DATA.',
      `3. OFF-TOPIC QUESTIONS: If the visitor asks anything NOT about Hyun's 11 recipes (for example: general trivia, weather, politics, coding, math, history, news, personal advice, or any unrelated topic), you MUST set isOffTopic to true, set reply to the exact string "${OFF_TOPIC_REFUSAL}", and set suggestedSlugs to [].`,
      '4. OTHER RECIPES NOT ON THE SITE: If the visitor asks for a specific food or recipe that is NOT one of our 11 recipes (for example lasagna, soup, brownies, tacos), set isOffTopic to false, say plainly and warmly that we do not have that recipe on Recipes by Hyun, and recommend the closest recipe(s) we DO have from RECIPES_DATA in suggestedSlugs.',
      '5. Keep on-topic answers warm, clear, concise (2-5 short sentences or clean bullet points), and easy to read for home cooks.',
      '6. Never mention YouTube, Instagram, TikTok, RM11, or Beautiful Hub.',
      '7. Include in suggestedSlugs any exact recipe slugs from RECIPES_DATA that you mention or recommend (max 3). Only use slugs that exist verbatim in RECIPES_DATA.',
      currentRecipe
        ? `The visitor is currently viewing the recipe page: "${currentRecipe.title}" (slug: "${currentRecipe.slug}").`
        : 'The visitor is currently browsing the main site.',
      '',
      'RECIPES_DATA:',
      JSON.stringify(recipesContext),
    ].join('\n');

    const contents = cleanedMessages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isOffTopic: {
              type: Type.BOOLEAN,
              description:
                'True when the question is off-topic (not about Hyun’s 11 recipes).',
            },
            reply: {
              type: Type.STRING,
              description:
                'Warm, plain-text answer from Hyun strictly grounded in RECIPES_DATA.',
            },
            suggestedSlugs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                'Exact slugs from RECIPES_DATA relevant to this answer (0 to 3 items).',
            },
          },
          required: ['isOffTopic', 'reply', 'suggestedSlugs'],
        },
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      return NextResponse.json(
        {
          error:
            'The AI kitchen helper could not generate a reply right now. Please try again in a moment.',
        },
        { status: 502 }
      );
    }

    let parsed: {
      isOffTopic?: boolean;
      reply?: string;
      suggestedSlugs?: string[];
    } = {};

    try {
      parsed = JSON.parse(rawText) as {
        isOffTopic?: boolean;
        reply?: string;
        suggestedSlugs?: string[];
      };
    } catch {
      parsed = { isOffTopic: false, reply: rawText, suggestedSlugs: [] };
    }

    if (parsed.isOffTopic) {
      return NextResponse.json({
        reply: OFF_TOPIC_REFUSAL,
        suggestedRecipes: [],
      });
    }

    const reply =
      typeof parsed.reply === 'string' && parsed.reply.trim().length > 0
        ? parsed.reply.trim()
        : OFF_TOPIC_REFUSAL;

    const suggestedRecipes = Array.from(
      new Set(
        (Array.isArray(parsed.suggestedSlugs) ? parsed.suggestedSlugs : []).filter(
          (slug) => typeof slug === 'string' && VALID_SLUGS.has(slug)
        )
      )
    )
      .slice(0, 3)
      .map((slug) => {
        const match = getRecipeBySlug(slug)!;
        return {
          slug: match.slug,
          title: match.title,
          url: `/recipes/${match.slug}`,
        };
      });

    return NextResponse.json({
      reply,
      suggestedRecipes,
    });
  } catch (error) {
    const { status, message } = extractApiErrorMessage(error);
    return NextResponse.json({ error: message }, { status });
  }
}
