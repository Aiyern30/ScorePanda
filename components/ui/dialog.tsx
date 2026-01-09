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

  const renderNiuNiuRules = () => (
    <>
      <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
        <h3 className="text-xl font-bold text-red-700 mb-2">
          🎯 目标 / Objective
        </h3>
        <p className="text-gray-700">
          使用5张牌，尝试组成三张牌总和为10的倍数，剩余两张牌的个位数决定"牛"的大小。
        </p>
        <p className="text-gray-600 text-sm mt-2">
          Use 5 cards to form a group of 3 cards that sum to a multiple of 10.
          The ones digit of the remaining 2 cards determines your "Niu" rank.
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
              Find combination: System finds 3 cards summing to multiple of 10
            </span>
          </li>
          <li>
            <strong>计算牛数：</strong>剩余两张牌的总和个位数就是你的"牛"
            <br />
            <span className="text-sm text-gray-600">
              Calculate Niu: Ones digit of remaining 2 cards is your Niu rank
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
              <strong>至尊黑桃A (5000分):</strong> 有效牌型且对子含黑桃A+公仔牌
              <br />
              <span className="text-gray-600">
                Supreme Spade Ace: Valid Hand with Pair of Spade Ace + Face Card
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            <div>
              <strong>五花牛/炸弹 (4500分):</strong> 五张都是J/Q/K
              <br />
              <span className="text-gray-600">Five Face Cards: All J/Q/K</span>
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
              <span className="text-gray-600">Niu 8 to Niu 1: Descending</span>
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
                When forming combinations, 3 can be treated as 6 and 6 as 3 to help make multiples of 10.
              </span>
            </li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg border-2 border-yellow-400">
        <h3 className="text-xl font-bold text-red-700 mb-2">
          💡 示例 / Example
        </h3>
          <p className="text-gray-700 mb-2">手牌：K♥, Q♦, 5♣, 3♠, 2♥</p>
          <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
            <p className="font-semibold text-red-700 mb-1">
              三张牌组 / Three-card group:
            </p>
            <p className="font-mono text-sm text-gray-700">
              K(10) + Q(10) + 5 = 25 → 总和为10的倍数 ✗ (应为30, 20, 10等)
            </p>
            <p className="font-semibold text-red-700 mt-2 mb-1">
              两张牌组 / Two-card group:
            </p>
            <p className="font-mono text-sm text-gray-700">
              3 + 2 = 5 → 个位数 = 5
            </p>
            <p className="font-bold text-red-600 mt-2">
              结果 / Result: 无牛 (No Niu)
            </p>
          </div>
      </div>

      <div className="bg-linear-to-r from-red-100 to-yellow-100 p-4 rounded-lg border-2 border-red-400">
        <h3 className="text-xl font-bold text-red-700 mb-2">
          ⚠️ 注意事项 / Notes
        </h3>
        <ul className="space-y-1 text-gray-700 text-sm">
          <li>• 系统会自动寻找最佳组合 / System finds best combination</li>
          <li>• 金色边框显示三张牌组 / Gold border shows three-card group</li>
          <li>• 红色边框显示两张牌组 / Red border shows two-card group</li>
          <li>• 特殊牌型有更高分数 / Special hands have higher scores</li>
        </ul>
      </div>
    </>
  );

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
              {gameTitle}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm md:text-base text-red-600 text-center mt-1 sm:mt-2">
              {gameType === "numbersolver"
                ? "How to use the Number Calculation Game Solver"
                : "How to play NiuNiu"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 min-h-0 p-3 sm:p-4 md:p-6">
          <div className="space-y-3 sm:space-y-4">
            {gameType === "numbersolver"
              ? renderNumberSolverRules()
              : renderNiuNiuRules()}
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
