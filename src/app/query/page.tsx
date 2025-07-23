"use client";

import { useState } from "react";
import QueryInput from "../../components/QueryInput";
import QueryResult from "../../components/QueryResult";

export default function QueryPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<any>(null);

  // Tablo ve sütun açıklamaları örnek (gerçek uygulamada backend'den alınacak)
  const tabloYapisi = `patients (id: hasta numarası, name: hasta adı, birth_date: doğum tarihi)\ntreatments (treatment_date: tedavi tarihi, total_fee: toplam ücret)`;

  const handleQuery = async (query: string) => {
    setLoading(true);
    setError(undefined);
    setData(null);
    try {
      // 1. GPT-4 ile SQL üret
      const sqlRes = await fetch("/api/generate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aciklama: query, tabloYapisi })
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
        headers: { "Content-Type": "application/json" },
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