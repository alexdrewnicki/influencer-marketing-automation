import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { CloudUpload as UploadIcon, Send as SendIcon } from '@mui/icons-material';
import { contractService } from '../services/contractService';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface BulkInfluencer {
  id: string;
  name: string;
  email: string;
  selected: boolean;
  status?: string;
  error?: string;
}

const BulkContractOperations: React.FC = () => {
  const [influencers, setInfluencers] = useState<BulkInfluencer[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { handleError } = useErrorHandler();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        const parsedInfluencers: BulkInfluencer[] = lines.slice(1).map((line) => {
          const values = line.split(',');
          return {
            id: values[0],
            name: values[1],
            email: values[2],
            selected: true
          };
        });

        setInfluencers(parsedInfluencers);
      };
      reader.readAsText(file);
    } catch (error) {
      handleError(error);
    }
  };

  const handleBulkGenerate = async () => {
    try {
      setLoading(true);
      const selectedInfluencers = influencers.filter(inf => inf.selected);
      
      const contractData = selectedInfluencers.map(influencer => ({
        influencerId: influencer.id,
        templateId: selectedTemplate,
        variables: {
          influencerName: influencer.name,
          influencerEmail: influencer.email,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      }));

      const results = await contractService.bulkGenerateContracts(contractData);
      
      // Update status for each influencer
      setInfluencers(current => 
        current.map(inf => ({
          ...inf,
          status: results.find(r => r.influencerId === inf.id)?.status || 'error',
          error: results.find(r => r.influencerId === inf.id)?.error
        }))
      );

      setSuccess(true);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    setInfluencers(current =>
      current.map(inf => ({ ...inf, selected: checked }))
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Bulk Contract Operations
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Bulk contract generation completed successfully!
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="csv-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="csv-upload">
            <Button
              component="span"
              variant="outlined"
              startIcon={<UploadIcon />}
              sx={{ mr: 2 }}
            >
              Upload Influencer CSV
            </Button>
          </label>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Contract Template</InputLabel>
            <Select
              value={selectedTemplate}
              label="Contract Template"
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <MenuItem value="standard">Standard Contract</MenuItem>
              <MenuItem value="premium">Premium Contract</MenuItem>
              <MenuItem value="enterprise">Enterprise Contract</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {influencers.length > 0 && (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        checked={influencers.every(inf => inf.selected)}
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {influencers.map((influencer) => (
                    <TableRow key={influencer.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={influencer.selected}
                          onChange={(e) => {
                            setInfluencers(current =>
                              current.map(inf =>
                                inf.id === influencer.id
                                  ? { ...inf, selected: e.target.checked }
                                  : inf
                              )
                            );
                          }}
                        />
                      </TableCell>
                      <TableCell>{influencer.name}</TableCell>
                      <TableCell>{influencer.email}</TableCell>
                      <TableCell>
                        {influencer.status && (
                          <Alert severity={influencer.error ? 'error' : 'success'} sx={{ py: 0 }}>
                            {influencer.error || influencer.status}
                          </Alert>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                onClick={handleBulkGenerate}
                disabled={loading || !selectedTemplate || !influencers.some(inf => inf.selected)}
              >
                Generate Selected Contracts
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkContractOperations;
