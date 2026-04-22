import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="animate-fade-in ai-message-container" style={{
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      flexDirection: 'row',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        flexShrink: 0
      }}>
        <Bot size={20} color="var(--accent-pink)" />
      </div>
      
      <div className="glass-panel" style={{
        padding: '1rem 1.25rem',
        borderRadius: '1.5rem 1.5rem 1.5rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        height: '52px'
      }}>
        <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
        <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
        <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
      </div>

      <style>{`
        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: var(--accent-purple);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
