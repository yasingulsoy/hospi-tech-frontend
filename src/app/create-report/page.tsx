"use client";

import { useState } from "react";
import SmartReportBuilder from "../../components/SmartReportBuilder";

export default function CreateReportPage() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Akıllı Rapor Oluşturucu</h1>
        <p className="text-gray-700">Doğal dil ile raporunuzu tanımlayın, AI otomatik olarak oluştursun</p>
      </div>
      <SmartReportBuilder />
    </div>
  );
} 