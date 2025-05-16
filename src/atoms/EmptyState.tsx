import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-text-bright mb-2">{title}</h3>
      <p className="text-text-muted mb-6 max-w-md">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;