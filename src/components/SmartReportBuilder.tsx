"use client";

import { useState } from "react";
import { 
  SparklesIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  FunnelIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  StarIcon
} from "@heroicons/react/24/outline";

type ChartType = "line" | "bar" | "pie" | "table";
type ReportTemplate = {
  id: string;
  name: string;
  description: string;
  prompt: string;
  chartType: ChartType;
  icon: any;
};

const reportTemplates: ReportTemplate[] = [
  {
    id: "monthly-revenue",
    name: "Aylık Gelir Raporu",
    description: "Aylık gelir trendini gösteren çizgi grafik",
    prompt: "Bu ayki toplam geliri ve son 6 ayın gelir trendini göster",
    chartType: "line",
    icon: ChartBarIcon
  },
  {
    id: "patient-stats",
    name: "Hasta İstatistikleri",
    description: "Hasta sayıları ve demografik bilgiler",
    prompt: "Bu ayki hasta sayısını ve yaş gruplarına göre dağılımını göster",
    chartType: "bar",
    icon: DocumentTextIcon
  },
  {
    id: "treatment-analysis",
    name: "Tedavi Analizi",
    description: "En popüler tedavi türleri ve gelirleri",
    prompt: "En çok uygulanan tedavi türlerini ve gelirlerini göster",
    chartType: "pie",
    icon: EyeIcon
  },
  {
    id: "custom",
    name: "Özel Rapor",
    description: "Kendi raporunuzu oluşturun",
    prompt: "",
    chartType: "table",
    icon: SparklesIcon
  }
];

export default function SmartReportBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [dateRange, setDateRange] = useState("last-month");
  const [filters, setFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setCustomPrompt(template.prompt);
    setChartType(template.chartType);
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      // Burada AI ile rapor oluşturma API'si çağrılacak
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simülasyon
      
      // Mock veri
      setReportData({
        title: selectedTemplate?.name || "Özel Rapor",
        data: [
          { month: "Ocak", revenue: 45000 },
          { month: "Şubat", revenue: 52000 },
          { month: "Mart", revenue: 48000 },
          { month: "Nisan", revenue: 61000 },
          { month: "Mayıs", revenue: 55000 },
          { month: "Haziran", revenue: 67000 }
        ],
        chartType: chartType
      });
    } catch (error) {
      console.error("Rapor oluşturma hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Şablon Seçimi */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 animate-fade-in border border-gray-200/50 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Rapor Şablonu Seçin</h3>
            <p className="text-gray-600">Hazır şablonlardan birini seçin veya özel rapor oluşturun</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTemplates.map((template, index) => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`group p-6 rounded-2xl transition-all duration-500 hover:scale-105 animate-fade-in ${
                  selectedTemplate?.id === template.id
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/25"
                    : "bg-white/80 hover:bg-white border border-gray-200/50 hover:border-blue-300 hover:shadow-xl"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  selectedTemplate?.id === template.id
                    ? "bg-white/20"
                    : "bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200"
                }`}>
                  <Icon className={`w-8 h-8 ${
                    selectedTemplate?.id === template.id ? "text-white" : "text-blue-600"
                  }`} />
                </div>
                <h4 className={`font-bold text-lg mb-2 ${
                  selectedTemplate?.id === template.id ? "text-white" : "text-gray-900"
                }`}>{template.name}</h4>
                <p className={`text-sm ${
                  selectedTemplate?.id === template.id ? "text-blue-100" : "text-gray-600"
                }`}>{template.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rapor Detayları */}
      {selectedTemplate && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 animate-slide-in border border-gray-200/50 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <DocumentTextIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Rapor Detayları</h3>
              <p className="text-gray-600">Raporunuzu özelleştirin ve ayarları yapın</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Doğal Dil Açıklaması */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-900">
                Rapor Açıklaması
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full h-40 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 placeholder-gray-500 p-4 text-lg resize-none transition-all duration-300"
                placeholder="Raporunuzu doğal dil ile açıklayın... Örn: Bu ayki hasta gelirlerini ve tedavi türlerine göre dağılımını göster"
              />
            </div>

            {/* Ayarlar */}
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Grafik Türü
                </label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as ChartType)}
                  className="w-full rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 p-4 text-lg transition-all duration-300"
                >
                  <option value="line">📈 Çizgi Grafik</option>
                  <option value="bar">📊 Sütun Grafik</option>
                  <option value="pie">🥧 Pasta Grafik</option>
                  <option value="table">📋 Tablo</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Tarih Aralığı
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 p-4 text-lg transition-all duration-300"
                >
                  <option value="last-week">📅 Son 1 Hafta</option>
                  <option value="last-month">📅 Son 1 Ay</option>
                  <option value="last-3-months">📅 Son 3 Ay</option>
                  <option value="last-6-months">📅 Son 6 Ay</option>
                  <option value="last-year">📅 Son 1 Yıl</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleGenerateReport}
              disabled={loading || !customPrompt.trim()}
              className="btn-gradient w-full py-4 px-8 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Rapor Oluşturuluyor...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-6 h-6" />
                  Rapor Oluştur
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Rapor Önizleme */}
      {reportData && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 animate-scale-in border border-gray-200/50 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <ChartBarIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{reportData.title}</h3>
                <p className="text-gray-600">Rapor başarıyla oluşturuldu</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="group p-3 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 transition-all duration-300 hover:scale-110">
                <StarIcon className="w-6 h-6 text-yellow-600 group-hover:text-yellow-700" />
              </button>
              <button className="group p-3 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 transition-all duration-300 hover:scale-110">
                <ArrowDownTrayIcon className="w-6 h-6 text-green-600 group-hover:text-green-700" />
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 text-center border-2 border-dashed border-blue-200">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <ChartBarIcon className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Grafik Önizlemesi</h4>
            <p className="text-gray-600 mb-4">Gerçek verilerle oluşturulan interaktif grafik</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">
                {reportData.data.length} veri noktası bulundu
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 