'use client';

import Sidebar from '@/components/Sidebar';
import DataTable from '@/components/DataTable';

const userData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-10' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-09' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive', lastLogin: '2024-01-08' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-07' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-06' },
];

const userColumns = [
  { key: 'id', label: 'ID', type: 'number' as const, sortable: true },
  { key: 'name', label: 'Name', type: 'string' as const, sortable: true, filterable: true },
  { key: 'email', label: 'Email', type: 'string' as const, sortable: true, filterable: true },
  { key: 'role', label: 'Role', type: 'string' as const, sortable: true, filterable: true },
  { key: 'status', label: 'Status', type: 'string' as const, sortable: true, filterable: true },
  { key: 'lastLogin', label: 'Last Login', type: 'date' as const, sortable: true },
];

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:pl-64">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-2">
              Manage user accounts and permissions.
            </p>
          </div>

          <DataTable
            data={userData}
            columns={userColumns}
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