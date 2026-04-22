import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Mic, Bot } from 'lucide-react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [wsError, setWsError] = useState(null);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initialize WebSocket connection
    const connectWs = () => {
      // For local development, assume backend is on port 8000
      const wsUrl = `ws://localhost:8000/ws/chat`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket Connected');
        setWsError(null);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.error) {
          console.error('WebSocket Error:', data.error);
          setWsError(data.error);
          setIsTyping(false);
          return;
        }

        if (data.chunk) {
          setMessages(prev => {
            if (prev.length > 0 && prev[prev.length - 1].role === 'ai') {
              // Create a new array and a new object for the last message
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                ...newMessages[newMessages.length - 1],
                content: newMessages[newMessages.length - 1].content + data.chunk
              };
              return newMessages;
            } else {
              // Create a new AI message
              return [...prev, { role: 'ai', content: data.chunk }];
            }
          });
        }

        if (data.done) {
          setIsTyping(false);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket Disconnected');
        // Simple reconnect logic
        setTimeout(connectWs, 3000);
      };
    };

    connectWs();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    
    if (!inputValue.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    // Add user message to UI
    const newMessage = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Send to backend
    ws.current.send(JSON.stringify({ message: newMessage.content }));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
    }}>
      {wsError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#fca5a5',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          textAlign: 'center',
          marginBottom: '1rem',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          Connection Error: {wsError}
        </div>
      )}

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {messages.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            opacity: 0.7,
            color: 'var(--text-secondary)'
          }}>
            <Bot size={48} color="var(--accent-purple)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h2>How can I help you with math today?</h2>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <Message key={idx} role={msg.role} content={msg.content} />
          ))
        )}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '1rem',
        position: 'relative',
      }}>
        <form 
          onSubmit={handleSendMessage}
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            gap: '0.75rem',
            background: 'rgba(20, 20, 30, 0.6)',
          }}
        >
          <button type="button" style={iconButtonStyle}>
            <Paperclip size={20} />
          </button>
          
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask a math question..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              padding: '0.5rem 0',
              outline: 'none',
              resize: 'none',
              maxHeight: '120px',
              fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
            rows={1}
          />
          
          <button type="button" style={iconButtonStyle}>
            <Mic size={20} />
          </button>
          
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isTyping}
            style={{
              ...iconButtonStyle,
              background: inputValue.trim() && !isTyping ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' : 'rgba(255,255,255,0.1)',
              color: inputValue.trim() && !isTyping ? 'white' : 'rgba(255,255,255,0.3)',
              transform: inputValue.trim() && !isTyping ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <style>{`
        /* Minimal markdown styling for AI responses */
        .markdown-content p { margin-bottom: 0.75rem; }
        .markdown-content p:last-child { margin-bottom: 0; }
        .markdown-content pre { 
          background: rgba(0,0,0,0.3); 
          padding: 1rem; 
          border-radius: 0.5rem; 
          overflow-x: auto;
          margin: 0.75rem 0;
        }
        .markdown-content code {
          font-family: monospace;
          background: rgba(0,0,0,0.2);
          padding: 0.1rem 0.3rem;
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  );
};

const iconButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  transition: 'color 0.2s, background 0.2s',
};

export default ChatInterface;
