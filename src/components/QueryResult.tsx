import { ChartBarIcon, TableCellsIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import ResultChart from "./ResultChart";
import DownloadButtons from "./DownloadButtons";
import { useState } from "react";

export default function QueryResult({ loading, error, data }: { loading: boolean, error?: string, data?: any }) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

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
  // Örnek/mock veri
  const columns = ["Tedavi", "Toplam Gelir"];
  const rows = [
    ["Diş Beyazlatma", "12.000 TL"],
    ["Dolgu", "8.500 TL"],
    ["Kanal Tedavisi", "7.200 TL"],
  ];
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-blue-100 mt-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <TableCellsIcon className="w-6 h-6 text-blue-400" />
        <span className="font-bold text-blue-700">Sorgu Sonucu</span>
      </div>
      <div className="overflow-x-auto">
        <table id="result-table" className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-blue-50 text-blue-900">
              {columns.map(col => (
                <th key={col} className="px-4 py-2 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="bg-gray-50 hover:bg-blue-50 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-gray-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <ChartBarIcon className="w-6 h-6 text-blue-400" />
          <span className="font-bold text-blue-700">Grafik</span>
          <div className="ml-4 flex gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${chartType === 'pie' ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
              onClick={() => setChartType('pie')}
            >Pasta</button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${chartType === 'bar' ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
              onClick={() => setChartType('bar')}
            >Çubuk</button>
          </div>
        </div>
        <div id="result-chart" className="w-full">
          <ResultChart type={chartType} />
        </div>
      </div>
      <DownloadButtons tableId="result-table" chartId="result-chart" fileName="rapor" />
    </div>
  );
} 