"use client";

import { useState } from "react";
import { CloudArrowUpIcon, LinkIcon, GlobeAltIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function DbUploadForm() {
  const [dbType, setDbType] = useState("sqlite");
  const [connectionString, setConnectionString] = useState("");
  const [connectionUrl, setConnectionUrl] = useState("");
  const [sqliteFile, setSqliteFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tables, setTables] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      let formData = new FormData();
      formData.append('dbType', dbType);

      if (dbType === "sqlite") {
        if (!sqliteFile) {
          throw new Error("SQLite dosyası seçilmedi");
        }
        formData.append('sqliteFile', sqliteFile);
      } else {
        if (!connectionString) {
          throw new Error("Bağlantı dizesi girilmedi");
        }
        formData.append('connectionString', connectionString);
      }

      const response = await fetch('/api/connect-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dbType,
          connectionString,
          connectionUrl,
          sqliteFile: sqliteFile?.name
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bağlantı hatası');
      }

      setTables(data.tables);
      setSuccess(true);
      
      // Başarılı bağlantıyı localStorage'a kaydet
      localStorage.setItem('databaseInfo', JSON.stringify({
        type: dbType,
        tables: data.tables,
        connectedAt: new Date().toISOString()
      }));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSqliteFile(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Bağlantı Formu */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <CloudArrowUpIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Veritabanı Bağlantısı</h3>
            <p className="text-gray-600">Veritabanınızı bağlayın ve tabloları otomatik olarak yükleyin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Veritabanı Türü
              </label>
              <select
                className="w-full rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 p-4 text-lg transition-all duration-300"
                value={dbType}
                onChange={e => setDbType(e.target.value)}
              >
                <option value="sqlite">🗄️ SQLite</option>
                <option value="postgresql">🐘 PostgreSQL</option>
                <option value="mysql">🐬 MySQL</option>
                <option value="mssql">💾 MSSQL</option>
              </select>
            </div>

            {dbType === "sqlite" ? (
              <div>
                <label className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CloudArrowUpIcon className="w-5 h-5 text-blue-500" /> 
                  SQLite Dosyası
                </label>
                <input
                  type="file"
                  accept=".sqlite,.db"
                  onChange={handleFileChange}
                  className="w-full rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 p-4 text-lg transition-all duration-300 file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white file:rounded-xl file:border-0 file:mr-4 file:px-4 file:py-2 file:font-semibold"
                />
              </div>
            ) : (
              <div>
                <label className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-blue-500" /> 
                  Bağlantı Dizesi
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 placeholder-gray-500 p-4 text-lg transition-all duration-300"
                  placeholder="postgres://user:pass@host:port/db"
                  value={connectionString}
                  onChange={e => setConnectionString(e.target.value)}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                <span className="text-red-700 font-semibold">{error}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-full py-4 px-8 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Bağlanıyor...
              </>
            ) : (
              <>
                <LinkIcon className="w-6 h-6" />
                Veritabanına Bağlan
              </>
            )}
          </button>
        </form>
      </div>

      {/* Başarı Mesajı */}
      {success && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircleIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Bağlantı Başarılı!</h3>
              <p className="text-gray-600">{tables.length} tablo başarıyla yüklendi</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">📋 {table.table}</h4>
                <p className="text-sm text-gray-600">{table.columns.length} sütun</p>
                <div className="mt-2 space-y-1">
                  {table.columns.slice(0, 3).map((col: any, colIndex: number) => (
                    <div key={colIndex} className="text-xs text-gray-500">
                      • {col.column_name} ({col.data_type})
                    </div>
                  ))}
                  {table.columns.length > 3 && (
                    <div className="text-xs text-blue-600">+{table.columns.length - 3} daha...</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Animasyon için Tailwind'e ek:
// .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } } 