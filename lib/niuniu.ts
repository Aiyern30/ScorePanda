export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Value =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export interface Card {
  suit: Suit;
  value: Value;
  numericValue: number;
}

export interface NiuNiuResult {
  hasNiu: boolean;
  niuRank: number; // 0-10 (10 = Niu Niu)
  handType: string;
  handTypeZh: string;
  description: string;
  descriptionZh: string;
  threeCardGroup: (Value | number)[];
  twoCardGroup: (Value | number)[];
  score: number; // For comparison
  alternatives?: NiuNiuResult[];
}

// Get card value for Niu Niu
export function getCardValue(value: Value): number {
  if (value === "A") return 1;
  if (["J", "Q", "K"].includes(value)) return 10;
  return parseInt(value);
}

// Get doubled value for Niu Niu (3 can become 6, 6 stays 6)
function getDoubledValue(value: number): number {
  if (value === 3) return 6;
  if (value === 6) return 6;
  return value;
}

// Check if three cards sum to multiple of 10
function sumsToTen(a: number, b: number, c: number): boolean {
  return (a + b + c) % 10 === 0;
}

// Find the best double (pair) from cards, considering doubled values
function findBestDouble(
  numericValues: number[]
): { doubleIndices: number[]; doubleValue: number } | null {
  const valueMap = new Map<number, number[]>();

  // Map doubled values to their indices
  numericValues.forEach((val, idx) => {
    const doubled = getDoubledValue(val);
    if (!valueMap.has(doubled)) {
      valueMap.set(doubled, []);
    }
    valueMap.get(doubled)!.push(idx);
  });

  // Find the highest value that has at least 2 cards
  let bestDoubleValue = -1;
  let bestDoubleIndices: number[] = [];

  for (const [doubledVal, indices] of valueMap.entries()) {
    if (indices.length >= 2 && doubledVal > bestDoubleValue) {
      bestDoubleValue = doubledVal;
      bestDoubleIndices = indices.slice(0, 2); // Take first 2 indices
    }
  }

  if (bestDoubleValue === -1) {
    return null;
  }

  return {
    doubleIndices: bestDoubleIndices,
    doubleValue: bestDoubleValue,
  };
}

// Get all possible 3-card combinations from 5 cards
function getCombinations(cards: number[]): number[][] {
  const combinations: number[][] = [];
  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        combinations.push([i, j, k]);
      }
    }
  }
  return combinations;
}

// Check for special hands
function checkSpecialHands(cards: Card[]): NiuNiuResult | null {
  const values = cards.map((c) => c.value);
  const numericValues = cards.map((c) => c.numericValue);

  // Spade Ace Special (Spade A + 4 Tens/Face Cards, MUST include at least one Face Card)
  const spadeAce = cards.find((c) => c.suit === "spades" && c.value === "A");
  const tenValueCards = cards.filter((c) => c.numericValue === 10);
  const tenCount = tenValueCards.length;
  // Check if at least one card is actually a Face Card (J, Q, K)
  const hasFaceCard = values.some((v) => ["J", "Q", "K"].includes(v));

  if (spadeAce && tenCount === 4 && hasFaceCard) {
    return {
      hasNiu: true,
      niuRank: 13, // Highest
      handType: "Supreme Spade Ace",
      handTypeZh: "至尊黑桃A",
      description: "Spade Ace with Face Card + Tens!",
      descriptionZh: "黑桃A配公仔牌 + 十！",
      threeCardGroup: tenValueCards.slice(0, 3).map((c) => c.value),
      twoCardGroup: [spadeAce.value, tenValueCards[3].value], // Ace + Ten/Face
      score: 5000,
    };
  }

  // Five Face Cards (炸弹 - Bomb)
  const faceCards = cards.filter((c) => ["J", "Q", "K"].includes(c.value));
  if (faceCards.length === 5) {
    return {
      hasNiu: true,
      niuRank: 11,
      handType: "Five Face Cards (Bomb)",
      handTypeZh: "五花牛 (炸弹)",
      description: "All five cards are face cards!",
      descriptionZh: "五张牌都是公仔牌！",
      threeCardGroup: faceCards.slice(0, 3).map((c) => c.value),
      twoCardGroup: faceCards.slice(3, 5).map((c) => c.value),
      score: 4500,
    };
  }

  // Five Small Cards (all under 5)
  const allSmall = numericValues.every((v) => v < 5);
  if (allSmall && numericValues.reduce((a, b) => a + b, 0) <= 10) {
    return {
      hasNiu: true,
      niuRank: 12,
      handType: "Five Small Cards",
      handTypeZh: "五小牛",
      description: "All cards under 5 with sum ≤ 10!",
      descriptionZh: "五张牌都小于5且总和≤10！",
      threeCardGroup: cards.slice(0, 3).map((c) => c.value),
      twoCardGroup: cards.slice(3, 5).map((c) => c.value),
      score: 4800,
    };
  }

  return null;
}

