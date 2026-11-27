const UNICODE_FRACTIONS: Record<string, number> = {
  '¼': 0.25,
  '½': 0.5,
  '¾': 0.75,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '⅛': 0.125,
  '⅜': 0.375,
  '⅝': 0.625,
  '⅞': 0.875,
};

const DISPLAY_FRACTIONS: Array<[number, string]> = [
  [0.125, '⅛'],
  [0.25, '¼'],
  [1 / 3, '⅓'],
  [0.375, '⅜'],
  [0.5, '½'],
  [0.625, '⅝'],
  [2 / 3, '⅔'],
  [0.75, '¾'],
  [0.875, '⅞'],
];

function parseSingleNumber(token: string): number | null {
  const cleaned = token.trim();
  if (!cleaned) return null;

  // Mixed number with unicode fraction e.g. "1 ½" or "1½"
  const unicodeMixed = cleaned.match(/^(\d+)\s*([¼½¾⅓⅔⅛⅜⅝⅞])$/);
  if (unicodeMixed) {
    return parseInt(unicodeMixed[1], 10) + UNICODE_FRACTIONS[unicodeMixed[2]];
  }

  // Single unicode fraction e.g. "½"
  if (cleaned.length === 1 && UNICODE_FRACTIONS[cleaned] !== undefined) {
    return UNICODE_FRACTIONS[cleaned];
  }

  // Mixed ASCII fraction e.g. "1 1/2" or "1-1/2"
  const mixedAscii = cleaned.match(/^(\d+)[\s-]+(\d+)\/(\d+)$/);
  if (mixedAscii) {
    const whole = parseInt(mixedAscii[1], 10);
    const num = parseInt(mixedAscii[2], 10);
    const den = parseInt(mixedAscii[3], 10);
    if (den === 0) return null;
    return whole + num / den;
  }

  // Simple ASCII fraction e.g. "3/4"
  const asciiFrac = cleaned.match(/^(\d+)\/(\d+)$/);
  if (asciiFrac) {
    const num = parseInt(asciiFrac[1], 10);
    const den = parseInt(asciiFrac[2], 10);
    if (den === 0) return null;
    return num / den;
  }

  // Standard integer or decimal e.g. "2" or "1.5"
  if (/^\d+(?:\.\d+)?$/.test(cleaned)) {
    return parseFloat(cleaned);
  }

  return null;
}

export function formatCulinaryQuantity(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '';

  const whole = Math.floor(value);
  const remainder = value - whole;

  if (remainder < 0.04) {
    return String(whole);
  }
  if (remainder > 0.96) {
    return String(whole + 1);
  }

  for (const [fracValue, symbol] of DISPLAY_FRACTIONS) {
    if (Math.abs(remainder - fracValue) <= 0.035) {
      return whole > 0 ? `${whole} ${symbol}` : symbol;
    }
  }

  // Fallback to clean decimal (max 2 decimals, strip trailing zeros)
  return Number(value.toFixed(2)).toString();
}

const NUMBER_TOKEN =
  '(?:\\d+[\\s-]+\\d+\\/\\d+|\\d+\\s*[¼½¾⅓⅔⅛⅜⅝⅞]|\\d+\\/\\d+|[¼½¾⅓⅔⅛⅜⅝⅞]|\\d+(?:\\.\\d+)?)';

const LEADING_RANGE_REGEX = new RegExp(
  `^\\s*(${NUMBER_TOKEN})\\s*(–|-|to)\\s*(${NUMBER_TOKEN})(?=\\s|$|[a-zA-Z])`,
  'i'
);

const LEADING_SINGLE_REGEX = new RegExp(
  `^\\s*(${NUMBER_TOKEN})(?=\\s|$|[a-zA-Z(])`
);

/**
 * Scales the leading quantity (or range) in a verbatim ingredient string.
 * Handles compound egg + egg yolk lines with proper pluralisation.
 * At multiplier === 1, always returns the exact original verbatim line.
 */
