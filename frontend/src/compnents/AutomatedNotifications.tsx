import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import { notificationService } from '../services/notificationService';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface NotificationRule {
  id: string;
  event: string;
  template: string;
  enabled: boolean;
  delay?: number;
}

const AutomatedNotifications: React.FC = () => {
  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: '1',
      event: 'contract_pending',
      template: 'Your contract is waiting for signature. Please review and sign within {{days}} days.',
      enabled: true,
    },
    {
      id: '2',
      event: 'content_review',
      template: 'Your content has been reviewed. Status: {{status}}',
      enabled: true,
    },
    {
      id: '3',
      event: 'payment_processed',
      template: 'Payment of {{amount}} has been processed for your content.',
      enabled: true,
    },
  ]);

  const handleToggleRule = (ruleId: string) => {
    setRules(currentRules =>
      currentRules.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const handleTemplateChange = (ruleId: string, newTemplate: string) => {
    setRules(currentRules =>
      currentRules.map(rule =>
        rule.id === ruleId ? { ...rule, template: newTemplate } : rule
      )
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Automated Notifications
        </Typography>

        <List>
          {rules.map((rule) => (
            <React.Fragment key={rule.id}>
              <ListItem>
                <ListItemText
                  primary={rule.event.replace('_', ' ').toUpperCase()}
                  secondary={
                    <TextField
                      fullWidth
                      multiline
                      variant="outlined"
                      size="small"
                      value={rule.template}
                      onChange={(e) => handleTemplateChange(rule.id, e.target.value)}
                      margin="dense"
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={rule.enabled}
                    onChange={() => handleToggleRule(rule.id)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default AutomatedNotifications;
