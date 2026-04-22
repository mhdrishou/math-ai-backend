import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <>
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '1rem',
      }}>
        <header className="animate-fade-in" style={{
          textAlign: 'center',
          padding: '2rem 1rem 1rem',
        }}>
          <h1 className="text-gradient" style={{
            fontSize: '3rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            letterSpacing: '-0.05em'
          }}>
            Math Solver AI
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.1em',
            fontWeight: 500
          }}>
            MUHAMMED RISHAN 10-E &bull; EHAN AL AMISH 10-E
          </p>
        </header>

        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '1rem 0' }}>
          <ChatInterface />
        </main>
      </div>
    </>
  );
}

export default App;
