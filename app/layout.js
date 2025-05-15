import { Toaster } from 'sonner'
import './globals.css';

export const metadata = {
  title: '周周老师的加油站 - 留言墙',
  description: '给正在备考的周周老师送上祝福和鼓励的留言墙',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
