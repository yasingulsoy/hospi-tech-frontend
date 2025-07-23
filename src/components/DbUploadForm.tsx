"use client";

import { useState } from "react";
import { CloudArrowUpIcon, LinkIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default function DbUploadForm() {
  const [dbType, setDbType] = useState("sqlite");
  const [connectionString, setConnectionString] = useState("");
  const [connectionUrl, setConnectionUrl] = useState("");

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fade-in border border-blue-100">
      <form className="space-y-6">
        <label className="block">
          <span className="font-semibold text-gray-700">Veritabanı Türü</span>
          <select
            className="block w-full mt-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            value={dbType}
            onChange={e => setDbType(e.target.value)}
          >
            <option value="sqlite">SQLite</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mssql">MSSQL</option>
          </select>
        </label>

        {dbType === "sqlite" ? (
          <label className="block">
            <span className="font-semibold text-gray-700 flex items-center gap-2"><CloudArrowUpIcon className="w-5 h-5 text-blue-500" /> SQLite Dosyası</span>
            <input
              type="file"
              accept=".sqlite,.db"
              className="block w-full mt-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 file:bg-blue-50 file:text-blue-700 file:rounded-lg file:border-0 file:mr-2"
            />
          </label>
        ) : (
          <>
            <label className="block">
              <span className="font-semibold text-gray-700 flex items-center gap-2"><LinkIcon className="w-5 h-5 text-blue-500" /> Bağlantı Dizesi</span>
              <input
                type="text"
                className="block w-full mt-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="postgres://user:pass@host:port/db"
                value={connectionString}
                onChange={e => setConnectionString(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="font-semibold text-gray-700 flex items-center gap-2"><GlobeAltIcon className="w-5 h-5 text-blue-500" /> URL ile Bağlan</span>
              <input
                type="url"
                className="block w-full mt-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://api.example.com/database"
                value={connectionUrl}
                onChange={e => setConnectionUrl(e.target.value)}
              />
            </label>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg font-semibold shadow-md"
        >
          Bağlan
        </button>
      </form>
    </div>
  );
}

// Animasyon için Tailwind'e ek:
// .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } } 