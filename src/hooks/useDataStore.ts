import React, { useState, useCallback } from 'react';
import { DataRow, DatasetInfo, AnalyticsData } from '../types';
import { calculateStatistics } from '../utils/dataProcessing';
import { processFile } from '../utils/fileProcessing';

// Real data persistence service
class DataPersistenceService {
  private static instance: DataPersistenceService;
  private currentDataset: {
    data: DataRow[];
    info: DatasetInfo;
    analytics: AnalyticsData;
  } | null = null;

  static getInstance(): DataPersistenceService {
    if (!DataPersistenceService.instance) {
      DataPersistenceService.instance = new DataPersistenceService();
    }
    return DataPersistenceService.instance;
  }

  saveDataset(data: DataRow[], info: DatasetInfo, analytics: AnalyticsData) {
    this.currentDataset = { data, info, analytics };
    
    // In a real app, this would save to a backend or local storage
    try {
      const datasetKey = `dataset_${Date.now()}`;
      const datasetSummary = {
        id: datasetKey,
        name: info.name,
        rows: info.rows,
        columns: info.columns,
        uploadDate: info.uploadDate,
        analytics: {
          totalRows: analytics.totalRows,
          totalColumns: analytics.totalColumns,
          numericColumns: analytics.numericColumns,
          stringColumns: analytics.stringColumns
        }
      };
      
      // Save summary to localStorage for persistence
      const existingSummaries = JSON.parse(localStorage.getItem('datasetSummaries') || '[]');
      existingSummaries.unshift(datasetSummary);
      
      // Keep only last 10 summaries
      if (existingSummaries.length > 10) {
        existingSummaries.splice(10);
      }
      
      localStorage.setItem('datasetSummaries', JSON.stringify(existingSummaries));
      localStorage.setItem('currentDataset', JSON.stringify(this.currentDataset));
      
      console.log('Dataset saved successfully:', datasetKey);
    } catch (error) {
      console.error('Failed to save dataset:', error);
    }
  }

  getCurrentDataset() {
    if (this.currentDataset) {
      return this.currentDataset;
    }
    
    // Try to restore from localStorage
    try {
      const saved = localStorage.getItem('currentDataset');
      if (saved) {
        this.currentDataset = JSON.parse(saved);
        return this.currentDataset;
      }
    } catch (error) {
      console.error('Failed to restore dataset:', error);
    }
    
    return null;
  }

  clearCurrentDataset() {
    this.currentDataset = null;
    localStorage.removeItem('currentDataset');
  }

  getDatasetSummaries() {
    try {
      return JSON.parse(localStorage.getItem('datasetSummaries') || '[]');
    } catch (error) {
      console.error('Failed to get dataset summaries:', error);
      return [];
    }
  }
}

export const useDataStore = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistenceService = DataPersistenceService.getInstance();

  // Initialize with any existing dataset
  React.useEffect(() => {
    const existing = persistenceService.getCurrentDataset();
    if (existing) {
      setData(existing.data);
      setDatasetInfo(existing.info);
      setAnalytics(existing.analytics);
    }
  }, []);

  const loadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Processing file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      
      const processedData = await processFile(file);
      
      if (!processedData || processedData.length === 0) {
        throw new Error('No data found in file');
      }

      console.log(`Successfully processed ${processedData.length} rows`);
      
      const info: DatasetInfo = {
        id: `dataset_${Date.now()}`,
        name: file.name,
        rows: processedData.length,
        columns: processedData.length > 0 ? Object.keys(processedData[0]).length : 0,
        size: file.size,
        uploadDate: new Date(),
        userId: 'current-user'
      };
      
      console.log('Calculating analytics...');
      const analyticsData = calculateStatistics(processedData);
      console.log('Analytics calculated:', analyticsData);
      
      // Save to persistence service
      persistenceService.saveDataset(processedData, info, analyticsData);
      
      setData(processedData);
      setDatasetInfo(info);
      setAnalytics(analyticsData);
      
      console.log('Data store updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      console.error('File processing error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData([]);
    setDatasetInfo(null);
    setAnalytics(null);
    setError(null);
    persistenceService.clearCurrentDataset();
    console.log('Data store cleared');
  }, []);

  const updateData = useCallback((newData: DataRow[]) => {
    if (!datasetInfo) return;
    
    const updatedAnalytics = calculateStatistics(newData);
    const updatedInfo = {
      ...datasetInfo,
      rows: newData.length,
      columns: newData.length > 0 ? Object.keys(newData[0]).length : 0
    };
    
    persistenceService.saveDataset(newData, updatedInfo, updatedAnalytics);
    
    setData(newData);
    setDatasetInfo(updatedInfo);
    setAnalytics(updatedAnalytics);
  }, [datasetInfo]);

  const getDataSample = useCallback((sampleSize: number = 100) => {
    return data.slice(0, sampleSize);
  }, [data]);

  const getColumnData = useCallback((columnName: string) => {
    return data.map(row => row[columnName]).filter(val => val !== null && val !== undefined);
  }, [data]);

  const getDatasetSummaries = useCallback(() => {
    return persistenceService.getDatasetSummaries();
  }, []);

  return {
    data,
    datasetInfo,
    analytics,
    loading,
    error,
    loadFile,
    clearData,
    updateData,
    getDataSample,
    getColumnData,
    getDatasetSummaries,
    hasData: data.length > 0 && !!datasetInfo && !!analytics
  };
};