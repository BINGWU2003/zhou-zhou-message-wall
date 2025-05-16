import { FaHeart } from "react-icons/fa";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { Sparkles, Stars, Lightbulb } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { ThemeToggle } from "./ui/theme-toggle";

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary text-white py-12 md:py-20">
      {/* 主题切换开关 */}
      <div className="absolute right-5 top-5 z-10">
        <ThemeToggle />
      </div>

      {/* 动态背景 */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgb3BhY2l0eT0iMC4yIiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIi8+PC9nPjwvc3ZnPg==')]" />

      {/* 装饰元素 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 大型模糊圆形 */}
        <div className="absolute -bottom-8 right-0 w-64 h-64 bg-white/10 rounded-full blur-xl transform translate-x-1/3 translate-y-1/3 animate-pulse"></div>
        <div
          className="absolute -top-8 left-0 w-64 h-64 bg-white/10 rounded-full blur-xl transform -translate-x-1/3 -translate-y-1/3 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* 小型装饰元素 */}
        <div className="absolute top-1/4 right-[10%] text-white/20 animate-float">
          <Stars className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <div
          className="absolute bottom-1/4 left-[10%] text-white/20 animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div
          className="absolute top-2/3 left-[25%] text-white/15 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <Lightbulb className="w-5 h-5 md:w-6 md:h-6" />
        </div>

        {/* 装饰光线效果 */}
        <div className="absolute -right-20 top-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45"></div>
        <div className="absolute -left-20 top-1/3 w-40 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* 图标容器 */}
        <div className="inline-flex items-center justify-center mb-6 bg-white/10 p-5 rounded-full backdrop-blur-md shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/15 group">
          <div className="relative">
            <PiChalkboardTeacherFill className="text-4xl md:text-5xl mx-auto relative z-10 group-hover:text-white transition-colors" />
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-0 group-hover:scale-125 transition-transform"></div>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/95 to-white/90 drop-shadow-sm">
            周周的加油站
          </span>
        </h1>

        {/* 描述容器 */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl max-w-2xl mx-auto shadow-lg border border-white/10 relative">
          {/* 装饰边角 */}
          <div className="absolute w-3 h-3 border-t border-l border-white/20 top-2 left-2"></div>
          <div className="absolute w-3 h-3 border-t border-r border-white/20 top-2 right-2"></div>
          <div className="absolute w-3 h-3 border-b border-l border-white/20 bottom-2 left-2"></div>
          <div className="absolute w-3 h-3 border-b border-r border-white/20 bottom-2 right-2"></div>

          <p
            className={cn(
              "md:text-xl max-w-xl mx-auto flex justify-center",
              "items-center flex-wrap gap-2 leading-relaxed"
            )}
          >
            这里汇集了大家对周周的支持与祝福
            <FaHeart className="text-pink-200 animate-pulse mx-1" />
            愿周周的备考之路充满温暖与力量！
          </p>
        </div>
      </div>
    </header>
  );
}
