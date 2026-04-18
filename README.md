# AI-First CRM – HCP Module (AIVOA.AI Assignment)

A production-grade AI-first CRM system with Healthcare Professional (HCP) interaction logging, powered by LangGraph + Groq LLM.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Redux + Vite |
| Backend | Python + FastAPI |
| AI Agent | LangGraph |
| LLM | Groq (gemma2-9b-it) |
| Database | MySQL |
| Font | Google Inter |

## Project Structure

```
aivoa-crm/
├── frontend/          # React + Redux UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── LogInteractionScreen.jsx   # Main screen (form + chat)
│   │   │   ├── InteractionForm.jsx        # Structured form
│   │   │   └── ChatInterface.jsx          # Conversational AI chat
│   │   ├── store/
│   │   │   ├── store.js                   # Redux store
│   │   │   └── interactionSlice.js        # Redux slice
│   │   └── App.jsx
├── backend/
│   ├── main.py                            # FastAPI app entry
│   ├── routers/interactions.py            # API routes
│   ├── agents/hcp_agent.py                # LangGraph agent
│   ├── tools/                             # 5 LangGraph tools
│   │   ├── log_interaction.py
│   │   ├── edit_interaction.py
│   │   ├── search_hcp.py
│   │   ├── suggest_followup.py
│   │   └── analyze_sentiment.py
│   └── models/database.py                 # MySQL models
├── screenshots/
│   └── api_docs.png 
├──.gitignore
└── LICENSE    
└── README.md
```

## LangGraph Agent & 5 Tools

### Agent Role
The LangGraph agent orchestrates HCP interaction management. It routes user input (form or chat) through a graph of tools, deciding which tool to invoke based on intent. It maintains conversation state, extracts entities from natural language, and generates intelligent follow-up suggestions.

### Tool 1: Log Interaction
- Captures structured interaction data (HCP name, date, topics, outcomes)
- Uses Groq LLM to extract entities from free-text chat input
- Summarizes long conversation notes into concise records
- Saves to MySQL with sentiment analysis

### Tool 2: Edit Interaction
- Retrieves existing interaction by ID
- Accepts partial updates via natural language ("change the sentiment to positive")
- LLM parses edit intent and maps to DB fields
- Validates and saves updated record

### Tool 3: Search HCP
- Searches HCP database by name, specialty, or region
- Returns matching HCPs with interaction history summary
- Supports fuzzy matching for partial names

### Tool 4: Suggest Follow-up
- Analyzes last interaction content using Groq LLM
- Generates 2-3 actionable follow-up recommendations
- Considers HCP sentiment, topics discussed, and time since last visit

### Tool 5: Analyze Sentiment
- Uses Groq LLM to classify HCP sentiment from interaction notes
- Returns: Positive / Neutral / Negative with confidence score
- Helps field reps track HCP relationship health over time

## Setup Instructions

### Backend
```bash
cd backend
pip install -r requirements.txt
# Set environment variables:
# GROQ_API_KEY=your_groq_api_key
# DB_URL=mysql+aiomysql://user:password@localhost/crm_db
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database
```sql
CREATE DATABASE crm_db;
-- Tables auto-created via SQLAlchemy on startup
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /interactions/ | Log new interaction |
| GET | /interactions/{id} | Get interaction by ID |
| PUT | /interactions/{id} | Edit interaction |
| GET | /interactions/ | List all interactions |
| POST | /chat/ | Chat with AI agent |
| GET | /hcp/search?q= | Search HCPs |

## Architecture Flow

```
User Input (Form or Chat)
        ↓
   React Frontend
        ↓
   FastAPI Backend
        ↓
  LangGraph Agent ──→ Groq LLM (gemma2-9b-it)
        ↓
  Tool Selection:
  ├── log_interaction → MySQL
  ├── edit_interaction → MySQL
  ├── search_hcp → MySQL
  ├── suggest_followup → Groq LLM
  └── analyze_sentiment → Groq LLM
        ↓
   Response → Frontend
```

## Screenshots

### Backend API — FastAPI Swagger UI
<img width="1890" height="905" alt="api_docs png" src="https://github.com/user-attachments/assets/b60edb2b-ba99-4080-b440-7b893c8df46e" />


> Frontend UI runs on `http://localhost:5173` after `npm install && npm run dev`
> Backend tested and running successfully on `http://localhost:8000`
