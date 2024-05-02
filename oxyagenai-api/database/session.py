from sqlalchemy.ext.declarative import declarative_base
from core.config import Settings
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from loguru import logger

logger.info("Session / Creating Async Engine")
settings = Settings()
Base = declarative_base()

engine = create_async_engine(settings.ASYNC_DATABASE_URI, future=True, echo=True)

AsyncSessionFactory = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

