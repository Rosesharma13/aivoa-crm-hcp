import { useDispatch, useSelector } from 'react-redux';
import { updateForm, resetForm, logInteraction } from '../store/interactionSlice';

const s = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '20px',
    alignItems: 'start',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #dadce0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #f1f3f4',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#202124',
  },
  cardBody: { padding: '20px' },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  field: { marginBottom: '16px' },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#5f6368',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #dadce0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#202124',
    outline: 'none',
    transition: 'border-color 0.15s',
    background: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #dadce0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#202124',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'Inter, sans-serif',
    lineHeight: '1.5',
  },
  select: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #dadce0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#202124',
    outline: 'none',
    background: '#fff',
  },
  sentimentGroup: {
    display: 'flex',
    gap: '8px',
  },
  sentimentBtn: (active, color) => ({
    flex: 1,
    padding: '8px',
    border: `2px solid ${active ? color : '#dadce0'}`,
    borderRadius: '8px',
    background: active ? color + '15' : '#fff',
    color: active ? color : '#5f6368',
    fontWeight: active ? '600' : '400',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  }),
  actions: {
    display: 'flex',
    gap: '10px',
    paddingTop: '4px',
  },
  btnPrimary: {
    flex: 1,
    padding: '10px 20px',
    background: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  btnSecondary: {
    padding: '10px 20px',
    background: '#fff',
    color: '#5f6368',
    border: '1px solid #dadce0',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
  },
  successBanner: {
    background: '#e6f4ea',
    border: '1px solid #ceead6',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  aiPanel: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #dadce0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  aiHeader: {
    padding: '14px 16px',
    background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
    color: '#fff',
  },
  aiTitle: { fontSize: '13px', fontWeight: '600', marginBottom: '2px' },
  aiSub: { fontSize: '11px', opacity: 0.8 },
  suggestionItem: {
    padding: '10px 14px',
    borderBottom: '1px solid #f1f3f4',
    fontSize: '13px',
    color: '#202124',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
    lineHeight: '1.4',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#1a73e8',
    marginTop: '6px',
    flexShrink: 0,
  },
  infoBox: {
    padding: '16px',
    background: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e8eaed',
    marginTop: '16px',
  },
  infoTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#5f6368',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  toolChip: {
    display: 'inline-block',
    background: '#e8f0fe',
    color: '#1557b0',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    margin: '2px 2px 2px 0',
  },
};

