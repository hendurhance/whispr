/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { ViewMode, Whispr, WhisprStats } from '../../types/whispr';
import WhisprCard from '../../molecules/WhisprCard';
import EmptyState from '../../atoms/EmptyState';
import MobileNavigationTabs from '../../molecules/MobileNavigationTabs';
import Badge from '../../atoms/Badge';

interface MobileWhisprViewProps {
  whisprs: Whispr[];
  stats: WhisprStats;
  displayName: string;
  avatarUrl?: string;
  onView: (whispr: Whispr) => void;
  onShare: (whispr: Whispr) => void;
  onDelete: (whisprId: string) => void;
  className?: string;
}

const MobileWhisprView: React.FC<MobileWhisprViewProps> = ({ 
  whisprs, 
  stats,
  displayName,
  avatarUrl,
  onView,
  onShare,
  onDelete,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWhisprs, setFilteredWhisprs] = useState<Whispr[]>(whisprs);
  
  // Generate type options from stats
  const typeOptions = [
    { type: 'all', count: stats.total },
    ...Object.entries(stats.byType).map(([type, count]) => ({
      type: type as any,
      count
    }))
  ];
  
  // Filter and sort whisprs
  useEffect(() => {
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
    
    setFilteredWhisprs(filtered);
  }, [whisprs, selectedType, sortOption, searchTerm]);
  
  return (
    <div className={`flex flex-col h-full bg-background-lighter ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-background-highlight bg-background-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-text-bright">{displayName}</div>
            <div className="text-xs text-text-muted flex items-center gap-1">
            {stats.unread > 0 ? (
                <>
                  <Badge count={stats.unread} variant="accent" className="text-[10px] h-4 min-w-[16px]" /> 
                  new whisprs
                </>
              ) : (
                'No new whisprs'
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="p-3 border-b border-background-highlight space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search whisprs..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-background-darkest border border-overlay-light text-text-bright placeholder-text-muted"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {typeOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => setSelectedType(option.type)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap flex items-center gap-1 ${
                selectedType === option.type
                  ? 'bg-gradient-primary text-white'
                  : 'bg-background-highlight text-text-muted'
              }`}
            >
              {option.type === 'all' ? 'All' : option.type}
              <span className="bg-black/30 rounded-full px-1.5 min-w-[20px] text-center text-xs">
                {option.count}
              </span>
            </button>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-text-muted">
            {filteredWhisprs.length} {filteredWhisprs.length === 1 ? 'whispr' : 'whisprs'}
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-background-darkest border border-overlay-light text-text-bright text-xs rounded-lg py-1 px-2"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="type">By Type</option>
            </select>
            
            <div className="flex bg-background-darkest rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-md ${viewMode === 'list' ? 'bg-gradient-primary text-white' : 'text-text-muted'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-1 rounded-md ${viewMode === 'card' ? 'bg-gradient-primary text-white' : 'text-text-muted'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredWhisprs.length > 0 ? (
          viewMode === 'card' ? (
            // Card View (one card at a time)
            <div className="h-full flex items-center justify-center">
              {filteredWhisprs.map((whispr, index) => (
                <div 
                  key={whispr.id} 
                  className={index === 0 ? 'block w-full' : 'hidden'}
                >
                  <WhisprCard
                    whispr={whispr}
                    viewMode="card"
                    onView={onView}
                    onShare={onShare}
                    onDelete={onDelete}
                  />
                  
                  <div className="mt-4 text-center text-text-muted text-sm">
                    1 of {filteredWhisprs.length}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-3">
              {filteredWhisprs.map((whispr) => (
                <WhisprCard
                  key={whispr.id}
                  whispr={whispr}
                  viewMode="list"
                  onView={onView}
                  onShare={onShare}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )
        ) : (
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
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-3 py-1.5 bg-gradient-primary text-white rounded-lg text-sm"
                >
                  Clear search
                </button>
              ) : (
                <button className="px-3 py-1.5 bg-gradient-primary text-white rounded-lg text-sm">
                  Share my link
                </button>
              )
            }
          />
        )}
      </div>
      
      {/* Navigation Tabs */}
      <MobileNavigationTabs unreadCount={stats.unread} />
    </div>
  );
};

export default MobileWhisprView;