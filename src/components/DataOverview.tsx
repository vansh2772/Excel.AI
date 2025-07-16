import React from 'react';
import { DatasetInfo, AnalyticsData } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { formatFileSize } from '../utils/dataProcessing';
import { 
  FileText, 
  Grid, 
  Calendar, 
  HardDrive,
  TrendingUp,
  Hash,
  Type,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface DataOverviewProps {
  datasetInfo: DatasetInfo;
  analytics: AnalyticsData;
}

export const DataOverview: React.FC<DataOverviewProps> = ({ 
  datasetInfo, 
  analytics 
}) => {
  const stats = [
    {
      label: 'Total Rows',
      value: analytics.totalRows.toLocaleString(),
      icon: Grid,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      label: 'Total Columns',
      value: analytics.totalColumns.toString(),
      icon: Hash,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      label: 'File Size',
      value: formatFileSize(datasetInfo.size),
      icon: HardDrive,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      label: 'Numeric Columns',
      value: analytics.numericColumns.length.toString(),
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      label: 'Text Columns',
      value: analytics.stringColumns.length.toString(),
      icon: Type,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20'
    },
    {
      label: 'Upload Date',
      value: new Date(datasetInfo.uploadDate).toLocaleDateString(),
      icon: Calendar,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20'
    }
  ];

  const getDataQualityStatus = () => {
    const issues = [];
    const recommendations = [];

    // Check for potential issues
    if (analytics.totalRows < 10) {
      issues.push('Very small dataset (less than 10 rows)');
      recommendations.push('Consider adding more data for better analysis');
    }

    if (analytics.numericColumns.length === 0) {
      issues.push('No numeric columns found');
      recommendations.push('Numeric data enables statistical analysis and trending');
    }

    if (analytics.stringColumns.length === 0) {
      issues.push('No categorical columns found');
      recommendations.push('Categorical data enables grouping and classification');
    }

    if (analytics.totalColumns > 50) {
      issues.push('Many columns detected');
      recommendations.push('Consider focusing on key columns for analysis');
    }

    return { issues, recommendations };
  };

  const { issues, recommendations } = getDataQualityStatus();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-400" />
            <div>
              <CardTitle>Dataset Overview</CardTitle>
              <p className="text-sm text-gray-400 mt-1">{datasetInfo.name}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                  <p className="text-xl font-bold text-black dark:text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Quality Assessment */}
      {(issues.length > 0 || recommendations.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {issues.length > 0 ? (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              <span>Data Quality Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {issues.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-yellow-400 mb-2">Potential Issues:</h4>
                  <ul className="space-y-1">
                    {issues.map((issue, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-center space-x-2">
                        <AlertTriangle className="w-3 h-3 text-yellow-400" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-blue-400 mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-blue-400" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Numeric Columns Summary */}
      {analytics.numericColumns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Numeric Columns Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Column</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">Mean</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">Median</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">Min</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">Max</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">Std Dev</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.numericColumns.map((column) => {
                    const stats = analytics.summary[column];
                    return (
                      <tr key={column} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4 font-medium text-black dark:text-white">{column}</td>
                        <td className="py-3 px-4 text-right text-gray-300">
                          {stats?.mean !== undefined ? stats.mean : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300">
                          {stats?.median !== undefined ? stats.median : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300">
                          {stats?.min !== undefined ? stats.min : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300">
                          {stats?.max !== undefined ? stats.max : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300">
                          {stats?.stdDev !== undefined ? stats.stdDev : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Columns Summary */}
      {analytics.stringColumns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Text Columns Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Column</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">Unique Values</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Most Common</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.stringColumns.map((column) => {
                    const stats = analytics.summary[column];
                    return (
                      <tr key={column} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4 font-medium text-black dark:text-white">{column}</td>
                        <td className="py-3 px-4 text-right text-gray-300">
                          {stats?.uniqueValues !== undefined ? stats.uniqueValues : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {stats?.mode !== undefined ? String(stats.mode) : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};