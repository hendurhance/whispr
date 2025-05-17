import React from 'react';
import TabBar from '../../molecules/TabBar';
import WhisprCard from '../../molecules/WhisprCard';
import { Whispr } from '../../types/whispr';

interface DashboardViewProps {
  whispr: Whispr[];
  unreadCount?: number;
  username?: string;
  profileLetter?: string;
  onView?: (messageId: string) => void;
  onShare?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onTabChange?: (tabId: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  whispr,
  unreadCount = 0,
  username = 'My Messages',
  profileLetter = 'W',
  onView,
  onShare,
  onDelete,
  onTabChange
}) => {
  // Tab data
  const tabs = [
    { id: 'messages', icon: '📨', label: 'Messages', isActive: true },
    { id: 'link', icon: '🔗', label: 'My Link', isActive: false },
    { id: 'settings', icon: '⚙️', label: 'Settings', isActive: false }
  ];

  return (
    <div className="bg-background-lighter flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-background-highlight bg-background-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white">
            {profileLetter}
          </div>
          <div>
            <div className="font-semibold text-text-bright">{username}</div>
            <div className="text-xs text-text-muted">
              {unreadCount > 0 
                ? `${unreadCount} new anonymous messages` 
                : 'No new messages'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4">
        {whispr.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
        {whispr.map((message) => (
          <WhisprCard 
            key={message.id}
            whispr={message}
            viewMode='list'
            onView={ () => onView && onView(message.id) }
            onShare={ () => onShare && onShare(message.id) }
            onDelete={ () => onDelete && onDelete(message.id) }
            forShowcase={true}
          />
        ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
        <div className="text-4xl mb-3">📭</div>
        <p>No messages yet</p>
          </div>
        )}
      </div>
      
      {/* Footer Tabs */}
      <TabBar 
        tabs={tabs} 
        onTabChange={onTabChange}
      />
    </div>
  );
};

export default DashboardView;