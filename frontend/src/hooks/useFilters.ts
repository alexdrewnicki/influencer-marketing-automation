import { useState, useCallback, useMemo } from 'react';
import { FilterConfig, FilterValues } from '../components/filters/FilterPanel';

export function useFilters(config: FilterConfig[]) {
  const [filters, setFilters] = useState<FilterValues>({});
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});

  const resetFilters = useCallback(() => {
    setFilters({});
    setAppliedFilters({});
  }, []);

  const updateFilters = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
  }, [filters]);

  const filterData = useCallback(<T extends object>(data: T[]): T[] => {
    return data.filter(item => {
      return Object.entries(appliedFilters).every(([key, value]) => {
        if (!value) return true;
        
        const itemValue = (item as any)[key];
        
        if (value instanceof Date) {
          return new Date(itemValue).toDateString() === value.toDateString();
        }
        
        if (typeof value === 'string') {
          return itemValue.toString().toLowerCase().includes(value.toLowerCase());
        }
        
        return itemValue === value;
      });
    });
  }, [appliedFilters]);

  const activeFilters = useMemo(() => {
    return Object.entries(appliedFilters)
      .filter(([_, value]) => value !== null && value !== '')
      .map(([key, value]) => {
        const filterConfig = config.find(f => f.id === key);
        return {
          id: key,
          label: filterConfig?.label || key,
          value: value instanceof Date ? value.toLocaleDateString() : value
        };
      });
  }, [appliedFilters, config]);

  return {
    filters,
    appliedFilters,
    activeFilters,
    updateFilters,
    applyFilters,
    resetFilters,
    filterData
  };
}
