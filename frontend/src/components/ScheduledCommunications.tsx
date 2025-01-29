import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { notificationService } from '../services/notificationService';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface ScheduledMessage {
  id: string;
  influencerId: string;
  influencerName: string;
  type: 'email' | 'notification';
  content: string;
  scheduledFor: string;
  recurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

const ScheduledCommunications: React.FC = () => {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Partial<ScheduledMessage>>({});
  const { handleError } = useErrorHandler();

  const handleSchedule = async () => {
    try {
      if (editingMessage.id) {
        // Update existing schedule
        await notificationService.updateScheduledNotification(
          editingMessage.id,
          editingMessage
        );
      } else {
        // Create new schedule
        await notificationService.scheduleReminder(
          editingMessage.influencerId!,
          {
            type: editingMessage.type!,
            message: editingMessage.content!,
            scheduledFor: editingMessage.scheduledFor!
          }
        );
      }
      setIsDialogOpen(false);
      loadScheduledMessages();
    } catch (error) {
      handleError(error);
    }
  };

  const loadScheduledMessages = async () => {
    try {
      const response = await notificationService.getScheduledNotifications();
      setMessages(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    loadScheduledMessages();
  }, []);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Scheduled Communications
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => {
              setEditingMessage({});
              setIsDialogOpen(true);
            }}
          >
            Schedule New
          </Button>
        </Box>

        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                mb: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {message.influencerName}
                    <Chip
                      label={message.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {message.recurring && (
                      <Chip
                        label={message.frequency}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2">{message.content}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Scheduled for: {new Date(message.scheduledFor).toLocaleString()}
                    </Typography>
                  </Box>
                }
              />
              <Box>
                <IconButton
                  onClick={() => {
                    setEditingMessage(message);
                    setIsDialogOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    // Handle delete
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>

        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingMessage.id ? 'Edit Scheduled Message' : 'Schedule New Message'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={editingMessage.type || ''}
                    onChange={(e) => setEditingMessage(prev => ({
                      ...prev,
                      type: e.target.value
                    }))}
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="notification">Notification</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message Content"
                  value={editingMessage.content || ''}
                  onChange={(e) => setEditingMessage(prev => ({
                    ...prev,
                    content: e.target.value
                  }))}
                />
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker
                  label="Schedule For"
                  value={editingMessage.scheduledFor || null}
                  onChange={(newValue) => setEditingMessage(prev => ({
                    ...prev,
                    scheduledFor: newValue
                  }))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSchedule} variant="contained">
              Schedule
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ScheduledCommunications;
