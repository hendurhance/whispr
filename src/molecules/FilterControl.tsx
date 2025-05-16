import React from 'react';
import { WhisprType, getWhisprTypeIcon, ViewMode, SortOption, getWhisprTypeLabel } from '../types/whispr';

interface FilterControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedType: WhisprType | 'all';
  setSelectedType: (type: WhisprType | 'all') => void;
  sortOption: SortOption['value'];
  setSortOption: (sort: SortOption['value']) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeOptions: Array<{type: WhisprType | 'all', count: number}>;
  isMobile?: boolean;
  className?: string;
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
  viewMode,
  setViewMode,
  selectedType,
  setSelectedType,
  sortOption,
  setSortOption,
  searchTerm,
  setSearchTerm,
  typeOptions,
  isMobile = false,
  className = ''
}) => {
  // View mode button active state class
  const getButtonClass = (mode: ViewMode) => {
    return viewMode === mode 
      ? 'bg-gradient-primary text-white' 
      : 'bg-background-highlight text-text-muted hover:text-text-bright';
  };
  
  // Mobile view mode button active state class
  const getMobileButtonClass = (mode: ViewMode) => {
    return viewMode === mode 
      ? 'bg-gradient-primary text-white' 
      : 'text-text-muted';
  };
  
  // For mobile, we need to format the type options differently
  const formattedTypeOptions = isMobile 
    ? [
        { type: 'all', count: typeOptions.reduce((sum, option) => sum + (option.type === 'all' ? 0 : option.count), 0) },
        ...typeOptions.filter(opt => opt.type !== 'all')
      ]
    : [
        { type: 'all', count: typeOptions.reduce((sum, option) => sum + (option.type === 'all' ? 0 : option.count), 0) },
        ...typeOptions.filter(opt => opt.type !== 'all')
      ];
  
  // Mobile view filter controls
  if (isMobile) {
    return (
      <div className={`p-3 border-b border-background-highlight space-y-3 ${className}`}>
        {/* Search Input */}
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
        
        {/* Type filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {formattedTypeOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => setSelectedType(option.type as WhisprType | 'all')}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap flex items-center gap-1 ${
                selectedType === option.type
                  ? 'bg-gradient-primary text-white'
                  : 'bg-background-highlight text-text-muted'
              }`}
            >
             {option.type === 'all' 
              ? <span>All</span> 
              : <span>{getWhisprTypeIcon(option.type as WhisprType)} {getWhisprTypeLabel(option.type as WhisprType)}</span>
            }
              <span className="bg-black/30 rounded-full px-1.5 min-w-[20px] text-center text-xs">
                {option.count}
              </span>
            </button>
          ))}
        </div>
        
        {/* Bottom Row - Count and Controls */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-text-muted">
            {typeOptions.reduce((sum, option) => 
              option.type === selectedType || selectedType === 'all' ? sum + option.count : sum, 0)
            } {typeOptions.reduce((sum, option) => 
              option.type === selectedType || selectedType === 'all' ? sum + option.count : sum, 0) === 1 
              ? 'whispr' 
              : 'whisprs'
            }
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sort dropdown */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption['value'])}
              className="bg-background-darkest border border-overlay-light text-text-bright text-xs rounded-lg py-1 px-2"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="type">By Type</option>
            </select>
            
            {/* View mode toggles - Limited options for mobile */}
            <div className="flex bg-background-darkest rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-md ${getMobileButtonClass('list')}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-1 rounded-md ${getMobileButtonClass('card')}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop view filter controls
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search whisprs..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background-darkest border border-overlay-light text-text-bright placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* View mode switches */}
        <div className="flex bg-background-darkest rounded-lg p-1 self-end gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-lg transition-colors ${getButtonClass('grid')}`}
            title="Grid View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-lg transition-colors ${getButtonClass('list')}`}
            title="List View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`px-3 py-2 rounded-lg transition-colors ${getButtonClass('card')}`}
            title="Card View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        
        {/* Sort dropdown */}
        <div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption['value'])}
            className="bg-background-darkest border border-overlay-light text-text-bright rounded-lg py-2 px-3 appearance-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="type">Group by Type</option>
          </select>
        </div>
      </div>
      
      {/* Type filters */}
      <div className="flex flex-wrap gap-2">
        {formattedTypeOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => setSelectedType(option.type as WhisprType | 'all')}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
              selectedType === option.type
                ? 'bg-gradient-primary text-white'
                : 'bg-background-highlight text-text-muted hover:text-text-bright'
            }`}
          >
            {option.type === 'all' 
              ? <span>All</span> 
              : <span>{getWhisprTypeIcon(option.type as WhisprType)} {getWhisprTypeLabel(option.type as WhisprType)}</span>
            }
            <span className="bg-black/30 rounded-full px-1.5 min-w-[20px] text-center">
              {option.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterControls;