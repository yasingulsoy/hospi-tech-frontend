"use client";

import { useState } from "react";
import ReportCard from "../../components/ReportCard";

const mockReports = [
  {
    id: 1,
    title: "Son 6 Aylık Gelir Raporu",
    description: "Son 6 ayda elde edilen toplam gelir ve tedavi bazında dağılım.",
    date: "2024-06-01",
    favorite: true,
  },
  {
    id: 2,
    title: "Hasta Sayısı Analizi",
    description: "Yıllara göre toplam hasta sayısı ve artış oranları.",
    date: "2024-05-15",
    favorite: false,
  },
  {
    id: 3,
    title: "Tedavi Türü Dağılımı",
    description: "En çok uygulanan tedavi türlerinin pasta grafiği.",
    date: "2024-05-01",
    favorite: false,
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [filter, setFilter] = useState("");

  const handleToggleFavorite = (id: number) => {
    setReports(reports => reports.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r));
  };

  const filtered = reports.filter(r =>
    r.title.toLowerCase().includes(filter.toLowerCase()) ||
    r.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Geçmiş Raporlar</h2>
      <input
        type="text"
        placeholder="Raporlarda ara..."
        className="w-full md:w-1/2 mb-6 px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 && (
          <div className="col-span-2 text-gray-400 text-center py-12">Hiç rapor bulunamadı.</div>
        )}
        {filtered.map(r => (
          <ReportCard
            key={r.id}
            title={r.title}
            description={r.description}
            date={r.date}
            favorite={r.favorite}
            onToggleFavorite={() => handleToggleFavorite(r.id)}
          />
        ))}
      </div>
    </div>
  );
} 