from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security.api_key import APIKeyHeader, APIKey
from sqlalchemy.ext.asyncio import AsyncSession
from core.config import settings
from database.session import AsyncSessionFactory
from core.google import GoogleService
from services.embedding_service import VertexAIEmbeddingService
from services.extraction_service import ExtractionService
from services.prompt_service import PromptService

# from app.services.similarity_service import SimilarityService
from services.text_process_service import TextProcessService

api_key_header = APIKeyHeader(name="access_token")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionFactory() as session:
        try:
            yield session
        finally:
            await session.close()


def get_google_service() -> GoogleService:
    return GoogleService()

def get_prompt_service() -> PromptService:
    return PromptService()

def get_embedding_service() -> VertexAIEmbeddingService:
    return VertexAIEmbeddingService()


def get_extraction_service() -> ExtractionService:
    return ExtractionService(access_token="xxx")


# def get_similarity_service() -> SimilarityService:
#     return SimilarityService(...)


def get_text_process_service() -> TextProcessService:
    return TextProcessService()
