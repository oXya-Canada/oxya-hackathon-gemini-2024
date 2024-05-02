from sqlalchemy import Column, Integer, String, Float
from pgvector.sqlalchemy import Vector

from database.session import Base


class DocEmbeddingModel(Base):
    __tablename__ = "docembeddings"

    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(Integer)
    content = Column(String)
    embeddings = Column(Vector(768))