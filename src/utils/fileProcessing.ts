import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { DataRow } from '../types';
import { validateData } from './dataProcessing';

export const processExcelFile = (file: File): Promise<DataRow[]> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      reject(new Error('File too large. Maximum size is 100MB.'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          reject(new Error('No sheets found in Excel file'));
          return;
        }
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        if (!worksheet) {
          reject(new Error('Unable to read worksheet'));
          return;
        }
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          defval: null,
          raw: false,
          dateNF: 'yyyy-mm-dd'
        });
        
        const validation = validateData(jsonData as DataRow[]);
        if (!validation.isValid) {
          reject(new Error(`Data validation failed: ${validation.errors.join(', ')}`));
          return;
        }
        
        resolve(jsonData as DataRow[]);
      } catch (error) {
        console.error('Excel processing error:', error);
        reject(new Error('Failed to process Excel file. Please ensure it\'s a valid .xlsx or .xls file.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const processCSVFile = (file: File): Promise<DataRow[]> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      reject(new Error('File too large. Maximum size is 100MB.'));
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Clean up header names
        return header.trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
      },
      transform: (value) => {
        // Clean up values
        if (typeof value === 'string') {
          const trimmed = value.trim();
          // Try to convert to number if it looks like one
          if (trimmed !== '' && !isNaN(Number(trimmed))) {
            return Number(trimmed);
          }
          return trimmed === '' ? null : trimmed;
        }
        return value;
      },
      complete: (results) => {
        try {
          if (results.errors && results.errors.length > 0) {
            const criticalErrors = results.errors.filter(error => error.type === 'Delimiter');
            if (criticalErrors.length > 0) {
              reject(new Error('CSV parsing failed: Invalid delimiter or format'));
              return;
            }
          }
          
          if (!results.data || results.data.length === 0) {
            reject(new Error('No data found in CSV file'));
            return;
          }
          
          const validation = validateData(results.data as DataRow[]);
          if (!validation.isValid) {
            reject(new Error(`Data validation failed: ${validation.errors.join(', ')}`));
            return;
          }
          
          resolve(results.data as DataRow[]);
        } catch (error) {
          console.error('CSV processing error:', error);
          reject(new Error('Failed to process CSV data'));
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        reject(new Error('Failed to parse CSV file. Please ensure it\'s a valid CSV format.'));
      }
    });
  });
};

export const processFile = async (file: File): Promise<DataRow[]> => {
  if (!file) {
    throw new Error('No file provided');
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (!extension) {
    throw new Error('Unable to determine file type');
  }

  try {
    switch (extension) {
      case 'xlsx':
      case 'xls':
        return await processExcelFile(file);
      case 'csv':
        return await processCSVFile(file);
      default:
        throw new Error(`Unsupported file format: .${extension}. Please use .xlsx, .xls, or .csv files.`);
    }
  } catch (error) {
    console.error('File processing error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while processing file');
  }
};

export const exportToCSV = (data: DataRow[], filename: string) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const csv = Papa.unparse(data, {
      header: true,
      skipEmptyLines: true
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export CSV file');
  }
};

export const getFileInfo = (file: File) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified),
    extension: file.name.split('.').pop()?.toLowerCase() || ''
  };
};

export const validateFileType = (file: File): boolean => {
  const allowedExtensions = ['xlsx', 'xls', 'csv'];
  const extension = file.name.split('.').pop()?.toLowerCase();
  return allowedExtensions.includes(extension || '');
};

export const validateFileSize = (file: File, maxSizeMB: number = 100): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};