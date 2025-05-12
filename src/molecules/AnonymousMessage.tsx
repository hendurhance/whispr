import React from 'react';

interface MessageAction {
  label: string;
  color: string;
  onClick?: () => void;
}

interface AnonymousMessageProps {
  content: string;
  timestamp?: string;
  actions?: MessageAction[];
  className?: string;
}

const AnonymousMessage: React.FC<AnonymousMessageProps> = ({ 
  content, 
  timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
  actions = [],
  className = '' 
}) => {
  return (
    <div className={`bg-background-card p-4 rounded-xl border border-background-highlight ${className}`}>
      <p className="text-text mb-2">{content}</p>
      
      {/* Actions */}
      {(actions.length > 0 || timestamp) && (
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-background-highlight">
          {timestamp && (
            <div className="text-text-muted text-xs">
              {timestamp}
            </div>
          )}
          
          {actions.length > 0 && (
            <div className="flex gap-2">
              {actions.map((action, index) => (
                <button 
                  key={index}
                  className={`text-${action.color} px-3 py-1 rounded-full text-xs bg-background-darker hover:bg-${action.color}/10 transition-colors`}
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnonymousMessage;