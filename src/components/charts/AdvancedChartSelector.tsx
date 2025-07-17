import React, { useState, useCallback } from 'react';
import { DataRow, ChartConfig } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { SmartChartRecommendations } from './SmartChartRecommendations';
import { DataContext } from '../../services/aiService';
import { BarChart3, LineChart, PieChart, Dot, Sparkles, Settings, Download } from 'lucide-react';

interface AdvancedChartSelectorProps {
  data: DataRow[];
  numericColumns: string[];
  stringColumns: string[];
  dataContext: DataContext;
  onChartConfigChange: (config: ChartConfig) => void;
  onExportChart: (format: 'png' | 'pdf') => void;
}

const chartTypes = [
  { type: 'bar', icon: BarChart3, label: '2D Bar Chart', description: 'Compare values across categories' },
  { type: 'line', icon: LineChart, label: 'Line Chart', description: 'Show trends over time' },
  { type: 'pie', icon: PieChart, label: 'Pie Chart', description: 'Show proportions of a whole' },
  { type: 'scatter', icon: Dot, label: 'Scatter Plot', description: 'Show correlation between variables' },
  { type: 'area', icon: LineChart, label: 'Area Chart', description: 'Show cumulative values over time' },
] as const;

const colorSchemes = [
  { name: 'Blue', colors: ['#3B82F6', '#1E40AF', '#60A5FA', '#93C5FD'] },
  { name: 'Green', colors: ['#10B981', '#047857', '#34D399', '#6EE7B7'] },
  { name: 'Purple', colors: ['#8B5CF6', '#5B21B6', '#A78BFA', '#C4B5FD'] },
  { name: 'Orange', colors: ['#F59E0B', '#D97706', '#FBBF24', '#FCD34D'] },
  { name: 'Rainbow', colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] }
];

export const AdvancedChartSelector: React.FC<AdvancedChartSelectorProps> = ({
  data,
  numericColumns,
  stringColumns,
  dataContext,
  onChartConfigChange,
  onExportChart
}) => {
  const [selectedType, setSelectedType] = useState<ChartConfig['type']>('bar');
  const [xAxis, setXAxis] = useState(stringColumns[0] || numericColumns[0] || '');
  const [yAxis, setYAxis] = useState(numericColumns[0] || '');
  const [title, setTitle] = useState('Data Visualization');
  const [selectedColors, setSelectedColors] = useState(colorSchemes[0].colors);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);

  const handleConfigChange = useCallback(() => {
    const config: ChartConfig = {
      type: selectedType,
      xAxis,
      yAxis,
      title,
      colors: selectedColors
    };
    onChartConfigChange(config);
  }, [selectedType, xAxis, yAxis, title, selectedColors, onChartConfigChange]);

  React.useEffect(() => {
    if (xAxis && yAxis) {
      handleConfigChange();
    }
  }, [handleConfigChange, xAxis, yAxis]);

  const handleApplyRecommendation = (recommendedConfig: Partial<ChartConfig>) => {
    if (recommendedConfig.type) {
      setSelectedType(recommendedConfig.type);
    }
    if (recommendedConfig.title) {
      setTitle(recommendedConfig.title);
    }
  };

  const allColumns = [...stringColumns, ...numericColumns];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Chart Configuration</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIRecommendations(!showAIRecommendations)}
              >
                <Sparkles className="w-4 h-4" />
                AI Help
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportChart('png')}
              >
                <Download className="w-4 h-4" />
                PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportChart('pdf')}
              >
                <Download className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chart Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Chart Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {chartTypes.map((chart) => (
                <button
                  key={chart.type}
                  onClick={() => setSelectedType(chart.type)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedType === chart.type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <chart.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xs font-medium">{chart.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Axis Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X-Axis (Categories)
              </label>
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select column...</option>
                {allColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Y-Axis (Values)
              </label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select column...</option>
                {numericColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter chart title..."
            />
          </div>

          {/* Advanced Settings */}
          {showSettings && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Color Scheme</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.name}
                    onClick={() => setSelectedColors(scheme.colors)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedColors === scheme.colors
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex space-x-1 mb-2">
                      {scheme.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-xs font-medium">{scheme.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chart Description */}
          {selectedType && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                {chartTypes.find(c => c.type === selectedType)?.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {showAIRecommendations && (
        <SmartChartRecommendations
          dataContext={dataContext}
          selectedXAxis={xAxis}
          selectedYAxis={yAxis}
          onApplyRecommendation={handleApplyRecommendation}
        />
      )}
    </div>
  );
};