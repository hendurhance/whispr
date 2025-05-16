import React from 'react';
import { Whispr, formatDate, getWhisprTypeIcon } from '../types/whispr';
import TypeBadge from '../atoms/TypeBadge';

interface WhisprCardProps {
  whispr: Whispr;
  viewMode: 'grid' | 'list' | 'card';
  onView?: (whispr: Whispr) => void;  // Changed from onReply to onView
  onShare?: (whispr: Whispr) => void;
  onDelete?: (whisprId: string) => void;
  className?: string;
}

const WhisprCard: React.FC<WhisprCardProps> = ({ 
  whispr, 
  viewMode,
  onView,  // Changed from onReply to onView
  onShare,
  onDelete,
  className = ''
}) => {
  // Different layout based on view mode
  if (viewMode === 'list') {
    return (
      <div className={`p-4 bg-background-card rounded-xl border ${whispr.isRead ? 'border-overlay-light' : 'border-primary'} transition-all hover:shadow-sm ${className}`}>
        <div className="flex items-start gap-3">
          <div className="bg-background-darkest rounded-lg p-2 text-xl">
            {getWhisprTypeIcon(whispr.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <TypeBadge type={whispr.type} />
              <span className="text-xs text-text-muted">{formatDate(whispr.createdAt)}</span>
            </div>
            <p className="text-text-bright mb-3">{whispr.content}</p>
            <div className="flex gap-2">
              {onView && (
                <button 
                  onClick={() => onView(whispr)}
                  className="text-xs px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 transition-colors"
                >
                  View
                </button>
              )}
              {onShare && (
                <button 
                  onClick={() => onShare(whispr)}
                  className="text-xs px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors"
                >
                  Share
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={() => onDelete(whispr.id)}
                  className="text-xs px-3 py-1 rounded-full bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20 transition-colors ml-auto"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (viewMode === 'grid') {
    return (
      <div className={`p-4 bg-background-card rounded-xl border ${whispr.isRead ? 'border-overlay-light' : 'border-primary'} h-full flex flex-col transition-all hover:shadow-sm ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <TypeBadge type={whispr.type} />
          <span className="text-xs text-text-muted">{formatDate(whispr.createdAt)}</span>
        </div>
        <p className="text-text-bright mb-4 flex-1">{whispr.content}</p>
        <div className="flex gap-2 mt-auto">
          {onView && (
            <button 
              onClick={() => onView(whispr)}
              className="flex-1 text-xs px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 transition-colors"
            >
              View
            </button>
          )}
          {onShare && (
            <button 
              onClick={() => onShare(whispr)}
              className="flex-1 text-xs px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors"
            >
              Share
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(whispr.id)}
              className="text-xs px-2 py-1 rounded-full bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20 transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Card view (swipe card)
  return (
    <div className={`p-6 bg-background-card rounded-xl border ${whispr.isRead ? 'border-overlay-light' : 'border-primary'} flex flex-col shadow-md max-w-md mx-auto transition-all ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <TypeBadge type={whispr.type} />
        <span className="text-xs text-text-muted">{formatDate(whispr.createdAt)}</span>
      </div>
      <p className="text-text-bright text-lg mb-6 flex-1">{whispr.content}</p>
      <div className="flex gap-3 mt-auto">
        {onView && (
          <button 
            onClick={() => onView(whispr)}
            className="flex-1 py-2 rounded-lg bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 transition-colors"
          >
            View
          </button>
        )}
        {onShare && (
          <button 
            onClick={() => onShare(whispr)}
            className="flex-1 py-2 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors"
          >
            Share
          </button>
        )}
        {onDelete && (
          <button 
            onClick={() => onDelete(whispr.id)}
            className="py-2 px-3 rounded-lg bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default WhisprCard;