import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const COLORS = [
  "#2563eb", "#38bdf8", "#fbbf24", "#f87171", "#34d399", "#a78bfa", "#f472b6"
];

export default function ResultChart({ type = "pie" }: { type?: "pie" | "bar" }) {
  // Mock veri
  const labels = ["Diş Beyazlatma", "Dolgu", "Kanal Tedavisi"];
  const dataValues = [12000, 8500, 7200];

  const data = {
    labels,
    datasets: [
      {
        label: "Toplam Gelir (TL)",
        data: dataValues,
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow p-4 mt-4 animate-fade-in">
      {type === "pie" ? (
        <Pie data={data} options={options} />
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
} 