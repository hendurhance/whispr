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
  const positionStyles = {
    ...position,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };

  return (
    <div 
      className={`absolute max-w-xs p-4 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg text-sm animate-messageFloat z-10 ${className}`}
      style={positionStyles}
    >
      {content}
    </div>
  );
};

export default FloatingMessage;