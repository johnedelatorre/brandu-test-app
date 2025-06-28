import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryLine, VictoryBar, VictoryAxis, VictoryTheme, VictoryArea } from 'victory-native';

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
  const chartWidth = screenWidth - 72; // Account for card padding
  const chartHeight = 200;

  // Transform data for Victory charts
  const transformedData = data.labels.map((label, index) => ({
    x: label,
    y: data.datasets[0]?.data[index] || 0,
  }));

  // Goal line data if needed
  const goalData = showGoal && goalValue ? data.labels.map((label) => ({
    x: label,
    y: goalValue,
  })) : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showGoal && goalDate && (
          <Text style={styles.goalText}>Goal: {goalDate}</Text>
        )}
      </View>
      
      <View style={styles.chartContainer}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={chartWidth}
          height={chartHeight}
          padding={{ left: 60, top: 20, right: 40, bottom: 40 }}
          domainPadding={{ x: type === 'bar' ? 20 : 0 }}
        >
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${t}`}
            style={{
              axis: { stroke: '#E5E5E5' },
              tickLabels: { 
                fontSize: 12, 
                fill: '#666666',
                fontFamily: 'Inter-Regular'
              },
              grid: { stroke: '#E5E5E5', strokeWidth: 1 }
            }}
          />
          <VictoryAxis
            style={{
              axis: { stroke: '#E5E5E5' },
              tickLabels: { 
                fontSize: 12, 
                fill: '#666666',
                fontFamily: 'Inter-Regular'
              }
            }}
          />
          
          {type === 'line' ? (
            <>
              <VictoryArea
                data={transformedData}
                style={{
                  data: { 
                    fill: '#000000', 
                    fillOpacity: 0.1,
                    stroke: '#000000',
                    strokeWidth: 2
                  }
                }}
                animate={{
                  duration: 1000,
                  onLoad: { duration: 500 }
                }}
              />
              <VictoryLine
                data={transformedData}
                style={{
                  data: { 
                    stroke: '#000000',
                    strokeWidth: 2
                  }
                }}
                animate={{
                  duration: 1000,
                  onLoad: { duration: 500 }
                }}
              />
            </>
          ) : (
            <VictoryBar
              data={transformedData}
              style={{
                data: { 
                  fill: '#000000',
                  fillOpacity: 0.8
                }
              }}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 }
              }}
            />
          )}

          {/* Goal line */}
          {showGoal && goalValue && goalData.length > 0 && (
            <VictoryLine
              data={goalData}
              style={{
                data: { 
                  stroke: '#666666',
                  strokeWidth: 2,
                  strokeDasharray: '5,5'
                }
              }}
            />
          )}
        </VictoryChart>
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