"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChartBarIcon, 
  ServerIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon,
  StarIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon,
  UsersIcon
} from "@heroicons/react/24/outline";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(loginStatus === "true");
    setUserRole(role || "");
  }, []);

  const features = [
    {
      icon: ServerIcon,
      title: "Veritabanı Bağlantısı",
      description: "SQLite, PostgreSQL, MySQL ve MSSQL desteği ile kolay bağlantı",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Doğal Dil Sorgu",
      description: "Türkçe açıklamalarla AI destekli SQL sorguları oluşturun",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: ChartBarIcon,
      title: "Akıllı Raporlar",
      description: "Otomatik grafik ve tablo oluşturma ile hızlı analiz",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: DocumentTextIcon,
      title: "Rapor Yönetimi",
      description: "Oluşturulan raporları kaydedin, düzenleyin ve paylaşın",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { label: "Desteklenen DB", value: "4", icon: ServerIcon },
    { label: "AI Sorgu", value: "GPT-4", icon: SparklesIcon },
    { label: "Grafik Türü", value: "8+", icon: ChartBarIcon },
    { label: "Güvenlik", value: "SSL", icon: ShieldCheckIcon }
  ];

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Hoşgeldin Mesajı */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HospiTech Dashboard
              </h1>
            </div>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 px-4">
              Hoş geldiniz! Veritabanınızı bağlayın ve AI destekli raporlar oluşturmaya başlayın.
            </p>
            
            {/* Hızlı İstatistikler */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12 px-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200/50 shadow-lg">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg md:rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hızlı Erişim Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 px-4">
                          <Link href="/db-upload" className="group">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ServerIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Veritabanı Bağla</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">Veritabanınızı yükleyin ve tabloları görüntüleyin</p>
                  <div className="flex items-center text-blue-600 font-semibold text-sm md:text-base">
                    Başla <ArrowRightIcon className="w-3 h-3 md:w-4 md:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

            <Link href="/query" className="group">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI Sorgu</h3>
                <p className="text-gray-600 mb-4">Doğal dil ile veritabanınızı sorgulayın</p>
                <div className="flex items-center text-purple-600 font-semibold">
                  Sorgula <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/create-report" className="group">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ChartBarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rapor Oluştur</h3>
                <p className="text-gray-600 mb-4">AI destekli akıllı raporlar oluşturun</p>
                <div className="flex items-center text-green-600 font-semibold">
                  Oluştur <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/reports" className="group">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <DocumentTextIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Raporlarım</h3>
                <p className="text-gray-600 mb-4">Kaydedilen raporları görüntüleyin</p>
                <div className="flex items-center text-orange-600 font-semibold">
                  Görüntüle <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Son Aktiviteler */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Son Aktiviteler</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <ServerIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Veritabanı bağlantısı kuruldu</p>
                  <p className="text-sm text-gray-600">3 tablo yüklendi</p>
                </div>
                <span className="text-xs text-gray-500">2 dk önce</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Aylık gelir raporu oluşturuldu</p>
                  <p className="text-sm text-gray-600">Çizgi grafik formatında</p>
                </div>
                <span className="text-xs text-gray-500">15 dk önce</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HospiTech
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Giriş Yap
              </Link>
              <Link href="/login" className="btn-gradient px-6 py-2 rounded-xl text-white font-semibold">
                Başla
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 md:mb-20 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            AI Destekli
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block sm:inline"> Veritabanı Raporlama</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Veritabanınızı bağlayın, doğal dil ile sorgulayın ve otomatik olarak profesyonel raporlar oluşturun. 
            GPT-4 teknolojisi ile güçlendirilmiş akıllı analiz platformu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Link href="/login" className="btn-gradient px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-white font-bold text-base md:text-lg flex items-center justify-center gap-2 md:gap-3">
              <SparklesIcon className="w-5 h-5 md:w-6 md:h-6" />
              Ücretsiz Başla
            </Link>
            <Link href="/db-upload" className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-300 text-gray-700 font-bold text-base md:text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
              Demo İncele
            </Link>
          </div>
        </div>

        {/* Özellikler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-20 px-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${feature.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6`}>
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* İstatistikler */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 border border-gray-200/50 shadow-xl mb-12 md:mb-20 mx-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Hemen Başlayın</h2>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90">
              Veritabanınızı bağlayın ve AI destekli raporlama deneyimini keşfedin
            </p>
            <Link href="/login" className="bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-gray-100 transition-all duration-300">
              Ücretsiz Hesap Oluştur
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-xl border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HospiTech</span>
            </div>
            <p className="text-gray-600 mb-4">
              AI destekli veritabanı raporlama platformu
            </p>
            <div className="text-sm text-gray-500">
              © 2024 HospiTech. Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
