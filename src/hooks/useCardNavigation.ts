import { useState, useRef, useEffect } from 'react';
import { Whispr } from '../types/whispr';

interface UseCardNavigationProps {
  whisprs: Whispr[];
  enableSwipe?: boolean;
}

/**
 * Custom hook for card navigation with optional swipe gestures
 */
export const useCardNavigation = ({ 
  whisprs, 
  enableSwipe = true 
}: UseCardNavigationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swiping, setSwiping] = useState(false);
  const [, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const swipeContainerRef = useRef<HTMLDivElement>(null);

  // Reset current index when whisprs change
  useEffect(() => {
    setCurrentIndex(0);
  }, [whisprs]);

  // Navigate to previous card
  const goToPrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Navigate to next card
  const goToNextCard = () => {
    if (currentIndex < whisprs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Minimum distance required for a swipe
  const minSwipeDistance = 50;

  // Touch event handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipe) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipe || !swiping) return;
    setTouchEnd(e.targetTouches[0].clientX);

    // Calculate swipe direction and distance for animation
    if (touchStart !== null && touchEnd !== null) {
      const distance = touchEnd - touchStart;
      if (distance < 0) {
        setSwipeDirection('left');
      } else {
        setSwipeDirection('right');
      }

      // Apply transform during swipe
      if (swipeContainerRef.current) {
        const maxTranslate = 100; // Max pixels to translate
        const translate = Math.min(Math.abs(distance), maxTranslate) * (distance < 0 ? -1 : 1);
        swipeContainerRef.current.style.transform = `translateX(${translate}px)`;
        swipeContainerRef.current.style.opacity = `${1 - Math.abs(translate) / (maxTranslate * 2)}`;
      }
    }
  };

  const onTouchEnd = () => {
    if (!enableSwipe || !touchStart || !touchEnd || !swiping) {
      // Reset swipe animation
      if (swipeContainerRef.current) {
        swipeContainerRef.current.style.transform = 'translateX(0)';
        swipeContainerRef.current.style.opacity = '1';
      }
      setSwiping(false);
      setSwipeDirection(null);
      return;
    }

    const distance = touchEnd - touchStart;
    const isLeftSwipe = distance < -minSwipeDistance;
    const isRightSwipe = distance > minSwipeDistance;

    // Reset swipe animation first
    if (swipeContainerRef.current) {
      swipeContainerRef.current.style.transform = 'translateX(0)';
      swipeContainerRef.current.style.opacity = '1';
    }

    if (isLeftSwipe && currentIndex < whisprs.length - 1) {
      // Go to next card
      goToNextCard();
    } else if (isRightSwipe && currentIndex > 0) {
      // Go to previous card
      goToPrevCard();
    }

    // Reset state
    setSwiping(false);
    setSwipeDirection(null);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return {
    currentIndex,
    setCurrentIndex,
    goToNextCard,
    goToPrevCard,
    swipeContainerRef,
    onTouchStart: enableSwipe ? onTouchStart : undefined,
    onTouchMove: enableSwipe ? onTouchMove : undefined,
    onTouchEnd: enableSwipe ? onTouchEnd : undefined,
    hasPrevious: currentIndex > 0,
    hasNext: currentIndex < whisprs.length - 1,
    totalCount: whisprs.length,
    currentItem: whisprs[currentIndex]
  };
};