import React from 'react';
import { WhisprType, getWhisprTypeIcon, getWhisprTypeColor, getWhisprTypeLabel } from '../types/whispr';

interface TypeBadgeProps {
  type: WhisprType;
  showLabel?: boolean;
  className?: string;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ 
  type, 
  showLabel = true,
  className = ''
}) => {
  const typeColor = getWhisprTypeColor(type);
  const typeIcon = getWhisprTypeIcon(type);

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-${typeColor}/10 text-${typeColor} ${className}`}>
      <span>{typeIcon}</span>
      {showLabel && (
        <span className="capitalize">{getWhisprTypeLabel(type)}</span>
      )}
    </span>
  );
};

export default TypeBadge;