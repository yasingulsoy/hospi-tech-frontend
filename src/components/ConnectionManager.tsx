"use client";

import { useState, useEffect } from "react";
import { 
  LinkIcon, 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  ChartBarIcon,
  CogIcon
} from "@heroicons/react/24/outline";
import { showNotification } from "./NotificationSystem";

interface Connection {
  id: string;
  name: string;
  type: string;
  connectionString: string;
  isActive: boolean;
  lastConnected?: string;
  tables?: any[];
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  autoReconnect?: boolean;
  performance?: {
    responseTime?: number;
    lastPing?: number;
  };
}

export default function ConnectionManager() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showNewConnection, setShowNewConnection] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'postgresql',
    connectionString: '',
    autoReconnect: true
  });
  const [testingConnection, setTestingConnection] = useState(false);
  const [activeTab, setActiveTab] = useState<'connections' | 'history' | 'performance'>('connections');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Kaydedilen bağlantıları yükle
    const savedConnections = localStorage.getItem('savedConnections');
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }

    // Otomatik yeniden bağlanma kontrolü
    const interval = setInterval(() => {
      connections.forEach(connection => {
        if (connection.autoReconnect && connection.status === 'error') {
          console.log(`Otomatik yeniden bağlanma deneniyor: ${connection.name}`);
          // Burada otomatik yeniden bağlanma mantığı eklenebilir
        }
      });
    }, 30000); // 30 saniyede bir kontrol

    return () => clearInterval(interval);
  }, [connections]);

  const saveConnections = (conns: Connection[]) => {
    localStorage.setItem('savedConnections', JSON.stringify(conns));
    setConnections(conns);
  };

  const testConnection = async () => {
    if (!newConnection.connectionString) {
      alert('Lütfen bağlantı dizesini girin');
      return;
    }

    setTestingConnection(true);
    try {
      const startTime = Date.now();
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dbType: newConnection.type,
          connectionString: newConnection.connectionString
        })
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Test hatası');
      }

      showNotification({
        type: 'success',
        title: 'Bağlantı Testi Başarılı',
        message: `Versiyon: ${data.details.version}, Tablo Sayısı: ${data.details.tableCount}, Yanıt Süresi: ${responseTime}ms`
      });

    } catch (error: any) {
      showNotification({
        type: 'error',
        title: 'Bağlantı Testi Başarısız',
        message: error.message
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const addConnection = async () => {
    if (!newConnection.name || !newConnection.connectionString) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    const connection: Connection = {
      id: Date.now().toString(),
      name: newConnection.name,
      type: newConnection.type,
      connectionString: newConnection.connectionString,
      isActive: false,
      status: 'disconnected',
      autoReconnect: newConnection.autoReconnect
    };

    const updatedConnections = [...connections, connection];
    saveConnections(updatedConnections);
    
    setNewConnection({ name: '', type: 'postgresql', connectionString: '', autoReconnect: true });
    setShowNewConnection(false);
  };

  const connectToDatabase = async (connection: Connection) => {
    const updatedConnections = connections.map(conn => 
      conn.id === connection.id 
        ? { ...conn, status: 'connecting' as const }
        : conn
    );
    saveConnections(updatedConnections);

    try {
      const startTime = Date.now();
      const response = await fetch('/api/connect-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dbType: connection.type,
          connectionString: connection.connectionString
        })
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bağlantı hatası');
      }

      const updatedConnections = connections.map(conn => 
        conn.id === connection.id 
          ? { 
              ...conn, 
              status: 'connected' as const,
              isActive: true,
              lastConnected: new Date().toISOString(),
              tables: data.tables,
              performance: {
                responseTime,
                lastPing: Date.now()
              }
            }
          : conn
      );
      saveConnections(updatedConnections);

      // Aktif bağlantıyı localStorage'a kaydet
      localStorage.setItem('activeConnection', JSON.stringify(connection));
      
      // Bağlantı durumu değişikliğini tetikle
      window.dispatchEvent(new Event('connectionStatusChange'));

      // Bildirim göster
      showNotification({
        type: 'success',
        title: 'Bağlantı Başarılı',
        message: `${connection.name} veritabanına başarıyla bağlandı`
      });

    } catch (error: any) {
      const updatedConnections = connections.map(conn => 
        conn.id === connection.id 
          ? { ...conn, status: 'error' as const }
          : conn
      );
      saveConnections(updatedConnections);
      showNotification({
        type: 'error',
        title: 'Bağlantı Hatası',
        message: error.message
      });
    }
  };

  const disconnectFromDatabase = async (connection: Connection) => {
    try {
      await fetch('/api/disconnect-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dbType: connection.type,
          connectionString: connection.connectionString
        })
      });

      const updatedConnections = connections.map(conn => 
        conn.id === connection.id 
          ? { ...conn, status: 'disconnected' as const, isActive: false }
          : conn
      );
      saveConnections(updatedConnections);

      // Aktif bağlantıyı temizle
      localStorage.removeItem('activeConnection');
      
      // Bağlantı durumu değişikliğini tetikle
      window.dispatchEvent(new Event('connectionStatusChange'));

    } catch (error: any) {
      console.error('Bağlantı kesme hatası:', error);
    }
  };

  const deleteConnection = (connectionId: string) => {
    const updatedConnections = connections.filter(conn => conn.id !== connectionId);
    saveConnections(updatedConnections);
  };

  const toggleAutoReconnect = (connectionId: string) => {
    const updatedConnections = connections.map(conn => 
      conn.id === connectionId 
        ? { ...conn, autoReconnect: !conn.autoReconnect }
        : conn
    );
    saveConnections(updatedConnections);
  };

  const getStatusIcon = (status: Connection['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'connecting':
        return <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <XMarkIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: Connection['status']) => {
    switch (status) {
      case 'connected':
        return 'Bağlı';
      case 'connecting':
        return 'Bağlanıyor...';
      case 'error':
        return 'Hata';
      default:
        return 'Bağlı Değil';
    }
  };

  const getDbIcon = (type: string) => {
    switch (type) {
      case 'postgresql':
        return '🐘';
      case 'mysql':
        return '🐬';
      case 'mssql':
        return '💾';
      case 'sqlite':
        return '🗄️';
      default:
        return '🔗';
    }
  };

  const maskConnectionString = (connectionString: string) => {
    if (!connectionString) return '';
    
    // Şifre kısmını maskele
    const regex = /(password|pwd)=([^;&]+)/gi;
    return connectionString.replace(regex, '$1=***');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Veritabanı Bağlantı Yöneticisi</h2>
          <p className="text-gray-600 mt-2">Canlı veritabanı bağlantılarınızı yönetin</p>
        </div>
        
        <button
          onClick={() => setShowNewConnection(true)}
          className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <PlusIcon className="w-5 h-5" />
          Yeni Bağlantı
        </button>
      </div>

      {/* Yeni Bağlantı Formu */}
      {showNewConnection && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Yeni Bağlantı Ekle</h3>
            <button
              onClick={() => setShowNewConnection(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Bağlantı Adı
              </label>
              <input
                type="text"
                value={newConnection.name}
                onChange={(e) => setNewConnection({...newConnection, name: e.target.value})}
                className="w-full rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 p-3 transition-all"
                placeholder="Örn: Production DB"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Veritabanı Türü
              </label>
              <select
                value={newConnection.type}
                onChange={(e) => setNewConnection({...newConnection, type: e.target.value})}
                className="w-full rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 p-3 transition-all"
              >
                <option value="postgresql">🐘 PostgreSQL</option>
                <option value="mysql">🐬 MySQL</option>
                <option value="mssql">💾 MSSQL</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Bağlantı Dizesi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newConnection.connectionString}
                  onChange={(e) => setNewConnection({...newConnection, connectionString: e.target.value})}
                  className="w-full rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 p-3 pr-10 transition-all"
                  placeholder="postgres://user:pass@host:port/db"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Otomatik Yeniden Bağlan
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newConnection.autoReconnect}
                  onChange={(e) => setNewConnection({...newConnection, autoReconnect: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Aktif</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={testConnection}
              disabled={testingConnection}
              className="px-6 py-3 rounded-xl border-2 border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {testingConnection ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin inline mr-2" />
                  Test Ediliyor...
                </>
              ) : (
                'Bağlantıyı Test Et'
              )}
            </button>
            <button
              onClick={addConnection}
              className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
            >
              <LinkIcon className="w-5 h-5" />
              Bağlantı Ekle
            </button>
            <button
              onClick={() => setShowNewConnection(false)}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Tab Menüsü */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'connections'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔗 Bağlantılar ({connections.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📊 Bağlantı Geçmişi
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'performance'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⚡ Performans
        </button>
      </div>

      {/* Bağlantı Listesi */}
      {activeTab === 'connections' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {connections.map((connection) => (
            <div key={connection.id} className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getDbIcon(connection.type)}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{connection.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{connection.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(connection.status)}
                  <span className={`text-sm font-semibold ${
                    connection.status === 'connected' ? 'text-green-600' :
                    connection.status === 'connecting' ? 'text-blue-600' :
                    connection.status === 'error' ? 'text-red-600' :
                    'text-gray-500'
                  }`}>
                    {getStatusText(connection.status)}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 break-all">
                  {maskConnectionString(connection.connectionString)}
                </p>
              </div>
              
              {connection.tables && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    📋 {connection.tables.length} tablo yüklendi
                  </p>
                </div>
              )}

              {connection.performance && (
                <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
                  {connection.performance.responseTime && (
                    <span>⏱️ {connection.performance.responseTime}ms</span>
                  )}
                  {connection.performance.lastPing && (
                    <span>🔄 {new Date(connection.performance.lastPing).toLocaleTimeString('tr-TR')}</span>
                  )}
                </div>
              )}
              
              {connection.lastConnected && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500">
                    Son bağlantı: {new Date(connection.lastConnected).toLocaleString('tr-TR')}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                {connection.status === 'connected' ? (
                  <button
                    onClick={() => disconnectFromDatabase(connection)}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors"
                  >
                    Bağlantıyı Kes
                  </button>
                ) : (
                  <button
                    onClick={() => connectToDatabase(connection)}
                    disabled={connection.status === 'connecting'}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl font-semibold text-sm transition-colors"
                  >
                    Bağlan
                  </button>
                )}
                
                <button
                  onClick={() => toggleAutoReconnect(connection.id)}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    connection.autoReconnect 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Otomatik yeniden bağlanma"
                >
                  <CogIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => deleteConnection(connection.id)}
                  className="px-4 py-2 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-xl transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bağlantı Geçmişi */}
      {activeTab === 'history' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Bağlantı Geçmişi</h3>
          <div className="space-y-4">
            {connections
              .filter(conn => conn.lastConnected)
              .sort((a, b) => new Date(b.lastConnected!).getTime() - new Date(a.lastConnected!).getTime())
              .map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getDbIcon(connection.type)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{connection.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{connection.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(connection.lastConnected!).toLocaleDateString('tr-TR')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(connection.lastConnected!).toLocaleTimeString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            {connections.filter(conn => conn.lastConnected).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Henüz bağlantı geçmişi yok
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performans */}
      {activeTab === 'performance' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Bağlantı Performansı</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections
              .filter(conn => conn.performance)
              .map((connection) => (
                <div key={connection.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getDbIcon(connection.type)}</span>
                    <h4 className="font-semibold text-gray-900">{connection.name}</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    {connection.performance?.responseTime && (
                      <p className="text-gray-600">
                        ⏱️ Yanıt Süresi: <span className="font-semibold">{connection.performance.responseTime}ms</span>
                      </p>
                    )}
                    {connection.performance?.lastPing && (
                      <p className="text-gray-600">
                        🔄 Son Ping: <span className="font-semibold">{new Date(connection.performance.lastPing).toLocaleTimeString('tr-TR')}</span>
                      </p>
                    )}
                    <p className="text-gray-600">
                      📊 Durum: <span className={`font-semibold ${
                        connection.status === 'connected' ? 'text-green-600' : 'text-red-600'
                      }`}>{getStatusText(connection.status)}</span>
                    </p>
                  </div>
                </div>
              ))}
            {connections.filter(conn => conn.performance).length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                Henüz performans verisi yok
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'connections' && connections.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz bağlantı yok</h3>
          <p className="text-gray-600 mb-4">İlk veritabanı bağlantınızı ekleyerek başlayın</p>
          <button
            onClick={() => setShowNewConnection(true)}
            className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold"
          >
            İlk Bağlantıyı Ekle
          </button>
        </div>
      )}
    </div>
  );
} 