# AIVOA AI-First CRM — HCP Module

<div align="center">

### AI-Powered Healthcare Professional (HCP) CRM Platform

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge\&logo=redux\&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-orange?style=for-the-badge)
![LangChain](https://img.shields.io/badge/LangChain-AI%20Framework-green?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-LLM-red?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge\&logo=sqlite\&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?style=for-the-badge)
![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

</div>

> A production-grade AI-first CRM system for pharmaceutical sales teams to manage Healthcare Professional (HCP) interactions using **LangGraph multi-agent architecture**, **Groq LLM**, **FastAPI**, and **React**.


## 🧠 What This Project Does

MIRA-style CRM built for **pharmaceutical field representatives** to:

* Log detailed meetings with doctors (HCPs) via a structured form or natural language chat
* Get AI-generated follow-up suggestions after every interaction
* Analyze HCP sentiment (Positive / Neutral / Negative) from interaction notes
* Search HCPs by name, specialty, or region
* Edit and retrieve past interaction records

---

## ⚙️ Tech Stack

| Layer    | Technology                  | Purpose                              |
| -------- | --------------------------- | ------------------------------------ |
| Frontend | React + Redux + Vite        | Interactive UI with state management |
| Backend  | Python + FastAPI            | REST API with async support          |
| AI Agent | LangGraph                   | Multi-agent orchestration            |
| LLM      | Groq (gemma2-9b-it)         | Fast LLM inference for AI features   |
| Database | SQLite (dev) / MySQL (prod) | Persistent interaction storage       |
| Styling  | CSS + Google Inter          | Clean professional UI                |

---

## 🤖 LangGraph Agent — 5 AI Tools

The LangGraph agent orchestrates all AI operations. It routes user input through a graph of tools, deciding which tool to invoke based on intent. It maintains conversation state, extracts entities from natural language, and generates intelligent follow-up suggestions.

### Tool 1: `log_interaction`

* Captures structured interaction data (HCP name, date, topics, outcomes)
* Uses Groq LLM to extract entities from free-text chat input
* Summarizes long conversation notes into concise records
* Saves to database with auto-generated sentiment analysis

### Tool 2: `edit_interaction`

* Retrieves existing interaction by ID
* Accepts partial updates via natural language
* LLM parses edit intent and maps to database fields
* Validates and saves updated record

### Tool 3: `search_hcp`

* Searches HCP database by name, specialty, or region
* Returns matching HCPs with interaction history summary
* Supports fuzzy matching for partial names

### Tool 4: `suggest_followup`

* Analyzes last interaction content using Groq LLM
* Generates 2–3 actionable follow-up recommendations
* Considers HCP sentiment, topics discussed, and time since last visit

### Tool 5: `analyze_sentiment`

* Uses Groq LLM to classify HCP sentiment from interaction notes
* Returns Positive / Neutral / Negative with confidence score
* Helps field reps track HCP relationship health over time

---

## 📁 Project Structure

```bash
aivoa-crm-hcp/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routers/
│   │   ├── interactions.py
│   │   ├── chat.py
│   │   └── hcp.py
│   ├── agents/
│   │   └── hcp_agent.py
│   ├── tools/
│   │   ├── log_interaction.py
│   │   ├── edit_interaction.py
│   │   ├── search_hcp.py
│   │   ├── suggest_followup.py
│   │   └── analyze_sentiment.py
│   └── models/
│       └── database.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── screenshot/
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🏗️ Architecture Flow

```text
User Input (Structured Form or AI Chat)
              ↓
       React + Redux Frontend
              ↓
        FastAPI Backend
              ↓
      LangGraph Agent ──→ Groq LLM
              ↓
       Tool Selection
              ↓
        SQLite / MySQL
              ↓
        JSON Response
              ↓
          Frontend
```

---

## 🛠️ Setup Instructions

### Prerequisites

* Python 3.10+
* Node.js 18+
* Groq API Key

### Clone Repository

```bash
git clone https://github.com/Rosesharma13/aivoa-crm-hcp.git

cd aivoa-crm-hcp
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

### Environment Variable

```bash
# Windows PowerShell
$env:GROQ_API_KEY="your_groq_api_key_here"

# Linux / Mac
export GROQ_API_KEY="your_groq_api_key_here"
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

### Open Browser

Frontend:

```bash
http://localhost:5173
```

API Docs:

```bash
http://localhost:8000/docs
```

---

## 📡 API Endpoints

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/interactions/`     | Log interaction    |
| GET    | `/interactions/`     | List interactions  |
| GET    | `/interactions/{id}` | Get interaction    |
| PUT    | `/interactions/{id}` | Edit interaction   |
| POST   | `/chat/`             | Chat with AI agent |
| GET    | `/hcp/`              | List HCPs          |
| GET    | `/hcp/search?q=`     | Search HCPs        |

---

## 🔑 Key Features

* Dual Input Modes (Structured Form + AI Chat)
* LangGraph Multi-Agent Architecture
* Groq LLM Integration
* Real-Time Sentiment Analysis
* AI Follow-up Recommendation Engine
* HCP Search & Retrieval
* CRUD Operations
* Redux State Management
* FastAPI Async Backend
* Production-Ready Architecture

---

## 👨‍💻 Built By

### Rose Sharma

AI/ML Engineer • Generative AI Developer • Full Stack AI Builder

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-ff2d78?style=flat-square)](https://rosesharma13.github.io)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077b5?style=flat-square\&logo=linkedin)](https://linkedin.com/in/rose-sharma13)

[![GitHub](https://img.shields.io/badge/GitHub-Rosesharma13-181717?style=flat-square\&logo=github)](https://github.com/Rosesharma13)

---

## 📜 License

MIT License © 2026 Rose Sharma

---

> ⚠️ Note: Never commit API keys or secrets to GitHub. Use environment variables for all credentials.
