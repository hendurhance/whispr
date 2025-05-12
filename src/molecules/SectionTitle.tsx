import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle: string;
  highlight?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, highlight }) => (
  <div className="text-center mb-12">
    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-text-bright">
      {title} {highlight && (
        <span className="bg-gradient-primary bg-clip-text text-transparent">
          {highlight}
        </span>
      )}
    </h2>
    <p className="text-text-muted max-w-xl mx-auto text-lg">{subtitle}</p>
  </div>
);

export default SectionTitle;