export default function InteractionForm() {
  const dispatch = useDispatch();
  const { form, hcps, submitStatus, aiSuggestions } = useSelector(s => s.interaction);

  const handleChange = (field) => (e) => dispatch(updateForm({ [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.hcp_name || !form.topics_discussed) return alert('Please fill in HCP name and topics discussed.');
    dispatch(logInteraction(form));
  };

  const sentimentColors = { Positive: '#1e8e3e', Neutral: '#f9ab00', Negative: '#d93025' };
  const sentimentEmojis = { Positive: '😊', Neutral: '😐', Negative: '😟' };

  return (
    <div style={s.grid}>
      {/* Left: Form */}
      <div>
        {submitStatus === 'success' && (
          <div style={s.successBanner}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <div>
              <div style={{ fontWeight: '600', color: '#1e8e3e', marginBottom: '4px' }}>Interaction logged successfully!</div>
              <div style={{ fontSize: '13px', color: '#137333' }}>AI follow-up suggestions have been generated on the right panel.</div>
            </div>
          </div>
        )}

        <div style={s.card}>
          <div style={s.cardHeader}>
            <span>📋</span>
            <span style={s.cardTitle}>Interaction Details</span>
          </div>
          <div style={s.cardBody}>

            {/* Row 1: HCP + Type */}
            <div style={s.row}>
              <div>
                <label style={s.label}>HCP Name *</label>
                <select style={s.select} value={form.hcp_name} onChange={handleChange('hcp_name')}>
                  <option value="">Search or select HCP...</option>
                  {hcps.map(h => (
                    <option key={h.id} value={h.name}>{h.name} — {h.specialty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={s.label}>Interaction Type</label>
                <select style={s.select} value={form.interaction_type} onChange={handleChange('interaction_type')}>
                  {['Meeting', 'Call', 'Email', 'Conference', 'Virtual'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Date + Attendees */}
            <div style={s.row}>
              <div>
                <label style={s.label}>Date</label>
                <input type="date" style={s.input} value={form.date} onChange={handleChange('date')} />
              </div>
              <div>
                <label style={s.label}>Attendees</label>
                <input type="text" style={s.input} placeholder="Enter names or search..." value={form.attendees} onChange={handleChange('attendees')} />
              </div>
            </div>

            {/* Topics */}
            <div style={s.field}>
              <label style={s.label}>Topics Discussed *</label>
              <textarea style={s.textarea} rows={3} placeholder="Enter key discussion points..." value={form.topics_discussed} onChange={handleChange('topics_discussed')} />
            </div>

            {/* Materials + Samples */}
            <div style={s.row}>
              <div>
                <label style={s.label}>Materials Shared</label>
                <input type="text" style={s.input} placeholder="e.g. OncoBoost brochure, Phase III data" value={form.materials_shared} onChange={handleChange('materials_shared')} />
              </div>
              <div>
                <label style={s.label}>Samples Distributed</label>
                <input type="text" style={s.input} placeholder="e.g. 2x OncoBoost 10mg" value={form.samples_distributed} onChange={handleChange('samples_distributed')} />
              </div>
            </div>

            {/* Sentiment */}
            <div style={s.field}>
              <label style={s.label}>Observed HCP Sentiment</label>
              <div style={s.sentimentGroup}>
                {['Positive', 'Neutral', 'Negative'].map(sent => (
                  <button
                    key={sent}
                    style={s.sentimentBtn(form.sentiment === sent, sentimentColors[sent])}
                    onClick={() => dispatch(updateForm({ sentiment: sent }))}
                  >
                    {sentimentEmojis[sent]} {sent}
                  </button>
                ))}
              </div>
            </div>

            {/* Outcomes */}
            <div style={s.field}>
              <label style={s.label}>Outcomes</label>
              <textarea style={s.textarea} rows={2} placeholder="Key outcomes or agreements..." value={form.outcomes} onChange={handleChange('outcomes')} />
            </div>

            {/* Follow-up */}
            <div style={{ ...s.field, marginBottom: 0 }}>
              <label style={s.label}>Follow-up Actions</label>
              <textarea style={s.textarea} rows={2} placeholder="Enter next steps or tasks..." value={form.follow_up_actions} onChange={handleChange('follow_up_actions')} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f3f4', display: 'flex', gap: '10px' }}>
            <button style={s.btnPrimary} onClick={handleSubmit} disabled={submitStatus === 'loading'}>
              {submitStatus === 'loading' ? '⏳ Logging...' : '⚡ Log Interaction'}
            </button>
            <button style={s.btnSecondary} onClick={() => dispatch(resetForm())}>Reset</button>
          </div>
        </div>
      </div>

      {/* Right: AI Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={s.aiPanel}>
          <div style={s.aiHeader}>
            <div style={s.aiTitle}>🤖 AI Assistant</div>
            <div style={s.aiSub}>Powered by Groq — gemma2-9b-it</div>
          </div>

          <div style={{ padding: '14px 16px' }}>
            {aiSuggestions.length > 0 ? (
              <>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#5f6368', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  AI Suggested Follow-ups
                </div>
                {aiSuggestions.map((s_, i) => (
                  <div key={i} style={s.suggestionItem}>
                    <div style={s.dot} />
                    <span>{typeof s_ === 'string' ? s_ : JSON.stringify(s_)}</span>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ fontSize: '13px', color: '#5f6368', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '8px' }}>After logging an interaction, the AI will:</p>
                <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Generate 3 follow-up suggestions</li>
                  <li>Analyze HCP sentiment from notes</li>
                  <li>Extract key entities automatically</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tools Info */}
        <div style={s.infoBox}>
          <div style={s.infoTitle}>🔧 LangGraph Tools Active</div>
          {['log_interaction', 'edit_interaction', 'search_hcp', 'suggest_followup', 'analyze_sentiment'].map(t => (
            <span key={t} style={s.toolChip}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
