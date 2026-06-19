import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Leaf, Sparkles } from 'lucide-react';
import { getBotResponse } from '../../data/chatbotResponses';
import { useTheme } from '../../context/ThemeContext';

const QUICK_PROMPTS = [
  'What is a carbon footprint?',
  'Tips for transportation',
  'How to save energy?',
  'Improve my score',
];

function formatMessage(text) {
  // Convert **bold** and bullet points to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .split('\n')
    .map((line) => line.startsWith('•') ? `<li>${line.slice(1).trim()}</li>` : `<p>${line}</p>`)
    .join('');
}

export default function AIAssistant() {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi! I'm **EcoBot**, your AI sustainability assistant.\n\nI can help you:\n• Understand carbon footprints\n• Get eco-friendly tips\n• Improve your sustainability score\n\nWhat would you like to know?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = (text) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const botResponse = getBotResponse(msgText);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center
          shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)' }}
        aria-label="Open EcoBot assistant"
      >
        {isOpen
          ? <X size={22} className="text-white" />
          : <MessageCircle size={22} className="text-white" />
        }
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-eco-400 rounded-full flex items-center justify-center">
            <Sparkles size={9} className="text-white" />
          </span>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden flex flex-col animate-slide-up"
          style={{
            height: '480px',
            background: isDark ? 'rgba(10,16,30,0.97)' : 'rgba(255,255,255,0.97)',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #0d9488)',
              borderColor: 'rgba(255,255,255,0.1)',
            }}>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">EcoBot</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-eco-300 rounded-full animate-pulse-slow" />
                <span className="text-xs text-white/70">AI Sustainability Assistant</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-eco-500/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={13} className="text-eco-400" />
                  </div>
                )}
                <div className="max-w-[75%]">
                  <div
                    className={`rounded-2xl px-3 py-2.5 text-xs leading-relaxed
                      ${msg.sender === 'user'
                        ? 'rounded-tr-sm text-white'
                        : isDark ? 'rounded-tl-sm text-gray-200' : 'rounded-tl-sm text-gray-800'
                      }`}
                    style={{
                      background: msg.sender === 'user'
                        ? 'linear-gradient(135deg, #16a34a, #0d9488)'
                        : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      border: msg.sender === 'bot'
                        ? isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'
                        : 'none',
                    }}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                  />
                  <p className={`text-[10px] mt-1 px-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}
                    ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-eco-500/20 flex items-center justify-center">
                  <Bot size={13} className="text-eco-400" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-3 py-2.5"
                  style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-eco-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-xl whitespace-nowrap transition-all duration-200"
                style={{
                  background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  color: '#10b981',
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className={`px-4 py-3 border-t flex gap-2 items-center
            ${isDark ? 'border-white/8' : 'border-gray-200'}`}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask EcoBot anything…"
              className={`flex-1 text-xs rounded-xl px-3 py-2.5 outline-none transition-all duration-200
                ${isDark
                  ? 'bg-white/6 border border-white/10 text-white placeholder-gray-500 focus:border-eco-500/40'
                  : 'bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-eco-500'
                }`}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)' }}
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
