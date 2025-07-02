'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, FileText, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface CSVUploadProps {
  onDataUpload: (data: { headers: string[]; rows: Record<string, any>[] }) => void;
}

export default function CSVUpload({ onDataUpload }: CSVUploadProps) {
  const [uploadedData, setUploadedData] = useState<{
    headers: string[];
    rows: Record<string, any>[];
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsProcessing(false);
        
        if (results.errors.length > 0) {
          toast.error('Error parsing CSV file');
          return;
        }

        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, any>[];

        if (rows.length === 0) {
          toast.error('No data found in CSV file');
          return;
        }

        setUploadedData({ headers, rows });
        onDataUpload({ headers, rows });
        toast.success(`Successfully uploaded ${rows.length} rows of data`);
      },
      error: (error) => {
        setIsProcessing(false);
        toast.error('Error reading CSV file');
        console.error('CSV parsing error:', error);
      },
    });
  }, [onDataUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    multiple: false,
  });

  const clearData = () => {
    setUploadedData(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop the CSV file here' : 'Upload CSV file'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Drag and drop a CSV file, or click to select
          </p>
        </div>
        {isProcessing && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-700 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Processing...</p>
          </div>
        )}
      </div>

      {/* Uploaded Data Preview */}
      {uploadedData && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-medium text-gray-900">
                Uploaded Data Preview
              </h3>
              <span className="badge badge-success">
                {uploadedData.rows.length} rows
              </span>
            </div>
            <button
              onClick={clearData}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear data"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Headers */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Columns:</h4>
            <div className="flex flex-wrap gap-2">
              {uploadedData.headers.map((header, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {header}
                </span>
              ))}
            </div>
          </div>

          {/* Sample Data */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Sample Data (first 5 rows):
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {uploadedData.headers.map((header, index) => (
                      <th
                        key={index}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploadedData.rows.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {uploadedData.headers.map((header, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                        >
                          {String(row[header] || '').substring(0, 50)}
                          {String(row[header] || '').length > 50 && '...'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2 text-sm text-green-600">
            <Check className="h-4 w-4" />
            <span>Data successfully uploaded and ready for analysis</span>
          </div>
        </div>
      )}
    </div>
  );
} 