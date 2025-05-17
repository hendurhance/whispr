import React from 'react';
import { WhisprType, getWhisprTypeIcon, getWhisprTypeLabel } from '../types/whispr';

interface TypeBadgeProps {
  type: WhisprType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ 
  type, 
  className = '',
  size = 'md'
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };
  
  // Background and text color mapping for each type
  const colorMapping = {
    question: 'bg-accent-purple/10 text-accent-purple',
    compliment: 'bg-accent-green/10 text-accent-green',
    roast: 'bg-accent-red/10 text-accent-red',
    confession: 'bg-accent-blue/10 text-accent-blue',
    rumor: 'bg-accent-teal/10 text-accent-teal',
    suggestion: 'bg-accent-orange/10 text-accent-orange',
    secret: 'bg-accent-lime/10 text-accent-lime',
    hot_take: 'bg-accent-pink/10 text-accent-pink',
    dare: 'bg-accent-yellow/10 text-accent-yellow'
  };
  
  return (
    <div 
      className={`inline-flex items-center gap-1 rounded-full ${colorMapping[type]} ${sizeClasses[size]} ${className}`}
    >
      <span className="mr-0.5">{getWhisprTypeIcon(type)}</span>
      <span>{getWhisprTypeLabel(type)}</span>
    </div>
  );
};

export default TypeBadge;