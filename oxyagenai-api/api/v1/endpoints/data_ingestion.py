from sqlalchemy import select
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Body
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Query
from api.dependencies import (
    get_db,
    get_embedding_service,
    get_text_process_service,
    get_extraction_service,
    get_google_service
)
from crud.doc_crud import DocCRUD

from services.text_process_service import TextProcessService
from services.embedding_service import VertexAIEmbeddingService
from services.extraction_service import ExtractionService

from sqlalchemy import text
from loguru import logger

from core.config import settings
from models.corpus_model import CorpusUpdate, Corpus
import os

router = APIRouter()


@router.get("/corpus")
async def corpus(
    db: AsyncSession = Depends(get_db),
):
    logger.info("Corpus (list)")
    query = text(
        """
        SELECT id, name, description 
        FROM corpus
    """
    )
    existing_corpus_result = await db.execute(query)
    existing_corpus = existing_corpus_result.all()
    logger.info(existing_corpus)

    #existing_corpus = await db.execute(select(CorpusModel))
    corpus_arr = []
    for row in existing_corpus:
        id, name, description = row
        item = {"id": id, "name": name, "description": description}
        corpus_arr.append(item)
    return corpus_arr

@router.delete("/corpus/{corpus_id}")
async def delete_corpus(
    corpus_id: int,
    db: AsyncSession = Depends(get_db),
):
    logger.info(f"Delete corpus with ID: {corpus_id}")

    # Check if corpus exists
    query = text("SELECT 1 FROM corpus WHERE id = :id")
    result = await db.execute(query, {"id": corpus_id})
    if not result.rowcount:
        return {"error": "Corpus not found"}
    
    # Delete the embeddings
    delete_query = text("DELETE FROM docembeddings WHERE doc_id in (SELECT id FROM documents WHERE corpus_id = :id)")
    await db.execute(delete_query, {"id": corpus_id})
    await db.commit()

    # Delete the documents
    delete_query = text("DELETE FROM documents WHERE corpus_id = :id")
    await db.execute(delete_query, {"id": corpus_id})
    await db.commit()

    # Delete the corpus
    delete_query = text("DELETE FROM corpus WHERE id = :id")
    await db.execute(delete_query, {"id": corpus_id})
    await db.commit()

    return {"message": "Corpus deleted successfully"}

@router.patch("/corpus/{corpus_id}")
async def update_corpus(
    corpus_id: int,
    corpus: CorpusUpdate,  # Use CorpusModel for expected data
    db: AsyncSession = Depends(get_db),
):
    logger.info(f"Update corpus with ID: {corpus_id}")

    db_corpus = await db.get(Corpus, corpus_id)
    if not db_corpus:
        raise HTTPException(status_code=404, detail="Corpus not found")
    corpus_data = corpus.model_dump(exclude_unset=True)
    logger.info(corpus_data)
    db_corpus.sqlmodel_update(corpus_data)
    logger.info(db_corpus)
    db.add(db_corpus)
    await db.commit()
    await db.refresh(db_corpus)
    return db_corpus

    return {"message": "Corpus updated successfully"}

