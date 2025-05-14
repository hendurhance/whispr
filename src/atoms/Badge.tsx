import React from 'react';

interface BadgeProps {
  count: number;
  variant?: 'primary' | 'accent' | 'muted';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  count, 
  variant = 'primary',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center text-xs font-medium rounded-full px-2 min-w-[20px] h-5';
  
  const variantClasses = {
    primary: 'bg-gradient-primary text-white',
    accent: 'bg-accent-pink text-white',
    muted: 'bg-overlay-light text-text-muted'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {count}
    </span>
  );
};

export default Badge;