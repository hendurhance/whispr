import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  example?: string;
  is_coming_soon?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  example,
  is_coming_soon = false
}) => (
  <div className="bg-background-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-background-highlight hover:shadow-lg hover:shadow-primary/20 flex flex-col h-full items-center relative">
    {is_coming_soon && (
      <div className="absolute top-4 right-4 bg-primary/80 text-white text-xs font-medium px-2 py-1 rounded-full">
        ⏳ Coming Soon
      </div>
    )}
    <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center text-2xl mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-text-bright">{title}</h3>
    <p className="text-text-muted flex-grow">{description}</p>
    {example && (
      <div className="mt-4 w-full bg-background-darkest rounded-xl p-3 text-sm text-text-muted">
        "{example}"
      </div>
    )}
  </div>
);

export default FeatureCard;