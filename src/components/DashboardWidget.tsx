"use client";

import { useState, useEffect } from "react";
import { 
  ChartBarIcon, 
  ServerIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalConnections: number;
  activeConnections: number;
  totalReports: number;
  totalQueries: number;
  averageResponseTime: number;
  lastActivity: string;
}

export default function DashboardWidget() {
  const [stats, setStats] = useState<DashboardStats>({
    totalConnections: 0,
    activeConnections: 0,
    totalReports: 0,
    totalQueries: 0,
    averageResponseTime: 0,
    lastActivity: ''
  });

  useEffect(() => {
    // Gerçek verileri localStorage'dan al
    const savedConnections = localStorage.getItem('savedConnections');
    const savedReports = localStorage.getItem('reports');
    const savedQueries = localStorage.getItem('queryHistory');

    if (savedConnections) {
      const connections = JSON.parse(savedConnections);
      const activeConnections = connections.filter((conn: any) => conn.status === 'connected').length;
      
      // Ortalama yanıt süresini hesapla
      const responseTimes = connections
        .filter((conn: any) => conn.performance?.responseTime)
        .map((conn: any) => conn.performance.responseTime);
      
      const avgResponseTime = responseTimes.length > 0 
        ? Math.round(responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length)
        : 0;

      setStats(prev => ({
        ...prev,
        totalConnections: connections.length,
        activeConnections,
        averageResponseTime: avgResponseTime
      }));
    }

    if (savedReports) {
      const reports = JSON.parse(savedReports);
      setStats(prev => ({
        ...prev,
        totalReports: reports.length
      }));
    }

    if (savedQueries) {
      const queries = JSON.parse(savedQueries);
      setStats(prev => ({
        ...prev,
        totalQueries: queries.length
      }));
    }

    // Son aktiviteyi bul
    const lastConnected = localStorage.getItem('lastConnected');
    if (lastConnected) {
      setStats(prev => ({
        ...prev,
        lastActivity: new Date(lastConnected).toLocaleString('tr-TR')
      }));
    }
  }, []);

  const getPerformanceColor = (responseTime: number) => {
    if (responseTime < 100) return 'text-green-600';
    if (responseTime < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (responseTime: number) => {
    if (responseTime < 100) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    if (responseTime < 500) return <ArrowTrendingDownIcon className="w-4 h-4 text-yellow-600" />;
    return <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <ChartBarIcon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Sistem Durumu</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Toplam Bağlantı */}
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ServerIcon className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalConnections}</div>
          <div className="text-xs text-blue-700">Toplam Bağlantı</div>
        </div>

        {/* Aktif Bağlantı */}
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <CheckCircleIcon className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.activeConnections}</div>
          <div className="text-xs text-green-700">Aktif Bağlantı</div>
        </div>

        {/* Toplam Rapor */}
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ChartBarIcon className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.totalReports}</div>
          <div className="text-xs text-purple-700">Toplam Rapor</div>
        </div>

        {/* Toplam Sorgu */}
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ServerIcon className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.totalQueries}</div>
          <div className="text-xs text-orange-700">Toplam Sorgu</div>
        </div>

        {/* Ortalama Yanıt Süresi */}
        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ClockIcon className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.averageResponseTime}</div>
          <div className="text-xs text-yellow-700">Ort. Yanıt (ms)</div>
        </div>

        {/* Performans Göstergesi */}
        <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            {getPerformanceIcon(stats.averageResponseTime)}
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(stats.averageResponseTime)}`}>
            {stats.averageResponseTime < 100 ? 'Mükemmel' : 
             stats.averageResponseTime < 500 ? 'İyi' : 'Yavaş'}
          </div>
          <div className="text-xs text-gray-700">Performans</div>
        </div>
      </div>

      {/* Son Aktivite */}
      {stats.lastActivity && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span>Son Aktivite: {stats.lastActivity}</span>
          </div>
        </div>
      )}

      {/* Hızlı İpuçları */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 text-sm mb-1">💡 İpucu</h4>
          <p className="text-xs text-blue-700">Bağlantılarınızı test ederek performansı optimize edin</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900 text-sm mb-1">🚀 Hızlı Başlangıç</h4>
          <p className="text-xs text-green-700">AI sorguları ile veritabanınızı keşfedin</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-900 text-sm mb-1">📊 Raporlar</h4>
          <p className="text-xs text-purple-700">Oluşturduğunuz raporları favorilere ekleyin</p>
        </div>
      </div>
    </div>
  );
} 