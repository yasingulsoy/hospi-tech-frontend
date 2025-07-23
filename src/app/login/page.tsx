"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (username === "admin" && password === "admin") {
      // Başarılı giriş
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "admin");
      router.push("/");
    } else {
      setError("Kullanıcı adı veya şifre hatalı!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white/95 backdrop-blur-xl max-w-md w-full rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in border border-gray-200/50">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <h1 className="text-2xl font-bold text-white">HT</h1>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">HospiTech</h1>
          <p className="text-gray-600 text-lg">Yapay Zekâ Destekli Veritabanı Raporlama</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-blue-600" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-lg transition-all duration-300"
                placeholder="Kullanıcı adınızı girin"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Şifre
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <LockClosedIcon className="w-4 h-4 text-purple-600" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-14 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-lg transition-all duration-300"
                placeholder="Şifrenizi girin"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-4 h-4 text-gray-600" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="text-red-600 text-center bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-2xl border-2 border-red-200">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                {error}
              </div>
            </div>
          )}
          
          <button
            type="submit"
            className="btn-gradient w-full py-4 px-6 rounded-2xl text-white font-bold text-lg transition-all duration-300"
          >
            Giriş Yap
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700">Demo Giriş: admin / admin</span>
          </div>
        </div>
      </div>
    </div>
  );
} 