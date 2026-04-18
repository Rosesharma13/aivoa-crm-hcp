import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, setInputValue, clearChat } from '../store/chatSlice';

const s = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '20px',
    alignItems: 'start',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #dadce0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    height: '580px',
  },
  chatHeader: {
    padding: '14px 20px',
    borderBottom: '1px solid #f1f3f4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatHeaderLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  aiDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#1e8e3e', boxShadow: '0 0 0 2px #ceead6',
  },
  chatTitle: { fontWeight: '600', fontSize: '14px', color: '#202124' },
  clearBtn: {
    fontSize: '12px', color: '#5f6368', background: 'none',
    border: 'none', cursor: 'pointer', padding: '4px 8px',
    borderRadius: '6px',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  msgUser: {
    alignSelf: 'flex-end',
    background: '#1a73e8',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '18px 18px 4px 18px',
    maxWidth: '80%',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  msgAI: {
    alignSelf: 'flex-start',
    background: '#f8f9fa',
    color: '#202124',
    padding: '10px 14px',
    borderRadius: '18px 18px 18px 4px',
    maxWidth: '85%',
    fontSize: '14px',
    lineHeight: '1.5',
    border: '1px solid #e8eaed',
  },
  msgTime: {
    fontSize: '10px',
    color: '#9aa0a6',
    marginTop: '4px',
    textAlign: 'right',
  },
  typing: {
    alignSelf: 'flex-start',
    padding: '12px 16px',
    background: '#f8f9fa',
    borderRadius: '18px 18px 18px 4px',
    border: '1px solid #e8eaed',
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  typingDot: {
    width: '6px', height: '6px', borderRadius: '50%', background: '#9aa0a6',
    animation: 'bounce 1.2s infinite',
  },
  inputArea: {
    padding: '12px 16px',
    borderTop: '1px solid #f1f3f4',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid #dadce0',
    borderRadius: '24px',
    fontSize: '14px',
    outline: 'none',
    resize: 'none',
    fontFamily: 'Inter, sans-serif',
    lineHeight: '1.4',
    maxHeight: '100px',
    overflowY: 'auto',
  },
  sendBtn: (active) => ({
    width: '40px', height: '40px', borderRadius: '50%',
    background: active ? '#1a73e8' : '#e8eaed',
    border: 'none', cursor: active ? 'pointer' : 'default',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16px', transition: 'background 0.15s', flexShrink: 0,
  }),
  infoCard: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #dadce0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  infoHeader: {
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
  },
  exampleBtn: {
    width: '100%',
    padding: '10px 14px',
    border: 'none',
    borderBottom: '1px solid #f1f3f4',
    background: '#fff',
    textAlign: 'left',
    fontSize: '12px',
    color: '#202124',
    cursor: 'pointer',
    lineHeight: '1.4',
    transition: 'background 0.1s',
  },
};

const EXAMPLES = [
  "Log a meeting with Dr. Anjali Mehta about OncoBoost Phase III — she was very positive and requested follow-up brochure",
  "Search for cardiologists in Mumbai",
  "Get follow-up suggestions for interaction 1",
  "Analyze sentiment: The doctor seemed hesitant about prescribing, wanted more clinical data before committing",
  "Edit interaction 1 — change sentiment to Positive",
];

export default function ChatInterface() {
  const dispatch = useDispatch();
  const { messages, status, inputValue } = useSelector(s => s.chat);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const handleSend = () => {
    if (!inputValue.trim() || status === 'loading') return;
    dispatch(sendChatMessage({ message: inputValue, history: [] }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }`}</style>
      <div style={s.grid}>
        {/* Chat */}
        <div style={s.card}>
          <div style={s.chatHeader}>
            <div style={s.chatHeaderLeft}>
              <div style={s.aiDot} />
              <span style={s.chatTitle}>AI Chat — LangGraph Agent</span>
            </div>
            <button style={s.clearBtn} onClick={() => dispatch(clearChat())}>Clear chat</button>
          </div>

          <div style={s.messages}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div style={msg.role === 'user' ? s.msgUser : s.msgAI}>
                  {msg.content}
                </div>
                <div style={{ ...s.msgTime, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.role === 'assistant' ? '🤖 ' : ''}
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))}
            {status === 'loading' && (
              <div style={s.typing}>
                {[0, 150, 300].map(d => (
                  <div key={d} style={{ ...s.typingDot, animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={s.inputArea}>
            <textarea
              style={s.input}
              placeholder="Describe an interaction or ask anything..."
              value={inputValue}
              onChange={e => dispatch(setInputValue(e.target.value))}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button style={s.sendBtn(!!inputValue.trim())} onClick={handleSend}>
              ➤
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div style={s.infoCard}>
          <div style={s.infoHeader}>💡 Try these prompts</div>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              style={s.exampleBtn}
              onClick={() => dispatch(setInputValue(ex))}
              onMouseEnter={e => e.target.style.background = '#f8f9fa'}
              onMouseLeave={e => e.target.style.background = '#fff'}
            >
              "{ex}"
            </button>
          ))}

          <div style={{ padding: '14px', background: '#f8f9fa' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#5f6368', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Agent Tools
            </div>
            {[
              { name: 'log_interaction', desc: 'Saves HCP meeting to DB' },
              { name: 'edit_interaction', desc: 'Updates existing records' },
              { name: 'search_hcp', desc: 'Finds HCPs by name/spec' },
              { name: 'suggest_followup', desc: 'AI next-step suggestions' },
              { name: 'analyze_sentiment', desc: 'LLM sentiment scoring' },
            ].map(t => (
              <div key={t.name} style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#1a73e8', fontFamily: 'monospace' }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: '#5f6368' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
