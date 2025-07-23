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
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Giriş yapmamışsa loading göster
  if (!isLoggedIn) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen text-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yönlendiriliyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 bg-transparent min-h-screen ml-0 md:ml-64">
        {children}
      </main>
    </div>
  );
} 