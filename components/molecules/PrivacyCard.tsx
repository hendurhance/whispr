'use client';

import React, { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface PrivacyCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const PrivacyCard: React.FC<PrivacyCardProps> = ({ icon, title, description }) => (
  <div className="bg-transparent border border-overlay-light rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 text-left relative">
    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent-green/20 flex items-center justify-center">
      <Check className="w-3.5 h-3.5 text-accent-green" />
    </div>
    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-3 text-text-bright">{title}</h3>
    <p className="text-text-muted">{description}</p>
  </div>
);

export default PrivacyCard;