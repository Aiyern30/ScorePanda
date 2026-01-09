/* eslint-disable react/no-unescaped-entities */
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          // REMOVED: max-h-[calc(100vh-4rem)] to allow custom max-h in className prop
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] sm:max-w-[90vw] md:max-w-2xl lg:max-w-4xl translate-x-[-50%] translate-y-[-50%] rounded-lg border shadow-lg duration-200 outline-none",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

interface RulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameType: "numbersolver" | "niuniu";
}

export function RulesDialog({
  open,
  onOpenChange,
  gameType,
}: RulesDialogProps) {
  const renderNumberSolverRules = () => (
    <>
      <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
        <h3 className="text-xl font-bold text-red-700 mb-2">
          🎯 目标 / Objective
        </h3>
        <p className="text-gray-700">
          使用选定的卡牌数字，通过加、减、乘、除四则运算，得出目标数字。
        </p>
        <p className="text-gray-600 text-sm mt-2">
          Use the numbers from selected cards with addition (+), subtraction
          (-), multiplication (x), and division (÷) to reach the target number.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
        <h3 className="text-xl font-bold text-red-700 mb-2">
          📝 游戏步骤 / How to Play
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            <strong>设置目标数字：</strong>输入你想要达到的数字(默认为24)
            <br />
            <span className="text-sm text-gray-600">
              Set target number: Enter the number you want to reach (default is
              24)
            </span>
          </li>
          <li>
            <strong>选择卡牌：</strong>从牌组中选择至少2张卡牌
            <br />
            <span className="text-sm text-gray-600">
              Select cards: Choose at least 2 cards from the deck
            </span>
          </li>
          <li>
            <strong>寻找解答：</strong>
            点击"寻找解答"按钮，系统会自动计算所有可能的解法
            <br />
            <span className="text-sm text-gray-600">
              Find solutions: Click "Find Solutions" and the system will
              calculate all possible solutions
            </span>
          </li>
        </ol>
      </div>

      <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
        <h3 className="text-xl font-bold text-red-700 mb-2">
          🃏 卡牌数值 / Card Values
        </h3>
        <ul className="space-y-1 text-gray-700">
          <li>• A = 1</li>
          <li>• 2-10 = 面值 / Face value</li>
          <li>• J = 11</li>
          <li>• Q = 12</li>
          <li>• K = 13</li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
        <h3 className="text-xl font-bold text-red-700 mb-2">
          💡 示例 / Example
        </h3>
        <p className="text-gray-700">
          选择卡牌：3, 3, 8, 8 | 目标：24
          <br />
          <span className="text-sm text-gray-600">
            Selected cards: 3, 3, 8, 8 | Target: 24
          </span>
        </p>
        <p className="font-mono text-sm text-red-700 mt-2 bg-yellow-50 p-2 rounded">
          解答 / Solution: (8 / (3 - (8 / 3))) = 24
        </p>
      </div>

      <div className="bg-linear-to-r from-red-100 to-yellow-100 p-4 rounded-lg border-2 border-red-400">
        <h3 className="text-xl font-bold text-red-700 mb-2">
          ⚠️ 注意事项 / Notes
        </h3>
        <ul className="space-y-1 text-gray-700 text-sm">
          <li>• 每张卡牌只能使用一次 / Each card can only be used once</li>
          <li>
            • 可以使用任意数量的括号 / You can use any number of parentheses
          </li>
          <li>• 所有数字都必须使用 / All numbers must be used</li>
          <li>
            • 系统会显示最多50个解答 / System will display up to 50 solutions
          </li>
        </ul>
      </div>
    </>
  );

  const rulesContent = {
    numbersolver: {
      title: "🎴 数字计算游戏规则 / Number Calculation Game Rules",
      description: "How to use the Number Calculation Game Solver",
      content: renderNumberSolverRules(),
    },
    niuniu: {
      title: "🐂 牛牛游戏规则 / NiuNiu Game Rules",
      description: "How to play NiuNiu",
      content: (
        <div className="space-y-4 text-sm">
          <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
            <h3 className="text-xl font-bold text-red-700 mb-2">
              🎯 目标 / Objective
            </h3>
            <p className="text-gray-700">
              使用5张牌，尝试组成三张牌总和为10的倍数，剩余两张牌的个位数决定"牛"的大小。
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Use 5 cards to form a group of 3 cards that sum to a multiple of
              10. The ones digit of the remaining 2 cards determines your "Niu"
              rank.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
            <h3 className="text-xl font-bold text-red-700 mb-2">
              🃏 卡牌数值 / Card Values
            </h3>
            <ul className="space-y-1 text-gray-700">
              <li>• A (Ace) = 1 点</li>
              <li>• 2-10 = 面值 / Face value</li>
              <li>• J, Q, K = 10 点 / 10 points each</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
            <h3 className="text-xl font-bold text-red-700 mb-2">
              📝 游戏步骤 / How to Play
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                <strong>发牌：</strong>系统会发5张牌
                <br />
                <span className="text-sm text-gray-600">
                  Deal: System deals 5 cards
                </span>
              </li>
              <li>
                <strong>寻找组合：</strong>
                系统会自动寻找三张牌总和为10的倍数的组合
                <br />
                <span className="text-sm text-gray-600">
                  Find combination: System finds 3 cards summing to multiple of
                  10
                </span>
              </li>
              <li>
                <strong>计算牛数：</strong>剩余两张牌的总和个位数就是你的"牛"
                <br />
                <span className="text-sm text-gray-600">
                  Calculate Niu: Ones digit of remaining 2 cards is your Niu
                  rank
                </span>
              </li>
            </ol>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
            <h3 className="text-xl font-bold text-red-700 mb-2">
              🏆 牌型排名 / Hand Rankings
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">👑</span>
                <div>
                  <strong>至尊黑桃A (5000分):</strong>{" "}
                  有效牌型且对子含黑桃A+公仔牌
                  <br />
                  <span className="text-gray-600">
                    Supreme Spade Ace: Valid Hand with Pair of Spade Ace + Face
                    Card
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">💎</span>
                <div>
                  <strong>五花牛/炸弹 (4500分):</strong> 五张都是J/Q/K
                  <br />
                  <span className="text-gray-600">
                    Five Face Cards: All J/Q/K
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🐂</span>
                <div>
                  <strong>牛牛 (Double) (3000分+):</strong> 严格对子 (如 K-K)
                  <br />
                  <span className="text-gray-600">
                    Double: Strict Pair (e.g. K-K) beats Mixed Pair
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🐂</span>
                <div>
                  <strong>牛牛 (2000分):</strong> 两组都是10的倍数
                  <br />
                  <span className="text-gray-600">
                    Niu Niu: Both groups sum to multiples of 10
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div>
                  <strong>牛9 (1900分):</strong> 剩余两张总和为9/19/29
                  <br />
                  <span className="text-gray-600">
                    Niu 9: Remaining cards sum to 9/19/29
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <div>
                  <strong>牛8-牛1:</strong> 依次递减
                  <br />
                  <span className="text-gray-600">
                    Niu 8 to Niu 1: Descending
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">😢</span>
                <div>
                  <strong>没牛 (0分):</strong> 无法组成三张牌总和为10的倍数
                  <br />
                  <span className="text-gray-600">
                    No Niu: Cannot form valid combination
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
            <h3 className="text-xl font-bold text-red-700 mb-2">
              ✨ 特殊规则 / Special Rules
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>
                <strong>对子优先 / Double Priority:</strong>
                严格对子 (如 J-J) 比混合对子 (如 Q-J)大。
                <br />
                <span className="text-gray-500 pl-4">
                  Strict Pairs (J-J) beat Mixed Pairs (Q-J).
                </span>
              </li>
              <li>
                <strong>天然优先 / Natural Priority:</strong>
                优先使用天然点数 (如 4+6) 而非变身点数 (如 4+3变6)。
                <br />
                <span className="text-gray-500 pl-4">
                  Natural sums favored over flexible sums.
                </span>
              </li>
              <li>
                <strong>3/6互换 / 3 and 6 Interchange:</strong>
                在计算组合时，3可以当6用，6也可以当3用（如需要组成10的倍数时）。
                <br />
                <span className="text-gray-500 pl-4">
                  When forming combinations, 3 can be treated as 6 and 6 as 3 to
                  help make multiples of 10.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-red-700 mb-2">📖 示例 / Examples:</h3>
            <div className="space-y-3 bg-green-50 p-3 rounded max-h-96 overflow-y-auto">
              <div className="bg-gray-100 p-3 rounded border-l-4 border-gray-500">
                <strong className="text-gray-700">
                  无牛 / No Niu (Score: 1)
                </strong>
                <br />
                <span className="font-mono text-sm">K♠, 8♥, 7♦, 4♣, 2♠</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 任意三张牌都无法凑成10的倍数
                  <br />
                  • No combination of 3 cards sums to multiple of 10
                  <br />• 无牛组 / No valid group found
                </span>
              </div>

              <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <strong className="text-orange-700">
                  牛一 / Niu 1 (Score: 10)
                </strong>
                <br />
                <span className="font-mono text-sm">9♠, 6♥, 5♦, 7♣, 4♠</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 三张牌组 (Base): 9+6+5 = 20 (凑整 ✓)
                  <br />
                  • 两张牌组 (Pair): 7+4 = 11 → 1点 = 牛一
                  <br />
                  • Base group: 9+6+5 = 20 (multiple of 10)
                  <br />• Pair: 7+4 = 11 → 1 point = Niu 1
                </span>
              </div>

              <div className="bg-orange-100 p-3 rounded border-l-4 border-orange-500">
                <strong className="text-orange-800">
                  牛二 / Niu 2 (Score: 20)
                </strong>
                <br />
                <span className="font-mono text-sm">K♥, Q♦, 9♣, 8♠, 4♥</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 三张牌组 (Base): K(10)+Q(10)+9 = 29 → 要凑30 ✗
                  <br />
                  • 三张牌组 (Base): K(10)+9+8 = 27 → 要凑30 ✗
                  <br />
                  • 三张牌组 (Base): 9+8+K(10) = 27 → 要凑30 ✗
                  <br />
                  • ✓ 三张牌组 (Base): K(10)+8+Q(10) = 28 → 要凑30 ✗
                  <br />
                  • ✓ 三张牌组 (Base): 9+8+K(3) = 20 (凑整 ✓) [6和3可互換]
                  <br />
                  • 两张牌组 (Pair): Q(10)+4 = 14 → 4 → 要2点 ✗
                  <br />• ✓ 两张牌组 (Pair): Q(6)+K(6) = 12 → 2点 = 牛二
                  [10視為6]
                </span>
              </div>

              <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                <strong className="text-yellow-800">
                  牛三 / Niu 3 (Score: 30)
                </strong>
                <br />
                <span className="font-mono text-sm">J♠, 10♥, 7♦, 6♣, 3♠</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 三张牌组 (Base): J(10)+10+7 = 27 → 要凑30 ✗
                  <br />
                  • 三张牌组 (Base): J(10)+7+6 = 23 → 要凑30 ✗
                  <br />
                  • ✓ 三张牌组 (Base): J(10)+10+3 = 23 → 要凑30 ✗
                  <br />
                  • ✓ 三张牌组 (Base): J(3)+10+7 = 20 (凑整 ✓) [6和3可互換]
                  <br />
                  • 两张牌组 (Pair): 6+3 = 9 → 要3点 ✗
                  <br />• ✓ 两张牌组 (Pair): 10+3 = 13 → 3点 = 牛三
                </span>
              </div>

              <div className="bg-yellow-100 p-3 rounded border-l-4 border-yellow-600">
                <strong className="text-yellow-900">
                  牛四 / Niu 4 (Score: 40)
                </strong>
                <br />
                <span className="font-mono text-sm">K♦, 9♠, 7♥, 5♣, 4♦</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 三张牌组 (Base): 9+7+4 = 20 (凑整 ✓)
                  <br />
                  • 两张牌组 (Pair): K(10)+5 = 15 → 5点 ≠ 4点
                  <br />
                  • ✓ 三张牌组 (Base): 9+5+K(6) = 20 (凑整 ✓)
                  <br />
                  • ✓ 两张牌组 (Pair): 7+4 = 11 → 1点 ≠ 4点
                  <br />
                  • ✓ 三张牌组 (Base): K(10)+7+K(3) = 20 (凑整 ✓) [special:
                  10视为3或6]
                  <br />• ✓ 两张牌组 (Pair): 9+5 = 14 → 4点 = 牛四
                </span>
              </div>

              <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
                <strong className="text-amber-800">
                  牛五 / Niu 5 (Score: 50)
                </strong>
                <br />
                <span className="font-mono text-sm">Q♣, 8♠, 7♥, 6♦, 5♠</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 三张牌组 (Base): 8+7+5 = 20 (凑整 ✓)
                  <br />
                  • 两张牌组 (Pair): Q(10)+6 = 16 → 6点 ≠ 5点
                  <br />
                  • ✓ 三张牌组 (Base): Q(10)+8+Q(2) = 20 (凑整 ✓) [10可视为2]
                  <br />
                  • ✓ 两张牌组 (Pair): 7+6 = 13 → 3点 ≠ 5点
                  <br />
                  • ✓ 三张牌组 (Base): Q(6)+8+Q(6) = 20 (凑整 ✓)
                  <br />• ✓ 两张牌组 (Pair): 7+8 = 15 → 5点 = 牛五
                </span>
              </div>

              <div className="bg-orange-200 p-3 rounded border-l-4 border-orange-600">
                <strong className="text-orange-900">
                  牛六 / Niu 6 (Score: 60)
                </strong>
                <br />
                <span className="font-mono text-sm">J♥, 9♦, 8♣, 7♠, 6♥</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 三张牌组 (Base): 9+8+J(3) = 20 (凑整 ✓)
                  <br />
                  • 两张牌组 (Pair): 7+6 = 13 → 3点 ≠ 6点
                  <br />
                  • ✓ 三张牌组 (Base): J(10)+7+J(3) = 20 (凑整 ✓)
                  <br />• ✓ 两张牌组 (Pair): 9+7 = 16 → 6点 = 牛六
                </span>
              </div>

              <div className="bg-red-100 p-3 rounded border-l-4 border-red-500">
                <strong className="text-red-700">
                  牛七 / Niu 7 (Score: 70)
                </strong>
                <br />
                <span className="font-mono text-sm">K♠, J♥, 9♦, 8♣, 7♠</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 三张牌组 (Base): K(10)+J(10)+9 = 29 → 要凑30 ✗
                  <br />
                  • ✓ 三张牌组 (Base): K(3)+9+8 = 20 (凑整 ✓)
                  <br />• ✓ 两张牌组 (Pair): J(10)+7 = 17 → 7点 = 牛七
                </span>
              </div>

              <div className="bg-red-200 p-3 rounded border-l-4 border-red-600">
                <strong className="text-red-800">
                  牛八 / Niu 8 (Score: 80)
                </strong>
                <br />
                <span className="font-mono text-sm">9♠, 7♥, 4♦, 6♣, 2♠</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 三张牌组 (Base): 9+7+4 = 20 (凑整 ✓)
                  <br />• 两张牌组 (Pair): 6+2 = 8点 = 牛八
                </span>
              </div>

              <div className="bg-red-300 p-3 rounded border-l-4 border-red-700">
                <strong className="text-red-900">
                  牛九 / Niu 9 (Score: 90)
                </strong>
                <br />
                <span className="font-mono text-sm">K♣, Q♠, 8♥, 5♦, 4♣</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 三张牌组 (Base): K(10)+Q(10)+8 = 28 → 要凑30 ✗
                  <br />
                  • ✓ 三张牌组 (Base): K(6)+Q(10)+4 = 20 (凑整 ✓)
                  <br />
                  • ✓ 两张牌组 (Pair): 8+K(1) = 9点 [10可视为1]
                  <br />
                  • 两张牌组 (Pair): 8+5 = 13 → 3点 ≠ 9点
                  <br />• ✓ 最佳: 8+K(1) = 9点 = 牛九
                </span>
              </div>

              <div className="bg-linear-to-r from-yellow-200 to-orange-300 p-3 rounded border-l-4 border-yellow-600">
                <strong className="text-yellow-900">
                  牛牛 / Niu Niu (Score: 500)
                </strong>
                <br />
                <span className="font-mono text-sm">K♥, Q♦, 5♣, 3♠, 2♥</span>
                <br />
                <span className="text-xs text-gray-600">
                  • ✓ 三张牌组 (Base): 5+3+2 = 10 (凑整 ✓)
                  <br />
                  • ✓ 两张牌组 (Pair): K(10)+Q(10) = 20 → 0点 = 牛牛！🐂
                  <br />• 最高奖励 / Highest regular reward!
                </span>
              </div>

              <div className="bg-linear-to-r from-purple-200 to-pink-200 p-3 rounded border-l-4 border-purple-600">
                <strong className="text-purple-900">
                  💎 特殊牌型 / Special Hands
                </strong>
              </div>

              <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-500">
                <strong className="text-purple-700">
                  葫芦牛 / Full House (Score: 4400)
                </strong>
                <br />
                <span className="font-mono text-sm">K♠, K♥, K♦, 7♣, 7♠</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 三张相同 + 两张相同
                  <br />
                  • 3 of a kind + pair
                  <br />• 特殊牌型，自动识别 / Auto-detected special hand
                </span>
              </div>

              <div className="bg-purple-100 p-3 rounded border-l-4 border-purple-600">
                <strong className="text-purple-800">
                  炸弹牛 / Four of a Kind (Score: 4600)
                </strong>
                <br />
                <span className="font-mono text-sm">Q♣, Q♠, Q♥, Q♦, 5♠</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 四张相同点数
                  <br />
                  • 4 cards same value
                  <br />• 超强牌型！/ Super strong hand!
                </span>
              </div>

              <div className="bg-linear-to-r from-purple-300 to-pink-300 p-3 rounded border-l-4 border-purple-700">
                <strong className="text-purple-900">
                  五公牛 / Five Face Cards (Score: 4800)
                </strong>
                <br />
                <span className="font-mono text-sm">K♠, K♥, Q♦, J♣, J♠</span>
                <br />
                <span className="text-xs text-gray-600">
                  • 全部是公牌 (J, Q, K)
                  <br />
                  • All face cards (J, Q, K)
                  <br />• 最强牌型！💎 / Ultimate hand!
                </span>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-red-100 to-yellow-100 p-4 rounded-lg border-2 border-red-400">
            <h3 className="text-xl font-bold text-red-700 mb-2">
              ⚠️ 注意事项 / Notes
            </h3>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• 系统会自动寻找最佳组合 / System finds best combination</li>
              <li>
                • 金色边框显示三张牌组 / Gold border shows three-card group
              </li>
              <li>• 红色边框显示两张牌组 / Red border shows two-card group</li>
              <li>• 特殊牌型有更高分数 / Special hands have higher scores</li>
            </ul>
          </div>
        </div>
      ),
    },
  };

  const gameTitle =
    gameType === "numbersolver"
      ? "🎴 数字计算游戏规则 / Number Calculation Game Rules"
      : "🐂 牛牛游戏规则 / NiuNiu Game Rules";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 bg-linear-to-br from-red-50 to-yellow-50 border-4 border-red-500 w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] sm:max-w-[90vw] md:max-w-2xl lg:max-w-4xl max-h-[90vh] flex! flex-col! overflow-hidden"
        showCloseButton={true}
      >
        {/* Fixed Header */}
        <div className="p-3 sm:p-4 md:p-6 border-b-2 border-red-300 shrink-0 bg-linear-to-br from-red-50 to-yellow-50">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl text-red-700 text-center pr-8">
              {rulesContent[gameType].title}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm md:text-base text-red-600 text-center mt-1 sm:mt-2">
              {rulesContent[gameType].description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 min-h-0 p-3 sm:p-4 md:p-6">
          <div className="space-y-3 sm:space-y-4">
            {rulesContent[gameType].content}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-3 sm:p-4 md:p-6 border-t-2 border-red-300 text-center shrink-0 bg-linear-to-br from-red-50 to-yellow-50">
          <button
            onClick={() => onOpenChange(false)}
            className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-yellow-100 font-bold text-sm sm:text-base md:text-lg border-2 border-yellow-400 shadow-lg px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-all hover:scale-105 w-full sm:w-auto"
          >
            ✅ 明白了 / Got It!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
