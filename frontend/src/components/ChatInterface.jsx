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
    const connectWs = () => {
      // ✅ FIXED: your Railway backend WebSocket URL
      const wsUrl = `wss://math-ai-backend-production-8711.up.railway.app/ws/chat`;

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
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                ...newMessages[newMessages.length - 1],
                content: newMessages[newMessages.length - 1].content + data.chunk
              };
              return newMessages;
            } else {
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

    const newMessage = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    ws.current.send(JSON.stringify({ message: newMessage.content }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>

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

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
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

      {/* Input */}
      <div style={{ padding: '1rem' }}>
        <form
          onSubmit={handleSendMessage}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            gap: '0.75rem',
            background: 'rgba(20, 20, 30, 0.6)',
          }}
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a math question..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              resize: 'none',
            }}
            rows={1}
          />

          <button type="submit" disabled={!inputValue.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
