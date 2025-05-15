import { Toaster } from 'sonner'
import './globals.css';
import { ThemeProvider } from './providers/theme-provider';

export const metadata = {
  title: '周周老师的加油站 - 留言墙',
  description: '给正在备课的周周老师送上祝福和鼓励的留言墙',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zhou-zhou-message-wall.netlify.app/',
    title: '周周老师的加油站 - 留言墙',
    description: '给正在备课的周周老师送上祝福和鼓励的留言墙',
    siteName: '周周老师的加油站',
  },
  twitter: {
    card: 'summary_large_image',
    title: '周周老师的加油站 - 留言墙',
    description: '给正在备课的周周老师送上祝福和鼓励的留言墙',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
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
