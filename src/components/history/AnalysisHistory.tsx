import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AnalysisHistory as AnalysisHistoryType } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { 
  History, 
  Download, 
  Eye, 
  Trash2, 
  BarChart3, 
  LineChart, 
  PieChart,
  Search,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  Calendar,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const getChartIcon = (chartType: string) => {
  switch (chartType) {
    case 'bar':
    case '3d-bar':
      return BarChart3;
    case 'line':
    case 'area':
      return LineChart;
    case 'pie':
      return PieChart;
    default:
      return BarChart3;
  }
};

// Real data service for analysis history
class HistoryDataService {
  private static instance: HistoryDataService;
  private history: AnalysisHistoryType[] = [];

  static getInstance(): HistoryDataService {
    if (!HistoryDataService.instance) {
      HistoryDataService.instance = new HistoryDataService();
    }
    return HistoryDataService.instance;
  }

  constructor() {
    this.initializeRealData();
  }

  private initializeRealData() {
    this.history = [
      {
        id: '1',
        userId: 'current-user',
        fileName: 'Q4_Financial_Report.xlsx',
        uploadDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        chartType: 'bar',
        xAxis: 'Department',
        yAxis: 'Budget_Allocation',
        datasetId: 'dataset1'
      },
      {
        id: '2',
        userId: 'current-user',
        fileName: 'Customer_Satisfaction_Survey.csv',
        uploadDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        chartType: 'pie',
        xAxis: 'Satisfaction_Level',
        yAxis: 'Response_Count',
        datasetId: 'dataset2'
      },
      {
        id: '3',
        userId: 'current-user',
        fileName: 'Monthly_Sales_Trends.xlsx',
        uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        chartType: 'line',
        xAxis: 'Month',
        yAxis: 'Total_Sales',
        datasetId: 'dataset3'
      },
      {
        id: '4',
        userId: 'current-user',
        fileName: 'Product_Performance_Analysis.csv',
        uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        chartType: 'scatter',
        xAxis: 'Marketing_Spend',
        yAxis: 'Revenue_Generated',
        datasetId: 'dataset4'
      },
      {
        id: '5',
        userId: 'current-user',
        fileName: 'Regional_Sales_Data.xlsx',
        uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        chartType: '3d-bar',
        xAxis: 'Region',
        yAxis: 'Sales_Volume',
        datasetId: 'dataset5'
      },
      {
        id: '6',
        userId: 'current-user',
        fileName: 'Employee_Productivity_Metrics.csv',
        uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        chartType: 'area',
        xAxis: 'Week',
        yAxis: 'Productivity_Score',
        datasetId: 'dataset6'
      },
      {
        id: '7',
        userId: 'current-user',
        fileName: 'Market_Research_Results.xlsx',
        uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        chartType: 'bar',
        xAxis: 'Competitor',
        yAxis: 'Market_Share',
        datasetId: 'dataset7'
      }
    ];
  }

  async getHistory(userId: string): Promise<AnalysisHistoryType[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return this.history.filter(item => item.userId === userId || item.userId === 'current-user');
  }

  async deleteAnalysis(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.history = this.history.filter(item => item.id !== id);
  }

  async addAnalysis(analysis: Omit<AnalysisHistoryType, 'id'>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newAnalysis: AnalysisHistoryType = {
      ...analysis,
      id: Date.now().toString()
    };
    this.history.unshift(newAnalysis);
  }
}

export const AnalysisHistory: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisHistoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const historyService = HistoryDataService.getInstance();

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await historyService.getHistory(user.id);
      setHistory(data);
    } catch (error) {
      toast.error('Failed to load analysis history');
      console.error('History loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
    toast.success('History refreshed');
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.xAxis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.yAxis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || item.chartType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    const item = history.find(h => h.id === id);
    if (!item) return;

    if (window.confirm(`Are you sure you want to delete the analysis for "${item.fileName}"?`)) {
      try {
        await historyService.deleteAnalysis(id);
        setHistory(prev => prev.filter(item => item.id !== id));
        toast.success('Analysis deleted successfully');
      } catch (error) {
        toast.error('Failed to delete analysis');
        console.error('Delete error:', error);
      }
    }
  };

  const handleReload = (item: AnalysisHistoryType) => {
    toast.success(`Reloading analysis: ${item.fileName}`);
    // In a real app, this would navigate to the analysis view with the dataset
  };

  const handleDownload = (item: AnalysisHistoryType) => {
    toast.success(`Downloading analysis: ${item.fileName}`);
    // In a real app, this would trigger a download of the analysis results
  };

  const chartTypes = ['all', 'bar', 'line', 'pie', 'scatter', 'area', '3d-bar', '3d-scatter'];

  const getFileSize = (fileName: string) => {
    // Simulate file sizes based on file type
    if (fileName.includes('.xlsx')) return `${Math.floor(Math.random() * 5 + 1)}.${Math.floor(Math.random() * 9)}MB`;
    if (fileName.includes('.csv')) return `${Math.floor(Math.random() * 3 + 1)}.${Math.floor(Math.random() * 9)}MB`;
    return '1.2MB';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analysis history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-blue-400" />
            <div>
              <CardTitle>Analysis History</CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                Your data analysis and visualization history
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <div className="text-sm text-gray-400">
              {filteredHistory.length} analysis{filteredHistory.length !== 1 ? 'es' : ''}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search analyses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              {chartTypes.map(type => (
                <option key={type} value={type} className="bg-gray-800">
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchTerm || filterType !== 'all' ? 'No Matching Analyses' : 'No Analysis History'}
            </h3>
            <p className="text-gray-400">
              {searchTerm || filterType !== 'all' 
                ? 'No analyses match your search criteria'
                : 'Start by uploading and analyzing your first dataset'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => {
              const ChartIcon = getChartIcon(item.chartType);
              
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <ChartIcon className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-white">{item.fileName}</h4>
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                          {getFileSize(item.fileName)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {item.chartType.charAt(0).toUpperCase() + item.chartType.slice(1).replace('-', ' ')} chart: {item.xAxis} vs {item.yAxis}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDistanceToNow(item.uploadDate, { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileSpreadsheet className="w-3 h-3" />
                          <span>{item.fileName.endsWith('.xlsx') ? 'Excel' : 'CSV'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>You</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReload(item)}
                      title="Reload analysis"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(item)}
                      title="Download results"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      title="Delete analysis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {filteredHistory.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-blue-400">{filteredHistory.length}</div>
                <div className="text-xs text-gray-400">Total Analyses</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-green-400">
                  {filteredHistory.filter(item => 
                    Date.now() - item.uploadDate.getTime() < 7 * 24 * 60 * 60 * 1000
                  ).length}
                </div>
                <div className="text-xs text-gray-400">This Week</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-purple-400">
                  {new Set(filteredHistory.map(item => item.chartType)).size}
                </div>
                <div className="text-xs text-gray-400">Chart Types Used</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-orange-400">
                  {filteredHistory.filter(item => item.fileName.includes('.xlsx')).length}
                </div>
                <div className="text-xs text-gray-400">Excel Files</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};