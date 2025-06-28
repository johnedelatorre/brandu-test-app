import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

interface BrandChartProps {
  type: 'line' | 'bar';
  title: string;
  data: ChartData;
  showGoal?: boolean;
  goalValue?: number;
  goalDate?: string;
}

export default function BrandChart({ 
  type, 
  title, 
  data, 
  showGoal = false, 
  goalValue, 
  goalDate 
}: BrandChartProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showGoal && goalDate && (
          <Text style={styles.goalText}>Goal: {goalDate}</Text>
        )}
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Chart Placeholder</Text>
          <Text style={styles.placeholderSubtext}>{type} chart for {title}</Text>
        </View>
      </View>

      {showGoal && goalValue && (
        <View style={styles.goalIndicator}>
          <View style={styles.goalLine} />
          <Text style={styles.goalLabel}>Target: {goalValue.toLocaleString()}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000000',
  },
  goalText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  chartContainer: {
    alignItems: 'center',
    paddingHorizontal: 0,
    height: 200,
    justifyContent: 'center',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  goalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 8,
  },
  goalLine: {
    width: 16,
    height: 2,
    backgroundColor: '#666666',
    marginRight: 8,
  },
  goalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
});