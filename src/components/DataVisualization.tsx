import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { DataRow } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { generateChartData } from '../utils/dataProcessing';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

interface DataVisualizationProps {
  data: DataRow[];
  numericColumns: string[];
  stringColumns: string[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'];

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  numericColumns,
  stringColumns
}) => {
  const [selectedColumn, setSelectedColumn] = useState(stringColumns[0] || numericColumns[0]);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');

  const chartData = generateChartData(data, selectedColumn, 10);

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle>Data Visualization</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <optgroup label="Text Columns">
                {stringColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Numeric Columns">
                {numericColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="flex space-x-2">
              <Button
                variant={chartType === 'bar' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant={chartType === 'pie' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('pie')}
              >
                <PieChartIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={chartType === 'line' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                <TrendingUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {selectedColumn} Distribution
          </h4>
          <p className="text-sm text-gray-600">
            Showing top 10 values for the selected column
          </p>
        </div>
        {renderChart()}
      </CardContent>
    </Card>
  );
};