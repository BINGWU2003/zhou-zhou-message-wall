import { FaHeart } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 py-8 mt-16 border-t">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <div className="flex items-center justify-center mb-3">
          <span>用</span>
          <FaHeart className="text-primary mx-2 animate-pulse" />
          <span>制作</span>
        </div>
        <p className="text-sm">
          &copy; {currentYear} 周周老师的加油站 - 永远支持您
        </p>
      </div>
    </footer>
  );
}
