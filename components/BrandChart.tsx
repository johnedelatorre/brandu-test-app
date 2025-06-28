import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

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
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: 0,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#000000',
      fill: '#FFFFFF',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#E5E5E5',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
    },
    fillShadowGradient: '#000000',
    fillShadowGradientOpacity: 0.1,
  };

  const chartWidth = screenWidth - 72; // Account for card padding

  // Add goal line data if needed
  const enhancedData = showGoal && goalValue ? {
    ...data,
    datasets: [
      ...data.datasets,
      {
        data: new Array(data.labels.length).fill(goalValue),
        color: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
        strokeWidth: 2,
        withDots: false,
      }
    ]
  } : data;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showGoal && goalDate && (
          <Text style={styles.goalText}>Goal: {goalDate}</Text>
        )}
      </View>
      
      <View style={styles.chartContainer}>
        {type === 'line' ? (
          <LineChart
            data={enhancedData}
            width={chartWidth}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
            transparent={true}
          />
        ) : (
          <BarChart
            data={data}
            width={chartWidth}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            withInnerLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            showBarTops={false}
            fromZero={true}
            transparent={true}
          />
        )}
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
  },
  chart: {
    marginVertical: 8,
    borderRadius: 0,
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
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
});