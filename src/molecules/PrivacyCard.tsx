import React from 'react';

interface PrivacyCardProps {
  icon: string;
  title: string;
  description: string;
}

const PrivacyCard: React.FC<PrivacyCardProps> = ({ icon, title, description }) => (
  <div className="bg-background-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-background-highlight hover:shadow-lg hover:shadow-primary/20 text-left">
    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-xl mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-3 text-text-bright">{title}</h3>
    <p className="text-text-muted">{description}</p>
  </div>
);

export default PrivacyCard;