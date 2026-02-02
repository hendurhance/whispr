'use client';

import React from 'react';

interface CTABlobsProps {
  className?: string;
}

/**
 */
const CTABlobs: React.FC<CTABlobsProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {/* Subtle gradient orb - top left */}
      <div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-float-slow"
        style={{ animationDuration: '25s' }}
      />

      {/* Subtle gradient orb - bottom right */}
      <div
        className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-secondary/15 blur-3xl animate-float-slow"
        style={{ animationDuration: '30s', animationDelay: '5s' }}
      />

      {/* Center subtle glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 rounded-full bg-accent-purple/10 blur-3xl"
      />
    </div>
  );
};

export default CTABlobs;