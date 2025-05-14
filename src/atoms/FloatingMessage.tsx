import React from 'react';

interface FloatingMessageProps {
  content: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay?: number;
  duration?: number;
  className?: string;
}

const FloatingMessage: React.FC<FloatingMessageProps> = ({
  content,
  position,
  delay = 0,
  duration = 15,
  className = ''
}) => {
  const mobileAdjustedPosition = {
    ...position,
    left: position.left ? `max(5%, ${position.left})` : position.left,
    right: position.right ? `max(5%, ${position.right})` : position.right
  };

   const positionStyles = {
    ...mobileAdjustedPosition,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };

  return (
    <div 
      className={`absolute max-w-[150px] sm:max-w-xs p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg text-xs sm:text-sm animate-messageFloat z-10 ${className}`}
      style={positionStyles}
    >
      {content}
    </div>
  );
};

export default FloatingMessage;