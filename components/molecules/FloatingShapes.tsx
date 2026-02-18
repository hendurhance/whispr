'use client';

import React from 'react';

export interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'blob' | 'orb';
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size: {
    width: string;
    height: string;
  };
  color: string;
  rotation?: number;
  delay?: number;
  duration?: number;
  blur?: string;
  opacity?: number;
}

interface FloatingShapesProps {
  shapes: Shape[];
  className?: string;
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({ shapes, className = '' }) => {
  const renderShape = (shape: Shape) => {
    const commonStyles: React.CSSProperties = {
      ...shape.position,
      width: shape.size.width,
      height: shape.size.height,
      animationDelay: `${shape.delay || 0}s`,
      animationDuration: `${shape.duration || 20}s`,
      transform: `rotate(${shape.rotation || 0}deg)`,
      filter: shape.blur ? `blur(${shape.blur})` : undefined,
      opacity: shape.opacity ?? 0.6
    };

    switch (shape.type) {
      case 'orb':
        return (
          <div
            key={shape.id}
            className={`absolute rounded-full animate-float-slow ${shape.color}`}
            style={{
              ...commonStyles,
              filter: `blur(${shape.blur || '60px'})`
            }}
          />
        );
      case 'rectangle':
        return (
          <div
            key={shape.id}
            className={`absolute rounded-xl animate-float-slow ${shape.color}`}
            style={commonStyles}
          />
        );
      case 'circle':
        return (
          <div
            key={shape.id}
            className={`absolute rounded-full animate-float-slow ${shape.color}`}
            style={commonStyles}
          />
        );
      case 'triangle':
        return (
          <div
            key={shape.id}
            className={`absolute animate-float-slow ${shape.color}`}
            style={{
              ...commonStyles,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
          />
        );
      case 'blob':
        return (
          <div
            key={shape.id}
            className={`absolute animate-float-slow ${shape.color}`}
            style={{
              ...commonStyles,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {shapes.map(renderShape)}
    </div>
  );
};

export default FloatingShapes;