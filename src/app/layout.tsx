import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from '../components/Sidebar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HospiTech - Yapay Zekâ Destekli Veritabanı Raporlama",
  description: "GPT-4 destekli, güvenli ve modern veritabanı raporlama platformu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="font-sans bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-8 bg-transparent min-h-screen ml-0 md:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
