'use client';

import React from 'react';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <div className="flex flex-col pt-5">
    <div className="bg-background-card rounded-2xl p-6 h-full relative transition-all duration-300 hover:-translate-y-1 hover:bg-background-highlight hover:shadow-lg hover:shadow-primary/20">
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center font-bold text-text-bright shadow-lg shadow-primary/30">
        {number}
      </div>
      <h3 className="mt-4 mb-3 text-lg font-semibold text-text-bright text-center">{title}</h3>
      <p className="text-text-muted text-sm text-center">{description}</p>
    </div>
  </div>
);

export default StepCard;