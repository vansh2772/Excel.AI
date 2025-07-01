import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDataStore } from '../hooks/useDataStore';
import { FileUpload } from '../components/FileUpload';
import { DataOverview } from '../components/DataOverview';
import { DataTable } from '../components/DataTable';
import { AdvancedDataVisualization } from '../components/charts/AdvancedDataVisualization';
import { AnalysisHistory } from '../components/history/AnalysisHistory';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { ChatBotToggle } from '../components/chat/ChatBotToggle';
import { DataContext } from '../services/aiService';
import { Button } from '../components/ui/Button';
import { RotateCcw, History, Shield } from 'lucide-react';
import { useState } from 'react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    data,
    datasetInfo,
    analytics,
    loading,
    error,
    loadFile,
    clearData
  } = useDataStore();

  const [activeTab, setActiveTab] = useState<'analysis' | 'history' | 'admin'>('analysis');

  const hasData = data.length > 0 && datasetInfo && analytics;
  const isAdmin = user?.role === 'admin';

  // Create data context for AI chatbot
  const dataContext: DataContext | undefined = hasData ? {
    data,
    analytics,
    fileName: datasetInfo.name
  } : undefined;

  const handleDataUploadedFromChat = (newDataContext: DataContext) => {
    // This would ideally update the main data store
    // For now, we'll show a success message
    console.log('Data uploaded from chat:', newDataContext);
  };

  const tabs = [
    { id: 'analysis', label: 'Data Analysis', icon: RotateCcw },
    { id: 'history', label: 'History', icon: History },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Shield }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isAdmin ? 'Admin Dashboard - Manage your platform' : 'Analyze your data with AI-powered insights and create stunning visualizations'}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'analysis' && (
          <>
            {!hasData ? (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Start Your AI-Powered Data Analysis
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Upload your Excel or CSV files to get instant AI insights, advanced visualizations, 
                    and intelligent chart recommendations powered by Excel.AI. You can also upload files directly in the chat!
                  </p>
                </div>
                <FileUpload 
                  onFileSelect={loadFile} 
                  loading={loading} 
                  error={error} 
                />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI-Enhanced Data Analysis</h2>
                    <p className="text-gray-600">Analyzing: {datasetInfo.name} • Excel.AI Assistant Available</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={clearData}
                    className="flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>New Analysis</span>
                  </Button>
                </div>

                <DataOverview 
                  datasetInfo={datasetInfo} 
                  analytics={analytics} 
                />

                <AdvancedDataVisualization
                  data={data}
                  numericColumns={analytics.numericColumns}
                  stringColumns={analytics.stringColumns}
                  dataContext={dataContext!}
                />

                <DataTable 
                  data={data} 
                  fileName={datasetInfo.name.split('.')[0]} 
                />
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && <AnalysisHistory />}
        
        {activeTab === 'admin' && isAdmin && <AdminDashboard />}
      </div>

      {/* Excel.AI Chatbot */}
      <ChatBotToggle 
        dataContext={dataContext} 
        onDataUploaded={handleDataUploadedFromChat}
      />
    </div>
  );
};