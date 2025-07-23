"use client";

import ReportManager from "../../components/ReportManager";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Raporlar</h1>
            <p className="text-gray-700">Oluşturduğunuz raporları görüntüleyin ve yönetin</p>
          </div>
          <ReportManager />
        </div>
      </div>
    </div>
  );
} 