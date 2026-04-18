from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from models.database import get_db, HCP

router = APIRouter()

@router.get("/search")
async def search_hcp(q: str = Query(..., description="Search by name, specialty, hospital or region"), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(HCP).where(
            or_(
                HCP.name.ilike(f"%{q}%"),
                HCP.specialty.ilike(f"%{q}%"),
                HCP.hospital.ilike(f"%{q}%"),
                HCP.region.ilike(f"%{q}%"),
            )
        ).limit(10)
    )
    hcps = result.scalars().all()
    return {"hcps": [{"id": h.id, "name": h.name, "specialty": h.specialty, "hospital": h.hospital, "region": h.region} for h in hcps]}

@router.get("/")
async def list_hcps(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HCP))
    hcps = result.scalars().all()
    return {"hcps": [{"id": h.id, "name": h.name, "specialty": h.specialty, "hospital": h.hospital, "region": h.region} for h in hcps]}
