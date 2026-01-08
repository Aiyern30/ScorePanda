"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-yellow-600 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">🏮</div>
        <div className="absolute top-20 right-20 text-8xl">🧧</div>
        <div className="absolute bottom-20 left-20 text-8xl">🐉</div>
        <div className="absolute bottom-10 right-10 text-8xl">🏮</div>
      </div>

      <div className="relative z-10">
        <h1 className="text-5xl font-bold text-center mb-12 text-yellow-300 drop-shadow-lg">
          🎊 新年快乐 🎊
        </h1>

        <div className="grid grid-cols-2 gap-8">
          {/* NiuNiu Page Card */}
          <div
            onClick={() => router.push("/niuniu")}
            className="cursor-pointer bg-gradient-to-br from-red-500 to-red-700 shadow-2xl rounded-xl p-10 flex flex-col items-center justify-center text-2xl font-bold text-yellow-300 hover:scale-105 transition-transform border-4 border-yellow-400 hover:border-yellow-200"
          >
            <span className="text-4xl mb-2">🐂</span>
            <span>牛牛</span>
            <span className="text-lg mt-1">NiuNiu</span>
          </div>

          {/* NumberSolver Page Card */}
          <div
            onClick={() => router.push("/numbersolver")}
            className="cursor-pointer bg-gradient-to-br from-yellow-500 to-yellow-700 shadow-2xl rounded-xl p-10 flex flex-col items-center justify-center text-2xl font-bold text-red-700 hover:scale-105 transition-transform border-4 border-red-500 hover:border-red-300"
          >
            <span className="text-4xl mb-2">🔢</span>
            <span>数字游戏</span>
            <span className="text-lg mt-1">NumberSolver</span>
          </div>
        </div>
      </div>
    </div>
  );
}
