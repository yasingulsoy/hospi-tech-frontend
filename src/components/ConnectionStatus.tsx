"use client";

import { useState, useEffect } from "react";
import { CheckCircleIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface ConnectionStatusProps {
  className?: string;
}

export default function ConnectionStatus({ className = "" }: ConnectionStatusProps) {
  const [activeConnection, setActiveConnection] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Aktif bağlantıyı localStorage'dan al
    const savedConnection = localStorage.getItem('activeConnection');
    if (savedConnection) {
      const connection = JSON.parse(savedConnection);
      setActiveConnection(connection);
      setIsConnected(true);
    }

    // Bağlantı durumu değişikliklerini dinle
    const handleStorageChange = () => {
      const savedConnection = localStorage.getItem('activeConnection');
      if (savedConnection) {
        const connection = JSON.parse(savedConnection);
        setActiveConnection(connection);
        setIsConnected(true);
      } else {
        setActiveConnection(null);
        setIsConnected(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('connectionStatusChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('connectionStatusChange', handleStorageChange);
    };
  }, []);

  if (!isConnected || !activeConnection) {
    return null;
  }

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

  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 ${className}`}>
      <CheckCircleIcon className="w-4 h-4 text-green-500" />
      <span className="text-sm font-medium">
        {getDbIcon(activeConnection.type)} {activeConnection.name}
      </span>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    </div>
  );
} 