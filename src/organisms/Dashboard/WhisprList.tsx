import React from 'react';
import { ViewMode, Whispr } from '../../types/whispr';
import EmptyState from '../../atoms/EmptyState';
import WhisprCard from '../../molecules/WhisprCard';

interface WhisprListProps {
  whisprs: Whispr[];
  viewMode: ViewMode;
  onView?: (whispr: Whispr) => void;
  onShare?: (whispr: Whispr) => void;
  onDelete?: (whisprId: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
  className?: string;
}

const WhisprList: React.FC<WhisprListProps> = ({ 
  whisprs, 
  viewMode,
  onView,
  onShare,
  onDelete,
  isLoading = false,
  searchTerm = '',
  className = ''
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12">
          <svg className="animate-spin h-full w-full text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (whisprs.length === 0) {
    if (searchTerm) {
      return (
        <EmptyState
          icon="🔍"
          title="No results found"
          description={`No whisprs match your search for "${searchTerm}". Try different keywords or clear your search.`}
          action={
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg"
            >
              Clear search
            </button>
          }
        />
      );
    }
    
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
  
  // Card view
  if (viewMode === 'card') {
    return (
      <div className="py-4">
        {whisprs.map((whispr) => (
          <div key={whispr.id} className="mb-6">
            <WhisprCard
              whispr={whispr}
              viewMode={viewMode}
              onView={onView}
              onShare={onShare}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    );
  }
  
  // List view
  if (viewMode === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {whisprs.map((whispr) => (
          <WhisprCard
            key={whispr.id}
            whispr={whispr}
            viewMode={viewMode}
            onView={onView}
            onShare={onShare}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }
  
  // Grid view (default)
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {whisprs.map((whispr) => (
        <WhisprCard
          key={whispr.id}
          whispr={whispr}
          viewMode={viewMode}
          onView={onView}
          onShare={onShare}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default WhisprList;