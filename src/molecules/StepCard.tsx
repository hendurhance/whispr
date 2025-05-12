import React from 'react';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <div className="bg-background-card rounded-2xl p-6 w-[300px] relative transition-all duration-300 hover:-translate-y-1 hover:bg-background-highlight hover:shadow-lg hover:shadow-primary/20">
    <div className="absolute -top-5 left-6 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center font-bold text-text-bright">
      {number}
    </div>
    <h3 className="mt-4 mb-3 text-lg font-semibold text-text-bright">{title}</h3>
    <p className="text-text-muted">{description}</p>
  </div>
);

export default StepCard;