export function scaleIngredientLine(line: string, multiplier: number): string {
  if (multiplier === 1) return line;

  // Special handling for compound "1 egg + 1 egg yolk..." lines
  const eggYolkMatch = line.match(
    /^\s*(\d+(?:\.\d+)?)\s+eggs?\s*\+\s*(\d+(?:\.\d+)?)\s+egg\s+yolks?(.*)$/i
  );
  if (eggYolkMatch) {
    const baseEggs = parseFloat(eggYolkMatch[1]);
    const baseYolks = parseFloat(eggYolkMatch[2]);
    const rest = eggYolkMatch[3] ?? '';

    if (multiplier === 0.5 && baseEggs === 1 && baseYolks === 1) {
      return `1 egg + 1 egg yolk (halve by beating and using half)${rest}`;
    }

    const scaledEggs = baseEggs * multiplier;
    const scaledYolks = baseYolks * multiplier;
    const eggLabel = scaledEggs > 1 ? 'eggs' : 'egg';
    const yolkLabel = scaledYolks > 1 ? 'egg yolks' : 'egg yolk';

    return `${formatCulinaryQuantity(scaledEggs)} ${eggLabel} + ${formatCulinaryQuantity(scaledYolks)} ${yolkLabel}${rest}`;
  }

  // Handle simple singular "1 egg..." lines with proper pluralisation
  const singleEggMatch = line.match(/^\s*(\d+(?:\.\d+)?)\s+egg(\b.*)$/i);
  if (singleEggMatch) {
    const baseEggs = parseFloat(singleEggMatch[1]);
    const rest = singleEggMatch[2] ?? '';
    const scaledEggs = baseEggs * multiplier;
    const eggLabel = scaledEggs > 1 ? 'eggs' : 'egg';
    return `${formatCulinaryQuantity(scaledEggs)} ${eggLabel}${rest}`;
  }

  const rangeMatch = line.match(LEADING_RANGE_REGEX);
  if (rangeMatch) {
    const low = parseSingleNumber(rangeMatch[1]);
    const high = parseSingleNumber(rangeMatch[3]);
    if (low !== null && high !== null) {
      const separator = rangeMatch[2].toLowerCase() === 'to' ? ' to ' : '–';
      const scaledLow = formatCulinaryQuantity(low * multiplier);
      const scaledHigh = formatCulinaryQuantity(high * multiplier);
      return `${scaledLow}${separator}${scaledHigh}${line.slice(rangeMatch[0].length)}`;
    }
  }

  const singleMatch = line.match(LEADING_SINGLE_REGEX);
  if (singleMatch) {
    const amount = parseSingleNumber(singleMatch[1]);
    if (amount !== null) {
      const scaled = formatCulinaryQuantity(amount * multiplier);
      return `${scaled}${line.slice(singleMatch[0].length)}`;
    }
  }

  return line;
}

/**
 * Scales numeric yields such as "4 burgers" or "12-14 cookies".
 * At multiplier === 1, always returns the original verbatim yield.
 */
export function scaleYieldText(makes: string, multiplier: number): string {
  if (multiplier === 1) return makes;

  // Match first number or range inside yield text (e.g. "Makes 4 burgers" or "12–16 cookies")
  return makes.replace(
    /(\d+(?:\.\d+)?)\s*(–|-|to)\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)/i,
    (match, low, sep, high, single) => {
      if (low && high) {
        const sLow = formatCulinaryQuantity(parseFloat(low) * multiplier);
        const sHigh = formatCulinaryQuantity(parseFloat(high) * multiplier);
        const joiner = sep.toLowerCase() === 'to' ? ' to ' : '–';
        return `${sLow}${joiner}${sHigh}`;
      }
      if (single) {
        return formatCulinaryQuantity(parseFloat(single) * multiplier);
      }
      return match;
    }
  );
}
