# crud/user_crud.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from crud.base_crud import BaseCRUD
from fastapi import HTTPException
from models.docembedding_model import DocEmbeddingModel
from models.document_model import DocumentModel
from models.corpus_model import Corpus, CorpusUpdate

class DocCRUD(BaseCRUD):
    def __init__(self):
        super().__init__(model=DocumentModel)
        super().__init__(model=DocEmbeddingModel)

    async def create_document(
        self, db: AsyncSession, doc_data: dict
    ) -> DocumentModel:
        # Create new UserSurveyModel instance
        doc = DocumentModel(**doc_data)
        db.add(doc)
        await db.commit()
        await db.refresh(doc)
        return doc
    
    async def create_docembedding(
        self, db: AsyncSession, doc_data: dict
    ) -> DocEmbeddingModel:
        # Create new UserSurveyModel instance
        doc = DocEmbeddingModel(**doc_data)
        db.add(doc)
        await db.commit()
        await db.refresh(doc)
        return doc   

    async def create_corpus(
        self, db: AsyncSession, corpus_data: dict
    ) -> DocEmbeddingModel:
        # Create new UserSurveyModel instance
        corpus = Corpus(**corpus_data)
        db.add(corpus)
        await db.commit()
        await db.refresh(corpus)
        return corpus     
    
    async def update_corpus(
            self, db: AsyncSession, corpus_id: int,  corpus: CorpusUpdate
    ):
        db_corpus = db.get(Corpus, corpus_id)
        if not db_corpus:
            raise HTTPException(status_code=404, detail="Corpus not found")
        corpus_data = corpus.model_dump(exclude_unset=True)
        db_corpus.sqlmodel_update(corpus_data)
        db.add(db_corpus)
        db.commit()
        db.refresh(db_corpus)
        return db_corpus
