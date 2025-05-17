import React, { useState, useRef, useEffect } from 'react';
import supabase from '../../lib/supabase';
import { getWhisprTypeIcon, getWhisprTypeLabel, Whispr, WhisprType } from '../../types/whispr';

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
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<WhisprType>('question');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const typeScrollContainerRef = useRef<HTMLDivElement>(null);

  const MAX_CHARS = 500;

  // Check if the screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // List of available whispr types
  const whisprTypes: WhisprType[] = [
    'question',
    'compliment',
    'roast',
    'confession',
    'rumor',
    'suggestion',
    'secret',
    'hot_take',
    'dare'
  ];

  // Sample suggestions for each type
  const suggestions = {
    question: [
      "What's the weirdest food combo you've ever tried?",
      "Who's the one person you'd yeet into the void without hesitation?",
      "What's the most unhinged thing you've done to get someone's attention?",
      "If you could swap lives with a celebrity for a day, who and why?",
      "What's a guilty pleasure you're lowkey obsessed with?"
    ],
    compliment: [
      "You're giving main character energy and I'm here for it.",
      "Your vibe is so chaotic, it's like a human glitter bomb.",
      "You've got the kind of confidence that makes people rethink their life choices.",
      "Your style is so fire, it's basically arson.",
      "You're out here slaying like nobody's business."
    ],
    roast: [
      "Your fashion sense is like a thrift store had a midlife crisis.",
      "You tweet like you're trying to win a gold medal in cringe.",
      "Your bio says expert,' but your takes say 'intern.'",
      "Is your personality sponsored by expired yogurt?",
      "Your content's so dry, it makes the Sahara look hydrated."
    ],
    confession: [
      "I stalked your profile for an hour and now I'm emotionally invested.",
      "I pretended to like your post just to slide into your DMs.",
      "I'm lowkey jealous of your clout but also obsessed with your chaos.",
      "I've been screenshotting your stories to show my friends how unhinged you are.",
      "I accidentally liked your post from 2017 and now I'm spiraling."
    ],
    rumor: [
      "Heard you got kicked out of a party for starting a freestyle rap battle.",
      "Word on the street is you're secretly running a meme account with 100k followers.",
      "People say you've got a hidden talent for juggling flaming torches.",
      "Rumor has it you're dating someone way out of your league.",
      "They're saying you crashed a Zoom meeting just to flex your karaoke skills."
    ],
    suggestion: [
      "Drop a thirst trap and watch the internet implode.",
      "Start a TikTok where you just roast random objects for no reason.",
      "Make a burner account and spill all the tea you're holding back.",
      "Host a live stream where you rank your followers' worst takes.",
      "Create a chaotic group chat and leak the highlights anonymously."
    ],
    secret: [
      "I'm the one who keeps reporting your posts just to mess with you.",
      "I've got a folder of your memes saved for personal inspiration.",
      "I'm secretly rooting for you to go viral, but I'd never admit it.",
      "I know what you did at that event last summer, and it's iconic.",
      "I've been pretending to be your biggest fan, but I'm just here for the drama."
    ],
    hot_take: [
      "Your content is overrated, but I can't stop watching it.",
      "You're trying too hard to be relatable, and it's painfully obvious.",
      "Your aesthetic is peak chaos, and I respect the commitment.",
      "You're the human equivalent of a Twitter thread nobody asked for.",
      "Your energy is either iconic or a cry for help, and I'm not sure which."
    ],
    dare: [
      "Post a selfie with zero filters and see who still simps.",
      "DM your crush something so unhinged they'll either block or propose.",
      "Tweet a hot take so wild it gets you canceled by noon.",
      "Go live and eat something nobody should ever eat on camera.",
      "Reply to a hater with a poem about their bad vibes."
    ]
  };

  // Handle horizontal scrolling with mouse wheel on mobile only
  useEffect(() => {
    if (!isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      if (typeScrollContainerRef.current) {
        e.preventDefault();
        typeScrollContainerRef.current.scrollLeft += e.deltaY;
      }
    };

    const element = typeScrollContainerRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isMobile]);

  // Handle content change with character limit
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setContent(text);
      setCharCount(text.length);
    }
  };

  // Generate a random suggestion based on the selected type
  const generateSuggestion = () => {
    setIsDiceRolling(true);

    // Simulate dice rolling animation
    setTimeout(() => {
      const typeSuggestions = suggestions[selectedType];
      const randomIndex = Math.floor(Math.random() * typeSuggestions.length);
      setContent(typeSuggestions[randomIndex]);
      setCharCount(typeSuggestions[randomIndex].length);
      setIsDiceRolling(false);
    }, 800); // Animation duration
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (submitWhispr) {
        // Use the edge function provided by the parent component
        await submitWhispr(username, content.trim(), selectedType);
      } else {
        // Fallback to using RPC function directly
        const { error } = await supabase.rpc('submit_anonymous_whispr', {
          recipient_username: username,
          whispr_content: content.trim(),
          whispr_type: selectedType
        });

        if (error) {
          throw error;
        }
      }

      // Clear form on success
      setContent('');
      setCharCount(0);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      if (onError) onError(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the border color and the background from the className prop
  const borderColor = className.includes('border-') ? className.split('border-')[1].split(' ')[0] : 'overlay-light';
  const backgroundColor = className.includes('bg-') ? className.split('bg-')[1].split(' ')[0] : 'background-darkest';

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
          >
            {whisprTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors whitespace-nowrap ${isMobile ? 'flex-shrink-0 snap-start' : 'mb-2'} ${selectedType === type
                  ? 'bg-gradient-primary text-white'
                  : `bg-${backgroundColor} text-text-muted hover:text-text-bright border border-${borderColor} hover:bg-opacity-70`
                  }`}
              >
                <span>{getWhisprTypeIcon(type)} {getWhisprTypeLabel(type)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content textarea with dice button inside */}
        <div className="mb-4 relative">
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
            />

            {/* Dice button positioned within the textarea */}
            <button
              type="button"
              onClick={generateSuggestion}
              disabled={isDiceRolling}
              className={`absolute bottom-3 right-3 text-text-muted hover:text-text-bright transition-colors disabled:opacity-50 bg-${backgroundColor} bg-opacity-70 p-1 rounded`}
              title="Get a random suggestion"
            >
              <div className={`text-lg ${isDiceRolling ? 'animate-bounce' : ''}`}>
              🎲
              </div>
            </button>
            </div>

          {/* Character count */}
          <div className="flex justify-end text-xs text-text-muted mt-1">
            {charCount}/{MAX_CHARS}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || content.trim().length === 0}
          className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${isSubmitting || content.trim().length === 0
            ? 'bg-overlay-light cursor-not-allowed'
            : 'bg-gradient-primary hover:bg-gradient-primary-hover'
            }`}
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