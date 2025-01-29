import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tab,
  Tabs,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { notificationService } from '../services/notificationService';
import { AutomatedNotifications } from './AutomatedNotifications';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface Communication {
  id: string;
  influencerId: string;
  influencerName: string;
  type: 'email' | 'notification' | 'message';
  content: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const CommunicationDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadCommunications();
  }, []);

  const loadCommunications = async () => {
    try {
      setLoading(true);
      // In real implementation, fetch from API
      const mockData: Communication[] = [
        {
          id: '1',
          influencerId: '101',
          influencerName: 'John Doe',
          type: 'email',
          content: 'Contract ready for review',
          status: 'sent',
          timestamp: new Date().toISOString(),
        },
        // Add more mock data
      ];
      setCommunications(mockData);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      sent: 'primary',
      delivered: 'info',
      read: 'success',
    };
    return colors[status as keyof typeof colors];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <EmailIcon />;
      case 'notification':
        return <NotificationsIcon />;
      case 'message':
        return <MessageIcon />;
      default:
        return <MessageIcon />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Communication Dashboard
        </Typography>

        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab label="Recent Communications" />
          <Tab label="Scheduled" />
          <Tab label="Automation Rules" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <List>
            {communications.map((comm) => (
              <ListItem
                key={comm.id}
                sx={{
                  mb: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    {getTypeIcon(comm.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comm.influencerName}
                  secondary={
                    <Box>
                      <Typography variant="body2">{comm.content}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comm.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
                <Chip
                  label={comm.status}
                  color={getStatusColor(comm.status)}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography>Scheduled Communications</Typography>
          {/* Add scheduled communications list */}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AutomatedNotifications />
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default CommunicationDashboard;
