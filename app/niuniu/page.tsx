"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  generateDeck,
  evaluateNiuNiuHand,
  type Card as CardType,
  type NiuNiuResult,
  type Suit,
  type Value,
} from "@/lib/niuniu";
import { RulesDialog } from "@/components/ui/dialog";

interface PlayingCardProps {
  suit: Suit;
  value: Value;
  isSelected?: boolean;
  isHighlighted?: boolean;
  highlightColor?: "red" | "gold";
  onClick?: () => void;
}

// Playing Card Component
const PlayingCard: React.FC<PlayingCardProps> = ({
  suit,
  value,
  isSelected = false,
  isHighlighted = false,
  highlightColor = "gold",
  onClick,
}) => {
  const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  const suitColors = {
    hearts: "#dc2626",
    diamonds: "#dc2626",
    clubs: "#000000",
    spades: "#000000",
  };

  const highlightClasses = {
    red: "ring-4 ring-red-500 shadow-2xl shadow-red-500/50 scale-105",
    gold: "ring-4 ring-yellow-400 shadow-2xl shadow-yellow-500/50 scale-105",
  };

  return (
    <div
      onClick={onClick}
      className={`relative w-16 h-24 sm:w-20 sm:h-28 bg-linear-to-br from-yellow-50 to-white rounded-lg border-2 shadow-md transition-all duration-300 ${
        onClick ? "cursor-pointer hover:scale-105" : ""
      } ${
        isSelected
          ? "border-red-600 shadow-xl scale-105 ring-2 ring-yellow-400"
          : "border-yellow-600"
      } ${isHighlighted ? highlightClasses[highlightColor] : ""}`}
    >
      <div
        className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 text-xs sm:text-sm font-bold"
        style={{ color: suitColors[suit] }}
      >
        <div>{value}</div>
        <div className="text-base sm:text-lg leading-none">
          {suitSymbols[suit]}
        </div>
      </div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl"
        style={{ color: suitColors[suit] }}
      >
        {suitSymbols[suit]}
      </div>
      <div
        className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 text-xs sm:text-sm font-bold rotate-180"
        style={{ color: suitColors[suit] }}
      >
        <div>{value}</div>
        <div className="text-base sm:text-lg leading-none">
          {suitSymbols[suit]}
        </div>
      </div>
    </div>
  );
};

