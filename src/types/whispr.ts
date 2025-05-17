export interface Whispr {
  id: string;
  content: string;
  type: WhisprType;
  createdAt: string; // ISO date string
  isRead: boolean;
  metadata?: {
    [key: string]: unknown;
  };
}

export type WhisprType = 'question' | 'compliment' | 'roast' | 'confession' | 'rumor' | 'suggestion' | 'secret' | 'hot_take' | 'dare';

export interface WhisprStats {
  total: number;
  unread: number;
  byType: {
    [key in WhisprType]?: number;
  };
}

export type ViewMode = 'grid' | 'list' | 'card';

export interface SortOption {
  label: string;
  value: 'newest' | 'oldest' | 'type';
}

export const formatDate = (dateString: string, forShowcase = false): string => {
  const date = new Date(dateString);
  return forShowcase 
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
    : new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
};

export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

export const getWhisprTypeIcon = (type: WhisprType): string => {
  switch (type) {
    case 'question': return '❓';
    case 'compliment': return '💐';
    case 'roast': return '🔥';
    case 'confession': return '🤫';
    case 'rumor': return '👂';
    case 'suggestion': return '📝';
    case 'secret': return '🔒';
    case 'hot_take': return '🌶️';
    case 'dare': return '⚡';
    default: return '✉️';
  }
};

export const getWhisprTypeLabel = (type: WhisprType): string => {
  switch (type) {
    case 'question': return 'Question';
    case 'compliment': return 'Compliment';
    case 'roast': return 'Roast';
    case 'confession': return 'Confession';
    case 'rumor': return 'Rumor';
    case 'suggestion': return 'Suggestion';
    case 'secret': return 'Secret';
    case 'hot_take': return 'Hot Take';
    case 'dare': return 'Dare';
    default: return 'Unknown Type';
  }
}

export const getWhisprTypeColor = (type: WhisprType): string => {
  switch (type) {
    case 'question': return 'accent-purple';
    case 'compliment': return 'accent-green';
    case 'roast': return 'accent-red';
    case 'confession': return 'accent-blue';
    case 'rumor': return 'accent-teal';
    case 'suggestion': return 'accent-orange';
    case 'secret': return 'accent-lime';
    case 'hot_take': return 'accent-pink';
    case 'dare': return 'accent-yellow';
    default: return 'primary';
  }
};