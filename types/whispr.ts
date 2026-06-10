import {
  HelpCircle,
  Heart,
  Flame,
  EyeOff,
  Ear,
  Lightbulb,
  Lock,
  Zap,
  Target,
  Mail,
  LucideIcon,
} from 'lucide-react';

export type WhisprType = 'question' | 'compliment' | 'roast' | 'confession' | 'rumor' | 'suggestion' | 'secret' | 'hot_take' | 'dare';

export interface Whispr {
  id: string;
  content: string;
  type: WhisprType;
  createdAt: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
}

export interface WhisprStats {
  total: number;
  unread: number;
  byType: { [key in WhisprType]?: number };
}

export const formatDate = (dateString: string, forShowcase = false): string => {
  if (!dateString) return 'Unknown date';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  try {
    return forShowcase
      ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
      : new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }).format(date);
  } catch {
    return 'Invalid date';
  }
};

export const getWhisprTypeIcon = (type: WhisprType): LucideIcon => {
  switch (type) {
    case 'question': return HelpCircle;
    case 'compliment': return Heart;
    case 'roast': return Flame;
    case 'confession': return EyeOff;
    case 'rumor': return Ear;
    case 'suggestion': return Lightbulb;
    case 'secret': return Lock;
    case 'hot_take': return Zap;
    case 'dare': return Target;
    default: return Mail;
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
};