const NiuNiuGame: React.FC = () => {
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [result, setResult] = useState<NiuNiuResult | null>(null);
  const [showRules, setShowRules] = useState(false);

  // Generate full deck
  const deck = generateDeck();

  const handleCardClick = (card: CardType) => {
    const cardKey = `${card.suit}-${card.value}`;
    const isAlreadySelected = selectedCards.some(
      (c) => `${c.suit}-${c.value}` === cardKey
    );

    if (isAlreadySelected) {
      // Remove card
      setSelectedCards(
        selectedCards.filter((c) => `${c.suit}-${c.value}` !== cardKey)
      );
      setResult(null); // Clear result when cards change
    } else if (selectedCards.length < 5) {
      // Add card (max 5)
      setSelectedCards([...selectedCards, card]);
      setResult(null); // Clear result when cards change
    }
  };

  const evaluateHand = () => {
    if (selectedCards.length !== 5) {
      alert("请选择5张牌 / Please select exactly 5 cards");
      return;
    }

    const evaluation = evaluateNiuNiuHand(selectedCards);
    setResult(evaluation);
  };

  const resetGame = () => {
    setSelectedCards([]);
    setResult(null);
  };

  const getResultColor = (result: NiuNiuResult) => {
    if (result.niuRank >= 11) return "from-purple-600 to-pink-600"; // Special hands
    if (result.niuRank === 0 && result.hasNiu)
      return "from-yellow-400 to-orange-500"; // Niu Niu
    if (result.niuRank >= 7) return "from-red-500 to-red-700"; // High Niu
    if (result.hasNiu) return "from-orange-400 to-red-500"; // Regular Niu
    return "from-gray-400 to-gray-600"; // No Niu
  };

  const getResultEmoji = (result: NiuNiuResult) => {
    if (result.niuRank >= 11) return "💎";
    if (result.niuRank === 0 && result.hasNiu) return "🐂";
    if (result.niuRank >= 7) return "🔥";
    if (result.hasNiu) return "✨";
    return "😢";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-600 via-red-700 to-yellow-600 p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-5 left-5 sm:top-10 sm:left-10 text-5xl sm:text-9xl animate-bounce">
          🏮
        </div>
        <div className="absolute top-10 right-10 sm:top-20 sm:right-20 text-5xl sm:text-9xl animate-pulse">
          🐂
        </div>
        <div className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 text-5xl sm:text-9xl animate-bounce">
          🧧
        </div>
        <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 text-5xl sm:text-9xl animate-pulse">
          🏮
        </div>
        <div className="absolute top-1/2 left-1/4 text-4xl sm:text-7xl">💰</div>
        <div className="absolute top-1/3 right-1/4 text-4xl sm:text-7xl">
          🎊
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-yellow-300 drop-shadow-lg mb-1 sm:mb-2">
            🐂 牛牛游戏 🐂
          </h1>
          <p className="text-lg sm:text-2xl text-yellow-200 font-semibold">
            Niu Niu Card Game
          </p>
          <Button
            onClick={() => setShowRules(true)}
            className="mt-4 bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-red-800 font-bold border-2 border-red-600 shadow-lg"
          >
            📖 游戏规则 / Rules
          </Button>
        </div>

        {/* Rules Dialog */}
        <RulesDialog
          open={showRules}
          onOpenChange={setShowRules}
          gameType="niuniu"
        />

        {/* Selected Cards Display */}
        <Card className="mb-4 sm:mb-6 bg-linear-to-br from-red-50 to-yellow-50 border-2 sm:border-4 border-yellow-500 shadow-2xl">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-700">
              🀄 已选卡牌 ({selectedCards.length}/5)
            </h2>
            <p className="text-xs sm:text-sm text-red-600 mb-4">
              Selected Cards (select exactly 5)
            </p>
            <div className="flex gap-2 sm:gap-4 mb-4 min-h-24 sm:min-h-32 items-center flex-wrap">
              {selectedCards.length === 0 ? (
                <p className="text-sm sm:text-base text-red-500 font-semibold">
                  👇 点击下方卡牌进行选择 / Click cards below to select
                </p>
              ) : (
                selectedCards.map((card, idx) => {
                  let isHighlighted = false;
                  let highlightColor: "red" | "gold" = "gold";

                  if (result && result.hasNiu) {
                    // Highlight three-card group in gold
                    // Use checks that allow 3/6 swapping
                    const checkMatch = (cardVal: number, targetVal: number) => {
                      if (cardVal === targetVal) return true;
                      if (cardVal === 3 && targetVal === 6) return true;
                      if (cardVal === 6 && targetVal === 3) return true;
                      return false;
                    };

                    const usedThreeIndices: number[] = [];
                    result.threeCardGroup.forEach((val) => {
                      const foundIdx = selectedCards.findIndex(
                        (c, i) =>
                          checkMatch(c.numericValue, val) &&
                          !usedThreeIndices.includes(i)
                      );
                      if (foundIdx !== -1) usedThreeIndices.push(foundIdx);
                    });

                    if (usedThreeIndices.includes(idx)) {
                      isHighlighted = true;
                      highlightColor = "gold";
                    } else {
                      // Must be in two-card group
                      isHighlighted = true;
                      highlightColor = "red";
                    }
                  }

                  return (
                    <PlayingCard
                      key={idx}
                      suit={card.suit}
                      value={card.value}
                      isHighlighted={isHighlighted}
                      highlightColor={highlightColor}
                      onClick={() => handleCardClick(card)}
                    />
                  );
                })
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button
                onClick={evaluateHand}
                disabled={selectedCards.length !== 5}
                className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-yellow-100 font-bold text-base sm:text-lg border-2 border-yellow-400 shadow-lg w-full sm:w-auto"
              >
                🎯 评估牌型 / Evaluate Hand
              </Button>
              <Button
                onClick={resetGame}
                className="bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-red-800 font-bold text-base sm:text-lg border-2 border-red-500 shadow-lg w-full sm:w-auto"
              >
                🔄 重置 / Reset
              </Button>
            </div>
            {result && result.hasNiu && (
              <div className="mt-4 text-center text-sm text-red-600">
                <p>
                  🔴 红色边框 = 两张牌组 (决定牛的大小) / Red = Double Pair
                  (Rank)
                </p>
                <p>🟡 金色边框 = 三张牌组 (凑整) / Gold = Base (Sum to 10)</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result Display */}
        {result && (
          <Card
            className={`mb-4 sm:mb-6 bg-linear-to-br ${getResultColor(
              result
            )} border-2 sm:border-4 border-yellow-400 shadow-2xl animate-in zoom-in-95 duration-500`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-6xl sm:text-8xl mb-4 animate-bounce">
                  {getResultEmoji(result)}
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold mb-2 text-white drop-shadow-lg">
                  {result.handTypeZh}
                </h2>
                <p className="text-lg sm:text-2xl text-yellow-100 font-semibold mb-4">
                  {result.handType}
                </p>
                <Alert className="bg-white/90 border-2 border-yellow-300">
                  <AlertDescription className="text-sm sm:text-base text-red-800 font-semibold">
                    <p className="mb-1">{result.descriptionZh}</p>
                    <p className="text-red-600">{result.description}</p>
                  </AlertDescription>
                </Alert>

                {result.hasNiu && (
                  <div className="mt-4 grid grid-cols-1 gap-4">
                    {/* Swapped order: Two Cards (Red) First/Top */}
                    <div className="bg-red-100 p-3 rounded-lg border-2 border-red-400 shadow-inner">
                      <h3 className="font-bold text-red-700 mb-2">
                        两张牌组 (Double)
                      </h3>
                      <p className="text-lg font-mono text-red-800">
                        {result.twoCardGroup.join(" + ")} ={" "}
                        {result.twoCardGroup.reduce((a, b) => a + b, 0)}
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        (Rank Points:{" "}
                        {result.niuRank === 0 ? "10 (Niu Niu)" : result.niuRank}
                        )
                      </p>
                    </div>

                    {/* Three Cards (Yellow) Second/Bottom */}
                    <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-400 shadow-inner">
                      <h3 className="font-bold text-red-700 mb-2">
                        三张牌组 (Base)
                      </h3>
                      <p className="text-lg font-mono text-red-800">
                        {result.threeCardGroup.join(" + ")} ={" "}
                        {result.threeCardGroup.reduce((a, b) => a + b, 0)}
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        (Sum: {result.threeCardGroup.reduce((a, b) => a + b, 0)}{" "}
                        - Multiple of 10)
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 bg-white/80 p-3 rounded-lg border-2 border-yellow-300">
                  <p className="text-xl sm:text-2xl font-bold text-red-700">
                    得分 / Score: {result.score}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card Deck */}
        <Card className="bg-linear-to-br from-yellow-50 to-red-50 border-2 sm:border-4 border-yellow-500 shadow-2xl">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-700">
              🎴 选择卡牌
            </h2>
            <p className="text-xs sm:text-sm text-red-600 mb-4">
              Select Cards from Deck (Click to select/deselect)
            </p>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-13 gap-1 sm:gap-2">
              {deck.map((card, idx) => {
                const isSelected = selectedCards.some(
                  (c) => c.suit === card.suit && c.value === card.value
                );
                return (
                  <PlayingCard
                    key={idx}
                    suit={card.suit}
                    value={card.value}
                    isSelected={isSelected}
                    onClick={() => handleCardClick(card)}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NiuNiuGame;
