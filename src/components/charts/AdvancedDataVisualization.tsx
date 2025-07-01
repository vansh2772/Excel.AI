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
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
  });

  const chartRef = useRef<any>(null);

  const chartData = generateChartData(data, chartConfig.xAxis, 15);

  const getChartJSData = () => {
    if (!chartData || chartData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'No Data Available',
          data: [0],
          backgroundColor: ['#E5E7EB'],
          borderColor: ['#9CA3AF'],
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
          backgroundColor: chartConfig.colors,
          borderColor: chartConfig.colors.map(color => color + '80'),
          borderWidth: 2,
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
      },
      title: {
        display: true,
        text: chartConfig.title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#3B82F6',
        borderWidth: 1
      }
    },
    scales: chartConfig.type !== 'pie' ? {
      x: {
        title: {
          display: true,
          text: chartConfig.xAxis
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        title: {
          display: true,
          text: chartConfig.yAxis || 'Count'
        },
        beginAtZero: true
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
        toast.error('3D chart export not supported yet');
        return;
      }

      if (!chartRef.current) {
        toast.error('Chart not ready for export');
        return;
      }

      if (format === 'png') {
        await exportChartAsPNG(chartRef.current, chartConfig.title);
      } else {
        await exportChartAsPDF(chartRef.current, chartConfig.title);
      }
      
      toast.success(`Chart exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export chart');
    }
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500">Upload a dataset to create visualizations</p>
          </div>
        </div>
      );
    }

    if (!chartConfig.xAxis) {
      return (
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Chart Axes</h3>
            <p className="text-gray-500">Choose X and Y axes to generate your visualization</p>
          </div>
        </div>
      );
    }

    const jsData = getChartJSData();

    if (chartConfig.type.startsWith('3d')) {
      return <Chart3D data={data} config={chartConfig} />;
    }

    try {
      switch (chartConfig.type) {
        case 'bar':
          return (
            <div className="h-96">
              <Bar ref={chartRef} data={jsData} options={chartOptions} />
            </div>
          );
        case 'line':
          return (
            <div className="h-96">
              <Line ref={chartRef} data={jsData} options={chartOptions} />
            </div>
          );
        case 'pie':
          return (
            <div className="h-96">
              <Pie ref={chartRef} data={jsData} options={chartOptions} />
            </div>
          );
        case 'scatter':
          const scatterData = {
            datasets: [
              {
                label: `${chartConfig.xAxis} vs ${chartConfig.yAxis}`,
                data: data.slice(0, 100).map(row => ({
                  x: Number(row[chartConfig.xAxis]) || 0,
                  y: Number(row[chartConfig.yAxis]) || 0
                })).filter(point => !isNaN(point.x) && !isNaN(point.y)),
                backgroundColor: chartConfig.colors[0] + '80',
                borderColor: chartConfig.colors[0],
                pointRadius: 4,
                pointHoverRadius: 6
              }
            ]
          };
          return (
            <div className="h-96">
              <Scatter ref={chartRef} data={scatterData} options={chartOptions} />
            </div>
          );
        case 'area':
          const areaData = {
            ...jsData,
            datasets: jsData.datasets.map(dataset => ({
              ...dataset,
              fill: true,
              backgroundColor: chartConfig.colors[0] + '20',
              borderColor: chartConfig.colors[0],
              pointBackgroundColor: chartConfig.colors[0],
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: chartConfig.colors[0]
            }))
          };
          return (
            <div className="h-96">
              <Line ref={chartRef} data={areaData} options={chartOptions} />
            </div>
          );
        default:
          return (
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Unsupported Chart Type</h3>
                <p className="text-gray-500">Please select a different chart type</p>
              </div>
            </div>
          );
      }
    } catch (error) {
      console.error('Chart rendering error:', error);
      return (
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chart Rendering Error</h3>
            <p className="text-gray-500">Unable to render the selected chart type</p>
          </div>
        </div>
      );
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

      <Card>
        <CardHeader>
          <CardTitle>{chartConfig.title}</CardTitle>
          <p className="text-sm text-gray-400">
            {chartConfig.xAxis} {chartConfig.yAxis && `vs ${chartConfig.yAxis}`}
          </p>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>
    </div>
  );
};