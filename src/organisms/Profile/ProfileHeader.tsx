import React from 'react';

interface ProfileHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  title, 
  subtitle,
  className = '' 
}) => {
  return (
    <header className={`text-center py-6 ${className}`}>
      <h1 className="text-3xl font-bold text-text-bright mb-2">{title}</h1>
      {subtitle && <p className="text-text-muted">{subtitle}</p>}
    </header>
  );
};

export default ProfileHeader;