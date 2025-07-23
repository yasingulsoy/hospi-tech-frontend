import { ChartBarIcon, TableCellsIcon, ExclamationCircleIcon, ArrowDownTrayIcon, StarIcon } from "@heroicons/react/24/outline";
import ResultChart from "./ResultChart";
import { useState } from "react";

export default function QueryResult({ loading, error, data }: { loading: boolean, error?: string, data?: any }) {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie" | "doughnut">("bar");
  const [showChart, setShowChart] = useState(false);

  const saveReport = () => {
    if (!data || data.length === 0) return;
    
    const report = {
      title: "Sorgu Sonucu",
      description: "Doğal dil sorgusu sonucu",
      chartType: chartType,
      data: data,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    savedReports.push({ ...report, id: Date.now().toString() });
    localStorage.setItem('savedReports', JSON.stringify(savedReports));
    
    alert("Rapor başarıyla kaydedildi!");
  };

  const exportData = () => {
    if (!data || data.length === 0) return;
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sorgu-sonucu.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <div className="text-blue-700 font-semibold">Sorgu çalıştırılıyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <ExclamationCircleIcon className="w-10 h-10 text-red-500 mb-4" />
        <div className="text-red-600 font-semibold">{error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const columns = Object.keys(data[0] || {});

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-10 border border-blue-100 mt-8 animate-fade-in mx-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <TableCellsIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
          <span className="font-bold text-blue-700 text-base md:text-lg">Sorgu Sonucu</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowChart(!showChart)}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
          >
            <ChartBarIcon className="w-4 h-4 md:w-5 md:h-5" />
            {showChart ? "Tablo" : "Grafik"}
          </button>
          <button 
            onClick={exportData}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
          >
            <ArrowDownTrayIcon className="w-4 h-4 md:w-5 md:h-5" />
            İndir
          </button>
          <button 
            onClick={saveReport}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
          >
            <StarIcon className="w-4 h-4 md:w-5 md:h-5" />
            Kaydet
          </button>
        </div>
      </div>

      {showChart && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700">Grafik Türü:</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as "line" | "bar" | "pie" | "doughnut")}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="line">Çizgi Grafik</option>
              <option value="bar">Sütun Grafik</option>
              <option value="pie">Pasta Grafik</option>
              <option value="doughnut">Halka Grafik</option>
            </select>
          </div>
          <ResultChart data={data} chartType={chartType} title="Sorgu Sonucu" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-blue-50 text-blue-900">
              {columns.map(col => (
                <th key={col} className="px-3 md:px-4 py-2 text-left text-sm">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i: number) => (
              <tr key={i} className="bg-gray-50 hover:bg-blue-50 transition-colors">
                {Object.values(row).map((cell: any, j: number) => (
                  <td key={j} className="px-3 md:px-4 py-2 text-gray-700 text-sm">{String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs md:text-sm text-gray-500">
        Toplam {data.length} sonuç bulundu.
      </div>
    </div>
  );
} 