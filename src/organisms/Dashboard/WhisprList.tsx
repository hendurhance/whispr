import React from 'react';
import { ViewMode, Whispr } from '../../types/whispr';
import EmptyState from '../../atoms/EmptyState';
import WhisprCard from '../../molecules/WhisprCard';

interface WhisprListProps {
  whisprs: Whispr[];
  viewMode: ViewMode;
  onView: (whispr: Whispr) => void;
  onShare: (whispr: Whispr) => void;
  onDelete: (whisprId: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
  totalWhisprs?: number; // Added prop to display correct total
}

const WhisprList: React.FC<WhisprListProps> = ({
  whisprs,
  viewMode,
  onView,
  onShare,
  onDelete,
  isLoading = false,
  searchTerm = '',
  totalWhisprs // Use this for the total count
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (whisprs.length === 0) {
    return (
      <EmptyState
        icon={searchTerm ? "🔍" : "📭"}
        title={searchTerm ? "No results found" : "No whisprs yet"}
        description={
          searchTerm 
            ? `No whisprs match your search for "${searchTerm}"`
            : "Share your unique link with friends to start receiving anonymous whisprs"
        }
        action={
          searchTerm ? (
            <button className="px-4 py-2 bg-gradient-primary text-white rounded-lg">
              Clear search
            </button>
          ) : (
            <button className="px-4 py-2 bg-gradient-primary text-white rounded-lg">
              Share my link
            </button>
          )
        }
      />
    );
  }

  // Display the correct total count at the top
  return (
    <div>
      <div className="text-text-muted text-sm mb-4">
        {whisprs.length} {whisprs.length === 1 ? 'whispr' : 'whisprs'}
        {searchTerm && ` matching "${searchTerm}"`}
        {whisprs.length !== totalWhisprs && totalWhisprs && ` (filtered from ${totalWhisprs} total)`}
      </div>
      
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
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
    </div>
  );
};

export default WhisprList;