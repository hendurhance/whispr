import { useState } from 'react';
import { Whispr } from '../types/whispr';

/**
 * Hook for managing whispr modal state
 */
export const useWhisprModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Whispr | null>(null);

  const openModal = (item: Whispr) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Optionally delay clearing the selected item to allow for exit animations
    setTimeout(() => {
      setSelectedItem(null);
    }, 300);
  };

  return {
    isOpen,
    selectedItem,
    openModal,
    closeModal
  };
};