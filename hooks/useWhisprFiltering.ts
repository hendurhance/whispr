import { useState, useMemo } from 'react';
import { Whispr, WhisprType } from '@/types/whispr';

interface UseWhisprFilteringProps {
  whisprs: Whispr[];
  initialType?: WhisprType | 'all';
  initialSearch?: string;
}

export const useWhisprFiltering = ({ whisprs, initialType = 'all', initialSearch = '' }: UseWhisprFilteringProps) => {
  const [selectedType, setSelectedType] = useState<WhisprType | 'all'>(initialType);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const filteredWhisprs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return whisprs.filter(
      (w) => (selectedType === 'all' || w.type === selectedType) && (!term || w.content.toLowerCase().includes(term)),
    );
  }, [whisprs, selectedType, searchTerm]);

  return {
    selectedType,
    setSelectedType,
    searchTerm,
    setSearchTerm,
    filteredWhisprs,
    isFiltered: searchTerm.trim() !== '' || selectedType !== 'all',
    resetFilters: () => {
      setSelectedType(initialType);
      setSearchTerm(initialSearch);
    },
  };
};
