import { useState, useMemo } from 'react';
import { Whispr, WhisprType, SortOption, ViewMode } from '@/types/whispr';

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
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [selectedType, setSelectedType] = useState<WhisprType | 'all'>(initialType);
  const [sortOption, setSortOption] = useState<SortOption['value']>(initialSort);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const typeOptions = useMemo(() => {
    const typeCount = whisprs.reduce((acc, whispr) => {
      acc[whispr.type] = (acc[whispr.type] || 0) + 1;
      return acc;
    }, {} as Record<WhisprType, number>);

    return [
      { type: 'all' as const, count: whisprs.length },
      ...Object.entries(typeCount).map(([type, count]) => ({
        type: type as WhisprType,
        count
      }))
    ];
  }, [whisprs]);

  const filteredWhisprs = useMemo(() => {
    let filtered = [...whisprs];

    // Filter by type — if the selected type no longer exists in the data, show all
    const typeStillExists = selectedType === 'all' || typeOptions.some(t => t.type === selectedType);
    const effectiveType = typeStillExists ? selectedType : 'all';

    if (effectiveType !== 'all') {
      filtered = filtered.filter(whispr => whispr.type === effectiveType);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(whispr =>
        whispr.content.toLowerCase().includes(term)
      );
    }

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
  }, [whisprs, selectedType, sortOption, searchTerm, typeOptions]);

  return {
    viewMode,
    setViewMode,
    selectedType,
    setSelectedType,
    sortOption,
    setSortOption,
    searchTerm,
    setSearchTerm,

    filteredWhisprs,
    typeOptions,
    totalCount: whisprs.length,
    filteredCount: filteredWhisprs.length,

    resetFilters: () => {
      setSelectedType(initialType);
      setSearchTerm(initialSearch);
      setSortOption(initialSort);
    },

    isFiltered: searchTerm !== '' || selectedType !== 'all'
  };
};
