"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HomeIcon, ServerIcon, TableCellsIcon, ChatBubbleLeftRightIcon, DocumentChartBarIcon, StarIcon, UserCircleIcon, Bars3Icon, ArrowRightOnRectangleIcon, PlusIcon, LinkIcon } from "@heroicons/react/24/outline";

const menu = [
  { href: "/db-upload", label: "Veritabanı Yükle", icon: ServerIcon },
  { href: "/connections", label: "Bağlantı Yöneticisi", icon: LinkIcon },
  { href: "/describe-columns", label: "Sütun Açıklama", icon: TableCellsIcon },
  { href: "/query", label: "Doğal Dil Sorgu", icon: ChatBubbleLeftRightIcon },
  { href: "/create-report", label: "Rapor Oluştur", icon: PlusIcon },
  { href: "/reports", label: "Raporlar", icon: DocumentChartBarIcon },
  { href: "/favorites", label: "Favoriler", icon: StarIcon },
  { href: "/profile", label: "Profil", icon: UserCircleIcon },
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loginStatus === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    router.push("/login");
  };

  if (!isLoggedIn) {
    return null; // Sidebar'ı gösterme
  }

  return (
    <>
      {/* Mobilde hamburger menü */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Menüyü Aç/Kapat"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
      
      {/* Mobil overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`w-64 md:w-72 h-screen bg-white/90 backdrop-blur-xl border-r border-gray-200/50 flex flex-col p-4 md:p-6 shadow-2xl fixed md:static z-20 transition-all duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-12">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
            <HomeIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HospiTech
          </h1>
        </div>
        
        <nav className="flex flex-col gap-2 md:gap-3 flex-1">
          {menu.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-2 md:gap-3 lg:gap-4 px-2 md:px-3 lg:px-4 py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:scale-105 text-gray-700 hover:text-gray-900 font-medium"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                <Icon className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
              </div>
              <span className="text-xs md:text-sm font-semibold">{label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="pt-6 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-300 w-full text-red-600 hover:text-red-700 font-medium"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-all duration-300">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold">Çıkış Yap</span>
          </button>
          <div className="text-xs text-gray-500 mt-4 text-center">© 2024 HospiTech</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 