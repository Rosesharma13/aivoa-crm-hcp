# AIVOA AI-First CRM — HCP Module

[![Backend](https://img.shields.io/badge/backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Redux-61DAFB)](https://react.dev/)
[![Agent](https://img.shields.io/badge/agent-LangGraph-4B8BBE)](https://langchain-ai.github.io/langgraph/)
[![LLM](https://img.shields.io/badge/LLM-Groq%20LLaMA%203.3%2070B-orange)](https://groq.com/)
[![Deployed on Render](https://img.shields.io/badge/backend-Render-46E3B7)](https://render.com/)
[![Deployed on Vercel](https://img.shields.io/badge/frontend-Vercel-000000)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](#license)

An AI-first CRM system for pharmaceutical field representatives to manage Healthcare Professional (HCP) interactions via structured form or natural language chat.

- **Live App:** https://aivoa-crm-hcp-alpha.vercel.app
- **Backend API:** https://aivoa-crm-hcp-jqq8.onrender.com
- **API Docs:** https://aivoa-crm-hcp-jqq8.onrender.com/docs

> **Note:** Backend runs on Render's free tier and spins down after inactivity. First request after idle may take 30–50 seconds.

---

## Overview

AIVOA demonstrates a production-deployable multi-agent CRM architecture. Field reps can either fill out a structured form to log HCP interactions, or describe the interaction in plain English and let the LangGraph agent handle extraction, logging, sentiment analysis, and follow-up generation automatically.

## Agent Tools

| Tool | Description |
|---|---|
| `log_interaction` | Logs a new HCP meeting to the database — looks up HCP by name, generates AI follow-up suggestions |
| `edit_interaction` | Updates an existing interaction record by ID and field name |
| `search_hcp` | Searches HCPs by name, specialty, hospital, or region with partial matching |
| `suggest_followup` | Generates 3 specific AI follow-up recommendations for a past interaction |
| `analyze_sentiment` | Classifies HCP interaction sentiment as Positive / Neutral / Negative with confidence score |

## Try These Prompts
- "Log a meeting with Dr. Anjali Mehta about OncoBoost Phase III — she was very positive and requested a follow-up brochure"
- "Search for cardiologists in Mumbai"
- "Get follow-up suggestions for interaction 1"
- "Analyze sentiment: The doctor seemed hesitant about prescribing, wanted more clinical data before committing"
- "Edit interaction 1 — change sentiment to Positive"

## Tech Stack

**Backend**
- FastAPI (async)
- LangGraph (multi-agent orchestration)
- LangChain + Groq API (LLaMA 3.3 70B)
- SQLAlchemy + aiosqlite (async SQLite)
- Python 3.11

**Frontend**
- React + Redux Toolkit
- Vite

**Deployment**
- Render (backend)
- Vercel (frontend)

## Project Structure
```
aivoa-crm-hcp/
├── backend/
│   ├── agents/
│   │   └── hcp_agent.py          # LangGraph agent with 5 tools
│   ├── models/
│   │   └── database.py           # SQLAlchemy async models (HCP, Interaction)
│   ├── routers/
│   │   ├── chat.py               # /chat endpoint → agent invocation
│   │   ├── interactions.py       # CRUD endpoints for interactions
│   │   └── hcp.py                # HCP search endpoints
│   ├── main.py                   # FastAPI app entrypoint
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── store/
│   │   │   ├── chatSlice.js      # Redux slice for AI chat
│   │   │   └── interactionSlice.js
│   │   └── ...
│   ├── vercel.json
│   └── .env.example
├── Screenshot
└── README.md
```

## Getting Started Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API key

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add GROQ_API_KEY to .env
uvicorn main:app --reload
```

Runs at `http://localhost:8000` — API docs at `/docs`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000
npm run dev
```

## Deployment

### Backend → Render

1. New Web Service → connect repo
2. Root Directory: `backend`
3. Language: Python 3
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Env var: `GROQ_API_KEY`
7. After frontend deploy: add `FRONTEND_ORIGIN` = Vercel URL

### Frontend → Vercel

1. New Project → import repo
2. Root Directory: `frontend`
3. Framework: Vite
4. Env var: `VITE_API_URL` = Render backend URL

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/chat/` | POST | Send message to LangGraph agent |
| `/interactions/` | GET | List all interactions |
| `/interactions/` | POST | Create interaction via form |
| `/interactions/{id}` | PUT | Update interaction |
| `/interactions/{id}` | DELETE | Delete interaction |
| `/hcp/` | GET | List all HCPs |
| `/health` | GET | Health check |

## License

MIT

## Author

**Rose Sharma**
[GitHub](https://github.com/Rosesharma13) · [LinkedIn](https://linkedin.com/in/rose-sharma13) · [Portfolio](https://rosesharma13.github.io)
