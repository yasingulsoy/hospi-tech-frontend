import { ArrowDownTrayIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DownloadButtons({
  tableId,
  chartId,
  fileName = "rapor"
}: {
  tableId: string;
  chartId: string;
  fileName?: string;
}) {
  // Excel çıktısı
  const handleExcel = () => {
    const table = document.getElementById(tableId) as HTMLTableElement | null;
    if (!table) return;
    const wb = XLSX.utils.table_to_book(table, { sheet: "Rapor" });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // PDF çıktısı (tablo + grafik)
  const handlePDF = async () => {
    const table = document.getElementById(tableId);
    const chart = document.getElementById(chartId);
    if (!table || !chart) return;
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    // Tabloyu ekle
    const tableCanvas = await html2canvas(table, { scale: 2 });
    const tableImg = tableCanvas.toDataURL("image/png");
    pdf.text("Rapor Tablosu", 40, 40);
    pdf.addImage(tableImg, "PNG", 40, 60, 500, 120);
    // Grafik ekle
    const chartCanvas = await html2canvas(chart, { scale: 2 });
    const chartImg = chartCanvas.toDataURL("image/png");
    pdf.text("Grafik", 40, 210);
    pdf.addImage(chartImg, "PNG", 40, 230, 350, 180);
    pdf.save(`${fileName}.pdf`);
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={handleExcel}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-colors"
      >
        <ArrowDownTrayIcon className="w-5 h-5" /> Excel
      </button>
      <button
        onClick={handlePDF}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-colors"
      >
        <DocumentArrowDownIcon className="w-5 h-5" /> PDF
      </button>
    </div>
  );
} 