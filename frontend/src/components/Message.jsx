import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';

const Message = ({ role, content }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`animate-fade-in ${isUser ? 'user-message-container' : 'ai-message-container'}`} style={{
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isUser ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' : 'var(--glass-bg)',
        border: isUser ? 'none' : '1px solid var(--glass-border)',
        boxShadow: isUser ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none',
        flexShrink: 0
      }}>
        {isUser ? <User size={20} color="white" /> : <Bot size={20} color="var(--accent-pink)" />}
      </div>
      
      <div className={isUser ? '' : 'glass-panel'} style={{
        padding: '1rem 1.25rem',
        borderRadius: isUser ? '1.5rem 1.5rem 0 1.5rem' : '1.5rem 1.5rem 1.5rem 0',
        background: isUser ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.9))' : '',
        maxWidth: '85%',
        color: 'var(--text-primary)',
        lineHeight: 1.6,
        fontSize: '0.95rem',
        boxShadow: isUser ? '0 4px 20px rgba(0,0,0,0.2)' : ''
      }}>
        <div style={{
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}>
          {isUser ? (
            <p>{content}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
