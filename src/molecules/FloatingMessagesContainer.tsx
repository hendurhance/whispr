import React from 'react';
import FloatingMessage from '../atoms/FloatingMessage';

interface FloatingMessage {
  id: string;
  content: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay?: number;
  duration?: number;
}

interface FloatingMessagesContainerProps {
  messages: FloatingMessage[];
  className?: string;
}

const FloatingMessagesContainer: React.FC<FloatingMessagesContainerProps> = ({
  messages,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {messages.map((message) => (
        <FloatingMessage
          key={message.id}
          content={message.content}
          position={message.position}
          delay={message.delay}
          duration={message.duration}
        />
      ))}
    </div>
  );
};

export default FloatingMessagesContainer;