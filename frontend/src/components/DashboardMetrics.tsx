import React from 'react';
import { Grid } from '@mui/material';
import MetricsChart from './charts/MetricsChart';
import DistributionChart from './charts/DistributionChart';
import MetricsBarChart from './charts/MetricsBarChart';

const DashboardMetrics: React.FC = () => {
  const timeSeriesData = [
    { date: '2024-01', views: 1000, engagement: 500, revenue: 5000 },
    { date: '2024-02', views: 1200, engagement: 600, revenue: 6000 },
    { date: '2024-03', views: 1500, engagement: 750, revenue: 7500 },
    // Add more data points...
  ];

  const distributionData = [
    { name: 'YouTube', value: 45, color: '#FF0000' },
    { name: 'Instagram', value: 30, color: '#E1306C' },
    { name: 'TikTok', value: 25, color: '#000000' },
  ];

  const performanceData = [
    { name: 'Jan', success: 85, failed: 15 },
    { name: 'Feb', success: 88, failed: 12 },
    { name: 'Mar', success: 92, failed: 8 },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MetricsChart
          title="Performance Overview"
          data={timeSeriesData}
          metrics={[
            { key: 'views', name: 'Views', color: '#8884d8' },
            { key: 'engagement', name: 'Engagement', color: '#82ca9d' },
            { key: 'revenue', name: 'Revenue', color: '#ffc658' },
          ]}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DistributionChart
          title="Platform Distribution"
          data={distributionData}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <MetricsBarChart
          title="Monthly Performance"
          data={performanceData}
          metrics={[
            { key: 'success', name: 'Successful', color: '#82ca9d' },
            { key: 'failed', name: 'Failed', color: '#ff8042' },
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardMetrics;
