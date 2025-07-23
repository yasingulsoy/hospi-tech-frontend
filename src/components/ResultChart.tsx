"use client";

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ResultChartProps {
  data: any[];
  chartType: 'line' | 'bar' | 'pie' | 'doughnut';
  title?: string;
}

export default function ResultChart({ data, chartType, title }: ResultChartProps) {
  const chartRef = useRef<ChartJS>(null);

  // Veriyi grafik formatına dönüştür
  const processData = () => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(col => 
      typeof data[0][col] === 'number' || !isNaN(Number(data[0][col]))
    );
    const labelColumn = columns.find(col => 
      typeof data[0][col] === 'string' && col.toLowerCase().includes('name')
    ) || columns[0];

    if (chartType === 'line' || chartType === 'bar') {
      const datasets = numericColumns.map((col, index) => ({
        label: col,
        data: data.map(row => Number(row[col]) || 0),
        borderColor: `hsl(${index * 60}, 70%, 50%)`,
        backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
        fill: chartType === 'line',
        tension: 0.4,
      }));

      return {
        labels: data.map(row => row[labelColumn]),
        datasets,
      };
    } else {
      // Pie/Doughnut için ilk numeric column'u kullan
      const valueColumn = numericColumns[0] || columns[1];
      return {
        labels: data.map(row => row[labelColumn]),
        datasets: [{
          data: data.map(row => Number(row[valueColumn]) || 0),
          backgroundColor: data.map((_, index) => 
            `hsl(${index * (360 / data.length)}, 70%, 50%)`
          ),
          borderWidth: 2,
          borderColor: '#fff',
        }],
      };
    }
  };

  const chartData = processData();
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
      y: {
        beginAtZero: true,
      },
    } : undefined,
  };

  if (!chartData) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <p className="text-gray-500">Grafik için veri bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
      <div className="h-64 md:h-80">
        {chartType === 'line' && <Line data={chartData} options={options} />}
        {chartType === 'bar' && <Bar data={chartData} options={options} />}
        {chartType === 'pie' && <Pie data={chartData} options={options} />}
        {chartType === 'doughnut' && <Doughnut data={chartData} options={options} />}
      </div>
    </div>
  );
} 