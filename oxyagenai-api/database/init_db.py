# init_db.py
from sqlalchemy import create_engine
from loguru import logger
from core.config import settings

from models.docembedding_model import Base
from models.document_model import Base

from sqlalchemy.ext.asyncio import create_async_engine


async def init_db() -> None:
    logger.info(f"Connecting to {settings.ASYNC_DATABASE_URI}")
    async_engine = create_async_engine(settings.ASYNC_DATABASE_URI, echo=True)

    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    logger.info("Database initialized and all tables created if they didn't exist.")
