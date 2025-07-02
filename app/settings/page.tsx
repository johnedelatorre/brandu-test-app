'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Settings as SettingsIcon, Bell, Palette, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    insights: true,
    weekly: true
  });

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:pl-64">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Configure your dashboard preferences and account settings.
            </p>
          </div>

          <div className="max-w-4xl space-y-6">
            {/* Notifications */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="h-6 w-6 text-primary-700" />
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive browser notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Insight Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified about new insights</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.insights}
                      onChange={(e) => setNotifications(prev => ({ ...prev, insights: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <Palette className="h-6 w-6 text-primary-700" />
                <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="input-field"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-field"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-6 w-6 text-primary-700" />
                <h2 className="text-xl font-semibold text-gray-900">Data & Privacy</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Data Export</h3>
                    <p className="text-sm text-gray-500">Download your data</p>
                  </div>
                  <button className="btn-secondary">
                    Export Data
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
                    <p className="text-sm text-gray-500">Permanently delete your account</p>
                  </div>
                  <button className="btn-secondary text-red-600 hover:text-red-700">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Database */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="h-6 w-6 text-primary-700" />
                <h2 className="text-xl font-semibold text-gray-900">Database</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Database Status</h3>
                    <p className="text-sm text-gray-500">SQLite database is running</p>
                  </div>
                  <span className="badge badge-success">Connected</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Backup Database</h3>
                    <p className="text-sm text-gray-500">Create a backup of your data</p>
                  </div>
                  <button className="btn-secondary">
                    Backup Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 