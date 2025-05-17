import React from 'react';
import { useNavigate } from 'react-router-dom';
import CTABlobs from './CTABlobs';
import Button from '../atoms/Button';

interface CTASectionProps {
  className?: string;
  title?: React.ReactNode;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
  showHighlight?: boolean;
}

/**
 * Call to Action section with animated blobs background
 */
const CTASection: React.FC<CTASectionProps> = ({ 
  className = '',
  title = 'Ready to Whispr?',
  description = 'Join thousands of users who are connecting authentically and anonymously. Cause chaos or spread love—the choice is yours.',
  buttonText = 'Get your free link',
  buttonAction,
  showHighlight = true
}) => {
  const navigate = useNavigate();

  // Default button action if none provided
  const handleClick = buttonAction || (() => navigate('/auth'));

  // Prepare the title with highlighting if needed
  const renderTitle = () => {
    if (!showHighlight || typeof title !== 'string') {
      return title;
    }
    
    // Handle the special case for "Whispr?" text
    if (title.includes('Whispr')) {
      const parts = title.split('Whispr');
      return (
        <>
          {parts[0]}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Whispr{parts[1]}
          </span>
        </>
      );
    }
    
    return title;
  };

  return (
    <div className="px-4 md:px-8 my-24">
      <section className={`py-24 px-4 md:px-16 text-center bg-background-lighter rounded-3xl relative overflow-hidden ${className}`}>
        {/* Use the CTABlobs component */}
        <CTABlobs />
        
        {/* Content with higher z-index to ensure it's above the shapes */}
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-text-bright">
            {renderTitle()}
          </h2>
          <p className="text-lg md:text-xl text-text-muted max-w-xl mx-auto mb-10">
            {description}
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Button
              variant="primary"
              className="px-8 py-4 text-lg shadow-glow"
              onClick={handleClick}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CTASection;