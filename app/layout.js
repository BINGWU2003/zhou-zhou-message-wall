import { Toaster } from 'sonner'
import './globals.css';
import { ThemeProvider } from './providers/theme-provider';

export const metadata = {
  title: '周周老师的加油站 - 留言墙',
  description: '给正在备课的周周老师送上祝福和鼓励的留言墙',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-center" richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
