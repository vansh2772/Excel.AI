import React, { useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { DataRow, ChartConfig } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Chart3D } from './Chart3D';
import { AdvancedChartSelector } from './AdvancedChartSelector';
import { DataContext } from '../../services/aiService';
import { generateChartData } from '../../utils/dataProcessing';
import { exportChartAsPNG, exportChartAsPDF } from '../../utils/chartExport';
import { BarChart3, Info } from 'lucide-react';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdvancedDataVisualizationProps {
  data: DataRow[];
  numericColumns: string[];
  stringColumns: string[];
  dataContext: DataContext;
}

const THEME_COLORS = [
  '#6366f1', // Indigo 500
  '#8b5cf6', // Violet 500
  '#ec4899', // Pink 500
  '#06b6d4', // Cyan 500
  '#10b981', // Emerald 500
  '#f59e0b', // Amber 500
];

export const AdvancedDataVisualization: React.FC<AdvancedDataVisualizationProps> = ({
  data,
  numericColumns,
  stringColumns,
  dataContext
}) => {
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'bar',
    xAxis: stringColumns[0] || numericColumns[0] || '',
    yAxis: numericColumns[0] || '',
    title: 'Data Visualization',
    colors: THEME_COLORS
  });

  const chartRef = useRef<unknown>(null);

  const chartData = generateChartData(data, chartConfig.xAxis, 15);

  const getChartJSData = () => {
    if (!chartData || chartData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'No Data Available',
          data: [0],
          backgroundColor: ['rgba(99, 102, 241, 0.2)'],
          borderColor: ['rgba(99, 102, 241, 0.5)'],
          borderWidth: 1
        }]
      };
    }

    return {
      labels: chartData.map(item => item.name),
      datasets: [
        {
          label: chartConfig.yAxis || 'Count',
          data: chartData.map(item => item.value),
          backgroundColor: chartConfig.colors.map(c => c + 'CC'),
          borderColor: chartConfig.colors,
          borderWidth: 2,
          borderRadius: 6,
          fill: chartConfig.type === 'area'
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      }
    },
    scales: chartConfig.type !== 'pie' ? {
      x: {
        ticks: {
          color: '#64748b',
          maxRotation: 45,
          minRotation: 0,
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(99, 102, 241, 0.05)',
          drawBorder: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#64748b',
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(99, 102, 241, 0.05)',
          drawBorder: false
        }
      }
    } : undefined,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    }
  };

  const handleExportChart = async (format: 'png' | 'pdf') => {
    try {
      if (chartConfig.type.startsWith('3d')) {
        toast.error('3D chart export coming soon!');
        return;
      }
      if (!chartRef.current) return;
      
      const loadToast = toast.loading(`Preparing ${format.toUpperCase()}...`);
      if (format === 'png') {
        await exportChartAsPNG(chartRef.current, chartConfig.title);
      } else {
        await exportChartAsPDF(chartRef.current, chartConfig.title);
      }
      toast.dismiss(loadToast);
      toast.success(`Chart exported!`);
    } catch (err) {
      console.error(err);
      toast.error('Export failed');
    }
  };

  const renderEmptyState = (icon: React.ReactNode, title: string, sub: string) => (
    <div className="h-96 flex items-center justify-center glass rounded-xl border border-indigo-500/10">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-slate-400 text-sm max-w-[200px] mx-auto">{sub}</p>
        </div>
      </div>
    </div>
  );

  const renderChart = () => {
    if (!data || data.length === 0) {
      return renderEmptyState(<BarChart3 className="w-8 h-8" />, "No Data Available", "Upload a dataset to start visualizing");
    }

    if (!chartConfig.xAxis) {
      return renderEmptyState(<Info className="w-8 h-8" />, "Configure Axes", "Pick columns to generate your visualization");
    }

    const jsData = getChartJSData();

    if (chartConfig.type.startsWith('3d')) {
      return <Chart3D data={data} config={chartConfig} />;
    }

    try {
      switch (chartConfig.type) {
        case 'bar':
          return <div className="h-96"><Bar ref={chartRef} data={jsData} options={chartOptions} /></div>;
        case 'line':
          return <div className="h-96"><Line ref={chartRef} data={jsData} options={chartOptions} /></div>;
        case 'pie':
          return <div className="h-96"><Pie ref={chartRef} data={jsData} options={chartOptions} /></div>;
        case 'scatter': {
          const scatterData = {
            datasets: [{
              label: `${chartConfig.xAxis} vs ${chartConfig.yAxis}`,
              data: data.slice(0, 100).map(row => ({
                x: Number(row[chartConfig.xAxis]) || 0,
                y: Number(row[chartConfig.yAxis]) || 0
              })).filter(p => !isNaN(p.x) && !isNaN(p.y)),
              backgroundColor: THEME_COLORS[0] + '80',
              borderColor: THEME_COLORS[0],
              pointRadius: 5,
              pointHoverRadius: 7
            }]
          };
          return <div className="h-96"><Scatter ref={chartRef} data={scatterData} options={chartOptions} /></div>;
        }
        case 'area': {
          const areaData = {
            ...jsData,
            datasets: jsData.datasets.map(ds => ({
              ...ds,
              fill: true,
              backgroundColor: THEME_COLORS[0] + '33',
              borderColor: THEME_COLORS[0],
              pointBackgroundColor: THEME_COLORS[0],
              pointBorderColor: '#fff',
            }))
          };
          return <div className="h-96"><Line ref={chartRef} data={areaData} options={chartOptions} /></div>;
        }
        default:
          return renderEmptyState(<Info className="w-8 h-8" />, "Unsupported Chart", "Try a different chart type");
      }
    } catch (err) {
      console.error(err);
      return renderEmptyState(<Info className="w-8 h-8 text-rose-500" />, "Rendering Error", "Unable to display this dataset configuration");
    }
  };

  return (
    <div className="space-y-6">
      <AdvancedChartSelector
        data={data}
        numericColumns={numericColumns}
        stringColumns={stringColumns}
        dataContext={dataContext}
        onChartConfigChange={setChartConfig}
        onExportChart={handleExportChart}
      />

      <Card className="border-indigo-500/20">
        <CardHeader className="flex flex-row items-center justify-between border-b border-indigo-500/10 pb-4">
          <div>
            <CardTitle className="gradient-text">{chartConfig.title}</CardTitle>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
              {chartConfig.xAxis} {chartConfig.yAxis && `vs ${chartConfig.yAxis}`}
            </p>
          </div>
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {renderChart()}
        </CardContent>
      </Card>
    </div>
  );
};