import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = "", 
  onClick, 
  variant = "primary" 
}) => {
  const baseStyles = "px-5 py-3 rounded-full font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 justify-center";
  const variantStyles = variant === "primary"
    ? "bg-gradient-primary text-white hover:-translate-y-1 hover:shadow-glow"
    : "bg-background-card text-text hover:bg-background-highlight hover:-translate-y-1";
    
  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;