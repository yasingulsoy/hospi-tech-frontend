"use client";

import ReportManager from "../../components/ReportManager";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Raporlar</h1>
        <p className="text-gray-700">Oluşturduğunuz raporları görüntüleyin ve yönetin</p>
      </div>
      <ReportManager />
    </div>
  );
} 