import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { validateFileType, validateFileSize } from '../utils/fileProcessing';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
  error?: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  loading, 
  error 
}) => {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      console.error('File rejected:', rejection.errors);
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Additional validation
      if (!validateFileType(file)) {
        console.error('Invalid file type');
        return;
      }
      
      if (!validateFileSize(file)) {
        console.error('File too large');
        return;
      }
      
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    isDragReject,
    fileRejections 
  } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB
    validator: (file) => {
      const errors = [];
      
      if (!validateFileType(file)) {
        errors.push({
          code: 'invalid-file-type',
          message: 'File type not supported'
        });
      }
      
      if (!validateFileSize(file)) {
        errors.push({
          code: 'file-too-large',
          message: 'File is too large'
        });
      }
      
      return errors.length > 0 ? errors : null;
    }
  });

  const getDropzoneClassName = () => {
    let baseClass = 'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ';
    
    if (isDragReject || error) {
      baseClass += 'border-red-500 bg-red-50';
    } else if (isDragActive) {
      baseClass += 'border-blue-500 bg-blue-50';
    } else {
      baseClass += 'border-gray-300 hover:border-gray-400 hover:bg-gray-50';
    }
    
    return baseClass;
  };

  const renderIcon = () => {
    if (loading) {
      return <LoadingSpinner size="lg" className="mx-auto text-blue-600" />;
    }
    
    if (isDragReject || error) {
      return <AlertCircle className="w-16 h-16 text-red-500" />;
    }
    
    if (isDragActive) {
      return <Upload className="w-16 h-16 text-blue-600" />;
    }
    
    return <FileSpreadsheet className="w-16 h-16 text-gray-400" />;
  };

  const renderMessage = () => {
    if (loading) {
      return (
        <div>
          <p className="text-lg font-medium text-gray-700">Processing your file...</p>
          <p className="text-sm text-gray-500">This may take a moment for large datasets</p>
        </div>
      );
    }
    
    if (isDragReject) {
      return (
        <div>
          <p className="text-lg font-medium text-red-700">Invalid file type</p>
          <p className="text-sm text-red-600">Please upload .xlsx, .xls, or .csv files only</p>
        </div>
      );
    }
    
    if (isDragActive) {
      return (
        <div>
          <p className="text-lg font-medium text-blue-700">Drop your file here</p>
          <p className="text-sm text-blue-600">Release to upload</p>
        </div>
      );
    }
    
    return (
      <div>
        <p className="text-lg font-medium text-gray-700">
          Drag & drop your Excel or CSV file here
        </p>
        <p className="text-sm text-gray-500 mt-1">
          or click to browse files
        </p>
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div {...getRootProps()} className={getDropzoneClassName()}>
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {renderIcon()}
          </div>
          
          {renderMessage()}
          
          <div className="text-xs text-gray-400">
            Supported formats: .xlsx, .xls, .csv (Max 100MB)
          </div>
          
          {/* File requirements */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Excel files (.xlsx, .xls)</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>CSV files (.csv)</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Up to 100,000 rows</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* File rejection errors */}
      {fileRejections.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Upload Error</p>
              {fileRejections.map((rejection, index) => (
                <div key={index} className="mt-1">
                  <p className="text-sm text-red-700">
                    File: {rejection.file.name}
                  </p>
                  <ul className="text-sm text-red-600 list-disc list-inside">
                    {rejection.errors.map((error, errorIndex) => (
                      <li key={errorIndex}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* General error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-800">Upload Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </Card>
  );
};