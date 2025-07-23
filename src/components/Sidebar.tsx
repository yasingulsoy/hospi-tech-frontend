"use client";

import Link from "next/link";
import { useState } from "react";
import { HomeIcon, ServerIcon, TableCellsIcon, ChatBubbleLeftRightIcon, DocumentChartBarIcon, StarIcon, UserCircleIcon, Bars3Icon } from "@heroicons/react/24/outline";

const menu = [
  { href: "/db-upload", label: "Veritabanı Yükle", icon: ServerIcon },
  { href: "/describe-columns", label: "Sütun Açıklama", icon: TableCellsIcon },
  { href: "/query", label: "Doğal Dil Sorgu", icon: ChatBubbleLeftRightIcon },
  { href: "/reports", label: "Raporlar", icon: DocumentChartBarIcon },
  { href: "/favorites", label: "Favoriler", icon: StarIcon },
  { href: "/profile", label: "Profil", icon: UserCircleIcon },
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobilde hamburger menü */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-blue-600 p-2 rounded-full text-white shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Menüyü Aç/Kapat"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
      
      {/* Sidebar */}
      <aside className={`w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col p-4 shadow-lg fixed md:static z-20 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <h1 className="text-2xl font-extrabold mb-10 tracking-tight text-blue-400 flex items-center gap-2">
          <HomeIcon className="w-8 h-8 text-blue-400" /> HospiTech
        </h1>
        <nav className="flex flex-col gap-2">
          {menu.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/80 transition-colors text-base font-medium group"
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-6 h-6 text-blue-300 group-hover:text-white transition-colors" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-8 text-xs text-gray-400">© 2024 HospiTech</div>
      </aside>
    </>
  );
};

export default Sidebar; 