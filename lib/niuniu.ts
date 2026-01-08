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

// Check if three cards sum to multiple of 10
function sumsToTen(a: number, b: number, c: number): boolean {
  return (a + b + c) % 10 === 0;
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

  const numericValues = cards.map((c) => c.numericValue);

  // Try all combinations of 3 cards
  const combinations = getCombinations(numericValues);

  for (const combo of combinations) {
    const threeCards = combo.map((i) => numericValues[i]);
    const twoCards = numericValues.filter((_, i) => !combo.includes(i));

    if (sumsToTen(threeCards[0], threeCards[1], threeCards[2])) {
      // Found a valid Niu combination
      const twoCardSum = twoCards[0] + twoCards[1];
      const niuRank = twoCardSum % 10;

      let handType = "";
      let handTypeZh = "";
      let description = "";
      let descriptionZh = "";

      if (niuRank === 0) {
        handType = "Niu Niu";
        handTypeZh = "牛牛";
        description = "Both groups sum to multiples of 10!";
        descriptionZh = "两组都是10的倍数！";
      } else {
        handType = `Niu ${niuRank}`;
        handTypeZh = `牛${niuRank}`;
        description = `Three cards sum to 10, remaining cards sum to ${twoCardSum}`;
        descriptionZh = `三张牌总和为10的倍数，剩余两张总和为${twoCardSum}`;
      }

      return {
        hasNiu: true,
        niuRank,
        handType,
        handTypeZh,
        description,
        descriptionZh,
        threeCardGroup: threeCards,
        twoCardGroup: twoCards,
        score: niuRank === 0 ? 1000 : 900 + niuRank * 10,
      };
    }
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
