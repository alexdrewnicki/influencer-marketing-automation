import React from 'react';
import {
  Paper,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export interface FilterConfig {
  id: string;
  type: 'text' | 'select' | 'date' | 'number';
  label: string;
  options?: { value: string; label: string }[];
}

export interface FilterValues {
  [key: string]: any;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onApply: () => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  values,
  onChange,
  onApply,
  onReset,
}) => {
  const handleChange = (id: string, value: any) => {
    onChange({ ...values, [id]: value });
  };

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={filter.label}
            value={values[filter.id] || ''}
            onChange={(e) => handleChange(filter.id, e.target.value)}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>{filter.label}</InputLabel>
            <Select
              value={values[filter.id] || ''}
              label={filter.label}
              onChange={(e) => handleChange(filter.id, e.target.value)}
            >
              {filter.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={filter.label}
              value={values[filter.id] || null}
              onChange={(date) => handleChange(filter.id, date)}
            />
          </LocalizationProvider>
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={filter.label}
            value={values[filter.id] || ''}
            onChange={(e) => handleChange(filter.id, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(values).filter(value => value !== null && value !== '').length;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filters
          {getActiveFiltersCount() > 0 && (
            <Chip
              label={`${getActiveFiltersCount()} active`}
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
      </Box>

      <Stack spacing={2}>
        {filters.map((filter) => (
          <Box key={filter.id}>
            {renderFilter(filter)}
          </Box>
        ))}

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="outlined" onClick={onReset}>
            Reset
          </Button>
          <Button variant="contained" onClick={onApply}>
            Apply Filters
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default FilterPanel;
