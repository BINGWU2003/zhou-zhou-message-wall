import { FaHeart, FaChalkboardTeacher } from "react-icons/fa";
import { cn } from "@/app/lib/utils";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-primary to-secondary/90 text-white py-10 md:py-16 relative overflow-hidden">
      {/* 背景装饰 */}
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgb3BhY2l0eT0iMC4yIiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIi8+PC9nPjwvc3ZnPg==')] 
        opacity-20"
      />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-2 right-0 w-40 h-40 bg-white opacity-10 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute -top-2 left-0 w-40 h-40 bg-white opacity-10 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-block mb-4 bg-white/10 p-4 rounded-full backdrop-blur-sm">
          <FaChalkboardTeacher className="text-4xl md:text-5xl mx-auto" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-md tracking-tight">
          周周老师的加油站
        </h1>
        <p
          className={cn(
            "md:text-xl opacity-90 max-w-xl mx-auto flex justify-center",
            "items-center flex-wrap gap-2 leading-relaxed"
          )}
        >
          这里汇集了大家对周周老师的支持与祝福
          <FaHeart className="text-pink-200 animate-pulse mx-1" />
          愿您的备课之路充满温暖与力量！
        </p>
      </div>
    </header>
  );
}
