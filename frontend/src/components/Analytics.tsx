import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Button
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { analyticsService, AnalyticsData } from '../services/analyticsService';
import { useErrorHandler } from '../hooks/useErrorHandler';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getDashboardMetrics(timeframe);
      setAnalytics(data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      setLoading(true);
      const report = await analyticsService.generateReport({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        metrics: ['influencers', 'content', 'performance']
      });
      // Handle report download
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString()}.json`;
      a.click();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Analytics Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              label="Timeframe"
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleExportReport}>
            Export Report
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Influencer Metrics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Influencer Metrics
              </Typography>
              <Typography variant="h3">
                {analytics.influencerMetrics.totalInfluencers}
              </Typography>
              <Typography color="textSecondary">
                Total Influencers
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>
                  Active: {analytics.influencerMetrics.activeInfluencers}
                </Typography>
                <Typography>
                  Avg Engagement: {analytics.influencerMetrics.averageEngagementRate}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Content Metrics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Content Metrics
              </Typography>
              <Typography variant="h3">
                {analytics.contentMetrics.totalContent}
              </Typography>
              <Typography color="textSecondary">
                Total Content
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>
                  Pending Reviews: {analytics.contentMetrics.pendingReviews}
                </Typography>
                <Typography>
                  Approval Rate: {analytics.contentMetrics.approvalRate}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Typography variant="h3">
                {analytics.performanceMetrics.totalViews.toLocaleString()}
              </Typography>
              <Typography color="textSecondary">
                Total Views
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>
                  Avg Views/Content: {analytics.performanceMetrics.averageViewsPerContent.toLocaleString()}
                </Typography>
                <Typography>
                  Total Engagements: {analytics.performanceMetrics.totalEngagements.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Views Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.performanceMetrics.viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Content Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Content Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.contentMetrics.contentByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
