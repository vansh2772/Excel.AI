import React, { useState, useEffect } from 'react';
import { AdminStats, User, AnalysisHistory } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import {
  Users,
  Upload,
  Activity,
  BarChart3,
  HardDrive,
  TrendingUp,
  UserX,
  Shield,
  Eye,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Database,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

// Real data service simulation
class AdminDataService {
  private static instance: AdminDataService;
  private users: User[] = [];
  private activities: AnalysisHistory[] = [];
  private stats: AdminStats | null = null;

  static getInstance(): AdminDataService {
    if (!AdminDataService.instance) {
      AdminDataService.instance = new AdminDataService();
    }
    return AdminDataService.instance;
  }

  constructor() {
    this.initializeRealData();
  }

  private initializeRealData() {
    // Generate realistic user data
    this.users = [
      {
        id: '1',
        email: 'john.doe@company.com',
        name: 'John Doe',
        role: 'user',
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: '2',
        email: 'sarah.wilson@enterprise.com',
        name: 'Sarah Wilson',
        role: 'user',
        createdAt: new Date('2024-01-20'),
        lastLogin: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        id: '3',
        email: 'admin@excelai.com',
        name: 'System Administrator',
        role: 'admin',
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      },
      {
        id: '4',
        email: 'mike.chen@startup.io',
        name: 'Mike Chen',
        role: 'user',
        createdAt: new Date('2024-01-25'),
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: '5',
        email: 'lisa.garcia@analytics.com',
        name: 'Lisa Garcia',
        role: 'user',
        createdAt: new Date('2024-02-01'),
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      }
    ];

    // Generate realistic activity data
    this.activities = [
      {
        id: '1',
        userId: '1',
        fileName: 'Q4_Sales_Report.xlsx',
        uploadDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
        chartType: 'bar',
        xAxis: 'Product_Category',
        yAxis: 'Revenue',
        datasetId: 'ds1'
      },
      {
        id: '2',
        userId: '2',
        fileName: 'Customer_Demographics.csv',
        uploadDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
        chartType: 'pie',
        xAxis: 'Age_Group',
        yAxis: 'Count',
        datasetId: 'ds2'
      },
      {
        id: '3',
        userId: '4',
        fileName: 'Monthly_Trends_2024.xlsx',
        uploadDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
        chartType: 'line',
        xAxis: 'Month',
        yAxis: 'Growth_Rate',
        datasetId: 'ds3'
      },
      {
        id: '4',
        userId: '5',
        fileName: 'Marketing_Campaign_Results.csv',
        uploadDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
        chartType: 'scatter',
        xAxis: 'Ad_Spend',
        yAxis: 'Conversions',
        datasetId: 'ds4'
      },
      {
        id: '5',
        userId: '1',
        fileName: 'Employee_Performance.xlsx',
        uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        chartType: '3d-bar',
        xAxis: 'Department',
        yAxis: 'Performance_Score',
        datasetId: 'ds5'
      }
    ];

    this.updateStats();
  }

  private updateStats() {
    const activeUsers = this.users.filter(user => 
      user.lastLogin && (Date.now() - user.lastLogin.getTime()) < 24 * 60 * 60 * 1000
    ).length;

    const chartTypeCounts = this.activities.reduce((acc, activity) => {
      acc[activity.chartType] = (acc[activity.chartType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedChartType = Object.entries(chartTypeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'bar';

    this.stats = {
      totalUsers: this.users.length,
      totalUploads: this.activities.length,
      activeUsers,
      mostUsedChartType,
      storageUsed: 47.3, // GB
      recentActivity: this.activities.slice(0, 10)
    };
  }

  async getStats(): Promise<AdminStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    this.updateStats();
    return this.stats!;
  }

  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...this.users];
  }

  async updateUserRole(userId: string, newRole: 'user' | 'admin'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex].role = newRole;
      this.updateStats();
    }
  }

  async deleteUser(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.users = this.users.filter(u => u.id !== userId);
    this.activities = this.activities.filter(a => a.userId !== userId);
    this.updateStats();
  }

  async blockUser(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would set a blocked status
    console.log(`User ${userId} blocked`);
  }

  getChartTypeDistribution() {
    const distribution = this.activities.reduce((acc, activity) => {
      acc[activity.chartType] = (acc[activity.chartType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = this.activities.length;
    return Object.entries(distribution).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'activity'>('overview');
  const [refreshing, setRefreshing] = useState(false);

  const adminService = AdminDataService.getInstance();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers()
      ]);
      
      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      toast.error('Failed to load admin data');
      console.error('Admin data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAdminData();
    setRefreshing(false);
    toast.success('Data refreshed successfully');
  };

  const handleUserAction = async (userId: string, action: 'block' | 'delete' | 'promote') => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      if (action === 'delete') {
        if (window.confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) {
          await adminService.deleteUser(userId);
          setUsers(prev => prev.filter(u => u.id !== userId));
          toast.success('User deleted successfully');
        }
      } else if (action === 'promote') {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        await adminService.updateUserRole(userId, newRole);
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ));
        toast.success(`User ${newRole === 'admin' ? 'promoted to admin' : 'demoted to user'}`);
      } else if (action === 'block') {
        if (window.confirm(`Are you sure you want to block user ${user.name}?`)) {
          await adminService.blockUser(userId);
          toast.success('User blocked successfully');
        }
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`);
      console.error(`User ${action} error:`, error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      trend: '+12% this month'
    },
    {
      title: 'Total Uploads',
      value: stats?.totalUploads.toLocaleString() || '0',
      icon: Upload,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      trend: '+8% this week'
    },
    {
      title: 'Active Users (24h)',
      value: stats?.activeUsers.toLocaleString() || '0',
      icon: Activity,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      trend: '68% of total users'
    },
    {
      title: 'Storage Used',
      value: `${stats?.storageUsed || 0} GB`,
      icon: HardDrive,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      trend: 'of 100 GB limit'
    }
  ];

  const chartDistribution = adminService.getChartTypeDistribution();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Monitor platform activity and manage users</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-green-400">Admin Access</span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">System Status: Operational</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Database className="w-4 h-4" />
                <span>Database: Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-white/20">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'activity', label: 'Activity', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.trend}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Chart Type Usage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartDistribution.map((chart, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-32 text-sm font-medium text-gray-300">{chart.type}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${chart.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-400 text-right">
                      {chart.count} ({chart.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">
                    {stats?.recentActivity.filter(a => 
                      Date.now() - a.uploadDate.getTime() < 24 * 60 * 60 * 1000
                    ).length}
                  </div>
                  <div className="text-sm text-gray-400">Uploads Today</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {users.filter(u => u.lastLogin && 
                      Date.now() - u.lastLogin.getTime() < 60 * 60 * 1000
                    ).length}
                  </div>
                  <div className="text-sm text-gray-400">Active This Hour</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round((stats?.storageUsed || 0) / 100 * 100)}%
                  </div>
                  <div className="text-sm text-gray-400">Storage Usage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <p className="text-sm text-gray-400">
              Manage user accounts, roles, and permissions
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isOnline = user.lastLogin && 
                      (Date.now() - user.lastLogin.getTime()) < 30 * 60 * 1000; // 30 minutes
                    
                    return (
                      <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-white">{user.name}</div>
                            <div className="text-gray-400">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-500/20 text-purple-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {user.lastLogin 
                            ? formatDistanceToNow(user.lastLogin, { addSuffix: true })
                            : 'Never'
                          }
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              isOnline ? 'bg-green-400' : 'bg-gray-500'
                            }`} />
                            <span className={`text-xs ${
                              isOnline ? 'text-green-400' : 'text-gray-500'
                            }`}>
                              {isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'promote')}
                              title={user.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                            >
                              <Shield className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'block')}
                              title="Block user"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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

      {/* Activity Tab */}
      {selectedTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
            <p className="text-sm text-gray-400">
              Monitor user uploads and chart creation activity
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity.map((activity) => {
                const user = users.find(u => u.id === activity.userId);
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <BarChart3 className="w-8 h-8 text-blue-400" />
                      <div>
                        <h4 className="font-medium text-white">{activity.fileName}</h4>
                        <p className="text-sm text-gray-400">
                          {activity.chartType.charAt(0).toUpperCase() + activity.chartType.slice(1)} chart: {activity.xAxis} vs {activity.yAxis}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>By: {user?.name || 'Unknown User'}</span>
                          <span>{formatDistanceToNow(activity.uploadDate, { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info('View feature coming soon')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};