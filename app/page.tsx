"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

export default function Home() {
  const router = useRouter();
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // Generate fireworks
  useEffect(() => {
    const interval = setInterval(() => {
      const newFirework = {
        id: Math.random(),
        x: Math.random() * 100,
        y: 20 + Math.random() * 30,
        color: ["#FFD700", "#FF6B6B", "#FFA500", "#FF69B4"][
          Math.floor(Math.random() * 4)
        ],
      };
      setFireworks((prev) => [...prev, newFirework]);

      setTimeout(() => {
        setFireworks((prev) => prev.filter((fw) => fw.id !== newFirework.id));
      }, 2000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Generate sparkles
  useEffect(() => {
    const interval = setInterval(() => {
      const newSparkle = {
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
      };
      setSparkles((prev) => [...prev, newSparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 1500);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const floatingItems = [
    { emoji: "🏮", delay: "0s", duration: "6s", x: "10%", y: "10%" },
    { emoji: "🧧", delay: "1s", duration: "7s", x: "85%", y: "15%" },
    { emoji: "🐉", delay: "2s", duration: "8s", x: "15%", y: "80%" },
    { emoji: "🏮", delay: "0.5s", duration: "6.5s", x: "90%", y: "85%" },
    { emoji: "🎊", delay: "1.5s", duration: "7.5s", x: "50%", y: "5%" },
    { emoji: "🧨", delay: "2.5s", duration: "8.5s", x: "75%", y: "50%" },
    { emoji: "🎆", delay: "3s", duration: "9s", x: "25%", y: "45%" },
    { emoji: "🪙", delay: "0.8s", duration: "6.8s", x: "60%", y: "25%" },
  ];

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-red-600 via-red-700 to-yellow-600 relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-yellow-500/20 via-transparent to-red-500/20 animate-pulse"></div>

      {/* Floating decorative elements */}
      {floatingItems.map((item, i) => (
        <div
          key={i}
          className="absolute text-6xl opacity-30 pointer-events-none"
          style={{
            left: item.x,
            top: item.y,
            animation: `float ${item.duration} ease-in-out infinite`,
            animationDelay: item.delay,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Fireworks */}
      {fireworks.map((fw) => (
        <div
          key={fw.id}
          className="absolute pointer-events-none"
          style={{
            left: `${fw.x}%`,
            top: `${fw.y}%`,
          }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: fw.color,
                animation: `firework-particle 2s ease-out forwards`,
                transform: `rotate(${i * 30}deg)`,
                boxShadow: `0 0 10px ${fw.color}`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute text-yellow-300 pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animation: "sparkle 1.5s ease-out forwards",
            fontSize: "20px",
          }}
        >
          ✨
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 px-4 sm:px-8 w-full">
        <h1 className="text-6xl font-bold text-center mb-12 text-yellow-300 drop-shadow-2xl animate-bounce-slow">
          <span className="inline-block animate-wiggle">🎊</span> 新年快乐{" "}
          <span
            className="inline-block animate-wiggle"
            style={{ animationDelay: "0.2s" }}
          >
            🎊
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* NiuNiu Page Card */}
          <div
            onClick={() => router.push("/niuniu")}
            className="cursor-pointer bg-linear-to-br from-red-500 to-red-700 shadow-2xl rounded-xl p-10 flex flex-col items-center justify-center text-2xl font-bold text-yellow-300 hover:scale-110 transition-all duration-300 border-4 border-yellow-400 hover:border-yellow-200 hover:shadow-yellow-300/50 hover:rotate-2 group"
          >
            <span className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
              🐂
            </span>
            <span className="text-3xl">牛牛</span>
            <span className="text-lg mt-2 opacity-90">NiuNiu</span>
          </div>

          {/* NumberSolver Page Card */}
          <div
            onClick={() => router.push("/numbersolver")}
            className="cursor-pointer bg-linear-to-br from-yellow-500 to-yellow-700 shadow-2xl rounded-xl p-10 flex flex-col items-center justify-center text-2xl font-bold text-red-700 hover:scale-110 transition-all duration-300 border-4 border-red-500 hover:border-red-300 hover:shadow-red-300/50 hover:-rotate-2 group"
          >
            <span className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
              🔢
            </span>
            <span className="text-3xl">数字游戏</span>
            <span className="text-lg mt-2 opacity-90">NumberSolver</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(5deg);
          }
          50% {
            transform: translateY(-40px) translateX(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-20px) translateX(10px) rotate(5deg);
          }
        }

        @keyframes firework-particle {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(0, 100px) scale(0);
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
