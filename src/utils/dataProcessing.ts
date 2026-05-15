import { DataRow, ColumnInfo, AnalyticsData } from '../types';

export const detectColumnType = (values: (string | number)[]): 'string' | 'number' | 'date' => {
  if (!values || values.length === 0) return 'string';
  
  const nonNullValues = values.filter(val => 
    val !== null && val !== undefined && val !== ''
  );
  
  if (nonNullValues.length === 0) return 'string';
  
  const numericValues = nonNullValues.filter(val => {
    const num = Number(val);
    return !isNaN(num) && isFinite(num);
  });
  
  if (numericValues.length / nonNullValues.length > 0.7) {
    return 'number';
  }
  
  const dateValues = nonNullValues.filter(val => {
    if (typeof val === 'string') {
      const date = new Date(val);
      return !isNaN(date.getTime()) && val.length > 4;
    }
    return false;
  });
  
  if (dateValues.length / nonNullValues.length > 0.7) {
    return 'date';
  }
  
  return 'string';
};

export const analyzeColumns = (data: DataRow[]): ColumnInfo[] => {
  if (!data || data.length === 0) return [];
  
  const columns = Object.keys(data[0] || {});
  
  return columns.map(columnName => {
    const values = data
      .map(row => row[columnName])
      .filter(val => val !== null && val !== undefined && val !== '');
    const type = detectColumnType(values);
    
    return {
      name: columnName,
      type,
      values
    };
  });
};

export const calculateStatistics = (data: DataRow[]): AnalyticsData => {
  if (!data || data.length === 0) {
    return {
      totalRows: 0,
      totalColumns: 0,
      numericColumns: [],
      stringColumns: [],
      summary: {}
    };
  }

  const columns = analyzeColumns(data);
  const numericColumns = columns.filter(col => col.type === 'number').map(col => col.name);
  const stringColumns = columns.filter(col => col.type === 'string').map(col => col.name);
  
  const summary: AnalyticsData['summary'] = {};
  
  columns.forEach(column => {
    try {
      if (column.type === 'number') {
        const numValues = column.values
          .map(val => Number(val))
          .filter(val => !isNaN(val) && isFinite(val));
        
        if (numValues.length > 0) {
          numValues.sort((a, b) => a - b);
          const sum = numValues.reduce((acc, val) => acc + val, 0);
          const mean = sum / numValues.length;
          const median = numValues.length % 2 === 0
            ? (numValues[Math.floor(numValues.length / 2) - 1] + numValues[Math.floor(numValues.length / 2)]) / 2
            : numValues[Math.floor(numValues.length / 2)];
          const variance = numValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numValues.length;
          const stdDev = Math.sqrt(variance);
          
          summary[column.name] = {
            mean: Math.round(mean * 100) / 100,
            median: Math.round(median * 100) / 100,
            min: numValues[0],
            max: numValues[numValues.length - 1],
            stdDev: Math.round(stdDev * 100) / 100
          };
        }
      } else {
        const nonEmptyValues = column.values.filter(val => val !== null && val !== undefined && val !== '');
        const uniqueValues = new Set(nonEmptyValues).size;
        const valueCount: { [key: string]: number } = {};
        
        nonEmptyValues.forEach(val => {
          const strVal = String(val);
          valueCount[strVal] = (valueCount[strVal] || 0) + 1;
        });
        
        const mode = Object.keys(valueCount).length > 0 
          ? Object.keys(valueCount).reduce((a, b) => 
              valueCount[a] > valueCount[b] ? a : b
            )
          : 'N/A';
        
        summary[column.name] = {
          mode,
          uniqueValues
        };
      }
    } catch (error) {
      console.error(`Error calculating statistics for column ${column.name}:`, error);
      summary[column.name] = {
        uniqueValues: 0
      };
    }
  });
  
  return {
    totalRows: data.length,
    totalColumns: columns.length,
    numericColumns,
    stringColumns,
    summary
  };
};

export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateChartData = (data: DataRow[], column: string, limit: number = 10) => {
  if (!data || data.length === 0 || !column) {
    return [];
  }

  const valueCount: { [key: string]: number } = {};
  
  data.forEach(row => {
    const value = row[column];
    const stringValue = value !== null && value !== undefined ? String(value) : 'Unknown';
    valueCount[stringValue] = (valueCount[stringValue] || 0) + 1;
  });
  
  return Object.entries(valueCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, value]) => ({ 
      name: name.length > 20 ? name.substring(0, 20) + '...' : name, 
      value 
    }));
};

export const validateData = (data: DataRow[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data || !Array.isArray(data)) {
    errors.push('Data must be an array');
    return { isValid: false, errors };
  }
  
  if (data.length === 0) {
    errors.push('Data array is empty');
    return { isValid: false, errors };
  }
  
  if (data.length > 100000) {
    errors.push('Dataset too large (max 100,000 rows)');
  }
  
  const firstRow = data[0];
  if (!firstRow || typeof firstRow !== 'object') {
    errors.push('Invalid data format');
    return { isValid: false, errors };
  }
  
  const columns = Object.keys(firstRow);
  if (columns.length === 0) {
    errors.push('No columns found in data');
  }
  
  if (columns.length > 100) {
    errors.push('Too many columns (max 100)');
  }
  
  return { isValid: errors.length === 0, errors };
};