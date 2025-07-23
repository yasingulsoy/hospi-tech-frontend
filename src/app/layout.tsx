"use client";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "HospiTech - Yapay Zekâ Destekli Veritabanı Raporlama",
  description: "GPT-4 destekli, güvenli ve modern veritabanı raporlama platformu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loginStatus === "true");
    setIsLoading(false);

    // Login sayfasında değilse ve giriş yapmamışsa login'e yönlendir
    if (!isLoading && !loginStatus && pathname !== "/login") {
      router.push("/login");
    }
  }, [isLoading, pathname, router]);

  // Login sayfasında ise sadece children'ı göster
  if (pathname === "/login") {
    return (
      <html lang="tr">
        <body className={`${montserrat.variable} font-montserrat`}>
          {children}
        </body>
      </html>
    );
  }

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <html lang="tr">
        <body className={`${montserrat.variable} font-montserrat bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen text-gray-900 flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </body>
      </html>
    );
  }

  // Giriş yapmamışsa loading göster
  if (!isLoggedIn) {
    return (
      <html lang="tr">
        <body className={`${montserrat.variable} font-montserrat bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen text-gray-900`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Yönlendiriliyor...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="tr">
      <body className={`${montserrat.variable} font-montserrat bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen text-gray-900`}>
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
