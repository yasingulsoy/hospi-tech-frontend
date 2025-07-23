"use client";

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  TrashIcon, 
  EyeIcon, 
  ArrowDownTrayIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface Report {
  id: string;
  title: string;
  description: string;
  chartType: string;
  data: any[];
  createdAt: string;
  isFavorite: boolean;
}

export default function ReportManager() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    // localStorage'dan raporları yükle
    const savedReports = localStorage.getItem('savedReports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  const saveReport = (report: Omit<Report, 'id' | 'createdAt' | 'isFavorite'>) => {
    const newReport: Report = {
      ...report,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
  };

  const deleteReport = (id: string) => {
    const updatedReports = reports.filter(report => report.id !== id);
    setReports(updatedReports);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
  };

  const toggleFavorite = (id: string) => {
    const updatedReports = reports.map(report => 
      report.id === id ? { ...report, isFavorite: !report.isFavorite } : report
    );
    setReports(updatedReports);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
  };

  const exportReport = (report: Report) => {
    const dataStr = JSON.stringify(report.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Rapor Yok</h3>
        <p className="text-gray-600">İlk raporunuzu oluşturmak için rapor oluşturma sayfasına gidin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Kaydedilen Raporlar</h2>
        <div className="text-sm text-gray-600">
          {reports.length} rapor
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
              </div>
              <button
                onClick={() => toggleFavorite(report.id)}
                className={`ml-2 p-1 rounded-full transition-colors ${
                  report.isFavorite 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <StarIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <CalendarIcon className="w-4 h-4" />
              {formatDate(report.createdAt)}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedReport(report)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
              >
                <EyeIcon className="w-4 h-4" />
                Görüntüle
              </button>
              
              <button
                onClick={() => exportReport(report)}
                className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                İndir
              </button>
              
              <button
                onClick={() => deleteReport(report.id)}
                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rapor Önizleme Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedReport.title}</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">{selectedReport.description}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">Veri Önizleme</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(selectedReport.data[0] || {}).map((key) => (
                        <th key={key} className="text-left py-2 px-2 font-medium">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.data.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="py-2 px-2">{String(value)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {selectedReport.data.length > 5 && (
                  <p className="text-xs text-gray-500 mt-2">
                    ... ve {selectedReport.data.length - 5} satır daha
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => exportReport(selectedReport)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Raporu İndir
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 