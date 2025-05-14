import React, { ReactNode, useState } from 'react';

interface IconButtonProps {
  icon: ReactNode;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  altText?: string;
  className?: string;
  showAltText?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  children,
  variant = 'primary',
  onClick,
  altText = 'Coming Soon',
  showAltText = false,
  className = ''
}) => {
  const [showAlt, setShowAlt] = useState(showAltText);

  const baseStyles = "px-4 sm:px-5 py-3 rounded-full font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 justify-center";

  const variantStyles = variant === "primary"
    ? "bg-gradient-primary text-white hover:-translate-y-1 hover:shadow-glow active:translate-y-0"
    : "bg-background-card text-text hover:bg-background-highlight hover:-translate-y-1 active:translate-y-0";

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (!showAlt) {
      setShowAlt(true);
    }
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      onClick={handleClick}
    >
      <span className="flex items-center justify-center w-4 sm:w-5 h-4 sm:h-5">
        {icon}
      </span>
      <span>{showAlt ? altText : children}</span>
    </button>
  );
};

export default IconButton;