import React from 'react';
import TabBar from '../../molecules/TabBar';
import AnonymousMessage from '../../molecules/AnonymousMessage';

interface Message {
  id: string;
  content: string;
  timestamp?: string;
}

interface MessagesViewProps {
  messages: Message[];
  unreadCount?: number;
  username?: string;
  profileLetter?: string;
  onReply?: (messageId: string) => void;
  onShare?: (messageId: string) => void;
  onTabChange?: (tabId: string) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({
  messages,
  unreadCount = 0,
  username = 'My Messages',
  profileLetter = 'W',
  onReply,
  onShare,
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
      <div className="flex-1 overflow-y-auto p-3">
        {messages.length > 0 ? (
          messages.map((message) => (
            <AnonymousMessage 
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              className="mb-3"
              actions={[
                { 
                  label: 'Reply', 
                  color: 'accent-purple',
                  onClick: () => onReply && onReply(message.id)
                },
                { 
                  label: 'Share', 
                  color: 'accent-pink',
                  onClick: () => onShare && onShare(message.id)
                }
              ]}
            />
          ))
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

export default MessagesView;