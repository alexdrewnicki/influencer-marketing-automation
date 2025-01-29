import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Button,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  RemoveRedEye as ViewIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { contractService, Contract } from '../services/contractService';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface ContractTrackerProps {
  onViewContract?: (contractId: string) => void;
}

const ContractTracker: React.FC<ContractTrackerProps> = ({ onViewContract }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const loadContracts = async () => {
    try {
      setLoading(true);
      // In a real implementation, you might want to add pagination
      const response = await api.get('/contracts');
      setContracts(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
    // Set up real-time updates
    const interval = setInterval(loadContracts, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Contract['status']) => {
    const colors = {
      draft: 'default',
      sent: 'primary',
      signed: 'success',
      expired: 'error',
    };
    return colors[status];
  };

  const handleResend = async (contractId: string) => {
    try {
      await contractService.sendContract(contractId);
      loadContracts(); // Refresh the list
    } catch (error) {
      handleError(error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Contract Tracking</Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadContracts}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Influencer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.influencerId}</TableCell>
                  <TableCell>
                    <Chip
                      label={contract.status}
                      color={getStatusColor(contract.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(contract.createdAt)}</TableCell>
                  <TableCell>{contract.expiresAt ? formatDate(contract.expiresAt) : 'N/A'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Contract">
                        <IconButton
                          size="small"
                          onClick={() => onViewContract?.(contract.id)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {contract.status === 'sent' && (
                        <Tooltip title="Resend Contract">
                          <IconButton
                            size="small"
                            onClick={() => handleResend(contract.id)}
                          >
                            <SendIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ContractTracker;
