import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { contractService, ContractTemplate } from '../services/contractService';
import { useErrorHandler } from '../hooks/useErrorHandler';

const ContractTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<ContractTemplate>>({});
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

  const handleSave = async () => {
    try {
      if (editingTemplate.id) {
        // Update existing template
        await contractService.updateTemplate(editingTemplate.id, editingTemplate);
      } else {
        // Create new template
        await contractService.createTemplate(editingTemplate);
      }
      setIsDialogOpen(false);
      loadTemplates();
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await contractService.deleteTemplate(templateId);
        loadTemplates();
      } catch (error) {
        handleError(error);
      }
    }
  };

  const openEditDialog = (template?: ContractTemplate) => {
    setEditingTemplate(template || {});
    setIsDialogOpen(true);
  };

  const detectVariables = (template: string): string[] => {
    const matches = template.match(/\{\{([^}]+)\}\}/g) || [];
    return matches.map(match => match.replace(/[{}]/g, ''));
  };

  const handleTemplateContentChange = (content: string) => {
    const variables = detectVariables(content);
    setEditingTemplate(prev => ({
      ...prev,
      template: content,
      variables
    }));
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Contract Templates</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => openEditDialog()}
          >
            New Template
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2}>
              <List>
                {templates.map((template) => (
                  <ListItem
                    key={template.id}
                    button
                    selected={selectedTemplate?.id === template.id}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <ListItemText
                      primary={template.name}
                      secondary={`${template.variables.length} variables`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => openEditDialog(template)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete(template.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            {selectedTemplate && (
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedTemplate.name}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {selectedTemplate.variables.map((variable) => (
                    <Chip
                      key={variable}
                      label={variable}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    backgroundColor: 'grey.100',
                    p: 2,
                    borderRadius: 1
                  }}
                >
                  {selectedTemplate.template}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingTemplate.id ? 'Edit Template' : 'New Template'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Template Name"
              value={editingTemplate.name || ''}
              onChange={(e) => setEditingTemplate(prev => ({
                ...prev,
                name: e.target.value
              }))}
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={10}
              label="Template Content"
              value={editingTemplate.template || ''}
              onChange={(e) => handleTemplateContentChange(e.target.value)}
              helperText="Use {{variable}} syntax for dynamic content"
            />
            {editingTemplate.variables?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Detected Variables:
                </Typography>
                {editingTemplate.variables.map((variable) => (
                  <Chip
                    key={variable}
                    label={variable}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!editingTemplate.name || !editingTemplate.template}
            >
              Save Template
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ContractTemplateManager;
