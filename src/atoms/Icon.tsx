import React from 'react';

interface IconProps {
  children: React.ReactNode;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ children, className = "" }) => (
  <span className={`text-2xl ${className}`}>{children}</span>
);

export default Icon;