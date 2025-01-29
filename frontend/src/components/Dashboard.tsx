import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  LinearProgress
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardMetrics {
  totalInfluencers: number;
  activeVideos: number;
  pendingReviews: number;
  completionRate: number;
  monthlyStats: Array<{
    month: string;
    videos: number;
    approvalRate: number;
  }>;
}

const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalInfluencers: 0,
    activeVideos: 0,
    pendingReviews: 0,
    completionRate: 0,
    monthlyStats: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real implementation, fetch from your API
    const fetchDashboardData = async () => {
      try {
        // Simulated data for now
        setMetrics({
          totalInfluencers: 1000,
          activeVideos: 2000,
          pendingReviews: 150,
          completionRate: 85,
          monthlyStats: [
            { month: 'Jan', videos: 180, approvalRate: 88 },
            { month: 'Feb', videos: 200, approvalRate: 85 },
            { month: 'Mar', videos: 220, approvalRate: 90 },
            // Add more months...
          ]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Influencers
              </Typography>
              <Typography variant="h4">
                {metrics.totalInfluencers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Videos
              </Typography>
              <Typography variant="h4">
                {metrics.activeVideos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Reviews
              </Typography>
              <Typography variant="h4" color={metrics.pendingReviews > 200 ? 'error' : 'inherit'}>
                {metrics.pendingReviews}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completion Rate
              </Typography>
              <Typography variant="h4">
                {metrics.completionRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone"
                  dataKey="videos"
                  stroke="#8884d8"
                  name="Videos"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="approvalRate"
                  stroke="#82ca9d"
                  name="Approval Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
