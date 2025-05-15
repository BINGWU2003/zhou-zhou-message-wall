import { Toaster } from 'sonner'
import './globals.css';
import { ThemeProvider } from './providers/theme-provider';

export const metadata = {
  title: '周周老师的加油站 - 留言墙',
  description: '给正在备课的周周老师送上祝福和鼓励的留言墙',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/icon-192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        url: '/icon-512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
    shortcut: '/favicon.ico',
  },
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
