"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      className={`relative w-20 h-28 bg-white rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 ${
        isSelected ? "border-blue-500 shadow-lg scale-105" : "border-gray-300"
      }`}
    >
      <div
        className="absolute top-1 left-1 text-sm font-bold"
        style={{ color: suitColors[suit] }}
      >
        <div>{value}</div>
        <div className="text-lg leading-none">{suitSymbols[suit]}</div>
      </div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
        style={{ color: suitColors[suit] }}
      >
        {suitSymbols[suit]}
      </div>
      <div
        className="absolute bottom-1 right-1 text-sm font-bold rotate-180"
        style={{ color: suitColors[suit] }}
      >
        <div>{value}</div>
        <div className="text-lg leading-none">{suitSymbols[suit]}</div>
      </div>
    </div>
  );
};

// Solver function (converted from Python)
const findDFSExpressions = (nums: number[], target: number): string[] => {
  const results: string[] = [];

  const isClose = (a: number, b: number, tolerance = 1e-6) => {
    return Math.abs(a - b) < tolerance;
  };

  const dfs = (currentNums: number[], exprs: string[]) => {
    if (currentNums.length === 1) {
      if (isClose(currentNums[0], target)) {
        results.push(exprs[0]);
      }
      return;
    }

    const n = currentNums.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = currentNums[i];
        const b = currentNums[j];
        const exprA = exprs[i];
        const exprB = exprs[j];

        // Fix: ensure remaining is number[]
        const remaining = currentNums
          .map((num, k) => (k !== i && k !== j ? num : undefined))
          .filter((num): num is number => num !== undefined);

        const remainingExprs = exprs
          .map((expr, k) => (k !== i && k !== j ? expr : undefined))
          .filter((expr): expr is string => expr !== undefined);

        const operations: [number, string][] = [
          [a + b, `(${exprA} + ${exprB})`],
          [a - b, `(${exprA} - ${exprB})`],
          [b - a, `(${exprB} - ${exprA})`],
          [a * b, `(${exprA} * ${exprB})`],
        ];

        if (b !== 0) {
          operations.push([a / b, `(${exprA} / ${exprB})`]);
        }
        if (a !== 0) {
          operations.push([b / a, `(${exprB} / ${exprA})`]);
        }

        for (const [val, exprStr] of operations) {
          dfs([...remaining, val], [...remainingExprs, exprStr]);
        }
      }
    }
  };

  dfs(nums, nums.map(String));
  return results;
};

const Card24Game: React.FC = () => {
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

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
    } else if (selectedCards.length < 5) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const calculateSolutions = () => {
    if (selectedCards.length !== 5) {
      alert("Please select exactly 5 cards");
      return;
    }

    setIsCalculating(true);
    setSolutions([]);

    // Use setTimeout to prevent UI blocking
    setTimeout(() => {
      const nums = selectedCards.map((c) => c.numericValue);
      const results = findDFSExpressions(nums, 24);
      setSolutions(results);
      setIsCalculating(false);
    }, 100);
  };

  const resetGame = () => {
    setSelectedCards([]);
    setSolutions([]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-700 to-green-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          24 Card Game Solver
        </h1>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Selected Cards ({selectedCards.length}/5)
            </h2>
            <div className="flex gap-4 mb-4 min-h-32 items-center">
              {selectedCards.length === 0 ? (
                <p className="text-gray-500">
                  Click on cards below to select them
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
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={calculateSolutions}
                disabled={selectedCards.length !== 5 || isCalculating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCalculating ? "Calculating..." : "Find Solutions"}
              </Button>
              <Button onClick={resetGame} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {solutions.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Solutions Found: {solutions.length}
              </h2>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {solutions.slice(0, 50).map((solution, idx) => (
                  <Alert key={idx}>
                    <AlertDescription className="font-mono text-sm">
                      {solution}
                    </AlertDescription>
                  </Alert>
                ))}
                {solutions.length > 50 && (
                  <p className="text-gray-600 text-sm mt-4">
                    Showing first 50 of {solutions.length} solutions
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Select Cards from Deck
            </h2>
            <div className="grid grid-cols-13 gap-2">
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
