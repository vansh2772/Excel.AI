import React, { useState, useCallback } from 'react';
import { DataRow, DatasetInfo, AnalyticsData } from '../types';
import { calculateStatistics } from '../utils/dataProcessing';
import { processFile } from '../utils/fileProcessing';
import { db, storage } from '../services/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../services/firebase';

export interface UploadRecord {
  id?: string;
  userId: string;
  userEmail: string;
  fileName: string;
  fileSize: number;
  rows: number;
  columns: number;
  uploadDate: Date;
  storageUrl?: string;
  datasetId: string;
}

export const useDataStore = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const processedData = await processFile(file);
      if (!processedData || processedData.length === 0) throw new Error('No data found in file');

      const datasetId = `dataset_${Date.now()}`;
      const info: DatasetInfo = {
        id: datasetId,
        name: file.name,
        rows: processedData.length,
        columns: processedData.length > 0 ? Object.keys(processedData[0]).length : 0,
        size: file.size,
        uploadDate: new Date(),
        userId: auth.currentUser?.uid || 'anonymous',
      };

      const analyticsData = calculateStatistics(processedData);

      // Upload file to Firebase Storage
      let storageUrl = '';
      try {
        const uid = auth.currentUser?.uid || 'anonymous';
        const storageRef = ref(storage, `uploads/${uid}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        storageUrl = await getDownloadURL(snapshot.ref);
      } catch (storageErr) {
        console.warn('Storage upload failed (continuing without):', storageErr);
      }

      // Save metadata to Firestore
      try {
        const uploadRecord: Omit<UploadRecord, 'id'> = {
          userId: auth.currentUser?.uid || 'anonymous',
          userEmail: auth.currentUser?.email || '',
          fileName: file.name,
          fileSize: file.size,
          rows: processedData.length,
          columns: info.columns,
          uploadDate: new Date(),
          storageUrl,
          datasetId,
        };
        await addDoc(collection(db, 'uploads'), {
          ...uploadRecord,
          uploadDate: serverTimestamp(),
        });
      } catch (dbErr) {
        console.warn('Firestore save failed (continuing without):', dbErr);
      }

      // Cache locally
      try {
        localStorage.setItem('currentDataset', JSON.stringify({ data: processedData, info, analytics: analyticsData }));
      } catch { /* ignore */ }

      setData(processedData);
      setDatasetInfo(info);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData([]);
    setDatasetInfo(null);
    setAnalytics(null);
    setError(null);
    localStorage.removeItem('currentDataset');
  }, []);

  const getUserUploads = useCallback(async (): Promise<UploadRecord[]> => {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    const q = query(collection(db, 'uploads'), where('userId', '==', uid), orderBy('uploadDate', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as UploadRecord));
  }, []);

  return {
    data, datasetInfo, analytics, loading, error,
    loadFile, clearData, getUserUploads,
    hasData: data.length > 0 && !!datasetInfo && !!analytics,
    getDataSample: (n = 100) => data.slice(0, n),
    getColumnData: (col: string) => data.map(r => r[col]).filter(v => v !== null && v !== undefined),
  };
};