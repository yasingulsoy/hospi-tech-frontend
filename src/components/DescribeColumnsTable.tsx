import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

// Örnek/mock tablo ve sütun verisi
const mockColumns = [
  { table: "patients", column: "id", type: "integer", description: "" },
  { table: "patients", column: "name", type: "text", description: "" },
  { table: "patients", column: "birth_date", type: "date", description: "" },
  { table: "treatments", column: "treatment_date", type: "date", description: "" },
  { table: "treatments", column: "total_fee", type: "decimal", description: "" },
];

export default function DescribeColumnsTable() {
  const [columns, setColumns] = useState(mockColumns);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Açıklama güncelleme
  const handleDescChange = (idx: number, value: string) => {
    setColumns(cols => cols.map((col, i) => i === idx ? { ...col, description: value } : col));
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

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-blue-100 animate-fade-in">
      <h3 className="text-lg font-bold mb-6 text-blue-700 flex items-center gap-2">
        <InformationCircleIcon className="w-6 h-6 text-blue-400" /> Sütun Açıklamaları
      </h3>
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
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-1 text-sm text-gray-900 placeholder-gray-500"
                    placeholder="Örn: Tedavi tarihi, Toplam ücret..."
                    value={col.description}
                    onChange={e => handleDescChange(idx, e.target.value)}
                  />
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