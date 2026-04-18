from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database import get_db, Interaction
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

class InteractionCreate(BaseModel):
    hcp_name: str
    interaction_type: str = "Meeting"
    topics_discussed: str
    outcomes: str
    sentiment: str = "Neutral"
    attendees: Optional[str] = ""
    materials_shared: Optional[str] = ""
    samples_distributed: Optional[str] = ""
    follow_up_actions: Optional[str] = ""

class InteractionUpdate(BaseModel):
    field: str
    new_value: str

@router.post("/")
async def create_interaction(data: InteractionCreate, db: AsyncSession = Depends(get_db)):
    interaction = Interaction(**data.dict(), date=datetime.utcnow())
    db.add(interaction)
    await db.commit()
    await db.refresh(interaction)
    return interaction

@router.get("/")
async def list_interactions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Interaction).order_by(Interaction.created_at.desc()))
    return result.scalars().all()

@router.get("/{interaction_id}")
async def get_interaction(interaction_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Interaction).where(Interaction.id == interaction_id))
    interaction = result.scalar_one_or_none()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction

@router.put("/{interaction_id}")
async def update_interaction(interaction_id: int, data: InteractionUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Interaction).where(Interaction.id == interaction_id))
    interaction = result.scalar_one_or_none()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    setattr(interaction, data.field, data.new_value)
    interaction.updated_at = datetime.utcnow()
    await db.commit()
    return {"status": "updated", "interaction_id": interaction_id}
