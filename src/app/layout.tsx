import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: "Nimisora's Galgame Collection",
  description: "Galgame",
  icons: {
    icon: `favicon.ico`,
    apple: `${basePath}/apple-touch-icon.png`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Nimisora&apos;s Space
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-md transition-all">
                列表
              </Link>
              <Link href="/timeline" className="text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-md transition-all">
                时间轴
              </Link>
              <Link href="/statistics" className="text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-md transition-all">
                数据统计
              </Link>
            </div>
          </div>
        </nav>
        <div className="pt-16 flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
