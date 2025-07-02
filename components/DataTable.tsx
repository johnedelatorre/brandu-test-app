'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import AdvancedDataTable from './AdvancedDataTable';

interface DataTableColumn {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'percentage';
  sortable?: boolean;
  filterable?: boolean;
}

interface DataTableProps {
  data: Record<string, any>[];
  columns: DataTableColumn[];
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export default function DataTable(props: DataTableProps) {
  return <AdvancedDataTable {...props} />;
} 