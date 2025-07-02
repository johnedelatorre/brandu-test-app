'use client';

import AdvancedDataTable from './AdvancedDataTable';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ChartDataTableProps {
  data: Array<{ date: string; value: number; category?: string }>;
}

import type { AdvancedDataTableColumn } from './AdvancedDataTable';

const columns: AdvancedDataTableColumn[] = [
  { key: 'date', label: 'Date', type: 'date', sortable: true, filterable: true },
  { key: 'value', label: 'Revenue', type: 'currency', sortable: true, filterable: true },
  { key: 'change', label: 'Change', type: 'percentage', sortable: false, filterable: false },
  { key: 'category', label: 'Category', type: 'string', sortable: true, filterable: true },
];

export default function ChartDataTable({ data }: ChartDataTableProps) {
  // Calculate change for each row
  const tableData = data.map((row, index) => {
    const prevValue = index > 0 ? data[index - 1].value : row.value;
    const change = ((row.value - prevValue) / prevValue);
    return { ...row, change };
  });
  return (
    <AdvancedDataTable
      data={tableData}
      columns={columns}
      pageSize={20}
      searchable
      sortable
      filterable
      expandable
      downloadCsv
    />
  );
} 