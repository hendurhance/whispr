import { useState, useMemo, useEffect } from 'react';
import { Whispr, WhisprType, SortOption, ViewMode } from '../types/whispr';

interface UseWhisprFilteringProps {
  whisprs: Whispr[];
  initialViewMode?: ViewMode;
  initialType?: WhisprType | 'all';
  initialSort?: SortOption['value'];
  initialSearch?: string;
}

export const useWhisprFiltering = ({
  whisprs,
  initialViewMode = 'grid',
  initialType = 'all',
  initialSort = 'newest',
  initialSearch = ''
}: UseWhisprFilteringProps) => {
  // State for filtering/sorting options
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [selectedType, setSelectedType] = useState<WhisprType | 'all'>(initialType);
  const [sortOption, setSortOption] = useState<SortOption['value']>(initialSort);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Calculate type counts from whisprs for filter options
  const typeOptions = useMemo(() => {
    // Count whisprs by type
    const typeCount = whisprs.reduce((acc, whispr) => {
      acc[whispr.type] = (acc[whispr.type] || 0) + 1;
      return acc;
    }, {} as Record<WhisprType, number>);
    
    // Create the array of type options with counts
    return [
      { type: 'all' as const, count: whisprs.length },
      ...Object.entries(typeCount).map(([type, count]) => ({
        type: type as WhisprType,
        count
      }))
    ];
  }, [whisprs]);

  // Apply filtering and sorting to whisprs
  const filteredWhisprs = useMemo(() => {
    let filtered = [...whisprs];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(whispr => whispr.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(whispr =>
        whispr.content.toLowerCase().includes(term)
      );
    }

    // Sort
    switch (sortOption) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'type':
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
      default:
        break;
    }

    return filtered;
  }, [whisprs, selectedType, sortOption, searchTerm]);

  // Reset filters when whisprs change significantly (optional)
  useEffect(() => {
    setSelectedType(initialType);
    setSearchTerm(initialSearch);
  }, [initialSearch, initialType, whisprs.length]);

  return {
    // Filtering state
    viewMode,
    setViewMode,
    selectedType,
    setSelectedType,
    sortOption,
    setSortOption,
    searchTerm,
    setSearchTerm,
    
    // Results
    filteredWhisprs,
    
    // Metadata for UI
    typeOptions,
    totalCount: whisprs.length,
    filteredCount: filteredWhisprs.length,
    
    // Helper methods
    resetFilters: () => {
      setSelectedType(initialType);
      setSearchTerm(initialSearch);
      setSortOption(initialSort);
    },
    
    isFiltered: searchTerm !== '' || selectedType !== 'all'
  };
};