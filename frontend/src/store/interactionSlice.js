import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = 'http://localhost:8000';

export const logInteraction = createAsyncThunk('interaction/log', async (data) => {
  const res = await fetch(`${API}/interactions/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
});

export const fetchInteractions = createAsyncThunk('interaction/fetchAll', async () => {
  const res = await fetch(`${API}/interactions/`);
  return res.json();
});

export const searchHCP = createAsyncThunk('interaction/searchHCP', async (query) => {
  const res = await fetch(`${API}/hcp/search?q=${encodeURIComponent(query)}`);
  return res.json();
});

export const fetchHCPs = createAsyncThunk('interaction/fetchHCPs', async () => {
  const res = await fetch(`${API}/hcp/`);
  return res.json();
});

const interactionSlice = createSlice({
  name: 'interaction',
  initialState: {
    form: {
      hcp_name: '',
      interaction_type: 'Meeting',
      date: new Date().toISOString().split('T')[0],
      attendees: '',
      topics_discussed: '',
      materials_shared: '',
      samples_distributed: '',
      sentiment: 'Neutral',
      outcomes: '',
      follow_up_actions: '',
    },
    interactions: [],
    hcps: [],
    hcpSearchResults: [],
    status: 'idle',
    submitStatus: 'idle',
    lastSaved: null,
    aiSuggestions: [],
  },
  reducers: {
    updateForm: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm: (state) => {
      state.form = {
        hcp_name: '',
        interaction_type: 'Meeting',
        date: new Date().toISOString().split('T')[0],
        attendees: '',
        topics_discussed: '',
        materials_shared: '',
        samples_distributed: '',
        sentiment: 'Neutral',
        outcomes: '',
        follow_up_actions: '',
      };
      state.submitStatus = 'idle';
      state.aiSuggestions = [];
    },
    setAISuggestions: (state, action) => {
      state.aiSuggestions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInteraction.pending, (state) => { state.submitStatus = 'loading'; })
      .addCase(logInteraction.fulfilled, (state, action) => {
        state.submitStatus = 'success';
        state.lastSaved = action.payload;
        if (action.payload.ai_suggested_followups) {
          try {
            state.aiSuggestions = JSON.parse(action.payload.ai_suggested_followups);
          } catch { state.aiSuggestions = []; }
        }
      })
      .addCase(logInteraction.rejected, (state) => { state.submitStatus = 'error'; })
      .addCase(fetchInteractions.fulfilled, (state, action) => { state.interactions = action.payload; })
      .addCase(fetchHCPs.fulfilled, (state, action) => { state.hcps = action.payload.hcps || []; })
      .addCase(searchHCP.fulfilled, (state, action) => { state.hcpSearchResults = action.payload.hcps || []; });
  },
});

export const { updateForm, resetForm, setAISuggestions } = interactionSlice.actions;
export default interactionSlice.reducer;
