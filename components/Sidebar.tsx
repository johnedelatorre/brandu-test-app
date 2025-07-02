'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Settings,
  FileText,
  Users,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Insights', href: '/insights', icon: TrendingUp },
  { name: 'Data Table', href: '/data', icon: FileText },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          <div className="fixed inset-0 flex">
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-bold text-primary-700">BrandU</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          isActive
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={`mr-4 h-6 w-6 ${
                            isActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div
        className={`hidden lg:flex flex-col fixed inset-y-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
        style={{ minWidth: '5rem', width: collapsed ? '5rem' : '16rem' }}
      >
        <div className="flex flex-col min-h-0 flex-1">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 pt-5 pb-4`}>
            {!collapsed && (
              <div className="flex items-center">
                <h1 className={`text-xl font-bold text-primary-700 transition-all duration-300`}>BrandU</h1>
              </div>
            )}
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{ marginLeft: collapsed ? 0 : 'auto' }}
            >
              {collapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
            </button>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  <span className={`ml-3 transition-all duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
} 