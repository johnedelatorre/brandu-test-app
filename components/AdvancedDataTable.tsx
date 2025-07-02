import React, { useState, useRef, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, Download, ChevronRight, ChevronDown as ChevronDownIcon, Move } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export interface AdvancedDataTableColumn {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'percentage';
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
}

interface AdvancedDataTableProps {
  data: Record<string, any>[];
  columns: AdvancedDataTableColumn[];
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  expandable?: boolean;
  downloadCsv?: boolean;
}

function downloadCSV(data: Record<string, any>[], columns: AdvancedDataTableColumn[], filename = 'table.csv') {
  const header = columns.map(col => col.label).join(',');
  const rows = data.map(row => columns.map(col => '"' + String(row[col.key] ?? '').replace(/"/g, '""') + '"').join(','));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdvancedDataTable({
  data,
  columns: initialColumns,
  pageSize = 10,
  searchable = true,
  sortable = true,
  filterable = true,
  expandable = true,
  downloadCsv = true,
}: AdvancedDataTableProps) {
  // State for column order and width
  const [columns, setColumns] = useState(initialColumns);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [draggedCol, setDraggedCol] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  // Column resizing
  const resizingCol = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = data;
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(row =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    return filtered;
  }, [data, searchTerm, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Column resizing handlers
  const handleResizeStart = (e: React.MouseEvent, key: string) => {
    resizingCol.current = key;
    startX.current = e.clientX;
    startWidth.current = columnWidths[key] || 160;
    document.addEventListener('mousemove', handleResizing);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  const handleResizing = (e: MouseEvent) => {
    if (!resizingCol.current) return;
    const delta = e.clientX - startX.current;
    setColumnWidths(widths => ({
      ...widths,
      [resizingCol.current!]: Math.max(80, startWidth.current + delta),
    }));
  };
  const handleResizeEnd = () => {
    resizingCol.current = null;
    document.removeEventListener('mousemove', handleResizing);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  // Column drag-and-drop handlers
  const handleDragStart = (key: string) => setDraggedCol(key);
  const handleDragOver = (key: string) => setDragOverCol(key);
  const handleDrop = (key: string) => {
    if (!draggedCol || draggedCol === key) return;
    const fromIdx = columns.findIndex(col => col.key === draggedCol);
    const toIdx = columns.findIndex(col => col.key === key);
    const newCols = [...columns];
    const [moved] = newCols.splice(fromIdx, 1);
    newCols.splice(toIdx, 0, moved);
    setColumns(newCols);
    setDraggedCol(null);
    setDragOverCol(null);
  };

  // Sorting
  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Expandable rows
  const toggleRow = (idx: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) newSet.delete(idx);
      else newSet.add(idx);
      return newSet;
    });
  };

  // Format cell value
  const formatCellValue = (value: any, type: string) => {
    switch (type) {
      case 'currency':
        return formatCurrency(Number(value) || 0);
      case 'percentage':
        return `${(Number(value) * 100).toFixed(1)}%`;
      case 'date':
        return formatDate(value);
      case 'number':
        return Number(value).toLocaleString();
      default:
        return String(value);
    }
  };

  // Mock insights for expandable rows
  const getRowInsights = (row: Record<string, any>) => [
    `Insight: ${row[columns[0].key]} is trending positively!`,
    `Note: ${columns[1] ? row[columns[1].key] : ''} is above average.`
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        {searchable && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        )}
        {downloadCsv && (
          <button
            className="btn-primary flex items-center space-x-2"
            onClick={() => downloadCSV(sortedData, columns)}
          >
            <Download className="h-4 w-4" />
            <span>Download CSV</span>
          </button>
        )}
      </div>
      {filterable && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {columns.filter(col => col.filterable).map(column => (
            <div key={column.key} className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Filter ${column.label}...`}
                value={filters[column.key] || ''}
                onChange={e => setFilters(prev => ({ ...prev, [column.key]: e.target.value }))}
                className="input-field pl-10"
              />
            </div>
          ))}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 select-none">
            <tr>
              {expandable && <th className="w-8"></th>}
              {columns.map((column, colIdx) => (
                <th
                  key={column.key}
                  style={{ width: columnWidths[column.key] || column.width || 160, minWidth: 80 }}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group relative select-none ${column.sortable && sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                  draggable
                  onDragStart={() => handleDragStart(column.key)}
                  onDragOver={e => { e.preventDefault(); handleDragOver(column.key); }}
                  onDrop={() => handleDrop(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <Move className="h-3 w-3 text-gray-300 group-hover:text-primary-400 cursor-move mr-1" />
                    <span>{column.label}</span>
                    {column.sortable && sortable && sortColumn === column.key && (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    )}
                  </div>
                  {/* Resize handle */}
                  <div
                    className="absolute right-0 top-0 h-full w-2 cursor-col-resize z-10"
                    onMouseDown={e => handleResizeStart(e, column.key)}
                  />
                  {/* Drag over highlight */}
                  {dragOverCol === column.key && (
                    <div className="absolute inset-0 bg-primary-100 opacity-30 pointer-events-none transition-all" />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  {expandable && (
                    <td className="text-center align-middle">
                      <button
                        className="focus:outline-none"
                        onClick={() => toggleRow(rowIdx + (currentPage - 1) * pageSize)}
                        aria-label="Expand row"
                      >
                        {expandedRows.has(rowIdx + (currentPage - 1) * pageSize) ? (
                          <ChevronDownIcon className="h-4 w-4 text-primary-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                  )}
                  {columns.map(column => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      style={{ width: columnWidths[column.key] || column.width || 160, minWidth: 80 }}
                    >
                      {formatCellValue(row[column.key], column.type)}
                    </td>
                  ))}
                </tr>
                {/* Expandable row content */}
                {expandable && expandedRows.has(rowIdx + (currentPage - 1) * pageSize) && (
                  <tr className="bg-primary-50">
                    <td colSpan={columns.length + 1} className="px-8 py-4 text-sm text-primary-900 animate-fade-in">
                      <div className="font-semibold mb-2">Insights</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {getRowInsights(row).map((insight, i) => (
                          <li key={i}>{insight}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * pageSize) + 1} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
          {sortedData.length} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 