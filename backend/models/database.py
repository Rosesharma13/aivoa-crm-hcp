from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from datetime import datetime
import os

DATABASE_URL = os.getenv("DB_URL", "sqlite+aiosqlite:///./crm.db")

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


class HCP(Base):
    __tablename__ = "hcps"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    specialty = Column(String(100))
    hospital = Column(String(200))
    region = Column(String(100))
    email = Column(String(150))


class Interaction(Base):
    __tablename__ = "interactions"
    id = Column(Integer, primary_key=True, index=True)
    hcp_id = Column(Integer, nullable=False)
    hcp_name = Column(String(100))
    interaction_type = Column(String(50), default="Meeting")
    date = Column(DateTime, default=datetime.utcnow)
    attendees = Column(Text)
    topics_discussed = Column(Text)
    materials_shared = Column(Text)
    samples_distributed = Column(Text)
    sentiment = Column(Enum("Positive", "Neutral", "Negative"), default="Neutral")
    outcomes = Column(Text)
    follow_up_actions = Column(Text)
    ai_suggested_followups = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # Seed some HCPs
    async with AsyncSessionLocal() as session:
        from sqlalchemy import select
        result = await session.execute(select(HCP))
        if not result.scalars().first():
            hcps = [
                HCP(name="Dr. Anjali Mehta", specialty="Oncology", hospital="AIIMS Delhi", region="North"),
                HCP(name="Dr. Rajesh Kumar", specialty="Cardiology", hospital="Fortis Mumbai", region="West"),
                HCP(name="Dr. Priya Nair", specialty="Neurology", hospital="Apollo Chennai", region="South"),
                HCP(name="Dr. Sameer Shah", specialty="Endocrinology", hospital="Medanta Gurgaon", region="North"),
                HCP(name="Dr. Kavita Rao", specialty="Pulmonology", hospital="Manipal Bangalore", region="South"),
            ]
            session.add_all(hcps)
            await session.commit()


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
