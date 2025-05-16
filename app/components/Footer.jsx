import { FaHeart, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { create } from "zustand";

// 创建全局状态存储，用于管理管理员模式
export const useAdminStore = create((set) => ({
  isAdminMode: false,
  enableAdminMode: () => set({ isAdminMode: true }),
  disableAdminMode: () => set({ isAdminMode: false }),
}));

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [clickCount, setClickCount] = useState(0);
  const { enableAdminMode, disableAdminMode, isAdminMode } = useAdminStore();

  // 处理点击事件
  const handleFooterClick = () => {
    // 增加点击计数
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // 到达10次点击时，启用管理员模式
    if (newCount === 10) {
      enableAdminMode();
      toast.success("已开启管理员模式", {
        description: "现在可以删除留言了",
        duration: 3000,
      });
    }
  };

  // 退出管理员模式
  const handleExitAdminMode = (e) => {
    e.stopPropagation(); // 阻止冒泡，避免触发footer点击事件
    disableAdminMode();
    setClickCount(0);
    toast.info("已退出管理员模式", { duration: 2000 });
  };

  // 检测ESC键，退出管理员模式
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isAdminMode) {
        disableAdminMode();
        setClickCount(0);
        toast.info("已退出管理员模式", { duration: 2000 });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdminMode, disableAdminMode]);

  return (
    <footer
      className="bg-muted/30 dark:bg-gray-800/30 py-8 mt-16 border-t dark:border-gray-700 relative"
      onClick={handleFooterClick}
    >
      {isAdminMode && (
        <button
          onClick={handleExitAdminMode}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors z-10"
          aria-label="退出管理员模式"
          title="退出管理员模式"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      )}

      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <div className="flex items-center justify-center mb-3">
          <span>用</span>
          <FaHeart
            className={`text-primary mx-2 ${
              isAdminMode ? "animate-pulse text-red-600" : "animate-pulse"
            }`}
          />
          <span>制作</span>
        </div>
        <p className="text-sm">
          &copy; {currentYear} 周周的加油站 - 永远支持你的胡胡
          {isAdminMode && <span className="ml-2 text-primary">[管理模式]</span>}
        </p>
      </div>
    </footer>
  );
}
