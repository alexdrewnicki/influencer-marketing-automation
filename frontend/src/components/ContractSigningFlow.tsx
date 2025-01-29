import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { contractService } from '../services/contractService';
import SignatureCanvas from 'react-signature-canvas';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface ContractSigningFlowProps {
  contractId: string;
  onComplete?: () => void;
}

const ContractSigningFlow: React.FC<ContractSigningFlowProps> = ({
  contractId,
  onComplete
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signature, setSignature] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [signatureRef, setSignatureRef] = useState<any>(null);
  const { handleError } = useErrorHandler();

  const steps = ['Review Contract', 'Accept Terms', 'Sign Contract'];

  useEffect(() => {
    loadContract();
  }, [contractId]);

  const loadContract = async () => {
    try {
      setLoading(true);
      const contractData = await contractService.getContractById(contractId);
      setContract(contractData);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const clearSignature = () => {
    signatureRef?.clear();
    setSignature(null);
  };

  const saveSignature = () => {
    if (signatureRef) {
      const signatureData = signatureRef.toDataURL();
      setSignature(signatureData);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await contractService.submitSignedContract(contractId, {
        signature,
        agreedToTerms: agreed,
        signedAt: new Date().toISOString()
      });
      onComplete?.();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Contract Details
            </Typography>
            <Box sx={{ 
              maxHeight: '400px', 
              overflow: 'auto', 
              whiteSpace: 'pre-wrap',
              bgcolor: 'grey.50',
              p: 2,
              borderRadius: 1
            }}>
              {contract?.content}
            </Box>
          </Paper>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Please review and accept the terms and conditions below
            </Alert>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
              }
              label="I have read and agree to the terms and conditions"
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>
              Please sign below:
            </Typography>
            <Paper 
              elevation={3} 
              sx={{ 
                border: '1px solid',
                borderColor: 'grey.300',
                bgcolor: 'white',
                mt: 1 
              }}
            >
              <SignatureCanvas
                ref={(ref) => setSignatureRef(ref)}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'signature-canvas'
                }}
              />
            </Paper>
            <Button onClick={clearSignature} sx={{ mt: 1 }}>
              Clear Signature
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Contract Signing Process
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!signature || loading}
            >
              Submit Contract
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 1 && !agreed}
            >
              Next
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContractSigningFlow;
