"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { findDFSExpressions } from "@/lib/solver";
import { RulesDialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Value =
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

interface CardType {
  suit: Suit;
  value: Value;
  numericValue: number;
}

interface PlayingCardProps {
  suit: Suit;
  value: Value;
  isSelected: boolean;
  onClick: () => void;
}

// Simple SVG Card Component
const PlayingCard: React.FC<PlayingCardProps> = ({
  suit,
  value,
  isSelected,
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

  return (
    <div
      onClick={onClick}
      className={`relative w-16 h-24 sm:w-20 sm:h-28 bg-linear-to-br from-yellow-50 to-white rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 shadow-md ${
        isSelected
          ? "border-red-600 shadow-xl scale-105 ring-2 ring-yellow-400"
          : "border-yellow-600"
      }`}
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

const Card24Game: React.FC = () => {
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [targetNumber, setTargetNumber] = useState<number>(24);
  const [showRules, setShowRules] = useState(false);
  const router = useRouter();

  // Generate deck of cards
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

  const deck: CardType[] = suits.flatMap((suit) =>
    values.map((value) => ({
      suit,
      value,
      numericValue:
        value === "A"
          ? 1
          : ["J", "Q", "K"].includes(value)
          ? value === "J"
            ? 11
            : value === "Q"
            ? 12
            : 13
          : parseInt(value),
    }))
  );

  const handleCardClick = (card: CardType) => {
    const cardKey = `${card.suit}-${card.value}`;
    const isAlreadySelected = selectedCards.some(
      (c) => `${c.suit}-${c.value}` === cardKey
    );

    if (isAlreadySelected) {
      setSelectedCards(
        selectedCards.filter((c) => `${c.suit}-${c.value}` !== cardKey)
      );
    } else {
      if (selectedCards.length >= 5) {
        toast.warning("最多只能选择5张卡牌 / Maximum 5 cards allowed");
        return;
      }
      setSelectedCards([...selectedCards, card]);
    }
  };

  const calculateSolutions = () => {
    if (selectedCards.length < 2) {
      toast.warning("请至少选择2张卡牌 / Please select at least 2 cards");
      return;
    }

    setIsCalculating(true);
    setSolutions([]);

    // Use setTimeout to prevent UI blocking
    setTimeout(() => {
      const nums = selectedCards.map((c) => c.numericValue);
      const results = findDFSExpressions(nums, targetNumber);
      setSolutions(results);
      setIsCalculating(false);
    }, 100);
  };

  const resetGame = () => {
    setSelectedCards([]);
    setSolutions([]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-600 via-red-700 to-yellow-600 p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-5 left-5 sm:top-10 sm:left-10 text-5xl sm:text-9xl animate-bounce">
          🏮
        </div>
        <div className="absolute top-10 right-10 sm:top-20 sm:right-20 text-5xl sm:text-9xl animate-pulse">
          🧧
        </div>
        <div className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 text-5xl sm:text-9xl animate-bounce">
          🐉
        </div>
        <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 text-5xl sm:text-9xl animate-pulse">
          🏮
        </div>
        <div className="absolute top-1/2 left-1/4 text-4xl sm:text-7xl">✨</div>
        <div className="absolute top-1/3 right-1/4 text-4xl sm:text-7xl">
          🎊
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center mb-4 sm:mb-8 gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-3xl sm:text-5xl font-bold text-yellow-300 drop-shadow-lg mb-0">
              🎴 数字计算游戏 🎴
            </h1>
            <Button
              type="button"
              onClick={() => router.push("/")}
              className="ml-2 bg-yellow-400 hover:bg-yellow-500 text-red-800 font-bold px-4 py-2 rounded-lg border-2 border-red-600 shadow transition cursor-pointer text-base sm:text-lg"
            >
              ← 返回首页
            </Button>
          </div>
          <p className="text-lg sm:text-2xl text-yellow-200 font-semibold text-center">
            Number Calculation Game Solver
          </p>
          <Button
            onClick={() => setShowRules(true)}
            className="mt-2 bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-red-800 font-bold border-2 border-red-600 shadow-lg"
          >
            📖 游戏规则 / Rules
          </Button>
        </div>

        {/* Rules Dialog */}
        <RulesDialog
          open={showRules}
          onOpenChange={setShowRules}
          gameType="numbersolver"
        />

        <Card className="mb-4 sm:mb-6 bg-linear-to-br from-red-50 to-yellow-50 border-2 sm:border-4 border-yellow-500 shadow-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-700">
                🎯 目标数字 / Target Number
              </h2>
              <input
                type="number"
                value={targetNumber}
                onChange={(e) => setTargetNumber(Number(e.target.value))}
                className="w-full max-w-xs px-3 py-2 sm:px-4 sm:py-3 text-xl sm:text-2xl font-bold text-center border-2 sm:border-4 border-red-500 rounded-lg bg-yellow-50 text-red-700 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-yellow-400"
                placeholder="输入目标数字"
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-700">
              🀄 已选卡牌 ({selectedCards.length}/5)
            </h2>
            <p className="text-xs sm:text-sm text-red-600 mb-4">
              Selected Cards (minimum 2, maximum 5)
            </p>
            <div className="flex gap-2 sm:gap-4 mb-4 min-h-24 sm:min-h-32 items-center flex-wrap">
              {selectedCards.length === 0 ? (
                <p className="text-sm sm:text-base text-red-500 font-semibold">
                  👇 点击下方卡牌进行选择 / Click cards below to select
                </p>
              ) : (
                selectedCards.map((card, idx) => (
                  <PlayingCard
                    key={idx}
                    suit={card.suit}
                    value={card.value}
                    isSelected={false}
                    onClick={() => handleCardClick(card)}
                  />
                ))
              )}{" "}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button
                onClick={calculateSolutions}
                disabled={selectedCards.length < 2 || isCalculating}
                className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-yellow-100 font-bold text-base sm:text-lg border-2 border-yellow-400 shadow-lg w-full sm:w-auto"
              >
                {isCalculating
                  ? "🔮 计算中... / Calculating..."
                  : "🎯 寻找解答 / Find Solutions"}
              </Button>
              <Button
                onClick={resetGame}
                className="bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-red-800 font-bold text-base sm:text-lg border-2 border-red-500 shadow-lg w-full sm:w-auto"
              >
                🔄 重置 / Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {solutions.length > 0 && (
          <Card className="mb-4 sm:mb-6 bg-linear-to-br from-yellow-50 to-red-50 border-2 sm:border-4 border-red-500 shadow-2xl">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-700">
                ✨ 找到 {solutions.length} 个解答
              </h2>
              <p className="text-xs sm:text-sm text-red-600 mb-4">
                Solutions Found: {solutions.length}
              </p>
              <div className="max-h-64 sm:max-h-96 overflow-y-auto space-y-2">
                {solutions.slice(0, 50).map((solution, idx) => (
                  <Alert
                    key={idx}
                    className="bg-white border-2 border-yellow-400"
                  >
                    <AlertDescription className="font-mono text-xs sm:text-sm text-red-800 font-semibold break-all">
                      {solution}
                    </AlertDescription>
                  </Alert>
                ))}
                {solutions.length > 50 && (
                  <p className="text-red-700 text-xs sm:text-sm mt-4 font-semibold">
                    📋 显示前50个，共 {solutions.length} 个解答 / Showing first
                    50 of {solutions.length} solutions
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {solutions.length === 0 &&
          selectedCards.length >= 2 &&
          !isCalculating && (
            <Card className="mb-4 sm:mb-6 bg-linear-to-br from-red-50 to-yellow-50 border-2 sm:border-4 border-red-500 shadow-2xl">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-700">
                  ❌ 未找到解答
                </h2>
                <p className="text-xs sm:text-sm text-red-600">
                  No solutions found for target {targetNumber}
                </p>
              </CardContent>
            </Card>
          )}

        <Card className="bg-linear-to-br from-yellow-50 to-red-50 border-2 sm:border-4 border-yellow-500 shadow-2xl">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-700">
              🎴 选择卡牌
            </h2>
            <p className="text-xs sm:text-sm text-red-600 mb-4">
              Select Cards from Deck
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

export default Card24Game;
