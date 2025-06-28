import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, CircleNotch, Check } from 'phosphor-react-native';
import BrandULogo from '@/components/BrandULogo';
import BrandChart from '@/components/BrandChart';

interface KPIData {
  reach: number;
  visibility: number;
  growth: number;
  insights: string[];
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

interface ChartsData {
  kpiOverTime: ChartData;
  engagementTrend: ChartData;
  goalProgress: ChartData;
  monthlyGrowth: ChartData;
}

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [chartsData, setChartsData] = useState<ChartsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load KPI insights
      const insightsResponse = await fetch('/api/v1/dashboard/insights');
      if (insightsResponse.ok) {
        const insights = await insightsResponse.json();
        setKpiData(insights);
      }

      // Load action items
      const actionsResponse = await fetch('/api/v1/dashboard/actions');
      if (actionsResponse.ok) {
        const actions = await actionsResponse.json();
        setActionItems(actions);
      }

      // Load charts data
      const chartsResponse = await fetch('/api/v1/dashboard/charts');
      if (chartsResponse.ok) {
        const charts = await chartsResponse.json();
        setChartsData(charts);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const toggleActionItem = async (id: string) => {
    try {
      const item = actionItems.find(item => item.id === id);
      if (!item) return;

      const response = await fetch(`/api/v1/dashboard/actions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !item.completed }),
      });

      if (response.ok) {
        setActionItems(prev => 
          prev.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating action item:', error);
    }
  };

  const downloadReport = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/v1/dashboard/report');
      if (response.ok) {
        // In a real app, this would trigger a file download
        console.log('Report downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Centered Logo Header */}
      <View style={styles.logoHeader}>
        <BrandULogo size="small" />
      </View>

      {/* Greeting and Logout Section */}
      <View style={styles.greetingSection}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* KPI & Metrics Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Brand Metrics</Text>
        {kpiData ? (
          <>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{kpiData.reach.toLocaleString()}</Text>
                <Text style={styles.metricLabel}>Reach</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{kpiData.visibility}%</Text>
                <Text style={styles.metricLabel}>Visibility</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>+{kpiData.growth}%</Text>
                <Text style={styles.metricLabel}>Growth</Text>
              </View>
            </View>
            <View style={styles.insightsContainer}>
              <Text style={styles.insightsTitle}>Key Insights</Text>
              {kpiData.insights.map((insight, index) => (
                <Text key={index} style={styles.insightText}>• {insight}</Text>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading metrics...</Text>
        )}
      </View>

      {/* Charts Section */}
      {chartsData && (
        <>
          {/* Reach Over Time Chart */}
          <View style={styles.chartCard}>
            <BrandChart
              type="line"
              title="Reach Over Time"
              data={chartsData.kpiOverTime}
              showGoal={true}
              goalValue={15000}
              goalDate="Dec 2025"
            />
          </View>

          {/* Engagement Trend Chart */}
          <View style={styles.chartCard}>
            <BrandChart
              type="bar"
              title="Monthly Growth Rate"
              data={chartsData.monthlyGrowth}
            />
          </View>

          {/* Goal Progress Chart */}
          <View style={styles.chartCard}>
            <BrandChart
              type="line"
              title="Annual Goal Progress"
              data={chartsData.goalProgress}
              showGoal={true}
              goalValue={15000}
              goalDate="Q4 Target"
            />
          </View>
        </>
      )}

      {/* Action Items Checklist */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Action Items</Text>
        {actionItems.length > 0 ? (
          <View style={styles.actionsList}>
            {actionItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.actionItem}
                onPress={() => toggleActionItem(item.id)}
              >
                <View style={styles.actionContent}>
                  <View style={styles.checkboxContainer}>
                    {item.completed ? (
                      <CheckCircle size={24} color="#000000" weight="fill" />
                    ) : (
                      <CircleNotch size={24} color="#E5E5E5" weight="bold" />
                    )}
                  </View>
                  <View style={styles.actionText}>
                    <Text style={[
                      styles.actionTitle,
                      item.completed && styles.actionTitleCompleted
                    ]}>
                      {item.title}
                    </Text>
                    <Text style={styles.actionDescription}>{item.description}</Text>
                  </View>
                </View>
                <View style={[
                  styles.priorityBadge,
                  item.priority === 'high' ? styles.priorityHigh :
                  item.priority === 'medium' ? styles.priorityMedium :
                  styles.priorityLow
                ]}>
                  <Text style={styles.priorityText}>{item.priority}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.loadingText}>Loading action items...</Text>
        )}
      </View>

      {/* Download Report Button */}
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={downloadReport}
        disabled={isDownloading}
      >
        <Text style={styles.downloadButtonText}>
          {isDownloading ? 'Generating...' : 'Download Brand Report'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000000',
    marginTop: 4,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
  },
  chartCard: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000000',
    marginBottom: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  insightsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 20,
  },
  insightsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  actionsList: {
    gap: 16,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000000',
    marginBottom: 4,
  },
  actionTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#666666',
  },
  actionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 18,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 12,
  },
  priorityHigh: {
    backgroundColor: '#000000',
  },
  priorityMedium: {
    backgroundColor: '#666666',
  },
  priorityLow: {
    backgroundColor: '#CCCCCC',
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    marginHorizontal: 24,
    marginBottom: 100,
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  checkboxContainer: {
    marginRight: 12,
  },
});