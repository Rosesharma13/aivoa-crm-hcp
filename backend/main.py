from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import interactions, chat, hcp
from models.database import init_db

app = FastAPI(title="AIVOA AI-First CRM – HCP Module", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await init_db()

app.include_router(interactions.router, prefix="/interactions", tags=["Interactions"])
app.include_router(chat.router, prefix="/chat", tags=["AI Chat"])
app.include_router(hcp.router, prefix="/hcp", tags=["HCP Search"])

@app.get("/")
async def root():
    return {"message": "AIVOA AI-First CRM API Running"}