// Evaluate a Niu Niu hand
export function evaluateNiuNiuHand(cards: Card[]): NiuNiuResult {
  if (cards.length !== 5) {
    throw new Error("Niu Niu requires exactly 5 cards");
  }

  // Check for special hands first
  const specialHand = checkSpecialHands(cards);
  if (specialHand) return specialHand; // Special hands have no alternatives usually

  const originalValues = cards.map((c) => c.numericValue);

  // Helper to get possible values for a card value
  const getPossibleValues = (val: number): number[] => {
    if (val === 3) return [3, 6];
    if (val === 6) return [6, 3];
    return [val];
  };

  // Helper to get max rank from a sum
  const getRank = (sum: number): number => {
    const remainder = sum % 10;
    return remainder === 0 ? 10 : remainder; // 10 represents Niu Niu
  };

  const foundResults: (NiuNiuResult & { comparisonScore: number })[] = [];
  const startKeys = new Set<string>(); // To deduplicate

  // Try all combinations of 3 cards for the base
  const combinations = getCombinations(originalValues);

  for (const combo of combinations) {
    const baseIndices = combo;
    const pairIndices = originalValues
      .map((_, i) => i)
      .filter((i) => !baseIndices.includes(i));

    const baseValues = baseIndices.map((i) => originalValues[i]);
    const pairValues = pairIndices.map((i) => originalValues[i]);
    const baseCardValues = baseIndices.map((i) => cards[i].value); // Store actual face values
    const pairCardValues = pairIndices.map((i) => cards[i].value);

    // Check if Base can resolve to multiple of 10
    const baseOptions0 = getPossibleValues(baseValues[0]);
    const baseOptions1 = getPossibleValues(baseValues[1]);
    const baseOptions2 = getPossibleValues(baseValues[2]);

    let validBaseConfig: number[] | null = null;
    let validBase = false;

    // Check base validity
    for (const v0 of baseOptions0) {
      for (const v1 of baseOptions1) {
        for (const v2 of baseOptions2) {
          if ((v0 + v1 + v2) % 10 === 0) {
            validBase = true;
            validBaseConfig = [v0, v1, v2];

            // Should we continue to find other base configs for same cards?
            // Usually one valid base per combination is enough to define the split.
            // But if 3(3) and 3(6) both work?
            // E.g. 3, 3, 4. 3+3+4=10.
            // If we stop, we might miss something?
            // Actually, the pair determines the result.
            // So if base is valid, we check pair.
            // We should iterate ALL valid bases?
            // "3, 3, 4" base. Pair X, Y.
            // Result is determined by Pair.
            // Does base configuration matter for result?
            // Only for display "Base: 3+3+4".
            // If multiple valid bases exist for SAME 3 cards, display doesn't change much.
            // So finding FIRST valid base config for this combo is sufficient.
            break;
          }
        }
        if (validBase) break;
      }
      if (validBase) break;
    }

    if (validBase && validBaseConfig) {
      // Base is valid. Evaluate Pair.
      const pairOptions0 = getPossibleValues(pairValues[0]);
      const pairOptions1 = getPossibleValues(pairValues[1]);

      for (const p0 of pairOptions0) {
        for (const p1 of pairOptions1) {
          const sum = p0 + p1;
          const rank = getRank(sum);
          // Strict Pair check: visual values must match (e.g. K and K). Q and K is NOT a pair despite value 10.
          const isStrictPair =
            cards[pairIndices[0]].value === cards[pairIndices[1]].value;
          // Note: p0 === p1 checks numeric equality (10===10). We rely on isStrictPair for "Double" status.

          // Comparison Score Logic
          // Priority: Double (Strict) > Niu Niu > Normal
          // Double Base: 3000
          // Niu Niu Base: 2000
          // Normal Base: 1000
          let comparisonScore = 0;
          let rankScore = rank === 10 ? 10 : rank; // Treat Niu Niu as 10 for bonus

          if (isStrictPair) {
            comparisonScore += 3000;
          } else if (rank === 10) {
            comparisonScore += 2000;
          } else {
            comparisonScore += 1000;
          }

          comparisonScore += rankScore * 100; // Rank Bonus (100-1000)
          comparisonScore += sum / 100; // Tie Breaker

          // Deduplicate based on effective values
          // Sort groups to ensure uniqueness
          const tGroup = [...validBaseConfig].sort((a, b) => a - b);
          const pGroup = [p0, p1].sort((a, b) => a - b);
          const uniqueKey = `B:${tGroup.join(",")}|P:${pGroup.join(",")}`;

          if (!startKeys.has(uniqueKey)) {
            startKeys.add(uniqueKey);

            const finalNiuRank = rank === 10 ? 0 : rank;

            let handType = "";
            let handTypeZh = "";
            let description = "";
            let descriptionZh = "";

            if (finalNiuRank === 0) {
              if (isStrictPair) {
                handType = "Niu Niu (Double)";
                handTypeZh = `牛牛 (${p0}对)`;
                description = `Result is Niu Niu! And it's a Double ${p0}s!`;
                descriptionZh = `牛牛！而且是${p0}对子！`;
              } else {
                handType = "Niu Niu";
                handTypeZh = "牛牛";
                description = "Both groups sum to multiples of 10!";
                descriptionZh = "两组都是10的倍数！";
              }
            } else {
              if (isStrictPair) {
                handType = `Niu ${finalNiuRank} (Double)`;
                handTypeZh = `牛${finalNiuRank} (${p0}对)`;
                description = `Double ${p0}s (Sum ${sum})`;
                descriptionZh = `${p0}对 (总和${sum})`;
              } else {
                handType = `Niu ${finalNiuRank}`;
                handTypeZh = `牛${finalNiuRank}`;
                description = `Three cards sum to 10, remaining cards sum to ${sum}`;
                descriptionZh = `三张牌总和为10的倍数，剩余两张总和为${sum}`;
              }
            }

            foundResults.push({
              hasNiu: true,
              niuRank: finalNiuRank,
              handType,
              handTypeZh,
              description,
              descriptionZh,
              threeCardGroup: baseCardValues,
              twoCardGroup: pairCardValues,
              score: Math.floor(comparisonScore), // Use the new score system
              comparisonScore, // Internal use
            });
          }
        }
      }
    }
  }

  if (foundResults.length > 0) {
    // Sort by comparisonScore descending
    foundResults.sort((a, b) => b.comparisonScore - a.comparisonScore);

    const best = foundResults[0];
    // Attach alternatives (exclude self)
    // We only attach clean NiuNiuResult objects (remove comparisonScore)
    best.alternatives = foundResults.slice(1).map((r) => {
      const { comparisonScore, ...rest } = r;
      return rest;
    });

    // Return clean best (remove comparisonScore key? It's extra property, JS allows it, Interface ignores it. Safe)
    return best;
  }

  // No Niu found
  return {
    hasNiu: false,
    niuRank: 0,
    handType: "No Niu",
    handTypeZh: "没牛",
    description: "Cannot form a group of 3 cards summing to 10",
    descriptionZh: "无法组成三张牌总和为10的倍数",
    threeCardGroup: [],
    twoCardGroup: [],
    score: 0,
  };
}

// Generate a full deck
export function generateDeck(): Card[] {
  const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
  const values: Value[] = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  return suits.flatMap((suit) =>
    values.map((value) => ({
      suit,
      value,
      numericValue: getCardValue(value),
    }))
  );
}

// Shuffle deck
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Deal cards
export function dealCards(deck: Card[], count: number): Card[] {
  return deck.slice(0, count);
}
