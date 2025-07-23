"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from './Sidebar';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
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
    return <>{children}</>;
  }

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">HospiTech</h3>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Giriş yapmamışsa loading göster
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Yönlendiriliyor</h3>
          <p className="text-gray-600">Giriş sayfasına yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 bg-transparent min-h-screen ml-0 md:ml-72">
        {children}
      </main>
    </div>
  );
} 