from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from api.dependencies import get_db, get_embedding_service
from services.embedding_service import VertexAIEmbeddingService
from loguru import logger
from crud.doc_crud import DocCRUD

from sqlalchemy import text
from fastapi import HTTPException

router = APIRouter()


@router.post("/calculate_similarity")
async def calculate_similarity(
    input_text: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
    embedding_service: VertexAIEmbeddingService = Depends(get_embedding_service),
):
    # Generate embedding for the input text
    input_embedding = await embedding_service.generate_embeddings(input_text)
    embedding_str = "[" + ','.join(str(x) for x in input_embedding) + "]"

    # Use pgvector to calculate similarity with all readme_embedding
    similarity_query = text(
        """
        SELECT de.embeddings
        FROM documents d, docembeddings de
        WHERE d.id = de.doc_id 
        LIMIT 1;
    """
    )
    embed1 = await db.execute(
        similarity_query
    )
    embed = embed1.all()
    embed_str = "[" + ','.join(str(x) for x in embed) + "]"

    # Use pgvector to calculate similarity with all readme_embedding
    similarity_query = text(
        """
        SELECT d.name, (de.embeddings <=> :user_embedding) AS similarity 
        FROM documents d, docembeddings de
        WHERE d.id = de.doc_id 
        ORDER BY similarity ASC 
        LIMIT 5;
    """
    )
    similarities_result = await db.execute(
        similarity_query, {"user_embedding": embedding_str}
    )
    similarities = similarities_result.all()

    logger.info(f"Similarities: {similarities}")

    # Format and return the results
    return {
        "similarities": [
            {"doc_name": name, "similarity": similarity}
            for name, similarity in similarities
        ]
    }
