import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';

interface ContentItem {
  id: string;
  influencerId: string;
  influencerName: string;
  title: string;
  type: 'video' | 'post' | 'story';
  status: string;
  currentStage: 'concept' | 'script' | 'video';
  content: string;
  aiAnalysis?: {
    score: number;
    feedback: string;
    brandSafetyCheck: boolean;
  };
  timeline: {
    conceptSubmitted?: Date;
    conceptReviewed?: Date;
    scriptSubmitted?: Date;
    scriptReviewed?: Date;
    videoSubmitted?: Date;
    videoReviewed?: Date;
  };
}

const ContentReview = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [processing, setProcessing] = useState(false);

  const steps = ['Concept Review', 'Script Review', 'Video Review'];

  useEffect(() => {
    // In real implementation, fetch from your API
    const fetchContent = async () => {
      try {
        // Simulated data
        const mockData: ContentItem[] = [
          {
            id: '1',
            influencerId: '101',
            influencerName: 'John Doe',
            title: 'Product Review Video',
            type: 'video',
            status: 'pending',
            currentStage: 'concept',
            content: 'Detailed product review concept...',
            timeline: {
              conceptSubmitted: new Date(),
            }
          },
          // Add more mock data...
        ];
        setContents(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error);
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleReview = async (approved: boolean) => {
    if (!selectedContent) return;
    
    setProcessing(true);
    try {
      // In real implementation, call your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Update content status
      const updatedContents = contents.map(content => {
        if (content.id === selectedContent.id) {
          return {
            ...content,
            status: approved ? 'approved' : 'rejected',
            currentStage: approved ? getNextStage(content.currentStage) : content.currentStage
          };
        }
        return content;
      });
      
      setContents(updatedContents);
      setFeedback('');
      setSelectedContent(null);
    } catch (error) {
      console.error('Error updating review:', error);
    }
    setProcessing(false);
  };

  const getNextStage = (currentStage: string): 'concept' | 'script' | 'video' => {
    const stageOrder: Record<string, 'concept' | 'script' | 'video'> = {
      concept: 'script',
      script: 'video',
      video: 'video'
    };
    return stageOrder[currentStage];
  };

  const getStepIndex = (stage: string): number => {
    const stageMap: Record<string, number> = {
      concept: 0,
      script: 1,
      video: 2
    };
    return stageMap[stage] || 0;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Content Review
      </Typography>

      <Grid container spacing={3}>
        {/* Content List */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Reviews
              </Typography>
              {contents.map((content) => (
                <Card
                  key={content.id}
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    bgcolor: selectedContent?.id === content.id ? 'action.selected' : 'background.paper'
                  }}
                  onClick={() => setSelectedContent(content)}
                >
                  <CardContent>
                    <Typography variant="subtitle1">
                      {content.title}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {content.influencerName}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={content.currentStage}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Review Panel */}
        <Grid item xs={12} md={8}>
          {selectedContent ? (
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {selectedContent.title}
                </Typography>
                
                <Stepper activeStep={getStepIndex(selectedContent.currentStage)} sx={{ my: 3 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Content
                </Typography>
                <Typography paragraph>
                  {selectedContent.content}
                </Typography>

                {selectedContent.aiAnalysis && (
                  <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      AI Analysis
                    </Typography>
                    <Typography color="textSecondary">
                      Score: {selectedContent.aiAnalysis.score}/10
                    </Typography>
                    <Typography color="textSecondary">
                      {selectedContent.aiAnalysis.feedback}
                    </Typography>
                  </Box>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  sx={{ my: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleReview(false)}
                    disabled={processing}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleReview(true)}
                    disabled={processing}
                  >
                    Approve
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Typography color="textSecondary" align="center">
                  Select content to review
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContentReview;
