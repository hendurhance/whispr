import React from 'react';

interface BlobProps {
  className?: string;
  size?: string;
  position?: string;
  color?: string;
  opacity?: number;
  animation?: string;
  animationDelay?: string;
  zIndex?: number;
  rotate?: number;
  customPath?: string;
}

/**
 * Decorative blob component for backgrounds
 */
const Blob: React.FC<BlobProps> = ({
  className = '',
  size = 'w-32 h-32',
  position = '',
  color = 'bg-gradient-primary',
  opacity = 0.9,
  animation = 'float 13s ease-in-out infinite',
  animationDelay = '0s',
  zIndex = 1,
  rotate = 0,
  customPath
}) => {
  // Determine if it's a rounded shape (circle, rounded square) or a custom path blob
  const isCustomShape = customPath !== undefined;
  
  const blobStyle = {
    animation,
    animationDelay,
    zIndex,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
    opacity
  };
  
  // Position classes from utility (if provided)
  const positionClasses = position || 'absolute';
  
  // For standard shapes (circle, rounded square)
  if (!isCustomShape) {
    return (
      <div
        className={`absolute ${positionClasses} ${size} ${color} ${className}`}
        style={blobStyle}
        aria-hidden="true"
      />
    );
  }
  
  // For custom path blobs
  return (
    <div 
      className={`absolute ${positionClasses} ${size} ${className}`}
      style={{
        ...blobStyle,
        borderRadius: customPath || '30% 70% 70% 30% / 30% 30% 70% 70%',
        background: color.startsWith('bg-') ? undefined : color
      }}
      aria-hidden="true"
    />
  );
};

export default Blob;