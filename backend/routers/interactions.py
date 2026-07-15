
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database import get_db, Interaction, HCP
from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime, date as date_type

router = APIRouter()

ALLOWED_INTERACTION_TYPES = {"Meeting", "Call", "Email", "Conference", "Virtual"}
ALLOWED_SENTIMENTS = {"Positive", "Neutral", "Negative"}


class InteractionCreate(BaseModel):
    hcp_name: str
    interaction_type: str
    topics_discussed: str
    outcomes: str
    sentiment: str
    date: Optional[str] = None
    attendees: Optional[str] = ""
    materials_shared: Optional[str] = ""
    samples_distributed: Optional[str] = ""
    follow_up_actions: Optional[str] = ""

    @field_validator("interaction_type")
    @classmethod
    def validate_type(cls, v):
        if v not in ALLOWED_INTERACTION_TYPES:
            raise ValueError(f"interaction_type must be one of {ALLOWED_INTERACTION_TYPES}")
        return v

    @field_validator("sentiment")
    @classmethod
    def validate_sentiment(cls, v):
        if v not in ALLOWED_SENTIMENTS:
            raise ValueError(f"sentiment must be one of {ALLOWED_SENTIMENTS}")
        return v

    @field_validator("topics_discussed")
    @classmethod
    def validate_topics(cls, v):
        if not v or len(v.strip()) < 5:
            raise ValueError("topics_discussed must be at least 5 characters")
        return v

    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        if v is None or v == "":
            raise ValueError("date is required")
        try:
            parsed = date_type.fromisoformat(v)
        except ValueError:
            raise ValueError("date must be in YYYY-MM-DD format")
        if parsed > date_type.today():
            raise ValueError("date cannot be in the future")
        return v


class InteractionUpdate(BaseModel):
    field: str
    new_value: str


@router.post("/")
async def create_interaction(data: InteractionCreate, db: AsyncSession = Depends(get_db)):
    # Find hcp_id by name — reject if the HCP doesn't actually exist
    result = await db.execute(select(HCP).where(HCP.name == data.hcp_name))
    hcp = result.scalar_one_or_none()
    if not hcp:
        raise HTTPException(status_code=400, detail=f"No HCP found with name '{data.hcp_name}'")

    interaction = Interaction(
        hcp_id=hcp.id,
        hcp_name=data.hcp_name,
        interaction_type=data.interaction_type,
        topics_discussed=data.topics_discussed,
        outcomes=data.outcomes,
        sentiment=data.sentiment,
        attendees=data.attendees,
        materials_shared=data.materials_shared,
        samples_distributed=data.samples_distributed,
        follow_up_actions=data.follow_up_actions,
        date=datetime.fromisoformat(data.date)
    )
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
