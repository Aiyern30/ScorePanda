import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="grid grid-cols-2 gap-8">
        {/* NiuNiu Page Card */}
        <div
          onClick={() => router.push("/niuniu")}
          className="cursor-pointer bg-white shadow-lg rounded-xl p-10 flex items-center justify-center text-xl font-bold hover:bg-blue-100 transition"
        >
          NiuNiu
        </div>

        {/* NumberSolver Page Card */}
        <div
          onClick={() => router.push("/numbersolver")}
          className="cursor-pointer bg-white shadow-lg rounded-xl p-10 flex items-center justify-center text-xl font-bold hover:bg-green-100 transition"
        >
          NumberSolver
        </div>
      </div>
    </div>
  );
}
