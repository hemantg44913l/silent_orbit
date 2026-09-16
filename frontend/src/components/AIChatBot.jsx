import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, X, Send, User, RotateCcw, MessageSquare, Loader2, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 Hi! I'm **Loomora AI Assistant**. Ask me any doubt about textile recycling, vendor buyback rates, DIY upcycling ideas, or consignment tracking!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "What is the buyback rate for 100% Cotton?",
    "How does fiber matching work?",
    "How do I track my order?",
    "What DIY projects can I make with old denim?"
  ];

  // Auto-scroll chat stream to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend = null) => {
    const query = (textToSend || inputMsg).trim();
    if (!query || isLoading) return;

    const userMessageObj = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessageObj]);
    if (!textToSend) setInputMsg('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
      const aiData = await api.askAIChatbot(query, historyPayload);

      const aiMessageObj = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiData.reply || "I'm here to help with all your textile recycling questions!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessageObj]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I'm having trouble connecting right now, but feel free to ask about TexLoop pricing, materials, or order tracking!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: "👋 Hi! I'm **Loomora AI Assistant**. Ask me any doubt about textile recycling, vendor buyback rates, DIY upcycling ideas, or consignment tracking!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Helper to format basic markdown (bold, bullet points, headers) in chat bubble
  const formatMarkdown = (content) => {
    if (!content) return '';
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      let formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.06); padding: 1px 4px; border-radius: 4px;">$1</code>');

      if (line.startsWith('### ')) {
        return <h4 key={idx} style={{ margin: '6px 0 4px 0', color: 'var(--color-primary)', fontSize: '15px' }} dangerouslySetInnerHTML={{ __html: formattedLine.replace('### ', '') }} />;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <div key={idx} style={{ paddingLeft: '12px', margin: '3px 0' }} dangerouslySetInnerHTML={{ __html: '• ' + formattedLine.slice(2) }} />;
      }
      if (line.startsWith('> ')) {
        return <blockquote key={idx} style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: '8px', fontStyle: 'italic', margin: '4px 0', background: 'rgba(5, 150, 105, 0.08)' }} dangerouslySetInnerHTML={{ __html: formattedLine.slice(2) }} />;
      }
      if (!line.trim()) {
        return <div key={idx} style={{ height: '4px' }} />;
      }
      return <p key={idx} style={{ margin: '2px 0' }} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #059669 0%, #065F46 100%)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
          title="Open TexLoop AI Assistant"
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Sparkles size={20} />
            <span style={{ position: 'absolute', top: '-2px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: '#34D399' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em' }}>AI Assistant</span>
        </button>
      )}

      {/* Floating Glassmorphic AI Chat Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '90vw',
            maxWidth: '420px',
            height: '600px',
            maxHeight: '80vh',
            zIndex: 9999,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', color: 'white', fontWeight: 800 }}>Loomora AI Assistant</h3>
                <span style={{ fontSize: '11px', color: '#A7F3D0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                  Online • 24/7 AI Doubts Helper
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={handleResetChat}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: '4px' }}
                title="Reset Conversation"
              >
                <RotateCcw size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
                title="Close AI Assistant"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#F8FAFC'
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    gap: '4px'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius: isUser ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                      background: isUser ? '#059669' : '#FFFFFF',
                      color: isUser ? '#FFFFFF' : '#1E293B',
                      boxShadow: isUser ? '0 4px 12px rgba(5, 150, 105, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                      border: isUser ? 'none' : '1px solid var(--color-border)',
                      fontSize: '13.5px',
                      lineHeight: '1.5'
                    }}
                  >
                    {isUser ? m.text : formatMarkdown(m.text)}
                  </div>
                  <span style={{ fontSize: '10px', color: '#94A3B8', padding: '0 4px' }}>{m.timestamp}</span>
                </div>
              );
            })}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontSize: '12px', padding: '8px' }}>
                <Loader2 size={16} className="animate-spin" />
                <span>AI Assistant is analyzing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div
            style={{
              padding: '8px 12px',
              background: '#FFFFFF',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto'
            }}
          >
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '11px',
                  padding: '5px 10px',
                  borderRadius: '9999px',
                  background: 'var(--color-accent)',
                  color: 'var(--color-accent-text)',
                  border: '1px solid var(--color-accent-border)',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '12px 16px',
              background: '#FFFFFF',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <input
              type="text"
              className="input"
              placeholder="Ask AI your doubt (e.g. Cotton rates, order status)..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: '10px 14px',
                fontSize: '13px',
                borderRadius: '12px'
              }}
            />

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSendMessage()}
              disabled={!inputMsg.trim() || isLoading}
              style={{
                padding: '10px 14px',
                borderRadius: '12px'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
