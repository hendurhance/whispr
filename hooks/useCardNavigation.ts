import { useState, useRef } from 'react';
import { Whispr } from '@/types/whispr';

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

  // Derive a safe index: clamp to valid range instead of resetting via Effect
  const safeIndex = whisprs.length === 0 ? 0 : Math.min(currentIndex, whisprs.length - 1);

  const goToPrevCard = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    }
  };

  const goToNextCard = () => {
    if (safeIndex < whisprs.length - 1) {
      setCurrentIndex(safeIndex + 1);
    }
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipe) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipe || !swiping) return;
    setTouchEnd(e.targetTouches[0].clientX);

    if (touchStart !== null && touchEnd !== null) {
      const distance = touchEnd - touchStart;
      if (distance < 0) {
        setSwipeDirection('left');
      } else {
        setSwipeDirection('right');
      }

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

    if (swipeContainerRef.current) {
      swipeContainerRef.current.style.transform = 'translateX(0)';
      swipeContainerRef.current.style.opacity = '1';
    }

    if (isLeftSwipe && safeIndex < whisprs.length - 1) {
      goToNextCard();
    } else if (isRightSwipe && safeIndex > 0) {
      goToPrevCard();
    }

    setSwiping(false);
    setSwipeDirection(null);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return {
    currentIndex: safeIndex,
    setCurrentIndex,
    goToNextCard,
    goToPrevCard,
    swipeContainerRef,
    onTouchStart: enableSwipe ? onTouchStart : undefined,
    onTouchMove: enableSwipe ? onTouchMove : undefined,
    onTouchEnd: enableSwipe ? onTouchEnd : undefined,
    hasPrevious: safeIndex > 0,
    hasNext: safeIndex < whisprs.length - 1,
    totalCount: whisprs.length,
    currentItem: whisprs[safeIndex]
  };
};
