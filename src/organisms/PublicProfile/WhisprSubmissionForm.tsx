import React from 'react';
import { getWhisprTypeIcon, getWhisprTypeLabel, Whispr } from '../../types/whispr';
import { useWhisprSubmission } from '../../hooks/useWhisprSubmission';

interface WhisprSubmissionFormProps {
  username: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  submitWhispr?: (username: string, content: string, type: string) => Promise<Whispr> | void;
}

const WhisprSubmissionForm: React.FC<WhisprSubmissionFormProps> = ({
  username,
  onSuccess,
  onError,
  className = '',
  submitWhispr
}) => {
  const {
    content,
    selectedType,
    setSelectedType,
    isSubmitting,
    charCount,
    isDiceRolling,
    isMobile,
    typeScrollContainerRef,
    handleContentChange,
    generateSuggestion,
    handleSubmit,
    whisprTypes,
    maxChars
  } = useWhisprSubmission({
    username,
    onSuccess,
    onError,
    customSubmitFunction: submitWhispr
  });

  // Extract style classes from className prop
  const borderColor = className.includes('border-') 
    ? className.split('border-')[1].split(' ')[0] 
    : 'overlay-light';
    
  const backgroundColor = className.includes('bg-') 
    ? className.split('bg-')[1].split(' ')[0] 
    : 'background-darkest';

  return (
    <div className={`bg-background-card rounded-xl border border-overlay-light p-4 ${className}`}>
      <h2 className="text-lg font-semibold text-text-bright mb-4">
        Send an anonymous whispr to @{username}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Type selection - Horizontally scrollable only on mobile */}
        <div className="mb-4">
          <label className="block text-text-muted text-sm mb-2">
            Select type
          </label>
          <div
            ref={typeScrollContainerRef}
            className={`flex gap-2 ${isMobile ? 'overflow-x-auto pb-2 scrollbar-hide snap-x' : 'flex-wrap'}`}
            role="radiogroup"
            aria-label="Message type"
          >
            {whisprTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors whitespace-nowrap ${
                  isMobile ? 'flex-shrink-0 snap-start' : 'mb-2'
                } ${
                  selectedType === type
                    ? 'bg-gradient-primary text-white'
                    : `bg-${backgroundColor} text-text-muted hover:text-text-bright border border-${borderColor} hover:bg-opacity-70`
                }`}
                aria-pressed={selectedType === type}
                aria-label={getWhisprTypeLabel(type)}
              >
                <span>{getWhisprTypeIcon(type)} {getWhisprTypeLabel(type)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content textarea with dice button inside */}
        <div className="mb-4">
          <label htmlFor="whispr-content" className="block text-text-muted text-sm mb-2">
            Your message
          </label>
          <div className="relative">
            <textarea
              id="whispr-content"
              value={content}
              onChange={handleContentChange}
              placeholder={`Write your anonymous ${getWhisprTypeLabel(selectedType)} here...`}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg bg-${backgroundColor} border border-${borderColor} text-text-bright placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none`}
              required
              maxLength={maxChars}
              aria-describedby="char-count"
            />

            {/* Dice button positioned within the textarea */}
            <button
              type="button"
              onClick={generateSuggestion}
              disabled={isDiceRolling}
              className={`absolute bottom-3 right-3 text-text-muted hover:text-text-bright transition-colors disabled:opacity-50 bg-${backgroundColor} bg-opacity-70 p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/50`}
              title="Get a random suggestion"
              aria-label="Generate random suggestion"
            >
              <div className={`text-lg ${isDiceRolling ? 'animate-bounce' : ''}`}>
                🎲
              </div>
            </button>
          </div>

          {/* Character count */}
          <div id="char-count" className="flex justify-end text-xs text-text-muted mt-1">
            {charCount}/{maxChars}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || content.trim().length === 0}
          className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
            isSubmitting || content.trim().length === 0
              ? 'bg-overlay-light cursor-not-allowed'
              : 'bg-gradient-primary hover:bg-gradient-primary-hover'
          }`}
          aria-disabled={isSubmitting || content.trim().length === 0}
        >
          {isSubmitting ? 'Sending...' : 'Send Anonymous Whispr'}
        </button>

        {/* Privacy note */}
        <p className="text-xs text-text-muted text-center mt-3">
          Your identity will remain anonymous. We don't store personal information that can identify you.
        </p>
      </form>
    </div>
  );
};

export default WhisprSubmissionForm;