@router.post("/corpus")
async def corpus(
    corpus_name: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
):

    try:
        logger.info("1) ##### Creating corpus")
        doc_crud = DocCRUD()
        corpus = await doc_crud.create_corpus(
                db,
                {
                    "name": corpus_name
                }
            )
        print(corpus.id)
        return {"status": f"Corpus created successful", "corpus_id": corpus.id}
    except Exception as e:
        logger.error(f"Corpus creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    


@router.post("/corpus_document")
async def data_ingestion(
    file: UploadFile = File(...),
    corpus_id: int = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
    extraction_service: ExtractionService = Depends(get_extraction_service),
    text_process_service: TextProcessService = Depends(get_text_process_service),
    embedding_service: VertexAIEmbeddingService = Depends(get_embedding_service),
):

    try:
        logger.info("1) ##### Saving doc")
        doc_ = await extraction_service.save_file(
            file
        )
        doc = await extraction_service.file2gcs(doc_["source_file"], doc_["filename"])

        logger.info("2) ##### Processing Doc")
        chunks = await text_process_service.extract_content(doc["source_file"], doc["url"]) 
        os.remove(doc["source_file"])

        logger.info("3) ##### Generating embeddings")
        doc_crud = DocCRUD()
        document = await doc_crud.create_document(
                db,
                {
                    "name": doc["filename"],
                    "corpus_id": corpus_id,
                    "url": doc["url"]
                }
            )
        for chunk in chunks:
            embedding = await embedding_service.generate_embeddings(chunk["content"]) 


            logger.info("Loading new data into database")
            
            logger.info("Creating new doc with embeddings")
            #for data, embedding in zip(new_data, embeddings):
            await doc_crud.create_docembedding(
                db,
                {
                    "doc_id": document.id,
                    "embeddings": embedding,
                    "content": chunk["content"].replace("'", " ").replace('\x00', '')
                }
            )

        return {"status": "Document Embedding successful"}
    except Exception as e:
        logger.error(f"Data ingestion process failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/corpus_document/{corpus_id}")
async def corpus(
    corpus_id: int,
    db: AsyncSession = Depends(get_db),
):
    logger.info("Document (list)")
    query = text(
        """
        SELECT id, name, corpus_id, url 
        FROM documents where corpus_id = :corpus_id
    """
    )
    existing_docs_result = await db.execute(query, {"corpus_id": corpus_id})
    existing_docs = existing_docs_result.all()
    logger.info(existing_docs)

    #existing_corpus = await db.execute(select(CorpusModel))
    docs_arr = []
    for row in existing_docs:
        id, name, corpus_id, url = row
        item = {"id": id, "name": name, "corpus_id": corpus_id, "url": url}
        docs_arr.append(item)
    return docs_arr

@router.delete("/corpus_document/{doc_id}")
async def delete_doc(
    doc_id: int,
    db: AsyncSession = Depends(get_db),
):
    logger.info(f"Delete document with ID: {doc_id}")

    # Check if corpus exists
    query = text("SELECT 1 FROM documents WHERE id = :id")
    result = await db.execute(query, {"id": doc_id})
    if not result.rowcount:
        return {"error": "Document not found"}

    # Delete the corpus
    delete_query = text("DELETE FROM documents WHERE id = :id")
    await db.execute(delete_query, {"id": doc_id})
    await db.commit()

    return {"message": "Document deleted successfully"}
    
    

@router.post("/one_document")
async def data_ingestion(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    extraction_service: ExtractionService = Depends(get_extraction_service),
    text_process_service: TextProcessService = Depends(get_text_process_service),
    embedding_service: VertexAIEmbeddingService = Depends(get_embedding_service),
):

    try:
        logger.info("1) ##### Saving doc")
        doc = await extraction_service.save_file(
            file
        )

        logger.info("2) ##### Processing Doc")
        chunks = await text_process_service.extract_content(doc["source_file"], "") 
        os.remove(doc["source_file"])

        logger.info("3) ##### Generating embeddings")
        doc_crud = DocCRUD()
        document = await doc_crud.create_document(
                db,
                {
                    "name": doc["filename"],
                    "corpus_id": 0,
                    "url": ""
                }
            )
        for chunk in chunks:
            embedding = await embedding_service.generate_embeddings(chunk["content"]) 


            logger.info("Loading new data into database")
            
            logger.info("Creating new doc with embeddings")
            #for data, embedding in zip(new_data, embeddings):
            await doc_crud.create_docembedding(
                db,
                {
                    "doc_id": document.id,
                    "embeddings": embedding,
                    "content": chunk["content"].replace("'", " ").replace('\x00', '')
                }
            )

        return {"status": "Document Embedding successful", "doc_id":document.id}
    except Exception as e:
        logger.error(f"Data ingestion process failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))    

