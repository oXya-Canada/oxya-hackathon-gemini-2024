from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Body
from sqlalchemy.ext.asyncio import AsyncSession
from api.dependencies import (
    get_db,
    get_embedding_service,
    get_text_process_service,
    get_extraction_service,
    get_prompt_service
)
from services.prompt_service import PromptService
from services.embedding_service import VertexAIEmbeddingService
from services.extraction_service import ExtractionService
from loguru import logger
from crud.doc_crud import DocCRUD

from sqlalchemy import text
from fastapi import HTTPException
from core.config import settings
from vertexai.generative_models import GenerativeModel
import json

router = APIRouter()

@router.post("/gemini_pro_single_pdf")
async def genai_doc_query(
    file: UploadFile = File(...),
    prompt: str = Body(..., embed=True),
    prompt_service: PromptService = Depends(get_prompt_service),
    extraction_service: ExtractionService = Depends(get_extraction_service),
):
    logger.info("1) ##### Saving doc")
    doc_ = await extraction_service.save_file(
        file
    )
    doc = await extraction_service.file2gcs(doc_["source_file"], doc_["filename"])
    logger.info(f"Single PDF : {doc['url']}")
    response = await prompt_service.single_pdf(doc["url"], prompt)
    return response


@router.post("/genai_corpus_query")
async def genai_doc_query(
    prompt: str = Body(..., embed=True),
    corpus_id: int = Body(..., embed=True),
    json_output: bool = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
    embedding_service: VertexAIEmbeddingService = Depends(get_embedding_service),
):
   
    # Generate embedding for the input text
    input_embedding = await embedding_service.generate_embeddings(prompt)
    embedding_str = "[" + ','.join(str(x) for x in input_embedding) + "]"
    #logger.info(f"Input embedding : {embedding_str}")



    # Use pgvector to calculate similarity with all readme_embedding
    similarity_query = text(
        """
        SELECT d.name, de.content, (de.embeddings <=> :embedding_str) AS similarity 
        FROM documents d, docembeddings de
        WHERE d.id = de.doc_id AND d.corpus_id = :corpus_id
        ORDER BY similarity ASC 
        LIMIT 5;
    """
    )
    similarities_result = await db.execute(
        similarity_query, {"embedding_str": embedding_str, "corpus_id": corpus_id}
    )
    similarities = similarities_result.all()


    logger.info(f"Similarities: {similarities}")
    model = GenerativeModel("gemini-1.0-pro-002", generation_config=json.loads(settings.gemini_settings))

    text_block = ""
    for item in similarities:
        text_block += item[1] + "\n"

    new_prompt = f"""
{prompt}
{text_block}
                   
"""
    logger.info(f"Prompt: {new_prompt}")
    response = await model.generate_content_async(new_prompt)


    # Format and return the results
    return {"answer": response.candidates[0].content.parts[0].text}
