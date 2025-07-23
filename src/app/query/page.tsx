"use client";

import { useState } from "react";
import QueryInput from "../../components/QueryInput";
import QueryResult from "../../components/QueryResult";

export default function QueryPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<any>(null);

  // Tablo ve sütun açıklamalarını veritabanından al
  const getTabloYapisi = () => {
    const databaseInfo = localStorage.getItem('databaseInfo');
    if (!databaseInfo) return "";
    
    const dbInfo = JSON.parse(databaseInfo);
    if (!dbInfo.tables) return "";
    
    return dbInfo.tables.map((table: any) => {
      const columns = table.columns.map((col: any) => 
        `${col.column_name}: ${col.column_comment || col.data_type}`
      ).join(', ');
      return `${table.table} (${columns})`;
    }).join('\n');
  };

  const handleQuery = async (query: string) => {
    setLoading(true);
    setError(undefined);
    setData(null);
    try {
      // Veritabanı bilgilerini al
      const databaseInfo = localStorage.getItem('databaseInfo');
      if (!databaseInfo) {
        setError("Veritabanı bağlantısı bulunamadı. Lütfen önce veritabanını bağlayın.");
        setLoading(false);
        return;
      }

      const dbInfo = JSON.parse(databaseInfo);
      
      // 1. GPT-4 ile SQL üret
      const sqlRes = await fetch("/api/generate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aciklama: query, tabloYapisi: getTabloYapisi() })
      });
      const sqlData = await sqlRes.json();
      if (!sqlRes.ok) {
        setError(sqlData.error || "SQL üretimi sırasında bir hata oluştu.");
        setLoading(false);
        return;
      }
      
      // 2. SQL'i çalıştır
      const runRes = await fetch("/api/run-query", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-database-info": databaseInfo
        },
        body: JSON.stringify({ sql: sqlData.sql })
      });
      const runData = await runRes.json();
      if (!runRes.ok) {
        setError(runData.error || "Sorgu çalıştırılırken bir hata oluştu.");
        setLoading(false);
        return;
      }
      setData(runData.rows);
      setLoading(false);
    } catch (e: any) {
      setError("Bir hata oluştu: " + (e.message || e.toString()));
      setLoading(false);
    }
  };

  return (
    <div>
      <QueryInput onSubmit={handleQuery} />
      <QueryResult loading={loading} error={error} data={data} />
    </div>
  );
} 