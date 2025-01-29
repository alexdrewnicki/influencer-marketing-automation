import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { contractService, ContractTemplate } from '../services/contractService';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface ContractGeneratorProps {
  influencerId: string;
  onContractGenerated?: (contractId: string) => void;
}

const ContractGenerator: React.FC<ContractGeneratorProps> = ({
  influencerId,
  onContractGenerated
}) => {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const templatesData = await contractService.getTemplates();
      setTemplates(templatesData);
    } catch (error) {
      handleError(error);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    const newVariables: Record<string, string> = {};
    template?.variables.forEach(variable => {
      newVariables[variable] = '';
    });
    setVariables(newVariables);
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const contract = await contractService.generateContract(
        influencerId,
        selectedTemplate,
        variables
      );
      setSuccess(true);
      onContractGenerated?.(contract.id);
      
      // Auto-send contract after generation
      await contractService.sendContract(contract.id);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = () => {
    return selectedTemplate && Object.values(variables).every(v => v.trim() !== '');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Generate Contract
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Contract generated and sent successfully!
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Contract Template</InputLabel>
              <Select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value as string)}
                label="Contract Template"
              >
                {templates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedTemplate && Object.keys(variables).map((variable) => (
            <Grid item xs={12} key={variable}>
              <TextField
                fullWidth
                label={variable}
                value={variables[variable]}
                onChange={(e) => handleVariableChange(variable, e.target.value)}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={!isFormComplete() || loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Generate & Send Contract
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ContractGenerator;
