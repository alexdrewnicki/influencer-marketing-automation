import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

interface Influencer {
  id: string;
  name: string;
  channelName: string;
  status: 'pending' | 'active' | 'paused' | 'terminated';
  metrics: {
    subscribers: number;
    averageViews: number;
    engagementRate: number;
  };
  contentCount: number;
}

const InfluencerList = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real implementation, fetch from your API
    const fetchInfluencers = async () => {
      try {
        // Simulated data
        const mockData: Influencer[] = [
          {
            id: '1',
            name: 'John Doe',
            channelName: 'JohnDoeVlogs',
            status: 'active',
            metrics: {
              subscribers: 100000,
              averageViews: 25000,
              engagementRate: 8.5
            },
            contentCount: 15
          },
          // Add more mock data...
        ];
        setInfluencers(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching influencers:', error);
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, [page, rowsPerPage, searchTerm]);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      paused: 'info',
      terminated: 'error'
    };
    return colors[status as keyof typeof colors];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Influencers
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search influencers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Influencer Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Channel</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Subscribers</TableCell>
              <TableCell align="right">Avg Views</TableCell>
              <TableCell align="right">Engagement</TableCell>
              <TableCell align="right">Content</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {influencers.map((influencer) => (
              <TableRow key={influencer.id}>
                <TableCell>{influencer.name}</TableCell>
                <TableCell>{influencer.channelName}</TableCell>
                <TableCell>
                  <Chip
                    label={influencer.status}
                    color={getStatusColor(influencer.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {formatNumber(influencer.metrics.subscribers)}
                </TableCell>
                <TableCell align="right">
                  {formatNumber(influencer.metrics.averageViews)}
                </TableCell>
                <TableCell align="right">
                  {influencer.metrics.engagementRate}%
                </TableCell>
                <TableCell align="right">
                  {influencer.contentCount}
                </TableCell>
                <TableCell>
                  <IconButton size="small" title="View">
                    <ViewIcon />
                  </IconButton>
                  <IconButton size="small" title="Edit">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={100} // Replace with actual total count
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default InfluencerList;
