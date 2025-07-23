import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from '../components/AuthProvider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HospiTech - Yapay Zekâ Destekli Veritabanı Raporlama",
  description: "GPT-4 destekli, güvenli ve modern veritabanı raporlama platformu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen text-gray-900`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
