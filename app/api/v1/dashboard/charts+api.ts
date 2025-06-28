export async function GET(request: Request) {
  try {
    // Mock chart data - in production, this would come from your analytics database
    const chartData = {
      kpiOverTime: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [8500, 9200, 10100, 11800, 12500, 13200]
        }]
      },
      engagementTrend: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          data: [65, 72, 78, 85]
        }]
      },
      goalProgress: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          data: [2500, 5200, 8100, 12500]
        }]
      },
      monthlyGrowth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [12, 18, 25, 32, 28, 35]
        }]
      }
    };

    return Response.json(chartData);
  } catch (error) {
    console.error('Dashboard charts API error:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}