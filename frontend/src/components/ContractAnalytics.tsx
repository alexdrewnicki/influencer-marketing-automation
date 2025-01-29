import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { contractService } from '../services/contractService';
import { useErrorHandler } from '../hooks/useErrorHandler';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ContractStats {
  totalContracts: number;
  signedContracts: number;
  pendingContracts: number;
  averageSigningTime: number;
  statusDistribution: {
    name: string;
    value: number;
  }[];
  monthlyTrends: {
    month: string;
    sent: number;
    signed: number;
  }[];
}

const ContractAnalytics: React.FC = () => {
  const [stats, setStats] = useState<ContractStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();
useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const analyticsData = await contractService.getContractAnalytics();
      setStats(analyticsData);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Contract Analytics
        </Typography>

        <Grid container spacing={3}>
          {/* Key Metrics */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Contracts
                </Typography>
                <Typography variant="h4">
                  {stats.totalContracts}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
