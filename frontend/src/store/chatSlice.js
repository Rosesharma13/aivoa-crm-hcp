import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = 'http://localhost:8000';

export const sendChatMessage = createAsyncThunk('chat/send', async ({ message, history }) => {
  const res = await fetch(`${API}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  return res.json();
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [
      {
        role: 'assistant',
        content: "Hi! I'm your AI assistant. You can describe an HCP interaction in natural language and I'll log it for you. Try: \"Log a meeting with Dr. Anjali Mehta about OncoBoost Phase III — she seemed positive and requested a follow-up brochure.\"",
        timestamp: new Date().toISOString(),
      }
    ],
    status: 'idle',
    inputValue: '',
  },
  reducers: {
    setInputValue: (state, action) => { state.inputValue = action.payload; },
    clearChat: (state) => {
      state.messages = [{
        role: 'assistant',
        content: "Chat cleared. How can I help you log an interaction?",
        timestamp: new Date().toISOString(),
      }];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state, action) => {
        state.status = 'loading';
        state.messages.push({
          role: 'user',
          content: action.meta.arg.message,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.status = 'idle';
        state.messages.push({
          role: 'assistant',
          content: action.payload.response || 'Done!',
          timestamp: new Date().toISOString(),
        });
        state.inputValue = '';
      })
      .addCase(sendChatMessage.rejected, (state) => {
        state.status = 'idle';
        state.messages.push({
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
        });
      });
  },
});

export const { setInputValue, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
