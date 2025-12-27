import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

interface Source {
  url: string;
  title: string;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  sources?: Source[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showAllSources, setShowAllSources] = useState<{ [key: number]: boolean }>({});
  const [selection, setSelection] = useState({ visible: false, x: 0, y: 0, text: '' });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const initSession = async () => {
    try {
      const res = await fetch('https://ainativebookbackendsc-production.up.railway.app/chat/new-session', { method: 'POST' });
      const data = await res.json();
      if (data.session_id) setSessionId(data.session_id);
    } catch (e) { console.error("Session init failed", e); }
  };

  useEffect(() => { initSession(); }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const cleanResponse = (text: string) => {
    return text
      .replace(/Source Title:[\s\S]*?URL:.*?(?=\n|Source Title:|$)/gi, '')
      .replace(/\(Source:.*?\)/g, '')
      .replace(/\n{2,}/g, '\n\n')
      .trim();
  };

  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();

      if (text && text.length > 10) {
        // Get the bounding box of the selected text
        const range = sel?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect && rect.top !== 0) {
          setSelection({
            visible: true,
            // Use fixed coordinates relative to viewport
            x: rect.left + (rect.width / 2),
            y: rect.top - 50, // Position above the selection
            text: text,
          });
        }
      } else {
        // Hide if selection is cleared
        setSelection((prev) => ({ ...prev, visible: false }));
      }
    };

    // Desktop listener
    document.addEventListener('mouseup', handleSelection);
    // Mobile listener: selectionchange is much more reliable on iOS/Android
    document.addEventListener('selectionchange', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, []);

  const handleSendMessage = async (textOverride?: string) => {
    const query = textOverride || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setInput('');
    setIsTyping(true);
    if (!isOpen) setIsOpen(true);

    try {
      const response = await fetch('https://ai-native-book-backend-production-409f.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, session_id: sessionId }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'bot',
        content: cleanResponse(data.response),
        sources: data.sources
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Connection failed.' }]);
    } finally { setIsTyping(false); }
  };

  const clearChat = () => {
    setMessages([]);
    initSession();
  };

  return (
    <>
      {selection.visible && (
        <button
          className={styles.selectionTooltip}
          style={{
            top: `${selection.y}px`,
            left: `${selection.x}px`,
            position: 'fixed', // Force fixed to handle mobile viewport scrolling
            transform: 'translateX(-50%)', // Center based on the X coordinate
            zIndex: 10001
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleSendMessage(`Explain this context: "${selection.text}"`);
            setSelection(prev => ({ ...prev, visible: false }));
          }}
        >
          ✨ Ask AI
        </button>
      )}

      <div className={styles.chatbotContainer}>
        {!isOpen && (
          <button className={styles.chatToggle} onClick={() => setIsOpen(true)}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.1 21.9l4.9-.762C8.47 21.513 10.179 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
          </button>
        )}

        {isOpen && (
          <div className={styles.chatWindow}>
            <div className={styles.chatHeader}>
              <div className={styles.headerInfo}>
                <strong>Physical AI Assistant</strong>
                <div className={styles.status}><span className={styles.dot}></span> Online</div>
              </div>
              <div className={styles.headerActions}>
                <button title="Clear Chat" className={styles.headerBtn} onClick={clearChat}>🗑️</button>
                <button className={styles.headerBtn} onClick={() => setIsOpen(false)}>✕</button>
              </div>
            </div>

            <div className={styles.chatMessages}>
              {messages.map((msg, i) => (
                <div key={i} className={`${styles.message} ${styles[msg.role]}`}>
                  <div className={styles.bubble}>{msg.content}</div>
                  {msg.role === 'bot' && msg.sources && msg.sources.length > 0 && (
                    <div className={styles.sourcesWrapper}>
                      <p className={styles.sourceTitle}>Verified Sources</p>
                      <div className={styles.sourcesList}>
                        {(showAllSources[i] ? msg.sources : msg.sources.slice(0, 3)).map((src, idx) => (
                          <a key={idx} href={src.url} target="_blank" rel="noreferrer" className={styles.sourceLink}>
                            <span>{idx + 1}</span> {src.title}
                          </a>
                        ))}
                      </div>
                      {msg.sources.length > 3 && (
                        <button className={styles.viewMoreBtn} onClick={() => setShowAllSources(p => ({ ...p, [i]: !p[i] }))}>
                          {showAllSources[i] ? 'Show less' : `+${msg.sources.length - 3} more references`}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className={`${styles.message} ${styles.bot}`}>
                  <div className={styles.typingIndicator}><span></span><span></span><span></span></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className={styles.chatInputArea}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ask a question..." />
              <button className={styles.sendBtn} onClick={() => handleSendMessage()}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBot;