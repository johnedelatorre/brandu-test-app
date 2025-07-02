'use client';

import { useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import D3Chart, { D3ChartHandle } from '@/components/D3Chart';
import DataDetailDrawer from '@/components/DataDetailDrawer';
import { ChartData } from '@/types';
import { LineChart, BarChart3, Download } from 'lucide-react';

const analyticsData: ChartData[] = [
  { date: '2024-01-01', value: 12000, category: 'Revenue' },
  { date: '2024-01-02', value: 13500, category: 'Revenue' },
  { date: '2024-01-03', value: 11800, category: 'Revenue' },
  { date: '2024-01-04', value: 14200, category: 'Revenue' },
  { date: '2024-01-05', value: 15600, category: 'Revenue' },
  { date: '2024-01-06', value: 13800, category: 'Revenue' },
  { date: '2024-01-07', value: 16200, category: 'Revenue' },
  { date: '2024-01-08', value: 17500, category: 'Revenue' },
  { date: '2024-01-09', value: 16800, category: 'Revenue' },
  { date: '2024-01-10', value: 18200, category: 'Revenue' },
];

export default function AnalyticsPage() {
  const [chartType1, setChartType1] = useState<'line' | 'bar'>('line');
  const [chartType2, setChartType2] = useState<'line' | 'bar'>('line');
  const chartRef1 = useRef<D3ChartHandle>(null);
  const chartRef2 = useRef<D3ChartHandle>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ date: string; value: number; category?: string } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleDataPointClick = (dataPoint: { date: string; value: number; category?: string }) => {
    setSelectedDataPoint(dataPoint);
    // Small delay to ensure proper animation timing
    requestAnimationFrame(() => {
      setDrawerOpen(true);
    });
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedDataPoint(null), 300); // Clear data after animation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div
        className="transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? '5rem' : '16rem' }}
      >
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">
              Deep dive into your data with advanced analytics and insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Revenue Analytics</h2>
                <div className="flex items-center space-x-2">
                  <button
                    className={`p-2 rounded-md border ${chartType1 === 'line' ? 'bg-primary-100 border-primary-300 text-primary-700' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                    onClick={() => setChartType1('line')}
                    aria-label="Line chart"
                  >
                    <LineChart className="h-5 w-5" />
                  </button>
                  <button
                    className={`p-2 rounded-md border ${chartType1 === 'bar' ? 'bg-primary-100 border-primary-300 text-primary-700' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                    onClick={() => setChartType1('bar')}
                    aria-label="Bar chart"
                  >
                    <BarChart3 className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 rounded-md border bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
                    onClick={() => chartRef1.current?.downloadPng()}
                    aria-label="Download chart as PNG"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <D3Chart
                ref={chartRef1}
                data={analyticsData}
                height={400}
                chartType={chartType1}
                onDataPointClick={handleDataPointClick}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Cost Analysis</h2>
                <div className="flex items-center space-x-2">
                  <button
                    className={`p-2 rounded-md border ${chartType2 === 'line' ? 'bg-primary-100 border-primary-300 text-primary-700' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                    onClick={() => setChartType2('line')}
                    aria-label="Line chart"
                  >
                    <LineChart className="h-5 w-5" />
                  </button>
                  <button
                    className={`p-2 rounded-md border ${chartType2 === 'bar' ? 'bg-primary-100 border-primary-300 text-primary-700' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                    onClick={() => setChartType2('bar')}
                    aria-label="Bar chart"
                  >
                    <BarChart3 className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 rounded-md border bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
                    onClick={() => chartRef2.current?.downloadPng()}
                    aria-label="Download chart as PNG"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <D3Chart
                ref={chartRef2}
                data={analyticsData.map(d => ({ ...d, value: d.value * 0.8 }))}
                height={400}
                chartType={chartType2}
                onDataPointClick={handleDataPointClick}
              />
            </div>
          </div>
        </main>
      </div>
      
      {/* Data Detail Drawer */}
      <DataDetailDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        dataPoint={selectedDataPoint}
      />
    </div>
  );
} 