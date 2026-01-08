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
  threeCardGroup: number[];
  twoCardGroup: number[];
  score: number; // For comparison
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

  // Five Face Cards (炸弹 - Bomb)
  const faceCards = values.filter((v) => ["J", "Q", "K"].includes(v));
  if (faceCards.length === 5) {
    return {
      hasNiu: true,
      niuRank: 11,
      handType: "Five Face Cards (Bomb)",
      handTypeZh: "五花牛 (炸弹)",
      description: "All five cards are face cards!",
      descriptionZh: "五张牌都是公仔牌！",
      threeCardGroup: [numericValues[0], numericValues[1], numericValues[2]],
      twoCardGroup: [numericValues[3], numericValues[4]],
      score: 1100,
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
      threeCardGroup: [numericValues[0], numericValues[1], numericValues[2]],
      twoCardGroup: [numericValues[3], numericValues[4]],
      score: 1200,
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
  if (specialHand) return specialHand;

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

  let bestResult: NiuNiuResult | null = null;
  let maxRank = -1;
  let maxPairSum = -1; // Tiebreaker

  // Try all combinations of 3 cards for the base
  const combinations = getCombinations(originalValues);

  for (const combo of combinations) {
    const baseIndices = combo;
    const pairIndices = originalValues
      .map((_, i) => i)
      .filter((i) => !baseIndices.includes(i));

    const baseValues = baseIndices.map((i) => originalValues[i]);
    const pairValues = pairIndices.map((i) => originalValues[i]);

    // Check if Base can resolve to multiple of 10
    // We need to try all permutations of possible values for the base cards
    const baseOptions0 = getPossibleValues(baseValues[0]);
    const baseOptions1 = getPossibleValues(baseValues[1]);
    const baseOptions2 = getPossibleValues(baseValues[2]);

    let validBaseConfig: number[] | null = null;
    let validBase = false;

    // Iterate through all base value permutations
    // Optimization: Stop at first valid base?
    // Actually, does the choice of base values affect the pair? No, they are disjoint sets of cards.
    // However, we just need *one* valid base configuration to proceed to check the pair.
    for (const v0 of baseOptions0) {
      for (const v1 of baseOptions1) {
        for (const v2 of baseOptions2) {
          if ((v0 + v1 + v2) % 10 === 0) {
            validBase = true;
            validBaseConfig = [v0, v1, v2];
            break;
          }
        }
        if (validBase) break;
      }
      if (validBase) break;
    }

    if (validBase && validBaseConfig) {
      // Base is valid. Now optimize the Pair.
      const pairOptions0 = getPossibleValues(pairValues[0]);
      const pairOptions1 = getPossibleValues(pairValues[1]);

      let currentMaxRank = -1;
      let currentMaxPairSum = -1;
      let bestPairConfig: number[] = [];

      for (const p0 of pairOptions0) {
        for (const p1 of pairOptions1) {
          const sum = p0 + p1;
          const rank = getRank(sum);
          if (rank > currentMaxRank) {
            currentMaxRank = rank;
            currentMaxPairSum = sum;
            bestPairConfig = [p0, p1];
          } else if (rank === currentMaxRank) {
            // Tie-break with sum if needed (though usually rank is all that matters)
            if (sum > currentMaxPairSum) {
              currentMaxPairSum = sum;
              bestPairConfig = [p0, p1];
            }
          }
        }
      }

      // Check if this split is better than global best
      if (currentMaxRank > maxRank) {
        maxRank = currentMaxRank;
        maxPairSum = currentMaxPairSum;

        // Construct Result
        const niuRank = maxRank === 10 ? 0 : maxRank; // Convert back to 0 for Niu Niu in result interface if needed?
        // Wait, the interface says "niuRank: number; // 0-10 (10 = Niu Niu)"?
        // Looking at previous code: "if (result.niuRank === 0 && result.hasNiu) return "🐂";"
        // Previous code logic: "const niuRank = twoCardSum % 10;" -> so 10, 20 became 0.
        // And "if (niuRank === 0) { handType = "Niu Niu"; ... score: 1000 }"
        // BUT type definition says "niuRank: number; // 0-10 (10 = Niu Niu)"?
        // The type comment might be slightly misleading or I should align with it.
        // Let's stick to the previous code's convention: 0 implies Niu Niu (Multiple of 10). 1-9 are normal.
        // EXCEPT: The user might have meant 10.
        // Let's look at `evaluateNiuNiuHand` previous implementation: `const niuRank = twoCardSum % 10;`.
        // So 0 was indeed Niu Niu.
        // I will stick to returning 0 for Niu Niu to avoid breaking UI that expects 0.

        const finalNiuRank = currentMaxRank === 10 ? 0 : currentMaxRank;

        let handType = "";
        let handTypeZh = "";
        let description = "";
        let descriptionZh = "";

        if (finalNiuRank === 0) {
          handType = "Niu Niu";
          handTypeZh = "牛牛";
          description = "Both groups sum to multiples of 10!";
          descriptionZh = "两组都是10的倍数！";
        } else {
          handType = `Niu ${finalNiuRank}`;
          handTypeZh = `牛${finalNiuRank}`;
          description = `Three cards sum to 10, remaining cards sum to ${currentMaxPairSum}`;
          descriptionZh = `三张牌总和为10的倍数，剩余两张总和为${currentMaxPairSum}`;
        }

        bestResult = {
          hasNiu: true,
          niuRank: finalNiuRank,
          handType,
          handTypeZh,
          description,
          descriptionZh,
          threeCardGroup: validBaseConfig, // This now contains the EFFECTIVE values (e.g. 6 instead of 3)
          twoCardGroup: bestPairConfig, // EFFECTIVE values
          score: finalNiuRank === 0 ? 1000 : 900 + finalNiuRank * 10,
        };
      } else if (currentMaxRank === maxRank) {
        // Same rank found.
        // If we already have a Niu Niu, we stick with it.
        // Maybe check for "BIGGEST that can form double"?
        // If Rank is same, maybe prefer highest pair sum?
        if (currentMaxPairSum > maxPairSum) {
          maxPairSum = currentMaxPairSum;
          // Update bestResult ... (similar block as above)
          // For Brevity, I wont repeat safely unless I refactor.
          // Actually, since I need to construct the object, I should just assign it.
          const finalNiuRank = currentMaxRank === 10 ? 0 : currentMaxRank;
          bestResult = {
            hasNiu: true,
            niuRank: finalNiuRank,
            handType: `Niu ${finalNiuRank === 0 ? "Niu" : finalNiuRank}`,
            handTypeZh: finalNiuRank === 0 ? "牛牛" : `牛${finalNiuRank}`,
            description:
              finalNiuRank === 0
                ? "Both groups sum to multiples of 10!"
                : `Three cards sum to 10, remaining cards sum to ${currentMaxPairSum}`,
            descriptionZh:
              finalNiuRank === 0
                ? "两组都是10的倍数！"
                : `三张牌总和为10的倍数，剩余两张总和为${currentMaxPairSum}`,
            threeCardGroup: validBaseConfig,
            twoCardGroup: bestPairConfig,
            score: finalNiuRank === 0 ? 1000 : 900 + finalNiuRank * 10,
          };
        }
      }
    }
  }

  if (bestResult) {
    return bestResult;
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
