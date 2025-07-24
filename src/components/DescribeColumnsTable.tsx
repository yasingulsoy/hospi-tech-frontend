import { useState, useEffect } from "react";
import { InformationCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function DescribeColumnsTable() {
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Veritabanı bilgilerini localStorage'dan al
  useEffect(() => {
    const dbInfo = localStorage.getItem('databaseInfo');
    if (dbInfo) {
      try {
        const { tables } = JSON.parse(dbInfo);
        const allColumns = tables.flatMap((table: any) =>
          table.columns.map((col: any) => ({
            table: table.table,
            column: col.column_name,
            type: col.data_type,
            description: col.column_comment || ""
          }))
        );
        setColumns(allColumns);
        setError("");
      } catch (err) {
        setError("Veritabanı bilgileri yüklenemedi");
      }
    } else {
      setError("Henüz veritabanı bağlantısı yapılmamış. Lütfen önce veritabanınızı bağlayın.");
    }
    setLoading(false);
  }, []);

  // Açıklama güncelleme
  const handleDescChange = (idx: number, value: string) => {
    setColumns(cols => cols.map((col, i) => i === idx ? { ...col, description: value } : col));
  };

  // Açıklamayı yapay zekadan al
  const handleAIDesc = async (col: any, idx: number) => {
    try {
      const response = await fetch("/api/ai-column-desc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: col.table, column: col.column, type: col.type })
      });
      const data = await response.json();
      if (data.desc) {
        handleDescChange(idx, data.desc);
      }
    } catch (e) {
      alert("Açıklama üretilemedi. Lütfen tekrar deneyin.");
    }
  };

  // Kaydetme simülasyonu
  const handleSave = async () => {
    setError("");
    if (columns.some(col => !col.description.trim())) {
      setError("Tüm sütunlar için açıklama girilmelidir.");
      return;
    }
    setSaving(true);
    // Burada backend'e gönderilebilir
    await new Promise(res => setTimeout(res, 1000));
    setSaving(false);
    alert("Açıklamalar kaydedildi!");
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl animate-fade-in">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Veritabanı bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <InformationCircleIcon className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Veritabanı Bağlantısı Gerekli</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <a 
            href="/db-upload" 
            className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold"
          >
            Veritabanı Bağla
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-gray-200/50 shadow-xl animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <InformationCircleIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Sütun Açıklamaları</h3>
          <p className="text-gray-600">{columns.length} sütun bulundu</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-blue-50 text-blue-900 sticky top-0">
              <th className="px-4 py-2 rounded-l-lg text-left">Tablo</th>
              <th className="px-4 py-2 text-left">Sütun</th>
              <th className="px-4 py-2 text-left">Tip</th>
              <th className="px-4 py-2 rounded-r-lg text-left">Açıklama</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, idx) => (
              <tr key={col.table + col.column} className="bg-gray-50 hover:bg-blue-50 transition-colors">
                <td className="px-4 py-2 font-mono text-sm text-gray-700">{col.table}</td>
                <td className="px-4 py-2 font-mono text-sm text-gray-700">{col.column}</td>
                <td className="px-4 py-2 text-gray-700">{col.type}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-1 text-sm text-gray-900 placeholder-gray-500"
                      placeholder="Örn: Tedavi tarihi, Toplam ücret..."
                      value={col.description}
                      onChange={e => handleDescChange(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      title="Yapay zekâ ile doldur"
                      className="p-1 rounded bg-blue-50 hover:bg-blue-100 border border-blue-200"
                      onClick={() => handleAIDesc(col, idx)}
                    >
                      <SparklesIcon className="w-5 h-5 text-blue-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <div className="text-red-600 mt-4 font-medium">{error}</div>}
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded-lg font-semibold shadow-md disabled:opacity-60"
      >
        {saving ? "Kaydediliyor..." : "Açıklamaları Kaydet"}
      </button>
    </div>
  );
} 