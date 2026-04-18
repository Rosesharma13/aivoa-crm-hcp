from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from models.database import get_db, HCP
from pydantic import BaseModel
from typing import List
from agents.hcp_agent import run_agent

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    history: List[dict] = []

@router.post("/")
async def chat_with_agent(data: ChatMessage):
    response = await run_agent(data.message, [])
    return {"response": response, "status": "success"}
