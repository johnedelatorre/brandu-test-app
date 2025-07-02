'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DataTable from '@/components/DataTable';
import CSVUpload from '@/components/CSVUpload';

const initialData = [
  { id: 1, name: 'Product A', sales: 12500, revenue: 125000, date: '2024-01-10', category: 'Electronics' },
  { id: 2, name: 'Product B', sales: 8900, revenue: 89000, date: '2024-01-09', category: 'Clothing' },
  { id: 3, name: 'Product C', sales: 15600, revenue: 156000, date: '2024-01-08', category: 'Electronics' },
  { id: 4, name: 'Product D', sales: 7200, revenue: 72000, date: '2024-01-07', category: 'Home' },
  { id: 5, name: 'Product E', sales: 11300, revenue: 113000, date: '2024-01-06', category: 'Electronics' },
  { id: 6, name: 'Product F', sales: 9800, revenue: 98000, date: '2024-01-05', category: 'Clothing' },
  { id: 7, name: 'Product G', sales: 13400, revenue: 134000, date: '2024-01-04', category: 'Home' },
  { id: 8, name: 'Product H', sales: 6700, revenue: 67000, date: '2024-01-03', category: 'Electronics' },
];

const tableColumns = [
  { key: 'id', label: 'ID', type: 'number' as const, sortable: true },
  { key: 'name', label: 'Product Name', type: 'string' as const, sortable: true, filterable: true },
  { key: 'category', label: 'Category', type: 'string' as const, sortable: true, filterable: true },
  { key: 'sales', label: 'Sales', type: 'number' as const, sortable: true },
  { key: 'revenue', label: 'Revenue', type: 'currency' as const, sortable: true },
  { key: 'date', label: 'Date', type: 'date' as const, sortable: true },
];

export default function DataPage() {
  const [currentData, setCurrentData] = useState(initialData);
  const [showCSVUpload, setShowCSVUpload] = useState(false);

  const handleDataUpload = (data: { headers: string[]; rows: Record<string, any>[] }) => {
    const transformedData = data.rows.map((row, index) => ({
      id: index + 1,
      name: row.name || `Product ${index + 1}`,
      category: row.category || 'Uncategorized',
      sales: Number(row.sales) || 0,
      revenue: Number(row.revenue) || 0,
      date: row.date || new Date().toISOString().split('T')[0],
      ...row
    }));
    setCurrentData(transformedData);
    setShowCSVUpload(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:pl-64">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
            <p className="text-gray-600 mt-2">
              Upload, view, and analyze your data with powerful filtering and sorting capabilities.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Data Table</h2>
                <p className="text-gray-600 mt-1">
                  {currentData.length} records loaded
                </p>
              </div>
              <button
                onClick={() => setShowCSVUpload(!showCSVUpload)}
                className="btn-primary"
              >
                {showCSVUpload ? 'Cancel Upload' : 'Upload CSV'}
              </button>
            </div>
          </div>

          {showCSVUpload && (
            <div className="mb-6">
              <CSVUpload onDataUpload={handleDataUpload} />
            </div>
          )}

          <DataTable
            data={currentData}
            columns={tableColumns}
            pageSize={10}
            searchable={true}
            sortable={true}
            filterable={true}
          />
        </main>
      </div>
    </div>
  );
} 