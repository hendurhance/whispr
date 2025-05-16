import React, { useState } from 'react';
import { Whispr } from '../types/whispr';
import WhisprCard from './WhisprCard';
import EmptyState from '../atoms/EmptyState';

interface WhisprSwipeCardProps {
  whisprs: Whispr[];
  onView?: (whispr: Whispr) => void;
  onShare?: (whispr: Whispr) => void;
  onDelete?: (whisprId: string) => void;
  className?: string;
}

const WhisprSwipeCard: React.FC<WhisprSwipeCardProps> = ({ 
  whisprs, 
  onView,
  onShare,
  onDelete,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Empty state
  if (whisprs.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No whisprs yet"
        description="Share your unique link with friends to start receiving anonymous whisprs."
        action={
          <button className="px-4 py-2 bg-gradient-primary text-white rounded-lg">
            Share my link
          </button>
        }
      />
    );
  }
  
  const currentWhispr = whisprs[currentIndex];
  const totalWhisprs = whisprs.length;
  
  const handleNext = () => {
    if (currentIndex < totalWhisprs - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className="py-8">
        <WhisprCard
          whispr={currentWhispr}
          viewMode="card"
          onView={onView}
          onShare={onShare}
          onDelete={onDelete}
        />
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <button 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentIndex === 0 
              ? 'bg-overlay-light text-text-muted cursor-not-allowed' 
              : 'bg-background-card text-text-bright hover:bg-background-highlight'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-text-muted text-sm">
          {currentIndex + 1} of {totalWhisprs}
        </div>
        
        <button 
          onClick={handleNext}
          disabled={currentIndex === totalWhisprs - 1}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentIndex === totalWhisprs - 1 
              ? 'bg-overlay-light text-text-muted cursor-not-allowed' 
              : 'bg-background-card text-text-bright hover:bg-background-highlight'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WhisprSwipeCard;