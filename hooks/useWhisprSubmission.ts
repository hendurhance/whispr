import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Whispr, WhisprType } from '@/types/whispr';
import { isValidWhisprType, validateWhisprContent } from '@/utils/validation';
import { useResponsive } from '@/hooks/useResponsive';

const SUGGESTIONS = {
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

export const WHISPR_TYPES: WhisprType[] = [
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

export const MAX_WHISPR_CHARS = 500;

interface UseWhisprSubmissionProps {
  username: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  customSubmitFunction?: (username: string, content: string, type: string) => Promise<Whispr> | void;
}

export const useWhisprSubmission = ({
  username,
  onSuccess,
  onError,
  customSubmitFunction
}: UseWhisprSubmissionProps) => {
  const supabase = createClient();
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<WhisprType>('question');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const typeScrollContainerRef = useRef<HTMLDivElement>(null);

  const { isMobile } = useResponsive();

  const charCount = content.length;

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

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_WHISPR_CHARS) {
      setContent(text);
    }
  }, []);

  const generateSuggestion = useCallback(() => {
    setIsDiceRolling(true);

    setTimeout(() => {
      const typeSuggestions = SUGGESTIONS[selectedType];
      const randomIndex = Math.floor(Math.random() * typeSuggestions.length);
      setContent(typeSuggestions[randomIndex]);
      setIsDiceRolling(false);
    }, 800); // Animation duration
  }, [selectedType]);

  const resetForm = useCallback(() => {
    setContent('');
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    const contentValidation = validateWhisprContent(trimmedContent);
    if (!contentValidation.valid) {
      if (onError) onError(new Error(contentValidation.error));
      return;
    }

    if (!isValidWhisprType(selectedType)) {
      if (onError) onError(new Error(`Invalid whispr type: ${selectedType}`));
      return;
    }

    if (!username || !username.trim()) {
      if (onError) onError(new Error('Invalid recipient'));
      return;
    }
    const normalizedUsername = username.toLowerCase().trim();

    setIsSubmitting(true);

    try {
      if (customSubmitFunction) {
        await customSubmitFunction(normalizedUsername, trimmedContent, selectedType);
      } else {
        const { error } = await supabase.rpc('submit_anonymous_whispr', {
          recipient_username: normalizedUsername,
          whispr_content: trimmedContent,
          whispr_type: selectedType
        });

        if (error) {
          throw error;
        }
      }

      resetForm();

      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, selectedType, username, customSubmitFunction, onSuccess, onError, resetForm, supabase]);

  return {
    content,
    setContent,
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
    resetForm,
    whisprTypes: WHISPR_TYPES,
    maxChars: MAX_WHISPR_CHARS,
    suggestions: SUGGESTIONS
  };
};
